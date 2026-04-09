import ccxt
import time
import json
import argparse
import pandas as pd
import numpy as np
import requests
import yfinance as yf
from datetime import datetime
from v4_1_optimization import QuotaManager

# --- CONFIGURATION (API KEY 입력) ---
# 여기에 새로 발급받은 키를 입력하세요
API_KEY = 'wv67tA7RTW9MAlOcuB' 
API_SECRET = 'm1o9rL72gJVguv732nC4gKa2pADlNLQNQCLj'

def get_exchange():
    return ccxt.bybit({
        'apiKey': API_KEY,
        'secret': API_SECRET,
        'testnet': True,  # 데모 거래용 (실전은 False)
        'options': {'defaultType': 'swap'}, # Adjusted for UTA compatibility
    })

# --- INDICATORS ---
def calculate_smma(series, period):
    return series.ewm(alpha=1/period, adjust=False).mean()

def calculate_ema(series, period):
    return series.ewm(span=period, adjust=False).mean()

def calculate_williams_fractal(df, period=2):
    up_fractal = pd.Series(0, index=df.index)
    down_fractal = pd.Series(0, index=df.index)
    
    for i in range(period, len(df) - period):
        window_high = df['high'].iloc[i-period:i+period+1]
        window_low = df['low'].iloc[i-period:i+period+1]
        
        if df['high'].iloc[i] == window_high.max() and len(set(window_high)) > 1:
            up_fractal.iloc[i] = 1
            
        if df['low'].iloc[i] == window_low.min() and len(set(window_low)) > 1:
            down_fractal.iloc[i] = 1
            
    df['up_fractal'] = up_fractal.shift(period).fillna(0)
    df['down_fractal'] = down_fractal.shift(period).fillna(0)
    return df

def calculate_atr(high, low, close, period=14):
    tr1 = high - low
    tr2 = (high - close.shift()).abs()
    tr3 = (low - close.shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr.rolling(window=period).mean()

# --- BYPASS FUNCTIONS ---
def fetch_ohlcv_yfinance(symbol='BTC-USD', interval='1h', limit=200):
    # Use yfinance as robust bypass for market data (No API key needed)
    # Default symbol is BTC-USD for Yahoo.
    # interval 1h matches webhook flow.
    
    # Calculate start/end
    end_date = datetime.now()
    start_date = end_date - pd.Timedelta(days=limit/24 + 5) # Buffer
    
    try:
        df = yf.download(symbol, start=start_date, end=end_date, interval=interval, progress=False)
        
        # Format for consistency
        # yfinance columns might be MultiIndex or simple
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        
        df.columns = [col.lower() for col in df.columns]
        
        # Reset index to get 'timestamp' column if it's index (DatetimeIndex)
        df.reset_index(inplace=True)
        # Rename date/datetime/Datetime to timestamp
        # Check first column usually
        if 'Date' in df.columns: df.rename(columns={'Date': 'timestamp'}, inplace=True)
        if 'Datetime' in df.columns: df.rename(columns={'Datetime': 'timestamp'}, inplace=True)
        if 'date' in df.columns: df.rename(columns={'date': 'timestamp'}, inplace=True)
        if 'datetime' in df.columns: df.rename(columns={'datetime': 'timestamp'}, inplace=True)
        
        # If timestamp column is datetime object, convert to int timestamp (ms)
        if 'timestamp' in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df['timestamp']):
                df['timestamp'] = df['timestamp'].astype(np.int64) // 10**6 # ns to ms

        
        # Ensure correct columns and types
        required = ['timestamp', 'open', 'high', 'low', 'close', 'volume']
        for col in required:
            if col not in df.columns: raise Exception(f"Missing column: {col}")
            
        # Sort ascending (Old -> New) which yfinance usually does
        df.sort_values('timestamp', inplace=True)
        
        # Convert to list of lists [timestamp, open, high, low, close, volume]
        # Keep limit rows (latest)
        df = df.tail(limit)
        
        return df # Return DF directly to save conversion steps
    except Exception as e:
        raise Exception(f"YFinance Bypass Failed: {str(e)}")

# --- CORE LOGIC ---

