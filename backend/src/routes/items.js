const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '').slice(0, 40);
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${name || 'item'}-${suffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG, JPEG, PNG, WEBP images are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/dashboard', async (req, res) => {
  try {
    const [[counts]] = await db.query(
      `SELECT
         SUM(type='lost') AS totalLost,
         SUM(type='found') AS totalFound,
         SUM(status='claimed') AS totalClaimed
       FROM items`
    );

    const [recentItems] = await db.query(
      'SELECT id, type, title, category, location, image_url, status, created_at FROM items ORDER BY created_at DESC LIMIT 8'
    );

    res.json({
      totalLost: counts.totalLost || 0,
      totalFound: counts.totalFound || 0,
      totalClaimed: counts.totalClaimed || 0,
      recentItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { type, status, category, search, date } = req.query;
  const filters = ['1=1'];
  const params = [];

  if (type && ['lost', 'found'].includes(type)) {
    filters.push('type = ?');
    params.push(type);
  }
  if (status && ['open', 'claimed'].includes(status)) {
    filters.push('status = ?');
    params.push(status);
  }
  if (category) {
    filters.push('category = ?');
    params.push(category);
  }
  if (search) {
    filters.push('title LIKE ?');
    params.push(`%${search}%`);
  }
  if (date) {
    const safeDate = String(date).slice(0, 10);
    filters.push('created_at >= ?');
    params.push(`${safeDate} 00:00:00`);
  }

  const query = `SELECT * FROM items WHERE ${filters.join(' AND ')} ORDER BY created_at DESC`;

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, category, location, contact_info } = req.body;
    if (!type || !title || !category || !location || !contact_info) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await db.query(
      `INSERT INTO items (type, title, description, category, location, contact_info, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'open')`,
      [type, title, description || '', category, location, contact_info, imageUrl]
    );

    res.status(201).json({ id: result.insertId, message: 'Item created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, category, location, contact_info, status } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updates = ['type = ?', 'title = ?', 'description = ?', 'category = ?', 'location = ?', 'contact_info = ?', 'status = ?'];
    const params = [type, title, description, category, location, contact_info, status];

    if (imageUrl !== undefined) {
      updates.push('image_url = ?');
      params.push(imageUrl);
    }
    params.push(req.params.id);

    await db.query(`UPDATE items SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Item updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

