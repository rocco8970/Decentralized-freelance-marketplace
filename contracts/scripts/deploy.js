const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying FreelanceMarketplace contract...");

  const FreelanceMarketplace = await hre.ethers.getContractFactory("FreelanceMarketplace");
  const contract = await FreelanceMarketplace.deploy();
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("FreelanceMarketplace deployed to:", contractAddress);

  // Save contract address to frontend
  const frontendPath = path.join(__dirname, "../../freelance-frontend/src/contracts");
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  // Save contract address
  const addressData = `const FreelanceMarketplaceAddress = "${contractAddress}";\n\nexport default FreelanceMarketplaceAddress;\n`;
  fs.writeFileSync(
    path.join(frontendPath, "contractAddress.js"),
    addressData
  );

  // Save ABI
  const artifact = await hre.artifacts.readArtifact("FreelanceMarketplace");
  fs.writeFileSync(
    path.join(frontendPath, "freelanceMarketplaceABI.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("Contract address and ABI saved to frontend!");
  console.log("\nNext steps:");
  console.log("1. Update frontend .env with contract address");
  console.log("2. Start the frontend: cd freelance-frontend && npm start");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
