import os
import time
import ccxt
import requests
import schedule
import yfinance as yf
import feedparser
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
from datetime import datetime, timedelta

# 환경 변수 로드
load_dotenv()

# 이미 발송한 뉴스 URL을 기억하는 집합 (중복 발송 방지)
SENT_NEWS_URLS = set()

# 고래 트래킹용 이전 데이터 저장 메모리
PREVIOUS_WHALE_DATA = {}

API_KEY = os.getenv('BINANCE_API_KEY')
API_SECRET = os.getenv('BINANCE_API_SECRET')
WEBHOOK_URL = os.getenv('GOOGLE_SHEET_WEBHOOK')
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

if not all([API_KEY, API_SECRET, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID]):
    missing = []
    if not API_KEY: missing.append("BINANCE_API_KEY")
    if not API_SECRET: missing.append("BINANCE_API_SECRET")
    if not TELEGRAM_BOT_TOKEN: missing.append("TELEGRAM_TOKEN")
    if not TELEGRAM_CHAT_ID: missing.append("TELEGRAM_CHAT_ID")
    
    print(f"❌ 환경 변수 설정이 부족합니다: {', '.join(missing)}을(를) .env 파일에 추가해주세요.")
    # 텔레그램 알람이 핵심 기능이므로 텔레그램 토큰이 없으면 종료합니다.
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("💡 텔레그램 알람 기능이 핵심이므로 봇을 종료합니다. .env를 수정해주세요.")
        exit(1)

# CCXT 초기화 (바이낸스 선물)
try:
    exchange = ccxt.binance({
        'apiKey': API_KEY,
        'secret': API_SECRET,
        'enableRateLimit': True,
        'options': {
            'defaultType': 'future',
        }
    })
except Exception as e:
    print(f"CCXT 바이낸스 초기화 실패: {e}")
    exchange = None

def send_telegram_message(message):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        requests.post(url, json=payload, timeout=5)
        print(f"✅ 텔레그램 발송 완료 [{datetime.now().strftime('%H:%M:%S')}]")
    except Exception as e:
        print(f"❌ 텔레그램 발송 실패: {e}")

def get_trading_summary(scope="today"):
    """하루의 트레이딩 실현 손익 성과를 바이낸스에서 가져옵니다."""
    if not exchange:
        return None
    try:
        now = datetime.now() 
        if scope == "today":
            start_local = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_local = now
        else: # yesterday
            start_local = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            end_local = (now - timedelta(days=1)).replace(hour=23, minute=59, second=59, microsecond=999999)

        since_ts = int(start_local.timestamp() * 1000)
        end_ts = int(end_local.timestamp() * 1000)
        
        income_history = exchange.fapiPrivateGetIncome({
            'incomeType': 'REALIZED_PNL',
            'startTime': since_ts,
            'endTime': end_ts,
            'limit': 1000
        })
        
        total_pnl = 0.0
        win_count = 0
        loss_count = 0
        
        for item in income_history:
            pnl = float(item['income'])
            total_pnl += pnl
            if pnl > 0:
                win_count += 1
            elif pnl < 0:
                loss_count += 1
                
        trades_count = win_count + loss_count
                
        return {
            "total_pnl": total_pnl,
            "trades_count": trades_count,
            "win_count": win_count,
            "loss_count": loss_count
        }
            
    except Exception as e:
        print(f"Error fetching trading summary: {e}")
        return None

def log_to_google_sheet(data_dict):
    """구글 시트 웹훅(Google Apps Script 등)으로 데이터를 전송합니다."""
    if not WEBHOOK_URL:
        print("⚠️ 설정된 GOOGLE_SHEET_WEBHOOK 이 없습니다.")
        return
    try:
        response = requests.post(WEBHOOK_URL, json=data_dict, timeout=5)
        print(f"✅ 구글 시트 업로드 완료 (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ 구글 시트 기록 실패: {e}")

