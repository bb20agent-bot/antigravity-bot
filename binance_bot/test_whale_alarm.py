import requests
import daily_routine_bot
import time

print("--- 강제 고래 알람 테스트 시작 ---")

# 임시 변수를 설정해서 알람이 무조건 울리도록 상황을 조작합니다.
symbols = ['BTCUSDT', 'ETHUSDT']

for symbol in symbols:
    print(f"[{symbol}] 알람 발송 테스트 (텔레그램 확인 요망)")
    # 알람이 트리거된 상황을 가정
    alert_triggered = True
    alert_reason = ""
    alert_reason += f"🔹 시장가 매수(Taker Buy) 볼륨이 매도 대비 1.85배 폭증 (테스트)\n"
    alert_reason += f"🔹 고래 롱 포지션 비중 증가 (0.512 -> 0.551) (테스트)\n"
    alert_reason += f"🔹 미결제약정(OI) 급등 (+1.50% 새로운 자금 유입) (테스트)\n"
    
    msg = (
        f"🚨🚨 <b>[{symbol} 기관/세력 매집 포착 (테스트)]</b> 🚨🚨\n\n"
        f"바이낸스 선물 시장에서 강한 매수 움직임이 감지되었습니다.\n\n"
        f"<b>[감지 사유]</b>\n"
        f"{alert_reason}\n"
        f"👉 차트 이동 및 추세 변화에 대비하세요!"
    )
    daily_routine_bot.send_telegram_message(msg)
    time.sleep(2) # 순서 보장

print("--- 테스트 완료 ---")
