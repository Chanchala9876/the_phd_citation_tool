const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route: GET /api/citation/search?q=einstein
router.get('/search', async (req, res) => {
  router.get('/search', async (req, res) => {
  console.log("Request received at /api/citation/search");
  
});

  const query = req.query.q;
  try {
    const result = await axios.get(`https://openlibrary.org/search.json?author=${query}`);
    const books = result.data.docs.slice(0, 5).map(book => ({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown'
    }));
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;
