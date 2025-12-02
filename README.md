# Soulbound Tokens for Identity-Bound Verifiable Credentials
### A Protocol for Non-Transferable Digital Asset and Identity Binding.

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![Status](https://img.shields.io/badge/status-Demo_Pending_Deployment-important.svg)

A blockchain-based platform for issuing and verifying academic and professional credentials as **non-transferable NFTs (Soulbound Tokens)**. This system addresses the inefficiencies, fraud risks, and lack of ownership in traditional credential verification by creating a single, immutable source of truth that is globally accessible and mathematically secure.

---

## Live Demo & Documentation

> **Note:** The demo functionality will be available once the hosted UI is deployed.
> You can still explore the complete flow by running the project locally.

- **Live Application:** *TBD*
- **Full Technical Documentation:** *[documentation file](./documentation/Documentation.pdf)*

---

## Problem Statement

Traditional credential verification systems suffer from:

- **Fraud & Forgery:** Physical and digital certificates are easily counterfeited.
- **Inefficiency:** Manual verification can take days or weeks.
- **Lack of Ownership:** Credentials are stored in institutional silos, not truly owned by recipients.

This project solves these issues by creating a secure, decentralized, and transparent system that enables whitelisted institutions to issue on-chain, non-transferable certificates that can be verified instantly and permissionlessly by any third party.

---

## Key Features

- **On-Chain Credential Issuance** – Whitelisted institutions can issue immutable, on-chain certificates with verifiable metadata.
- **Soulbound Tokens (SBTs)** – Certificates are implemented as non-transferable NFTs, ensuring they remain permanently tied to the recipient.
- **Instant Verification** – A public-facing UI allows anyone to query the blockchain for a certificate's authenticity.
- **Role-Based Access Control:** A secure, two-tiered administrative system (`DEFAULT_ADMIN_ROLE`, `ADMIN_ROLE`, `ISSUER_ROLE`) governs the platform.
- **Secure Demo Testing** – A `DemoRoleFaucet` contract allows safe, temporary role assignments for evaluation without compromising the main contract's security.

---

## Tech Stack

| Layer          | Technologies |
|----------------|--------------|
| Blockchain     | Solidity, Hardhat, Ethers.js, OpenZeppelin Contracts |
| Frontend       | React, TypeScript, Vite, CSS Modules |
| Testing        | Chai, Hardhat Test Helpers, Solidity Coverage, Hardhat Gas Reporter |
| Deployment     | Hardhat Ignition (Smart Contracts) |

---

## Project Structure

* `/smart-contracts`: The Hardhat project containing all Solidity contracts, a comprehensive test suite, and deployment scripts.
* `/frontend`: The Vite + React web application for interacting with the smart contracts.
* `/documentation`: Contains the complete technical project report (`Documentation.pdf`), all system diagrams (`.svg` files), UI mockups.

---

## Installation & Local Setup
To run this project locally, follow these steps.

### Prerequisites
- Node.js (v18+)
- Yarn or npm
- MetaMask browser extension *(preferred)*

### Steps to Run the Project Locally (Using Existing Deployed Contracts)

#### 1. Clone the repository
```bash
git clone https://github.com/Phig0r/decentralized-certificate-verification-system
```
#### 2. Navigate to the frontend directory
```bash
cd decentralized-certificate-verification-system/frontend
```

#### 3. Install frontend dependencies
```bash
npm install
```


#### 4. Start the development server
```bash
npm run dev
```
### (Optional) Deploy and Test Your Own Smart Contracts
If you want to run tests or deploy a new instance of the smart contracts:

#### 1. Navigate to the smart-contracts folder
```bash
cd decentralized-certificate-verification-system/smart-contracts
```

#### 2. Install dependencies
```bash
npm install
```
#### 3. Create a .env file in the smart-contracts folder with
```env
PRIVATE_KEY=<your-private-key>
RPC_URL=<your-ethereum-rpc-url>
```
#### 4. Run the tests
```bash
npx hardhat test
```

#### 5. Deploy your own contract (example for Sepolia testnet)
```bash
npx hardhat run ignition/modules/DeployCertify.ts --network sepolia
```

---

## Demo Instructions

This project includes a Demo Role Faucet for a seamless testing experience.

* **1. Connect Your Wallet:** Open the application and click **"Connect Wallet"**. You will start as a Recipient.
* **2. Request a Demo Role:** Click **"Get a Demo Role"**.

* **3. Choose a Role:**
  - **Become an Issuer**  – To access the certificate minting interface.
  - **Become an Admin** – To access the governance dashboard and manage institutions.
  - **Become a Recipient** – To revoke any special roles and return to the default view.
* **4. Explore:** After approving the transaction, the page will reload with your new interface.

---

## Sepolia Testnet ETH for Testing

To interact with the smart contracts on the Sepolia testnet, you will need Sepolia ETH in your MetaMask wallet. You can request free testnet ETH from the official Google Cloud Faucet:

**[Request Sepolia ETH](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)**

> Note: You must have a Google account and provide your Sepolia wallet address.

---

## Deployed Contract Addresses (Sepolia Testnet)

| Contract          | Address	                                      | Etherscan Link|
|-------------------|-----------------------------------------------|---------------|
|**CertificateNft** |	`0xc009f31C9f68c4d141091350D3aDDb77AB40d4F3`	| [Sepolia Etherscan Link](https://sepolia.etherscan.io/address/0xc009f31c9f68c4d141091350d3addb77ab40d4f3) |
|**DemoRoleFaucet**	| `0x5fA4f02152d33ab9FE683574525b89D024Ae9c1f`	| [Sepolia Etherscan Link](https://sepolia.etherscan.io/address/0x5fA4f02152d33ab9FE683574525b89D024Ae9c1f) |


