import os
import json
from v4_1_optimization import QuotaManager, generate_interruption_report

def run_simulation():
    print("--- Starting V4.1 Optimization Simulation ---")
    
    # 1. Clean state
    if os.path.exists("RECOVERY_STATE.json"):
        os.remove("RECOVERY_STATE.json")
        
    qm = QuotaManager()
    
    # 2. Simulate Webhook Triggers
    trades_to_simulate = [
        {"symbol": "BTCUSDT", "signal": "BUY", "price": 65000},
        {"symbol": "ETHUSDT", "signal": "SELL", "price": 3500},
        {"symbol": "SOLUSDT", "signal": "BUY", "price": 145},
    ]
    
    for i, trade in enumerate(trades_to_simulate):
        print(f"\n[Simulation Step {i+1}] Received Trade Signal: {trade['symbol']}")
        qm.process_trade_webhook(trade)
        
    print("\n--- Simulation Complete ---")
    print(generate_interruption_report())

if __name__ == "__main__":
    run_simulation()
