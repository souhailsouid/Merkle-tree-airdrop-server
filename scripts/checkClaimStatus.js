const { contract }= require('../config/config.js');


const checkClaimStatus = async (address) => {
    const isClaimed = await contract.claimed(address);
    console.log(`Claimed status for ${address}:`, isClaimed);
};

checkClaimStatus('0x9791fDF86Cc0133A96cFc56129151dF3d5E32615');

