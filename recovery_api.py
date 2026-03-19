import os
import json
from flask import Flask, jsonify, request

app = Flask(__name__)

# Security Token (Should be in .env in production)
API_SECRET_TOKEN = os.getenv("VORA_INTERNAL_API_TOKEN", "brown_cto_secure_token_2026")
STATE_FILE = "RECOVERY_STATE.json"

@app.route('/api/internal/recovery-state', methods=['GET'])
def get_recovery_state():
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f"Bearer {API_SECRET_TOKEN}":
        return jsonify({"error": "Unauthorized"}), 401
    
    if not os.path.exists(STATE_FILE):
        return jsonify({"error": "State file not found", "data": None}), 404
        
    try:
        with open(STATE_FILE, "r") as f:
            state_data = json.load(f)
        return jsonify({"status": "success", "data": state_data}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to read state: {str(e)}"}), 500

if __name__ == '__main__':
    # Run on internal port 5000 (Recommend bind to internal IP or use reverse proxy like Nginx)
    app.run(host='0.0.0.0', port=5000)
