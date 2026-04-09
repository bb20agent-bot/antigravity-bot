import sys
from unittest.mock import MagicMock, patch

# Mocking missing modules before any other imports
mock_pd = MagicMock()
mock_np = MagicMock()
mock_ccxt = MagicMock()
mock_yf = MagicMock()
mock_requests = MagicMock()

sys.modules['pandas'] = mock_pd
sys.modules['numpy'] = mock_np
sys.modules['ccxt'] = mock_ccxt
sys.modules['yfinance'] = mock_yf
sys.modules['requests'] = mock_requests

import unittest

# Now we can import the handler
# We need to make sure vora_webhook_handler uses our mocks
import vora_webhook_handler
from vora_webhook_handler import check_exit_condition

class TestVoraWebhookHandler(unittest.TestCase):

    def setUp(self):
        self.mock_exchange = MagicMock()
        self.symbol = 'BTCUSDT'

    @patch('vora_webhook_handler.fetch_ohlcv_yfinance')
    @patch('vora_webhook_handler.calculate_ema')
    def test_check_exit_condition_no_position(self, mock_calc_ema, mock_fetch_yf):
        # Scenario 1: No open positions
        self.mock_exchange.fetch_positions.return_value = []

        result = check_exit_condition(self.mock_exchange, self.symbol)

        self.assertEqual(result['status'], 'success')
        self.assertEqual(result['signal'], 'NO_POSITION')
        self.mock_exchange.fetch_positions.assert_called_once_with([self.symbol])
        mock_fetch_yf.assert_not_called()

    @patch('vora_webhook_handler.fetch_ohlcv_yfinance')
    @patch('vora_webhook_handler.calculate_ema')
    def test_check_exit_condition_hold(self, mock_calc_ema, mock_fetch_yf):
        # Scenario 2: Open position exists but trend is NOT broken (Close > EMA100)
        self.mock_exchange.fetch_positions.return_value = [{'contracts': 1.0}]

        mock_df = MagicMock()
        mock_fetch_yf.return_value = mock_df

        # Mocking the last row of the dataframe
        mock_curr = {'close': 105.0, 'ema100': 100.0}
        mock_df.iloc = MagicMock()
        mock_df.iloc.__getitem__.return_value = mock_curr

        result = check_exit_condition(self.mock_exchange, self.symbol)

        self.assertEqual(result['status'], 'success')
        self.assertEqual(result['signal'], 'HOLD')
        self.mock_exchange.create_market_order.assert_not_called()

    @patch('vora_webhook_handler.fetch_ohlcv_yfinance')
    @patch('vora_webhook_handler.calculate_ema')
    def test_check_exit_condition_close_executed_long(self, mock_calc_ema, mock_fetch_yf):
        # Scenario 3: Open long position exists and trend IS broken (Close < EMA100)
        self.mock_exchange.fetch_positions.return_value = [{'contracts': 1.0}]

        mock_df = MagicMock()
        mock_fetch_yf.return_value = mock_df

        # Mocking the last row of the dataframe
        mock_curr = {'close': 95.0, 'ema100': 100.0}
        mock_df.iloc = MagicMock()
        mock_df.iloc.__getitem__.return_value = mock_curr

        result = check_exit_condition(self.mock_exchange, self.symbol)

        self.assertEqual(result['status'], 'success')
        self.assertEqual(result['signal'], 'CLOSE_EXECUTED')
        self.assertEqual(result['reason'], 'Trend Broken (Price < EMA100)')

        # Verify market order execution: side should be 'sell' for long
        self.mock_exchange.create_market_order.assert_called_once_with(
            self.symbol, 'sell', 1.0, params={'reduceOnly': True}
        )

    @patch('vora_webhook_handler.fetch_ohlcv_yfinance')
    @patch('vora_webhook_handler.calculate_ema')
    def test_check_exit_condition_close_executed_short(self, mock_calc_ema, mock_fetch_yf):
        # Scenario 3.1: Open short position exists and trend IS broken
        self.mock_exchange.fetch_positions.return_value = [{'contracts': -1.0}]

        mock_df = MagicMock()
        mock_fetch_yf.return_value = mock_df

        # Mocking the last row of the dataframe
        mock_curr = {'close': 95.0, 'ema100': 100.0}
        mock_df.iloc = MagicMock()
        mock_df.iloc.__getitem__.return_value = mock_curr

        result = check_exit_condition(self.mock_exchange, self.symbol)

        self.assertEqual(result['status'], 'success')
        self.assertEqual(result['signal'], 'CLOSE_EXECUTED')

        # Verify market order execution: side should be 'buy' for short
        self.mock_exchange.create_market_order.assert_called_once_with(
            self.symbol, 'buy', 1.0, params={'reduceOnly': True}
        )

    @patch('vora_webhook_handler.fetch_ohlcv_yfinance')
    def test_check_exit_condition_exception(self, mock_fetch_yf):
        # Scenario 4: Exception handling
        self.mock_exchange.fetch_positions.side_effect = Exception("API Error")

        result = check_exit_condition(self.mock_exchange, self.symbol)

        self.assertEqual(result['status'], 'error')
        self.assertEqual(result['message'], 'API Error')

if __name__ == '__main__':
    # Add this to avoid issues with pytest and sys.modules mocking
    unittest.main()
