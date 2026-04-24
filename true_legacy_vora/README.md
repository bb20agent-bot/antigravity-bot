
# VORA Ecosystem: TON-Based Unilevel Hub

This repository contains the public components of the BORA platform user ecosystem, specifically the TON Smart Contracts and the Telegram Mini App (TMA) interface.

## Repository Structure
- `/contracts`: TON Smart Contracts written in **Tact**. Implements the 7:3 distribution protocol and Unilevel reward mechanism.
- `/src/user`: User-facing Telegram Mini App logic, including Tap-to-Earn (T2E) and on-chain reward status.
- `/src/admin`: [EXCLUDED] Administrative logic is stored in a private environment and is not part of this public repository.

## Protocol Highlights
1. **7:3 Split Protocol**: All inflows are automatically split at the contract level (70% User / 30% Ecosystem).
2. **Unilevel Architecture**: 10% (L1), 5% (L2), 3% (L3) commission yields verified on the TON Blockchain.

## Legal Disclaimer
The code provided in this repository is for educational and protocol auditing purposes. The use of BORA tokens and participation in the Unilevel network is subject to your local jurisdiction's regulations regarding digital assets and multi-level rewards. Use at your own risk.
