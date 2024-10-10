const merkleService = require('../services/merkleService');

const getMerkleRoot = async (req, res) => {
    try {
        const merkleRoot = await merkleService.getMerkleRoot();
        res.status(200).json({ merkleRoot });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: error.message });
    }
};


const getMerkleProof = async(req, res) => {
    const { address, amount } = req.params;
    try {
        const proof = await merkleService.getMerkleProof(address, amount);

        if (!proof || proof.length === 0) {
            return res.status(404).json({ error: 'No proof found for this address' });
        }
        res.status(200).json({ proof });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const claimTokens = async (req, res) => {
    const { address, proof, amount } = req.body;

    if (!address || !proof || !amount) {
        return res.status(400).json({ error: 'Missing address, proof, or amount' });
    }

    try {

        const tx =  await merkleService.claimTokens(address, proof, amount);

        res.status(200).json({
            message: 'Tokens claimed successfully',
            transactionHash: tx.hash,
            data: tx.data,
            from: tx.from,
            to: tx.to
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to claim tokens', details: error.message });
    }
};
module.exports = {
    getMerkleRoot,
    getMerkleProof,
    claimTokens
};
