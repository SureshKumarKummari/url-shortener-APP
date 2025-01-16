const shortid=require('shortid');
function generateShortUrl() {
    
    let shortUrl =shortid.generate();
   
    return shortUrl;
  }
  
  module.exports = { generateShortUrl };
  