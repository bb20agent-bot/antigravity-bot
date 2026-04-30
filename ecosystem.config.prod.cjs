module.exports = {
  apps: [
    {
      name: "vora-backend",
      script: "npm",
      args: "run start",
      cwd: "/opt/vora-ecosystem/server",
      watch: false,
      env: {
        PORT: 3001,
        NODE_ENV: "production"
      }
    },
    {
      name: "joy-funnel-bot",
      script: "true_legacy_vora/binance_bot/joy_telegram_funnel_bot.py",
      interpreter: "/opt/vora-ecosystem/bot_env/bin/python3",
      cwd: "/opt/vora-ecosystem",
      watch: false,
      restart_delay: 5000
    },
    {
      name: "signal-server",
      script: "main.py",
      interpreter: "/opt/vora-ecosystem/bot_env/bin/python3",
      cwd: "/opt/vora-ecosystem/signal_server",
      watch: false,
      restart_delay: 5000,
      env: {
        PORT: 8000
      }
    }
  ]
};
