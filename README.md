# VORA Ecosystem: T3E Flywheel & Bromotion Hub

Welcome to the **VORA Ecosystem** repository. This project powers a dual-interface Telegram Mini App (TMA) ecosystem designed to bridge crypto-native liquidity (TON/VORA) with real-world advertising utility (Bromotion). 

The ecosystem fundamentally operates as a **Flywheel Trading & Staking Pool** network, moving away from legacy "tap-to-earn" mechanics.

---

## 🌌 Ecosystem Architecture

The VORA Ecosystem is divided into two mathematically decoupled, yet financially interconnected, platform endpoints:

### 1. VORA Mini-App (`voramini.com`)
The primary user-facing consumer hub for general VORA holders.
- **Flywheel Trading Staking Pool:** A robust, automated staking environment where users can participate in live futures trading insights (guided by Baul/Brown AI Agents) and earn yield via the platform's self-sustaining flywheel mechanism.
- **AI Automated Trading Bot:** Seamless integration with a built-in AI interface to track live trading charts (`recharts`).
- **TON/VORA Integrated Wallet:** A 100% unified smart contract wallet featuring Mnemonic backup, dual-asset balances, and cross-platform syncing.

### 2. Bromotion Driver Hub (`voraswap.com`)
The specialized P2P Liquidity platform designed strictly for "vehicle drivers" participating in offline advertisements.
- **P2P Dual Escrow Market:** Drivers utilize TON to purchase (swap) VORA from standard users via a strictly audited Escrow mechanism.
- **5% Commission Structure:** Every swap securely mints a 5% driver incentive yield verified at the contract level.
- **Premium Dark UI:** Designed with high aesthetic fidelity (`Framer Motion`, `TailwindCSS v4`), specifically circumventing Chromium WebView compositing bugs to ensure flawless mobile presentation.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React
- **Blockchain Connectivity:** `@tonconnect/ui-react`, `@ton/crypto`
- **Backend & Bot Infrastructure:** NodeJS, PM2, Telegraf (Telegram Bot API)
- **Deployment:** Zero-downtime automated Google Cloud Platform (GCP) powershell orchestration (`deploy_to_gcp.ps1`). Reverse Proxy handled by NGINX.

---

## 🚀 Key Features Recently Implemented

1. **Chromium Rendering Fixes:** Natively bypassed the Android/Telegram "Force Dark Mode" stripping bugs and `backdrop-filter` rendering crashes, guaranteeing overlapping layers and modals render beautifully on all low-end devices.
2. **Contextual Settings:** Added integrated settings menus on both hubs (Mnemonic backup, Currency conversion USD/KRW, Multilingual support).
3. **Escrow Smart-Signature:** Secure UI workflow displaying exact wallet debits (TON) and credits (VORA) before committing transactions.
4. **Cloud Auto-Deploy Pipeline:** A fully robust PowerShell script that builds the React environments, orchestrates NGINX routing, and re-boots PM2 backend instances transparently.

---

## 🔐 Legal Disclaimer
The code provided in this repository is strictly for administrative, educational, and internal use for the VORA Foundation. The dual-escrow contracts and Unilevel architecture components must be used in compliance with local regulations regarding digital assets and P2P value exchange. Use at your own risk.
