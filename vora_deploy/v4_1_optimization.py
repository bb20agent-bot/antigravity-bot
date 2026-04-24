import json
import os
import time
import requests
import datetime

# --- CONFIGURATION ---
STATE_FILE = "RECOVERY_STATE.json"
# In a real environment, these would be loaded from .env
# We need the user to provide the backup keys here.
GEMINI_API_KEYS = [
    os.getenv("GEMINI_API_KEY_PRIMARY", "PRIMARY_KEY_PLACEHOLDER"),
    os.getenv("GEMINI_API_KEY_FAMILY_1", "BACKUP_KEY_1_PLACEHOLDER")
]

class QuotaManager:
    def __init__(self):
        self.state = self.load_state()
        self.current_key_index = self.state.get("current_key_index", 0)
        self.hold_media = self.state.get("hold_media_generation", False)
        self.trade_batch = self.state.get("trade_batch", [])

    def load_state(self):
        if os.path.exists(STATE_FILE):
            try:
                with open(STATE_FILE, "r") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading state: {e}. Starting fresh.")
        return {"current_key_index": 0, "hold_media_generation": False, "trade_batch": []}

    def save_state(self):
        self.state["current_key_index"] = self.current_key_index
        self.state["hold_media_generation"] = self.hold_media
        self.state["trade_batch"] = self.trade_batch
        with open(STATE_FILE, "w") as f:
            json.dump(self.state, f, indent=4)

    def get_current_key(self):
        return GEMINI_API_KEYS[self.current_key_index]

    def rotate_key(self):
        self.current_key_index += 1
        if self.current_key_index >= len(GEMINI_API_KEYS):
            print("CRITICAL: All API keys exhausted. Halting non-essential operations.")
            self.hold_media = True
            self.save_state()
            # Here: Send Telegram Alert about total quota exhaustion
            return False
        
        print(f"Rotating to API Key index {self.current_key_index}")
        self.save_state()
        return True

    def safe_gemini_request(self, payload, is_essential=False):
        """
        Wrapper for making requests to AI/Media generation APIs.
        is_essential: If True (e.g., core trading calc), it will always try.
                      If False (e.g., video gen), it respects hold_media.
        """
        if self.hold_media and not is_essential:
            print("Media generation is currently on HOLD due to quota limits. Skipping request.")
            return None

        for attempt in range(len(GEMINI_API_KEYS)):
            current_key = self.get_current_key()
            # MOCK REQUEST LOGIC - Replace with actual google.genai call
            # response = requests.post(f"API_URL?key={current_key}", json=payload)
            print(f"[{datetime.datetime.now()}] MOCK: Attempting request with key index {self.current_key_index}")
            
            # Simulated 429 Error for testing
            mock_status_code = 200
            if current_key == "PRIMARY_KEY_PLACEHOLDER":
                 mock_status_code = 429
            
            if mock_status_code == 429:
                print("Error 429: Too Many Requests detected.")
                if self.rotate_key():
                    continue # Try again with new key
                else:
                    break    # All keys failed
            
            elif mock_status_code == 200:
                # Success!
                # If we succeeded, we can potentially un-hold future media generation 
                # (though usually quota resets daily, so this logic might need a timer).
                return {"status": "success", "data": "Mock response data"}
            
        return {"status": "error", "message": "All API keys failed or quota exhausted."}

    def process_trade_webhook(self, trade_data):
        """
        Optimized entry point for TradingWebhooks.
        """
        print(f"\n--- Processing New Trade Action ---")
        
        # 1. CORE LOGIC STAYS ESSENTIAL (Execute trade via vora_n8n_handler)
        # result = execute_trade(exchange, trade_data['symbol'])
        print(f"Executing core trading logic for {trade_data.get('symbol', 'UNKNOWN')}... (Done)")
        
        # 2. Add to batch for later media generation
        self.trade_batch.append(trade_data)
        self.save_state()
        
        # 3. Batch Processing Logic
        BATCH_SIZE = 3
        if len(self.trade_batch) >= BATCH_SIZE:
            print(f"Batch size ({BATCH_SIZE}) reached. Attempting media generation...")
            
            # Minify prompt
            minified_prompt = f"Batch Report: {len(self.trade_batch)} trades."
            
            response = self.safe_gemini_request({"prompt": minified_prompt}, is_essential=False)
            
            if response and response.get("status") == "success":
                print("Media generated successfully.")
                self.trade_batch = [] # Clear batch on success
                self.save_state()
            else:
                print("Media generation deferred.")
        else:
             print(f"Trade added to batch. Current batch size: {len(self.trade_batch)}/{BATCH_SIZE}. Waiting...")

def generate_interruption_report():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
             state = json.load(f)
             
        report = []
        report.append("=== SYSTEM STATUS REPORT ===")
        report.append(f"Media Generation Hold Status: {'ACTIVE (Halted)' if state.get('hold_media_generation') else 'Normal'}")
        report.append(f"Current API Key Index in Use: {state.get('current_key_index')}")
        batch = state.get("trade_batch", [])
        report.append(f"Pending Media Generation Queue (Trades waiting for video): {len(batch)}")
        if batch:
            report.append("Pending Trade Symbols:")
            for t in batch:
                report.append(f" - {t.get('symbol')}")
        
        return "\n".join(report)
    return "No state file found. System is fresh."

if __name__ == "__main__":
    print(generate_interruption_report())
