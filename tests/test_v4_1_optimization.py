import json
import unittest
import sys
from unittest.mock import patch, mock_open, MagicMock

# To maintain repository hygiene during Python testing
sys.dont_write_bytecode = True

# Mock requests before importing v4_1_optimization
sys.modules['requests'] = MagicMock()

from v4_1_optimization import generate_interruption_report

class TestV41Optimization(unittest.TestCase):
    @patch('v4_1_optimization.os.path.exists')
    def test_generate_interruption_report_no_file(self, mock_exists):
        mock_exists.return_value = False
        report = generate_interruption_report()
        self.assertEqual(report, "No state file found. System is fresh.")

    @patch('v4_1_optimization.os.path.exists')
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps({
        "current_key_index": 1,
        "hold_media_generation": True,
        "trade_batch": []
    }))
    def test_generate_interruption_report_hold_active(self, mock_file, mock_exists):
        mock_exists.return_value = True
        report = generate_interruption_report()
        self.assertIn("=== SYSTEM STATUS REPORT ===", report)
        self.assertIn("Media Generation Hold Status: ACTIVE (Halted)", report)
        self.assertIn("Current API Key Index in Use: 1", report)
        self.assertIn("Pending Media Generation Queue (Trades waiting for video): 0", report)

    @patch('v4_1_optimization.os.path.exists')
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps({
        "current_key_index": 0,
        "hold_media_generation": False,
        "trade_batch": [{"symbol": "BTC/USDT"}, {"symbol": "ETH/USDT"}]
    }))
    def test_generate_interruption_report_with_trades(self, mock_file, mock_exists):
        mock_exists.return_value = True
        report = generate_interruption_report()
        self.assertIn("=== SYSTEM STATUS REPORT ===", report)
        self.assertIn("Media Generation Hold Status: Normal", report)
        self.assertIn("Pending Media Generation Queue (Trades waiting for video): 2", report)
        self.assertIn("Pending Trade Symbols:", report)
        self.assertIn(" - BTC/USDT", report)
        self.assertIn(" - ETH/USDT", report)

if __name__ == "__main__":
    unittest.main()
