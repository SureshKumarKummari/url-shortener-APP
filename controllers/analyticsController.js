const URL=require('../models/urlModel');
const  AccessLog=require('../models/logModel');

async function getAnalytics(req, res) {
  const alias = req.params.alias;

  try {
    const urlDoc = await URL.findOne({ short_url: alias });

    if (!urlDoc) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const totalClicks = urlDoc.clicks;

    const logs = await AccessLog.find({ urlId: urlDoc._id });

    const uniqueUsers = new Set(logs.map(log => log.ip)).size;

    const recentLogs = logs.filter(log => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return log.timestamp >= sevenDaysAgo;
    });

    const clicksByDate = recentLogs.reduce((acc, log) => {
      const date = log.timestamp.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { date, clickCount: 0 };
      acc[date].clickCount += 1;
      return acc;
    }, {});

    const osType = recentLogs.reduce((acc, log) => {
      if (!acc[log.osType]) acc[log.osType] = { osName: log.osType, uniqueClicks: 0, uniqueUsers: new Set() };
      acc[log.osType].uniqueClicks += 1;
      acc[log.osType].uniqueUsers.add(log.ip);
      return acc;
    }, {});

    const deviceType = recentLogs.reduce((acc, log) => {
      if (!acc[log.deviceType]) acc[log.deviceType] = { deviceName: log.deviceType, uniqueClicks: 0, uniqueUsers: new Set() };
      acc[log.deviceType].uniqueClicks += 1;
      acc[log.deviceType].uniqueUsers.add(log.ip);
      return acc;
    }, {});

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.values(clicksByDate),
      osType: Object.values(osType).map(os => ({ ...os, uniqueUsers: os.uniqueUsers.size })),
      deviceType: Object.values(deviceType).map(device => ({ ...device, uniqueUsers: device.uniqueUsers.size }))
    });
  } catch (err) {
    console.error('Error retrieving analytics:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function getAnalyticsByTopic(req, res) {
  const topic = req.params.topic;

  try {
    const urls = await URL.find({ group: topic });

    if (!urls.length) {
      return res.status(404).json({ message: 'No URLs found for the specified topic' });
    }

    const urlIds = urls.map(url => url._id);
    const logs = await AccessLog.find({ urlId: { $in: urlIds } });

    const totalClicks = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.ip)).size;

    const clicksByDate = logs.reduce((acc, log) => {
      const date = log.timestamp.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { date, clickCount: 0 };
      acc[date].clickCount += 1;
      return acc;
    }, {});

    const urlsAnalytics = urls.map(url => {
      const urlLogs = logs.filter(log => log.urlId.equals(url._id));
      const urlUniqueUsers = new Set(urlLogs.map(log => log.ip)).size;
      return {
        shortUrl: url.short_url,
        totalClicks: urlLogs.length,
        uniqueUsers: urlUniqueUsers,
      };
    });

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.values(clicksByDate),
      urls: urlsAnalytics,
    });
  } catch (err) {
    console.error('Error retrieving analytics:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function getOverallAnalytics(req, res) {

  console.log("In overall analytics");
  const userId = req.user.id;

  try {
    const urls = await URL.find({ user_id: userId });

    if (!urls.length) {
      return res.status(404).json({ message: 'No URLs found for the authenticated user' });
    }

    const urlIds = urls.map(url => url._id);
    const logs = await AccessLog.find({ urlId: { $in: urlIds } });

    const totalUrls = urls.length;
    const totalClicks = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.ip)).size;

    const clicksByDate = logs.reduce((acc, log) => {
      const date = log.timestamp.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { date, clickCount: 0 };
      acc[date].clickCount += 1;
      return acc;
    }, {});

    const osType = logs.reduce((acc, log) => {
      if (!acc[log.osType]) acc[log.osType] = { osName: log.osType, uniqueClicks: 0, uniqueUsers: new Set() };
      acc[log.osType].uniqueClicks += 1;
      acc[log.osType].uniqueUsers.add(log.ip);
      return acc;
    }, {});

    const deviceType = logs.reduce((acc, log) => {
      if (!acc[log.deviceType]) acc[log.deviceType] = { deviceName: log.deviceType, uniqueClicks: 0, uniqueUsers: new Set() };
      acc[log.deviceType].uniqueClicks += 1;
      acc[log.deviceType].uniqueUsers.add(log.ip);
      return acc;
    }, {});

    res.json({
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.values(clicksByDate),
      osType: Object.values(osType).map(os => ({ ...os, uniqueUsers: os.uniqueUsers.size })),
      deviceType: Object.values(deviceType).map(device => ({ ...device, uniqueUsers: device.uniqueUsers.size }))
    });
  } catch (err) {
    console.error('Error retrieving overall analytics:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}





module.exports= { getAnalytics,getAnalyticsByTopic,getOverallAnalytics };



