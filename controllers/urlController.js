const URL = require('../models/urlModel');
const { generateShortUrl } = require('../util/urlShortener');

async function createShortUrl(req, res) {
  const { url } = req.body;
  const short_url = generateShortUrl();

  try {
    const newUrl = await URL.create({
      url,
      short_url,
      user_id,
      group,
    });

    res.status(201).json({ short_url: newUrl.short_url });
  } catch (err) {
    res.status(500).json({ message: 'Error creating short URL' });
  }
}

module.exports = { createShortUrl };
