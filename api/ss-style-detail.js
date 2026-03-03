export default async function handler(req, res) {
  const SS_USER = process.env.SS_ACCOUNT_NUMBER;
  const SS_PASS = process.env.SS_API_KEY;

  const styleID = req.query.styleID;
  if (!styleID) {
    return res.status(400).json({ error: 'styleID required' });
  }

  const credentials = Buffer.from(`${SS_USER}:${SS_PASS}`).toString('base64');

  try {
    const r = await fetch(
      `https://api-ca.ssactivewear.com/V2/products/?style=${styleID}`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
