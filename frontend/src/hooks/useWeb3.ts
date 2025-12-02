/**
 * @file useWeb3.ts
 * @description A centralized collection of custom React hooks for interacting with the
 * CertifyChain smart contracts. This file encapsulates all the core Web3 logic,
 * including wallet connection, contract instance creation, and data fetching.
 * Includes automatic network switching to Sepolia testnet when connecting wallets to ensure compatibility.
 */

"use client";

import { useMemo, useCallback, useState } from "react";

import { ethers, type BigNumberish, type Signer } from "ethers";

import { CERTIFY_CHAIN_ADDRESS, DEMO_ROLE_FAUCET_ADDRESS } from "../utils/constants";
import {contractAbi} from "../utils/abi/CertificationNftABI.json";
import {demoFaucetContractAbi} from "../utils/abi/DemoRoleFacuetABI.json";

import { wait } from "../utils/constants";
import type { CertificateNft, DemoRoleFaucet ,CertificateData, ToastState, ToastType, Roles } from "../types/types";

const SEPOLIA_CHAIN_ID = BigInt(11155111);
const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    import.meta.env.VITE_ALCHEMY_SEPOLIA_URL || 'https://rpc.sepolia.org'
  ],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

// --- CONTRACT HOOK ---

export function useContract(signer: Signer | null) {
   let provider: ethers.BrowserProvider;
   if (typeof window !== 'undefined' && (window as any).ethereum) {
      provider = new ethers.BrowserProvider((window as any).ethereum);
   }

   const contract = useMemo(() => {
   const contractRunner = signer ?? provider;
      if (!contractRunner) {
         return null;
      }
      return new ethers.Contract(
         CERTIFY_CHAIN_ADDRESS, 
         contractAbi, 
         contractRunner
      ) as unknown as CertificateNft;

   }, [signer]);

    return contract;
}

// --- WALLET HOOK ---

export function useWalletConnect () {
   const [walletAddress, setWalletAddress] = useState<string | null>(null);
   const [signer, setSigner] = useState<Signer | null>(null);

   const [closingToast, setToast] = useState<ToastState>({
      show: false,
      message: '',
      type: 'info'
   });

   const showToast = (message: string, type: ToastType) => {
      setToast({ show: true, message, type });
   };

   const handleCloseToast = () => {
    setToast({ ...closingToast, show: false });
   };

   const checkAndSwitchNetwork = async () => {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
         throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
         try {
            await (window as any).ethereum.request({
               method: 'wallet_switchEthereumChain',
               params: [{ chainId: SEPOLIA_NETWORK.chainId }],
            });
         } catch (switchError: any) {
            if (switchError.code === 4902) {
               await (window as any).ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [SEPOLIA_NETWORK],
               });
            } else {
               throw new Error("Failed to switch to Sepolia network");
            }
         }
      }
   };

   const connectWallet = useCallback( async()=>{
      try{
         if (typeof window === 'undefined' || !(window as any).ethereum) {
            showToast("Please install MetaMask to connect your wallet", 'error');
            return;
         }

         const provider = new ethers.BrowserProvider((window as any).ethereum);

         showToast("Switching to Sepolia testnet...", 'info');
         await checkAndSwitchNetwork();

         await provider.send("eth_requestAccounts", []);
         
         const currentSigner = await provider.getSigner();
         const currentWallet = await currentSigner.getAddress()

         setSigner(currentSigner);
         setWalletAddress(currentWallet);
         handleCloseToast();

         (window as any).ethereum.on('chainChanged', () => {
            window.location.reload();
         });

      } catch(error: any) {
         console.log("Couldn't connect to the wallet", error);
         showToast(error.message || "Couldn't connect to the wallet", 'error');
      }
   },[]);

   const disconnectWallet = async ()=>{
      showToast("Disconnecting wallet...", 'info');
      await wait(2000);
      setSigner(null);
      setWalletAddress(null);
      handleCloseToast();
   }

   return {signer, walletAddress, connectWallet, disconnectWallet, closingToast}

}

// --- CERTIFCATE HOOK ---

export function useCertificateData(contract: CertificateNft | null | undefined) {
   const [data, setData] = useState<CertificateData | null>(null);
   const [isLoading, setIsLoading] = useState(false); 
   const [error, setError] = useState<Error | null>(null);
   
   const fetchAllDetails = async (_tokenId: BigNumberish | null) => {
      if (!contract || _tokenId == null) {
         setError(new Error("Contract not ready or Token ID is missing."));
         return;
      }
      
      setIsLoading(true);
      setError(null); 
      setData(null); 

      try {
         const certifDetail = await contract.getCertificateDetails(_tokenId);

         if (certifDetail.issuerAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error(`A certificate with ID #${_tokenId} could not be found.`);
         }
         
         const issuerDetail = await contract.issuers(certifDetail.issuerAddress);
         const ownerAddress = await contract.ownerOf(_tokenId);

         const issueDate = (new Date(Number(certifDetail.issueDate) * 1000)).toLocaleDateString();
         const registrationDate = (new Date(Number(issuerDetail.registrationDate) * 1000)).toLocaleDateString();
        
         setData({
            // --- certificate data ---
            courseTitle: certifDetail.courseTitle,
            recipientName: certifDetail.recipientName,
            recipientAddress: ownerAddress,
            issueDate: issueDate,
            tokenId: _tokenId,
            // --- issuer data ---
            issuerAddress: certifDetail.issuerAddress,
            issuerName: issuerDetail.name,
            website: issuerDetail.website,
            issuerStatus: issuerDetail.status,
            registrationDate: registrationDate,
         });

      } catch (err) {
         setError(err as Error);
         console.error("couldn't fetch certificate detail", err);
      } finally {
         setIsLoading(false);
      }
   };

   return { isLoading, data, error, fetchAllDetails };
}

// --- DEMO ROLE HOOK ---

export function useDemoRole(signer: Signer | null) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const faucetContract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(
      DEMO_ROLE_FAUCET_ADDRESS,
      demoFaucetContractAbi,
      signer
    ) as unknown as DemoRoleFaucet;
  }, [signer]);

  const changeRole = async (
    role: Roles,
    showToast: (message: string, type: ToastType) => void
  ) => {
    if (!faucetContract) {
      showToast("Please connect your wallet first.", "error");
      return;
    }

    setIsUpdating(true);
    showToast("Preparing transaction...", "info");

    try {
      let tx;
      if (role === "admin") {
        tx = await faucetContract.requestAdminRole();
      } else if (role === "issuer") {
        tx = await faucetContract.requestIssuerRole();
      } else {
        tx = await faucetContract.requestRecipientRole();
      }

      showToast("Waiting for transaction confirmation...", "info");
      await tx.wait();
      showToast("Role updated successfully! The page will now reload.", "success");

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Failed to change role:", error);
      const errorMessage = error.reason || "Transaction failed or was rejected.";
      showToast(errorMessage, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, changeRole };
}
