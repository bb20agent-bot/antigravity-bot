import MetaTrader5 as mt5
import os
from dotenv import load_dotenv

# Load env from root
load_dotenv(dotenv_path=".env")

def test_mt5_connection():
    print("--- MT5 Connectivity & Test Trade Check ---")
    
    # 1. Initialize
    if not mt5.initialize():
        print(f"MT5 Initialize failed, error: {mt5.last_error()}")
        return

    # 2. Login
    account = int(os.getenv("EXNESS_ACCOUNT", 0))
    password = os.getenv("EXNESS_PASSWORD")
    server = os.getenv("EXNESS_SERVER")
    
    if not mt5.login(account, password=password, server=server):
        print(f"MT5 Login failed for {account}, error: {mt5.last_error()}")
        mt5.shutdown()
        return

    print(f"✅ Successfully logged into MT5 Account: {account}")

    # 3. Check Symbol
    symbol = "EURUSD"
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info is None:
        print(f"Symbol {symbol} not found.")
        mt5.shutdown()
        return
    
    if not symbol_info.visible:
        if not mt5.symbol_select(symbol, True):
            print(f"Failed to select {symbol}")
            mt5.shutdown()
            return

    # 4. Attempt a tiny test trade (Sell 0.01 lot)
    # WARNING: This will execute a REAL trade if on a real account. 
    # Use on Demo account first.
    
    price = mt5.symbol_info_tick(symbol).bid
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": 0.01,
        "type": mt5.ORDER_TYPE_SELL,
        "price": price,
        "magic": 123456,
        "comment": "VORA Test Trade",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }

    print(f"Sending test SELL order for {symbol} at {price}...")
    result = mt5.order_send(request)
    
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        print(f"❌ Order failed, retcode: {result.retcode}")
    else:
        print(f"✅ Order execution SUCCESS! Ticket: {result.order}")

    mt5.shutdown()

if __name__ == "__main__":
    test_mt5_connection()
