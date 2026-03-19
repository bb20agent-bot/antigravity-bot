from aiogram import Router, types
from aiogram.filters.command import Command
from services.fee_calculator import calculate_fees

router = Router()

# Mock Orders Data Structure
open_orders = [
    {"id": 1, "type": "SELL", "amount_vora": 10000, "price_ton": 50, "seller": "UserA"},
]

@router.message(Command("sell"))
async def cmd_sell(message: types.Message):
    # In a real bot, we'd use FSM to capture amount and price
    # For now, it's a static response explaining the flow
    response = (
        "📈 **Create Sell Order**\n\n"
        "To sell VORA, you will need to lock it in the Escrow contract.\n\n"
        "Example Command: `/sell 10000 VORA for 50 TON`\n\n"
        "A TON Connect link will be generated for you to sign the Escrow transfer."
    )
    await message.answer(response, parse_mode="Markdown")

@router.message(Command("buy"))
async def cmd_buy(message: types.Message):
    response = (
        "📉 **Create Buy Order / Fulfill Sell Order**\n\n"
        "To buy VORA, you will send TON to the Escrow contract holding the tokens.\n\n"
        "Example Command: `/buy OrderID`\n\n"
        "A TON Connect link will be generated to authorize the TON transfer."
    )
    await message.answer(response, parse_mode="Markdown")

@router.message(Command("orders"))
async def cmd_orders(message: types.Message):
    if not open_orders:
        await message.answer("No open orders right now.")
        return

    text = "📋 **Open OTC Orders**\n\n"
    for order in open_orders:
        fees = calculate_fees(order["price_ton"])
        text += (
            f"🔹 ID: `{order['id']}` | {order['type']}\n"
            f"Amount: {order['amount_vora']} VORA\n"
            f"Price: {order['price_ton']} TON\n"
            f"Fee Tier: {fees['tier_name']} ({fees['total_fee_percent']}%)\n\n"
        )
    await message.answer(text, parse_mode="Markdown")
