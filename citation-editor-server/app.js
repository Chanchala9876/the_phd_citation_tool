const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route to fetch citation suggestions using Open Library API
app.get('/api/citation/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);

    const docs = response.data.docs.slice(0, 10); // Return top 10 results

    const formatted = docs.map(doc => ({
      title: doc.title || 'Untitled',
      author: doc.author_name ? doc.author_name[0] : 'Unknown'
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching from Open Library:', error.message);
    res.status(500).json({ error: 'Failed to fetch citation data from external API' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
