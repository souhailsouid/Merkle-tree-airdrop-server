require("dotenv").config();
const MERKLE_AIRDROP_ABI = require("../abi/merkleAirdropAbi")
const privateKey = process.env.PRIVATE_KEY;
const MERKLE_AIRDROP_ADDRESS = '0x7ea925Ecd638ef6Bd11dBF491289854f98e1FBB5';
const ethers = require('ethers');


const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
// const contract = new ethers.Contract(MERKLE_AIRDROP_ADDRESS, MERKLE_AIRDROP_ABI, provider);
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(MERKLE_AIRDROP_ADDRESS, MERKLE_AIRDROP_ABI, signer);


module.exports = { contract, provider, signer, MERKLE_AIRDROP_ADDRESS, MERKLE_AIRDROP_ABI, privateKey };