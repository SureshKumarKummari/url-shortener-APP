function generateShortUrl() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';
    for (let i = 0; i < 6; i++) {
      shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortUrl;
  }
  
  module.exports = { generateShortUrl };
  