def get_market_briefing():
    """yfinance를 활용해 지정된 15개 종목의 전일 종가 및 변동률 데이터를 가져옵니다."""
    tickers = {
        "🇺🇸 미국 대형/기술주": {
            "AAPL": "AAPL", "MSFT": "MSFT", "GOOGL": "GOOGL", "AMZN": "AMZN", "TSLA": "TSLA"
        },
        "🇪🇺 유럽 주식": {
            "SAP": "SAP", "LVMH": "MC.PA"
        },
        "🛢️ 원자재": {
            "Gold": "GC=F", "WTI Oil": "CL=F"
        },
        "💱 외환": {
            "EUR/USD": "EURUSD=X", "GBP/USD": "GBPUSD=X", "USD/JPY": "JPY=X"
        },
        "🪙 암호화폐": {
            "BTC": "BTC-USD", "ETH": "ETH-USD", "SOL": "SOL-USD"
        }
    }

    briefing_msg = "<b>[어제 종가 기준 시황 브리핑]</b>\n\n"

    try:
        for category, symbol_map in tickers.items():
            briefing_msg += f"<b>{category}</b>\n"
            
            for display_name, yf_ticker in symbol_map.items():
                try:
                    # 단일 종목씩 받아오는 방식이 약간 느리지만 판다스 에러를 방지합니다.
                    ticker_obj = yf.Ticker(yf_ticker)
                    hist = ticker_obj.history(period="5d")
                    if len(hist) >= 2:
                        last_close = hist['Close'].iloc[-1]
                        prev_close = hist['Close'].iloc[-2]
                        
                        change_percent = ((last_close - prev_close) / prev_close) * 100
                        icon = "🟢" if change_percent > 0 else "🔻" if change_percent < 0 else "➖"
                        sign = "+" if change_percent > 0 else ""
                        
                        # 소수점 처리 (외환은 4자리, 나머지는 2자리)
                        decimals = 4 if category == "💱 외환" else 2
                        
                        briefing_msg += f"▪️ {display_name}: {last_close:,.{decimals}f} ({sign}{change_percent:.2f}% {icon})\n"
                    else:
                        briefing_msg += f"▪️ {display_name}: 데이터 조회 불가\n"
                except Exception as e:
                    briefing_msg += f"▪️ {display_name}: 에러 발생\n"
            
            briefing_msg += "\n"
        
        return briefing_msg
    except Exception as e:
        print(f"시장 데이터 조회 중 에러 발생: {e}")
        return "⚠️ 일일 시황 데이터를 불러오는데 실패했습니다."

# 각 시간대별 알림 함수
def notify_0500():
    print("[04:55] 아침 시황 데이터 및 전일 결산 수집 중...")
    
    # 전일 거래 내역 요약 가져오기
    yest_summary = get_trading_summary("yesterday")
    yest_msg = ""
    if yest_summary:
        yest_date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        yest_msg = (
            f"📈 <b>[{yest_date}] 전일 실현 손익 결산</b> 📉\n"
            f"▪️ 총 실현손익: <b>${yest_summary['total_pnl']:,.4f}</b>\n"
            f"▪️ 매매 횟수: {yest_summary['trades_count']}회\n"
            f"▪️ 승/패: {yest_summary['win_count']}승 / {yest_summary['loss_count']}패\n\n"
        )
        
    market_data_msg = get_market_briefing()
    
    msg = (
        "🌅 <b>[04:55] 프리마켓 분석 및 전일 결산</b>\n\n"
        f"{yest_msg}"
        f"{market_data_msg}"
        "아시아~유럽 프리마켓을 마저 분석하고 전체 시장 전망을 종합하세요.\n\n"
        "👉 <code>prompt_moring_analysis.md</code> 활용"
    )
    send_telegram_message(msg)

def notify_0750():
    msg = (
        "🎯 <b>[07:45] 거래 시작 15분 전! (최종 체크 5분 전 알림)</b>\n\n"
        "위험을 검사하고 오늘 거래를 준비하세요.\n\n"
        "👉 <code>prompt_pre_trading.md</code> 활용"
    )
    send_telegram_message(msg)

def notify_1200():
    msg = (
        "📊 <b>[11:55] 오전 거래 결산 5분 전 알림!</b>\n\n"
        "승/패 원인을 분석하고 점심 식사 다녀오세요.\n\n"
        "👉 <code>prompt_midday_review.md</code> 활용"
    )
    send_telegram_message(msg)

