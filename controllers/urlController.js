const URL = require('../models/urlModel');
const logs=require('../models/logModel');
const shortid = require('shortid');
const { client } =require('../config/redis');
const UAParser =require('user-agent-parser');


async function createShortUrl(req, res) {
  const { longUrl,customAlias,  topic } = req.body;
  const short_url =  customAlias||shortid.generate();
  console.log("created short id",short_url,req.user);

  try {
    console.log("in try");
    const newUrl = await URL.create({
      url:longUrl,
      short_url,
      user_id:req.user.id,
      group:topic
    });

    newUrl.save();
    console.log(newUrl);
    const fullUrl = `${req.protocol}://${req.get('host')}/${short_url}`;

    res.status(201).json({ shortUrl: fullUrl,short_url:short_url, createdAt: newUrl.createdAt });
  } catch (err) {
    res.status(500).json({ message: 'Error creating short URL' });
  }
}



// async function redirectUrl(req,res){
//   const alias = req.params.alias; 
//   try { 
//       let originalUrl = await client.get(alias); 
//       let urlDoc; 
//       if (!originalUrl) {
//          urlDoc = await URL.findOne({ short_url: alias }); 
//         if (!urlDoc) { 
//           return res.status(404).json({ message: 'URL not found' }); 
//         } 
//         originalUrl = urlDoc; 
//         await client.set(alias, urlDoc, 'EX', 24 * 60 * 60); 
//       } 
//       //originalUrl=originalUrl||originalUrl.url;

//      const parser = new UAParser(req.headers['user-agent']); 
//      const result = parser.getResult
//       const log =await logs.create({ 
//         urlId:originalUrl._id,
//         timestamp: Date.now(), 
//         userAgent: req.headers['user-agent'], 
//         ip: req.ip, 
//         geolocation: 'N/A',
//         deviceType: result.device.type || 'Desktop', 
//         osType: result.os.name, 
//       });
//       log.save();

//       return res.redirect(originalUrl.url); 
//     } catch (err) { 
//        console.error('Error redirecting:', err); 
//        return res.status(500).json({ message: 'Internal server error' });
//     }
  
// }


async function redirectUrl(req, res) {
  const alias = req.params.alias; 
  try { 
    let originalUrl = await client.get(alias); 

    if (!originalUrl) {
      const urlDoc = await URL.findOne({ short_url: alias }); 
      if (!urlDoc) { 
        return res.status(404).json({ message: 'URL not found' }); 
      } 
      
      originalUrl = JSON.stringify(urlDoc);
      await client.set(alias, originalUrl, 'EX', 24 * 60 * 60); 
    } else {
      originalUrl = JSON.parse(originalUrl);
    }

    const parser = new UAParser(req.headers['user-agent']); 
    const result = parser.getResult();

    const log = await logs.create({ 
      urlId: originalUrl._id, 
      timestamp: Date.now(), 
      userAgent: req.headers['user-agent'], 
      ip: req.ip, 
      geolocation: 'N/A', 
      deviceType: result.device.type || 'Desktop', 
      osType: result.os.name, 
    });
    await log.save();

    await URL.findByIdAndUpdate(originalUrl._id, {
      $inc: { clicks: 1 }
    });

    res.status(200).json({"url":originalUrl.url});

  } catch (err) { 
    console.error('Error redirecting:', err); 
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = { createShortUrl,redirectUrl };



