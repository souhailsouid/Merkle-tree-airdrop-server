const express = require('express');
const router = express.Router();
const merkleController = require('../controllers/merkleController');

router.get('/root', merkleController.getMerkleRoot);

router.get('/proof/:address/:amount', merkleController.getMerkleProof);

router.post('/claim', merkleController.claimTokens);

module.exports = router;
