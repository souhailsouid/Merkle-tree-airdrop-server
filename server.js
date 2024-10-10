const express = require('express');
const dotenv = require('dotenv');
const merkleRoutes = require('./routes/merkleRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/api/merkle', merkleRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
