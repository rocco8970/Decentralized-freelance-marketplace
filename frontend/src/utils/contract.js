import { ethers } from "ethers";
import FreelanceMarketplaceABI from "../contracts/freelanceMarketplaceABI.json";
import contractAddress from "../contracts/contractAddress";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask!");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, FreelanceMarketplaceABI, signer);
};