def notify_1600():
    msg = (
        "🌆 <b>[15:55] 오후 거래 결산 및 전략 수립 5분 전 알림!</b>\n\n"
        "오늘의 성과(오후 내역 포함)를 정리하고 저녁/내일 준비를 합니다.\n\n"
        "👉 <code>prompt_afternoon_review.md</code> 활용"
    )
    send_telegram_message(msg)

def notify_2200():
    # 1. 구글 시트 업로드 (Telegram에는 결과만 짧게 안내)
    print("[22:00] 구글 시트 결산 데이터 업로드 중...")
    msg = (
        "🌙 <b>[21:55] 일일 트레이딩 종료</b>\n\n"
        "하루의 매매를 복기하고 수면을 준비할 시간입니다. (오늘의 결산 내용은 구글 시트에 백업되며, 내일 아침 브리핑에 제공됩니다.)\n\n"
        "👉 <code>prompt_daily_final_review.md</code> 활용"
    )
    send_telegram_message(msg)
    
    summary = get_trading_summary("today")
    if summary:
        date_str = datetime.now().strftime('%Y-%m-%d')
        sheet_data = {
            "symbol": "ALL",
            "action": "DAILY_SUMMARY",
            "price": summary["total_pnl"],
            "quantity": summary["trades_count"],
            "message": f"Daily Summary - Win: {summary['win_count']}, Loss: {summary['loss_count']}"
        }
        log_to_google_sheet(sheet_data)
        print(f"[{date_str}] 하루 결산 시트 입력 완료: ${summary['total_pnl']:,.2f}")

def check_rss_news():
    """5분마다 RSS 피드를 확인하여 텔레그램으로 주요 속보를 전송합니다."""
    # 메모리 누수 방지
    if len(SENT_NEWS_URLS) > 500:
        SENT_NEWS_URLS.clear()

    feeds = {
        "Cointelegraph": "https://cointelegraph.com/rss",
        "CoinDesk": "https://www.coindesk.com/arc/outboundfeeds/rss/"
    }
    
    for source, url in feeds.items():
        try:
            feed = feedparser.parse(url)
            # 최근 5개의 기사만 확인하여 처리 속도 가장 최신 글 위주로 최적화
            for entry in feed.entries[:5]:
                link = entry.link
                title = entry.title
                
                # 이미 보낸 기사인지 중복 체크
                if link in SENT_NEWS_URLS:
                    continue
                
                # 모든 기사를 번역하고 알람 전송 (필터 제거됨)
                try:
                    kor_title = GoogleTranslator(source='en', target='ko').translate(title)
                except:
                    kor_title = "제목 번역 일시 오류"
                    
                msg = (
                    f"🚨 <b>[크립토 속보] {source}</b>\n\n"
                    f"<b>{title}</b>\n"
                    f"🇰🇷 <i>{kor_title}</i>\n\n"
                    f"<a href='{link}'>👉 기사 원문 보기</a>"
                )
                send_telegram_message(msg)
                SENT_NEWS_URLS.add(link)
        except Exception as e:
            print(f"[{source}] RSS 속보 체크 에러: {e}")

