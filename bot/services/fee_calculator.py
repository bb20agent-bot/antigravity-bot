# Tier thresholds in TON (simplified for example)
TIERS = [
    {"limit": 10000, "fee": 7.0, "rebate": 20, "name": "Basic (up to $10k)"},
    {"limit": 100000, "fee": 6.0, "rebate": 30, "name": "Silver (up to $100k)"},
    {"limit": 500000, "fee": 5.5, "rebate": 40, "name": "Gold (up to $500k)"},
    {"limit": 2000000, "fee": 5.0, "rebate": 50, "name": "Platinum (up to $2M)"},
    {"limit": float('inf'), "fee": 4.5, "rebate": 60, "name": "Whale ($2M+)"}
]

# Assume 1 TON = $5 (example rate)
TON_TO_USD = 5

def calculate_fees(ton_amount: float) -> dict:
    usd_value = ton_amount * TON_TO_USD
    
    # Find the appropriate tier
    selected_tier = TIERS[-1]
    for tier in TIERS:
        if usd_value <= tier["limit"]:
            selected_tier = tier
            break

    total_fee_percent = selected_tier["fee"]
    rebate_percent = selected_tier["rebate"]
    
    total_fee_ton = (ton_amount * total_fee_percent) / 100
    
    # Distribution based on total_fee
    treasury_ton = (total_fee_ton * 30) / 100
    seller_fee_ton = (total_fee_ton * 40) / 100
    buyer_rebate_ton = (total_fee_ton * rebate_percent) / 100
    dev_fund_ton = total_fee_ton - treasury_ton - seller_fee_ton - buyer_rebate_ton

    return {
        "usd_value": usd_value,
        "tier_name": selected_tier["name"],
        "total_fee_percent": total_fee_percent,
        "total_fee_ton": total_fee_ton,
        "treasury_ton": treasury_ton,
        "seller_fee_ton": seller_fee_ton,
        "buyer_rebate_ton": buyer_rebate_ton,
        "dev_fund_ton": dev_fund_ton
    }
