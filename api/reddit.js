export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.reddit.com%2Fr%2Flayoffs%2Fhot.rss');
    const data = await response.json();
    
    // Cache for 1 hour (3600 seconds) on Vercel Edge CDN
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reddit posts' });
  }
}
