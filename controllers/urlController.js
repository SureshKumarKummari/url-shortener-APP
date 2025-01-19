const URL = require('../models/urlModel');
const shortid = require('shortid');
const { client } =require('../config/redis');

async function createShortUrl(req, res) {
  const { longUrl,customAlias,  topic } = req.body;
  const short_url =  shortid.generate();
  const authToken = req.headers.authorization;
  console.log("created short id",short_url,req.user);

  try {
    console.log("in try");
    const newUrl = await URL.create({
      url:longUrl,
      short_url,
      user_id:req.user.id,
      group:topic||"acquisition"
    });

    newUrl.save();
    console.log(newUrl);

    res.status(201).json({ shortUrl: newUrl.short_url, createdAt: newUrl.createdAt });
  } catch (err) {
    res.status(500).json({ message: 'Error creating short URL' });
  }
}


async function redirectUrl(req,res){
  const alias = req.params.alias; 
  try { 
      let originalUrl = await client.get(alias); 
      let urlDoc; 
      if (!originalUrl) {
         urlDoc = await URL.findOne({ short_url: alias }); 
        if (!urlDoc) { 
          return res.status(404).json({ message: 'URL not found' }); 
        } 
        originalUrl = urlDoc.url; 
        await client.set(alias, originalUrl, 'EX', 24 * 60 * 60); 
      } 
      const log = { 
        timestamp: Date.now(), 
        userAgent: req.headers['user-agent'], 
        ip: req.ip, 
        geolocation: 'N/A', 
      };
      if (urlDoc) { 
        urlDoc.analytics.clicks += 1; 
        urlDoc.analytics.logs.push(log); 
        await urlDoc.save(); 
      } else { 
        await URL.updateOne({ short_url: alias },
           { $inc: { 'analytics.clicks': 1 }, 
           $push: { 'analytics.logs': log } }); 
        } 
      return res.redirect(originalUrl); 
    } catch (err) { 
       console.error('Error redirecting:', err); 
       return res.status(500).json({ message: 'Internal server error' });
    }
  
}


module.exports = { createShortUrl,redirectUrl };



