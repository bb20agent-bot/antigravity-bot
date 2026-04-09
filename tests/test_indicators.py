import pandas as pd
import numpy as np
import pytest
from vora_webhook_handler import calculate_atr

def test_calculate_atr_basic():
    """Test ATR calculation with a known small dataset."""
    # Create dummy data (15 points)
    data = {
        'high': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        'low':  [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        'close': [9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5]
    }
    df = pd.DataFrame(data)

    # ATR period 14
    atr = calculate_atr(df['high'], df['low'], df['close'], period=14)

    assert len(atr) == 15
    # The first 13 values should be NaN because we need 14 values for the rolling mean
    # Index 0 to 12 are NaN
    assert atr.iloc[:13].isna().all()
    # Index 13 and 14 should have values
    assert not np.isnan(atr.iloc[13])
    assert not np.isnan(atr.iloc[14])

def test_calculate_atr_constant_price():
    """Test ATR with constant prices (should result in 0 ATR)."""
    high = pd.Series([10.0] * 20)
    low = pd.Series([10.0] * 20)
    close = pd.Series([10.0] * 20)

    atr = calculate_atr(high, low, close, period=14)

    # After initial NaNs (index 0 to 12), it should be 0.0
    assert atr.iloc[13] == 0.0
    assert atr.iloc[-1] == 0.0

def test_calculate_atr_logic_verification():
    """Verify the True Range logic and mean calculation."""
    # TR calculation: max(high-low, abs(high-prev_close), abs(low-prev_close))
    high = pd.Series([10, 12, 11])
    low = pd.Series([9, 11, 10])
    close = pd.Series([9.5, 11.5, 10.5])

    # Index 0:
    # tr1 = 10-9 = 1
    # tr2 = NaN
    # tr3 = NaN
    # TR[0] = 1.0

    # Index 1:
    # tr1 = 12-11 = 1
    # tr2 = |12-9.5| = 2.5
    # tr3 = |11-9.5| = 1.5
    # TR[1] = 2.5

    # Index 2:
    # tr1 = 11-10 = 1
    # tr2 = |11-11.5| = 0.5
    # tr3 = |10-11.5| = 1.5
    # TR[2] = 1.5

    # For period=2:
    # atr[0] = NaN
    # atr[1] = (1.0 + 2.5) / 2 = 1.75
    # atr[2] = (2.5 + 1.5) / 2 = 2.0

    atr = calculate_atr(high, low, close, period=2)

    assert np.isnan(atr.iloc[0])
    assert atr.iloc[1] == pytest.approx(1.75)
    assert atr.iloc[2] == pytest.approx(2.0)

def test_calculate_atr_gap_up():
    """Test ATR with a significant price gap up."""
    # Previous close was 10. Current high 15, low 14.
    # tr1 = 15-14 = 1
    # tr2 = |15-10| = 5
    # tr3 = |14-10| = 4
    # TR should be 5
    high = pd.Series([10, 15])
    low = pd.Series([9, 14])
    close = pd.Series([10, 14.5])

    atr = calculate_atr(high, low, close, period=2)
    # TR[0] = 1
    # TR[1] = 5
    # ATR[1] = (1+5)/2 = 3
    assert atr.iloc[1] == pytest.approx(3.0)

def test_calculate_atr_gap_down():
    """Test ATR with a significant price gap down."""
    # Previous close was 10. Current high 6, low 5.
    # tr1 = 6-5 = 1
    # tr2 = |6-10| = 4
    # tr3 = |5-10| = 5
    # TR should be 5
    high = pd.Series([10, 6])
    low = pd.Series([9, 5])
    close = pd.Series([10, 5.5])

    atr = calculate_atr(high, low, close, period=2)
    # TR[0] = 1
    # TR[1] = 5
    # ATR[1] = (1+5)/2 = 3
    assert atr.iloc[1] == pytest.approx(3.0)
