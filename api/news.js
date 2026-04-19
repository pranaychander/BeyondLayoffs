export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dtech%2Blayoffs%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen');
    const data = await response.json();
    
    // Cache for 1 hour (3600 seconds) on Vercel Edge CDN
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
