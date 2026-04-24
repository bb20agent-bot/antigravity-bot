:: 1. 다이내믹 T2E 및 점수 시스템 문서 생성
(
echo # Simbora Dynamic T2E ^& Scoring System
echo.
echo ## 1. Subscription Scale (Multipliers^)
echo - Basic: 1.0x (Free entry^)
echo - Standard: 1.5x (Lvl 1 Referral open^)
echo - Premium: 3.0x (Lvl 2 Referral open, dNFT Boost^)
echo - VIP/Partner: 5.0x+ (All Levels open, Ecosystem Bonus eligibility^)
echo.
echo ## 2. Activity Scoring System
echo - New Referral: +50 pts (Fixed reward increase^)
echo - Team Building: +100 pts per 10 active members (Percentage bonus^)
echo - NFT Trading: +20 pts per 100 TON (Accelerates dNFT evolution^)
echo - Ecosystem Activities: +200 pts (Lectures, Parties, Conferences^)
echo.
echo ## 3. Calculation Logic
echo - Final T2E Reward = (Base_Reward * Scale_Multiplier^) + (Total_Activity_Score / 100^)
) > marketing\dynamic_t2e_v1.md

:: 2. 깃허브 전송 작업
git add .
git commit -m "Design: Implement dynamic scale and multi-faceted scoring system"
git push origin main