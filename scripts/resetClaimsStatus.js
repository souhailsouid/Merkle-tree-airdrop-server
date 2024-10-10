const { contract }= require('../config/config.js');


const resetClaimStatus = async (addressToReset) => {
    try {
        // Make sure the contract is instantiated with a signer (owner) who has the right to reset
        const tx = await contract.resetClaim(addressToReset);
        console.log(`Transaction sent. Hash: ${tx.hash}`);
        const receipt = await tx.wait();  // Wait for the transaction to be mined

        console.log(`Claim status reset for address: ${addressToReset}`);
        console.log('Transaction hash:', receipt.transactionHash);
        console.log('receipt', receipt);
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        console.log('Transaction hash:', receipt.transactionHash);
    } catch (error) {
        console.error('Failed to reset claim status:', error);
    }
};

// Example usage
const addressToReset = '0x9791fDF86Cc0133A96cFc56129151dF3d5E32615';
resetClaimStatus(addressToReset);