def check_whale_accumulation():
    """15분마다 선물 시장 데이터를 조회하여 고래 매집 패턴을 감지합니다."""
    symbols = ['BTCUSDT', 'ETHUSDT']
    
    for symbol in symbols:
        try:
            # 1. 미결제약정 (Open Interest)
            oi_url = f"https://fapi.binance.com/fapi/v1/openInterest?symbol={symbol}"
            oi_res = requests.get(oi_url, timeout=5).json()
            current_oi = float(oi_res.get('openInterest', 0))
            
            # 2. 고래 롱/숏 비율 (Top Trader Long/Short Ratio)
            ls_url = f"https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol={symbol}&period=15m&limit=1"
            ls_res = requests.get(ls_url, timeout=5).json()
            if ls_res and isinstance(ls_res, list):
                current_long_ratio = float(ls_res[0].get('longAccount', 0))
            else:
                current_long_ratio = 0
                
            # 3. 테이커 매수/매도 비율 (Taker Buy/Sell Ratio)
            taker_url = f"https://fapi.binance.com/futures/data/takerlongshortRatio?symbol={symbol}&period=15m&limit=1"
            taker_res = requests.get(taker_url, timeout=5).json()
            if taker_res and isinstance(taker_res, list):
                current_taker_buy_sell_ratio = float(taker_res[0].get('buySellRatio', 0))
            else:
                current_taker_buy_sell_ratio = 0
                
            # --- 매집 로직 검사 ---
            alert_triggered = False
            alert_reason = ""
            
            # 조건 1: 시장가 매수가 매도보다 압도적으로 많음 (1.5배 이상)
            if current_taker_buy_sell_ratio >= 1.5:
                alert_triggered = True
                alert_reason += f"🔹 시장가 매수(Taker Buy) 볼륨이 매도 대비 {current_taker_buy_sell_ratio:.2f}배 폭증\n"
            
            # 이전 데이터와 비교 (조건 2)
            prev_data = PREVIOUS_WHALE_DATA.get(symbol)
            if prev_data:
                prev_oi = prev_data['oi']
                prev_long = prev_data['long_ratio']
                
                # OI 증가율 계산
                oi_change_percent = ((current_oi - prev_oi) / prev_oi) * 100 if prev_oi else 0
                
                # 조건 2: 세력 롱 비율이 증가하고 동시에 미결제약정이 1% 이상 크게 증가 (돈이 들어옴)
                if current_long_ratio > prev_long and oi_change_percent >= 1.0:
                    alert_triggered = True
                    alert_reason += f"🔹 고래 롱 포지션 비중 증가 ({prev_long:.3f} -> {current_long_ratio:.3f})\n"
                    alert_reason += f"🔹 미결제약정(OI) 급등 (+{oi_change_percent:.2f}% 새로운 자금 유입)\n"
            
            # 알람 전송
            if alert_triggered:
                msg = (
                    f"🚨🚨 <b>[{symbol} 기관/세력 매집 포착]</b> 🚨🚨\n\n"
                    f"바이낸스 선물 시장에서 강한 매수 움직임이 감지되었습니다.\n\n"
                    f"<b>[감지 사유]</b>\n"
                    f"{alert_reason}\n"
                    f"👉 차트 이동 및 추세 변화에 대비하세요!"
                )
                send_telegram_message(msg)
                
            # 현재 데이터를 다음 비교를 위해 저장
            PREVIOUS_WHALE_DATA[symbol] = {
                'oi': current_oi,
                'long_ratio': current_long_ratio
            }
                
        except Exception as e:
            print(f"[{symbol}] 고래 트래킹 에러: {e}")

def setup_schedule():
    # 기존 일정(05:00, 07:50, 12:00, 16:00, 22:00) 대비 5분 전 알림
    schedule.every().day.at("04:55").do(notify_0500)
    schedule.every().day.at("07:45").do(notify_0750)
    schedule.every().day.at("11:55").do(notify_1200)
    schedule.every().day.at("15:55").do(notify_1600)
    schedule.every().day.at("21:55").do(notify_2200)
    
    # 5분마다 긴급 속보 확인
    schedule.every(5).minutes.do(check_rss_news)
    print("☑️ RSS 뉴스 알람 스케줄 (5분 간격) 등록 완료")
    
    # 15분마다 고래(기관) 매집 활동 스캔
    schedule.every(15).minutes.do(check_whale_accumulation)
    print("☑️ 고래(세력) 매집 트래킹 스케줄 (15분 간격) 등록 완료")

if __name__ == '__main__':
    print("==================================================")
    print("⏰ 데일리 트레이딩 루틴 알람 & 기록 봇 시작 ⏰")
    print("스케줄에 맞추어 알림이 전송됩니다.")
    print("==================================================")
    
    setup_schedule()
    
    # 봇이 재시작되었거나 켜졌음을 알림
    send_telegram_message("🤖 <b>Daily Routine Bot Started!</b>\n정해진 시간에 맞춰 매일 프롬프트 점검 알림 및 구글 시트 요약 백업을 진행합니다.")
    
    while True:
        schedule.run_pending()
        time.sleep(30)
