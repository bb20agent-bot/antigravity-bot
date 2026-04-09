import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram.enums import ParseMode
from dotenv import load_dotenv

from handlers.trading import router as trading_router

# Load environment variables
load_dotenv()

# Securely load bot token
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN or BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
    raise RuntimeError(
        "TELEGRAM_BOT_TOKEN is not set in environment variables or .env file. "
        "Please check your configuration."
    )

logging.basicConfig(level=logging.INFO)

async def main():
    bot = Bot(token=BOT_TOKEN, parse_mode=ParseMode.HTML)
    dp = Dispatcher()

    # Register routers
    dp.include_router(trading_router)

    # Simple start command defined here for brevity
    @dp.message(Command("start"))
    async def cmd_start(message: types.Message):
        welcome_text = (
            "🚀 Welcome to the **VORA P2P OTC Bot**! 🚀\n\n"
            "This bot allows you to securely trade VORA tokens via non-custodial Escrow smart contracts.\n\n"
            "Commands:\n"
            "/buy - Buy VORA tokens\n"
            "/sell - Sell VORA tokens\n"
            "/orders - View open orders\n"
            "/mywallet - Manage your TON Wallet connection"
        )
        await message.answer(welcome_text)

    # Start polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped!")