def check_balance(exchange):
    try:
        # Direct V5 Call for Unified Account (Bypassing fetch_balance issue)
        balance = exchange.private_get_v5_account_wallet_balance({'accountType': 'UNIFIED'})
        # Extract USDT Equity
        # Struct: result -> list[0] -> coin -> ... but totalEquity is at list level
        usdt_equity = float(balance['result']['list'][0]['totalEquity'])
        return usdt_equity
    except Exception as e:
        # Fallback for Demo Testing (If permission issues block balance check)
        print(f"Warning: Balance check failed ({e}). USING FALLBACK: $10,000")
        return 10000.0

def verify_signal(exchange, symbol='BTCUSDT'):
    try:
        yf_symbol = 'BTC-USD' if 'BTC' in symbol else ('ETH-USD' if 'ETH' in symbol else symbol)
        
        # 1. Fetch Daily Data for Gap (Risk/Reward context)
        daily_df = fetch_ohlcv_yfinance(yf_symbol, interval='1d', limit=5)
        prev_daily_gap = 0
        if len(daily_df) >= 2:
            yest = daily_df.iloc[-2]
            prev_daily_gap = abs(yest['open'] - yest['close'])
            
        # 2. Fetch 15m Data for Entry Timing
        df = fetch_ohlcv_yfinance(yf_symbol, interval='15m', limit=200)
        
        # Indicators
        df['smma21'] = calculate_smma(df['close'], 21)
        df['smma50'] = calculate_smma(df['close'], 50)
        df['smma200'] = calculate_smma(df['close'], 200)
        df['atr'] = calculate_atr(df['high'], df['low'], df['close'], 14)
        df = calculate_williams_fractal(df, 2)
        
        curr = df.iloc[-1]
        
        # Multi-timeframe trend context
        uptrend = curr['smma21'] > curr['smma50'] and curr['smma50'] > curr['smma200']
        downtrend = curr['smma21'] < curr['smma50'] and curr['smma50'] < curr['smma200']
        
        # Current Candle Close Direction
        is_bearish_candle = curr['close'] < curr['open']
        is_bullish_candle = curr['close'] > curr['open']

        # Pullbacks to the 21 SMMA (last 1-3 bars)
        pulled_back_below_21 = any(df.iloc[-i]['low'] < df.iloc[-i]['smma21'] for i in range(1, 4))
        pulled_back_above_21 = any(df.iloc[-i]['high'] > df.iloc[-i]['smma21'] for i in range(1, 4))
        
        # Fractal Confirmation (last 1-3 bars)
        recently_bullish_fractal = any(df.iloc[-i]['down_fractal'] == 1 for i in range(1, 4))
        recently_bearish_fractal = any(df.iloc[-i]['up_fractal'] == 1 for i in range(1, 4))
        
        signal = 'WAIT'
        
        if uptrend and pulled_back_below_21 and recently_bullish_fractal and is_bearish_candle:
            signal = 'BUY'
        elif downtrend and pulled_back_above_21 and recently_bearish_fractal and is_bullish_candle:
            signal = 'SELL'
            
        return {
            'status': 'success',
            'signal': signal,
            'data': {
                'price': float(curr['close']),
                'prev_daily_gap': float(prev_daily_gap),
                'atr': float(curr['atr'])
            }
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def check_exit_condition(exchange, symbol='BTCUSDT'):
    try:
        # Check if we have a position
        positions = exchange.fetch_positions([symbol])
        pos = positions[0] if positions else None
        
        if not pos or float(pos['contracts']) == 0:
            return {'status': 'success', 'signal': 'NO_POSITION'}
            
        # Fetch Data for Filter (Using YFinance Bypass)
        yf_symbol = 'BTC-USD' if 'BTC' in symbol else symbol
        df = fetch_ohlcv_yfinance(yf_symbol, interval='1h', limit=200)
        
        # ohlcv = fetch_ohlcv_bypass(exchange, symbol, interval='60', limit=200)
        # df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['ema100'] = calculate_ema(df['close'], 100)
        
        curr = df.iloc[-1]
        
        # Condition: Close < EMA 100
        # "Force Close logic"
        trend_broken = curr['close'] < curr['ema100']
        
        if trend_broken:
            # Execute Market Close (Vora checks close only on bar close, here we check hourly trigger)
            side = 'sell' if float(pos['contracts']) > 0 else 'buy' 
            exchange.create_market_order(symbol, side, abs(float(pos['contracts'])), params={'reduceOnly': True})
            return {
                'status': 'success',
                'signal': 'CLOSE_EXECUTED', 
                'reason': 'Trend Broken (Price < EMA100)',
                'price': curr['close']
            }
            
        return {'status': 'success', 'signal': 'HOLD'}

    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def execute_trade(exchange, symbol='BTCUSDT'):
    try:
        # 0. Set Leverage & Margin Mode (Bybit Demo 25x Isolated)
        try:
            exchange.set_margin_mode('isolated', symbol)
        except Exception as e:
            pass
            
        try:
            exchange.set_leverage(5, symbol)  # V5 is set to 5x leverage
        except Exception as e:
            pass

        # 1. Get Balance
        balance = check_balance(exchange)
        if isinstance(balance, dict): return balance # Error
        
        # 2. Verify Signal
        valid_res = verify_signal(exchange, symbol)
        if valid_res['status'] != 'success': return valid_res
        if valid_res['signal'] not in ['BUY', 'SELL']:
            return {'status': 'success', 'signal': 'WAIT'}
        
        data = valid_res['data']
        price = data['price']
        atr = data['atr']
        gap = data.get('prev_daily_gap', 0)
        
        # 3. V5 Sizing Logic
        risk_pct = 0.02       
        rr_ratio = 2.5
        
        sl_dist = atr * 1.5
        if gap and gap > 0:
            sl_dist = gap * 0.5  # rr_gap_mult
            
        if sl_dist < 1e-8: return {'status': 'error', 'message': 'SL Dist is 0'}
        
        # Quantity Calculation
        risk_amt = balance * risk_pct
        size = risk_amt / sl_dist
        
        # Min Size Check
        if size < 0.001: size = 0.001
        size = round(size, 3)
        
        # Cap Size at Max Available Balance
        max_position_value = balance * 5 * 0.95 
        if size * price > max_position_value:
             size = round(max_position_value / price, 3)

        # 4. Atomic Execution (Bracket Order)
        if valid_res['signal'] == 'BUY':
            sl_price = price - sl_dist
            tp_price = price + (sl_dist * rr_ratio)
            params = {
                'stopLoss': str(round(sl_price, 2)),
                'takeProfit': str(round(tp_price, 2)),
            }
            order = exchange.create_market_buy_order(symbol, size, params=params)
            
        elif valid_res['signal'] == 'SELL':
            sl_price = price + sl_dist
            tp_price = price - (sl_dist * rr_ratio)
            params = {
                'stopLoss': str(round(sl_price, 2)),
                'takeProfit': str(round(tp_price, 2)),
            }
            order = exchange.create_market_sell_order(symbol, size, params=params)
        
        trade_result = {
            'status': 'success',
            'details': {
                'symbol': symbol,
                'signal': valid_res['signal'],
                'entry_price': price,
                'stop_loss': sl_price,
                'take_profit': tp_price,
                'size': size,
                'balance': balance,
                'risk_pct': risk_pct,
                'order_id': order['id'],
                'leverage': 5,
                'margin': 'isolated'
            }
        }
        
        # v4.1 Optimization: Register successful trade to QuotaManager batch
        qm = QuotaManager()
        qm.process_trade_webhook(trade_result['details'])

        return trade_result

    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--action', required=True, choices=['check_balance', 'verify_signal', 'check_exit', 'execute_trade'])
    parser.add_argument('--symbol', default='BTCUSDT')
    args = parser.parse_args()
    
    exchange = get_exchange()
    
    if args.action == 'check_balance':
        res = {'balance': check_balance(exchange)}
        print(json.dumps(res))
        
    elif args.action == 'verify_signal':
        res = verify_signal(exchange, args.symbol)
        print(json.dumps(res))
        
    elif args.action == 'check_exit':
        res = check_exit_condition(exchange, args.symbol)
        print(json.dumps(res))
        
    elif args.action == 'execute_trade':
        res = execute_trade(exchange, args.symbol)
        print(json.dumps(res))

if __name__ == '__main__':
    import warnings
    warnings.simplefilter(action='ignore')
    main()

