// path: oudra-client/src/utils/web3Config.js
import { ethers } from "ethers";

// Contract address & ABI
// Use environment variables defined in .env: REACT_APP_CONTRACT_ADDRESS & REACT_APP_RPC_URL
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
import PlantationInvestmentABI from "./PlantationInvestment.json";

let provider;
let contract;

/**
 * Connect to blockchain (read-only)
 * Frontend uses public RPC for reading contract data
 */
export const connectBlockchain = async () => {
  try {
    if (!CONTRACT_ADDRESS) {
      throw new Error("Missing contract address in .env file: REACT_APP_CONTRACT_ADDRESS");
    }

    if (!window.ethereum) {
      console.warn("MetaMask not detected. Using default RPC provider for read-only access.");
      provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
    } else {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.BrowserProvider(window.ethereum);
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, PlantationInvestmentABI.abi, provider);

    console.log("✅ Connected to blockchain (read-only or via MetaMask)");
    console.log("Contract address:", CONTRACT_ADDRESS);

    return contract;
  } catch (error) {
    console.error("❌ Error connecting to blockchain:", error);
    throw error;
  }
};

/**
 * Get contract instance
 */
export const getContract = () => {
  if (!contract) {
    throw new Error("Contract not initialized. Call connectBlockchain first.");
  }
  return contract;
};

/**
 * Example function: fetch investor investments (read-only)
 */
export const getInvestorInvestments = async (investorAddress) => {
  try {
    const contract = getContract();
    const investmentIds = await contract.getInvestorInvestments(investorAddress);

    const investments = await Promise.all(
      investmentIds.map(async (id) => {
        const inv = await contract.getInvestment(id);
        return {
          id: Number(id),
          investor: inv.investor,
          amount: Number(inv.amount),
          numberOfTrees: Number(inv.numberOfTrees),
          plantationType: inv.plantationType,
          startDate: Number(inv.startDate),
          investmentPeriod: Number(inv.investmentPeriod),
          isActive: inv.isActive,
          certificateId: Number(inv.certificateId),
        };
      })
    );

    return investments;
  } catch (error) {
    console.error("❌ Error fetching investor investments:", error);
    throw error;
  }
};
