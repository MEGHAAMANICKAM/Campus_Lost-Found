const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const itemRoutes = require('./routes/items');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/items', itemRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Lost & Found API running on port ${PORT}`));

