import sys
from unittest.mock import MagicMock

# Mocking modules that are missing or heavy
mock_modules = [
    "requests",
    "ccxt",
    "MetaTrader5",
    "fastapi",
    "fastapi.middleware.cors",
    "pydantic",
    "dotenv",
]
for module_name in mock_modules:
    sys.modules[module_name] = MagicMock()

import unittest
from webhook_receiver import calculate_position_size, app_state

class TestCalculatePositionSize(unittest.TestCase):
    def setUp(self):
        # Reset app_state to a known state before each test
        app_state["seed_balance"] = 1000.0
        app_state["risk_pct"] = 1.0

    def test_binance_normal(self):
        # seed=1000, risk_pct=1.0 -> risk_amount=10.0
        # sl_distance=10 -> size = 10 / 10 = 1.0
        result = calculate_position_size("BINANCE", "BTCUSDT", 1.0, 10.0, 50000.0)
        self.assertEqual(result, 1.0)

    def test_binance_min_size(self):
        # seed=1000, risk_pct=1.0 -> risk_amount=10.0
        # sl_distance=100000 -> size = 10 / 100000 = 0.0001
        # should return 0.001 (min size)
        result = calculate_position_size("BINANCE", "BTCUSDT", 1.0, 100000.0, 50000.0)
        self.assertEqual(result, 0.001)

    def test_mt5_usd_symbol(self):
        # seed=1000, risk_pct=1.0 -> risk_amount=10.0
        # pip_value = 10 (USD in symbol)
        # sl_distance=10 -> lot = 10 / (10 * 10) = 0.1
        result = calculate_position_size("MT5", "EURUSD", 1.0, 10.0, 1.08)
        self.assertEqual(result, 0.1)

    def test_mt5_non_usd_symbol(self):
        # seed=1000, risk_pct=1.0 -> risk_amount=10.0
        # pip_value = 1 (No USD in symbol)
        # sl_distance=10 -> lot = 10 / (10 * 1) = 1.0
        result = calculate_position_size("MT5", "EURGBP", 1.0, 10.0, 0.85)
        self.assertEqual(result, 1.0)

    def test_mt5_min_lot(self):
        # seed=1000, risk_pct=1.0 -> risk_amount=10.0
        # pip_value = 10
        # sl_distance=1000 -> lot = 10 / (1000 * 10) = 0.001
        # should return 0.01 (min lot)
        result = calculate_position_size("MT5", "EURUSD", 1.0, 1000.0, 1.08)
        self.assertEqual(result, 0.01)

    def test_zero_sl_distance_binance(self):
        # Should return min size instead of raising ZeroDivisionError
        result = calculate_position_size("BINANCE", "BTCUSDT", 1.0, 0.0, 50000.0)
        self.assertEqual(result, 0.001)

    def test_zero_sl_distance_mt5(self):
        # Should return min lot instead of raising ZeroDivisionError
        result = calculate_position_size("MT5", "EURUSD", 1.0, 0.0, 1.08)
        self.assertEqual(result, 0.01)

if __name__ == "__main__":
    unittest.main()
