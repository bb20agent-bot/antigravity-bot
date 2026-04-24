import os
import time
import requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# ==========================================
# [설정 항목]
# ==========================================
# 1. 구글 클라우드 콘솔의 OAuth 클라이언트 ID JSON 파일 경로 (미리 발급받아야 함)
CLIENT_SECRETS_FILE = 'client_secret.json'
# 2. Blogger API 권한 범위
SCOPES = ['https://www.googleapis.com/auth/blogger']
# 3. 배포할 구글 블로그의 고유 ID (Blogger 대시보드 URL에서 확인 가능)
BLOG_ID = os.getenv('BLOGGER_BLOG_ID', 'YOUR_BLOG_ID_HERE')

# ==========================================
# [프롬프트 가이드라인 - CTO 지시사항 반영]
# ==========================================
BLOG_PROMPT = """
당신은 전문 암호화폐 트레이딩 분석가입니다. 
콘텐츠의 주요 목적은 투자자 유치 및 커뮤니티 정보 공유입니다.
작성 어조는 '전문적 분석'을 기반으로 하되, '직관적이고 쉬운 설명'이 겸비되어야 합니다.
복잡한 트레이딩 개념도 일반 투자자들이 이해하기 쉽게 풀어내면서도, 전문가적인 신뢰성을 잃지 않도록 작성해 주세요.
"""

def authenticate_blogger():
    """Blogger API OAuth 2.0 인증 및 빌드"""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            
    return build('blogger', 'v3', credentials=creds)

def fetch_market_data_for_post():
    """다른 봇(daily_routine_bot.py 등)의 로직을 재사용하여 시장 브리핑 포맷 생성"""
    # 실제 연동 시에는 데이터베이스나 파일에서 실시간 지표 크롤링 결과를 융합합니다.
    dummy_market_data = """
    <ul>
        <li><b>단기 강세 신호:</b> BTC/USDT (골든크로스 발생)</li>
        <li><b>조이봇 분석 신호:</b> 이더리움 단기 하락 다이버전스 포착</li>
        <li><b>주요 거시 이벤트:</b> 미국 10년물 채권 경매 완료 (예상치 상회)</li>
    </ul>
    """
    return dummy_market_data

def generate_blog_content(title, recipe_description, market_data, image_url=""):
    """
    마크다운 대신 HTML 포맷으로 포스트 내용 생성 
    (Blogger API v3는 HTML Content를 요구합니다)
    """
    image_tag = f'<img src="{image_url}" alt="Trading Recipe Chart" style="max-width:100%; border-radius: 8px;"/>' if image_url else ''
    
    html_content = f"""
    <h2>{title}</h2>
    {image_tag}
    <br/><br/>
    <h3>📊 오늘의 시장 인사이트</h3>
    {market_data}
    
    <h3>🔥 트레이딩 레시피 해부</h3>
    <p>{recipe_description}</p>
    
    <hr/>
    <h3>🎁 레시피 원본 스크립트는 조이서(Joyseo)가 무료로 챙겨드릴게요!</h3>
    <p>지금 바로 <a href='https://t.me/joyseo_CMO_Bot' target='_blank'><b>[공식 텔레그램 조이봇]</b></a>으로 오셔서 <b>'스크립트 줘'</b> 라고 말씀해 주세요.</p>
    <ul>
        <li>7일 무료 Invite-Only 전략 사용 권한 지급</li>
        <li>1:1 차트 세팅 및 코인 분석 응대</li>
    </ul>
    """
    return html_content

def publish_post(service, blog_id, title, content):
    """Blogger API를 호출하여 새 글을 퍼블리시합니다."""
    post_body = {
        'kind': 'blogger#post',
        'title': title,
        'content': content
    }
    
    try:
        posts = service.posts()
        result = posts.insert(blogId=blog_id, body=post_body, isDraft=False).execute()
        print(f"✅ 포스팅 성공! URL: {result['url']}")
        return result['url']
    except Exception as e:
        print(f"❌ 블로그 포스팅 에러: {e}")
        return None

if __name__ == "__main__":
    print("==================================================")
    print("🌐 조이서의 트레이딩 레시피 - 블로거(Blogger) 게시 봇")
    print("==================================================")
    
    # 1. API 접속
    # 최초 실행 시 브라우저가 열리며 구글 로그인 화면이 뜹니다. 권한에 동의해주세요.
    try:
        blogger_service = authenticate_blogger()
        
        # 2. 컨텐츠 빌드 (나중에는 Puppeteer 이미지 수급 및 AI 스크립트 모듈 연동)
        post_title = "[조이서 레시피] 볼린저 밴드 + RSI 돌파 역주행 타점 전략 해부"
        recipe_desc = "이 전략은 전형적인 횡보 장세에서 박스권을 이탈할 때 나오는 거짓 신호(휩소)를 필터링하는 파인스크립트 레시피입니다. EMA 200선의 위치에 따라 롱/숏을 엄격히 구분하여 승률을 극대화 시켰습니다."
        market_stats = fetch_market_data_for_post()
        
        # 임시 플레이스홀더 썸네일 (이후 DALL-E 3나 차트 캡쳐 이미지 URL로 교체)
        thumbnail_url = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800"
        
        final_html = generate_blog_content(post_title, recipe_desc, market_stats, thumbnail_url)
        
        # 3. 작성
        if BLOG_ID != 'YOUR_BLOG_ID_HERE':
            publish_post(blogger_service, BLOG_ID, post_title, final_html)
        else:
            print("⚠️ 'BLOGGER_BLOG_ID' 환경변수가 설정되지 않아, 포스팅 테스트를 생략합니다.")
            
    except FileNotFoundError:
        print("❌ 'client_secret.json' 파일이 없습니다. Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 다운로드 하세요.")
