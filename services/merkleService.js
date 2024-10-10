require("dotenv").config();
const ethers = require('ethers');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');
const path = require('path');
const { contract } = require('../config/config');

const claimsFilePath = path.join(__dirname, 'claims.json');


const saveClaimToFile = (address, amount, proof, transactionHash) => {
    if (!fs.existsSync(claimsFilePath)) {
        fs.writeFileSync(claimsFilePath, JSON.stringify([])); 
    }

    const claimsData = JSON.parse(fs.readFileSync(claimsFilePath, 'utf8'));

    const existingClaim = claimsData.find(claim => claim.address === address && claim.amount === amount);

    if (existingClaim) {
        console.log(`Claim for address ${address} and amount ${amount} already exists.`);
        return;
    }
    const newClaim = {
        address: address,
        proof: proof,
        amount: amount,
        transactionHash: transactionHash,
        timestamp: new Date().toISOString()
    };
    claimsData.push(newClaim);

    fs.writeFileSync(claimsFilePath, JSON.stringify(claimsData, null, 2));

    console.log(`Claim saved to ${claimsFilePath}:`, newClaim);
};

const getMerkleRoot = async () => {
    try {
        const merkleRoot = await contract.merkleRoot();
        console.log('merkleRoot:', merkleRoot);
        return merkleRoot;
    } catch (error) {
        console.log('error', error);
        throw new Error(error.message);
    }
};

const getMerkleProof = async (address, amount) => {

    try {
        const leaves = [
            ethers.solidityPackedKeccak256(['address', 'uint256'], ['0x9791fDF86Cc0133A96cFc56129151dF3d5E32615', 1]),  // Example
            ethers.solidityPackedKeccak256(['address', 'uint256'], ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 2000]), // Example
            ethers.solidityPackedKeccak256(['address', 'uint256'], ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 3000])  // Example
        ];
        console.log('Leaves:', leaves);
       
        const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

       
        const leaf = ethers.solidityPackedKeccak256(['address', 'uint256'], [address, amount]);
        console.log('Generated leaf:', leaf);

        
        const proof = merkleTree.getHexProof(leaf);
        console.log('Generated proof:', proof);

        saveClaimToFile(address, amount, proof);


        return proof;
    } catch (error) {
        console.error('Unable to generate Merkle Proof:', error);
        throw new Error('Unable to generate Merkle Proof');
    }
};


const claimTokens = async (address, proof, amount) => {
    try {
        if (!Array.isArray(proof) || proof.length === 0) {
            throw new Error("Invalid Merkle proof");
        }

        const tx = await contract.claimTokens(amount, proof); 

        const transactionHash = tx.hash;
        console.log('Transaction hash:', transactionHash);

        // Save the claim along with the transaction hash
        saveClaimToFile(address, amount, proof, transactionHash);

        return transactionHash;
    } catch (error) {
        console.error('Error claiming tokens:', error.message);
        throw error; 
    }
};





module.exports = {
    getMerkleRoot,
    getMerkleProof,
    claimTokens
};
