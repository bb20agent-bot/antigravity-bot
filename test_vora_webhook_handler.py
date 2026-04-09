import sys
from unittest.mock import MagicMock, patch

def test_check_balance_success():
    mock_exchange = MagicMock()
    mock_exchange.private_get_v5_account_wallet_balance.return_value = {
        'result': {
            'list': [
                {'totalEquity': '15000.50'}
            ]
        }
    }

    # Mocking missing modules within the test scope to avoid side effects
    with patch.dict('sys.modules', {
        'ccxt': MagicMock(),
        'pandas': MagicMock(),
        'numpy': MagicMock(),
        'requests': MagicMock(),
        'yfinance': MagicMock()
    }):
        import vora_webhook_handler
        balance = vora_webhook_handler.check_balance(mock_exchange)
        assert balance == 15000.50
        mock_exchange.private_get_v5_account_wallet_balance.assert_called_once_with({'accountType': 'UNIFIED'})

def test_check_balance_exception():
    mock_exchange = MagicMock()
    mock_exchange.private_get_v5_account_wallet_balance.side_effect = Exception("API Error")

    with patch.dict('sys.modules', {
        'ccxt': MagicMock(),
        'pandas': MagicMock(),
        'numpy': MagicMock(),
        'requests': MagicMock(),
        'yfinance': MagicMock()
    }):
        import vora_webhook_handler
        balance = vora_webhook_handler.check_balance(mock_exchange)
        assert balance == 10000.0
