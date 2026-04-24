module.exports = {
  apps: [
    {
      name: "vora-frontend",
      script: "npm",
      args: "run dev -- --host",
      cwd: "c:/antigravity-bot",
      watch: false
    },
    {
      name: "vora-backend",
      script: "npx",
      args: "ts-node index.ts",
      cwd: "c:/antigravity-bot/server",
      watch: false
    },
    {
      name: "daily-routine-bot",
      script: "python",
      args: "binance_bot/daily_routine_bot.py",
      cwd: "c:/antigravity-bot",
      watch: false,
      restart_delay: 5000
    },
    {
      name: "joy-funnel-bot",
      script: "python",
      args: "binance_bot/joy_telegram_funnel_bot.py",
      cwd: "c:/antigravity-bot",
      watch: false,
      restart_delay: 5000
    },
    {
      name: "binance-trading-bot",
      script: "python",
      args: "binance_bot/binance_trading_bot.py",
      cwd: "c:/antigravity-bot",
      watch: false,
      restart_delay: 5000
    },
    {
      name: "webhook-bot",
      script: "python",
      args: "binance_bot/webhook_bot.py",
      cwd: "c:/antigravity-bot",
      watch: false,
      restart_delay: 5000
    },
    {
      name: "vora-webhook-handler",
      script: "python",
      args: "vora_webhook_handler.py",
      cwd: "c:/antigravity-bot",
      watch: false,
      restart_delay: 5000
    },
    {
      name: "vora-copy-broadcaster",
      script: "python",
      args: "vora_copy_broadcaster.py --master_sync",
      cwd: "c:/antigravity-bot",
      watch: false,
      restart_delay: 10000
    }
  ]
};
