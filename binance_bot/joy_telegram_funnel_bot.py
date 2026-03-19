import os
import re
import requests
from dotenv import load_dotenv
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, ConversationHandler

# ==========================================
# 환경 변수 로드
# ==========================================
load_dotenv()
JOY_TELEGRAM_TOKEN = os.getenv('JOY_TELEGRAM_TOKEN', 'YOUR_TELEGRAM_BOT_TOKEN')
GOOGLE_SHEET_WEBHOOK = os.getenv('GOOGLE_SHEET_WEBHOOK')

# 대화 상태 정의 (Conversation States)
ASK_EMAIL = 1
ASK_TV_ID = 2

# 간단한 이메일 정규식 유효성 검사
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """사용자가 /start 명령을 보냈을 때 작동 (퍼널 진입점)"""
    user_fname = update.message.from_user.first_name
    welcome_msg = (
        f"반가워요 {user_fname}님! 조이서(Joyseo)의 트레이딩 레시피 채널에 오신 걸 환영합니다. ✨\n\n"
        "극강의 승률을 자랑하는 '레시피 스크립트' 원본과 7일 무료 초청권, "
        "그리고 저의 차트 세팅 1:1 분석을 도와드려요.\n\n"
        "🎁 **먼저 스크립트 지급을 위해, 연락 받으실 [이메일 주소]를 하나 남겨주시겠어요?**"
    )
    await update.message.reply_text(welcome_msg)
    return ASK_EMAIL

async def receive_email(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """사용자로부터 이메일 주소를 입력받고 유효성 검사"""
    email_text = update.message.text
    
    if not re.match(EMAIL_REGEX, email_text):
        await update.message.reply_text("올바른 이메일 주소 형식이 아닌 것 같아요. 다시 한번 이메일 주소를 남겨주시겠어요? 🧐")
        return ASK_EMAIL
        
    context.user_data['email'] = email_text
    
    reply_msg = (
        f"좋아요! 이메일(`{email_text}`)이 안전하게 확인되었습니다. 📩\n\n"
        "마지막으로! 트레이딩뷰에서 비공개(Invite-only) 원본 스크립트 권한을 넣어드려야 해요.\n"
        "👉 **[트레이딩뷰 유저 아이디(Username)]** 를 영문으로 입력해 주세요!"
    )
    await update.message.reply_text(reply_msg, parse_mode='Markdown')
    return ASK_TV_ID

async def receive_tv_id(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """사용자로부터 트레이딩뷰 아이디를 입력받고 구글 시트 전송 후 혜택 지급"""
    tv_id = update.message.text
    email = context.user_data.get('email')
    user_name = update.message.from_user.full_name
    
    # 1. 구글 시트로 데이터 로깅 (퍼널 정보 저장)
    if GOOGLE_SHEET_WEBHOOK:
        try:
            payload = {
                "symbol": "LEAD_GEN",
                "action": "FUNNEL_OPTIN",
                "price": 0,
                "quantity": 0,
                "message": f"Name: {user_name} | Email: {email} | TV_ID: {tv_id}"
            }
            requests.post(GOOGLE_SHEET_WEBHOOK, json=payload, timeout=5)
            print(f"✅ 리드 생성 성공: {email}")
        except Exception as e:
            print(f"❌ 시트 로깅/저장 에러: {e}")
    
    # 2. 유저에게 권한 혜택 안내 (스크립트/레퍼럴 링크 제공)
    success_msg = (
        "🎉 **모든 절차가 완료되었습니다!**\n\n"
        f"입력해주신 유저네임 `{tv_id}` 로 VORA 프리미엄 레시피 스크립트 **7일 사용 권한**을 전송 요청했습니다. (최대 12시간 내 접속 활성화)\n\n"
        "🔥 **[보너스 가이드]**\n"
        "조이서가 세팅하는 백테스트 환경과 1:1 트레이딩 질의응답은 앞으로 이 챗봇에서 계속 가능해요!\n\n"
        "👉 추가 레시피 계속 보기: [공식 레시피 블로그 링크]\n"
        "👉 실전 바이낸스 수수료 할인: [바이낸스 레퍼럴 링크]\n\n"
        "궁금한 점이 생기면 언제든 여기에 편하게 질문 남겨주세요! 😊"
    )
    await update.message.reply_text(success_msg, parse_mode='Markdown')
    
    # 대화 종료
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """대화 중단"""
    await update.message.reply_text("언제든 준비되시면 /start 를 다시 눌러서 레시피를 받아가세요! 👋")
    return ConversationHandler.END

if __name__ == '__main__':
    print("==================================================")
    print("🤖 조이서 퍼널 마케팅 텔레그램 봇 (Joy_Bot) 인스턴스 시작")
    print("==================================================")
    
    if JOY_TELEGRAM_TOKEN == 'YOUR_TELEGRAM_BOT_TOKEN' or not JOY_TELEGRAM_TOKEN:
        print("⚠️ 에러: .env 파일에 JOY_TELEGRAM_TOKEN이 세팅되지 않았습니다!")
        exit(1)

    # 텔레그램 애플리케이션 초기화
    app = Application.builder().token(JOY_TELEGRAM_TOKEN).build()

    # ConversationHandler: 이메일 -> 트레이딩뷰 아이디 -> 종료 루프
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            ASK_EMAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_email)],
            ASK_TV_ID: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_tv_id)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    app.add_handler(conv_handler)
    
    # 봇 가동 (백그라운드 인터랙티브 수신)
    print("👉 수신을 대기합니다... (퍼널 정상 작동 중)")
    app.run_polling()
