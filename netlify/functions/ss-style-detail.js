exports.handler = async function(event) {
  const SS_USER = process.env.SS_USER || '424896';
  const SS_PASS = process.env.SS_PASS ||
    '989d630c-9919-4c9c-a9ff-ed1a23677eac';
  const credentials =
    Buffer.from(`${SS_USER}:${SS_PASS}`).toString('base64');

  const styleID = event.queryStringParameters?.styleID;
  if (!styleID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'styleID required' })
    };
  }

  try {
    const res = await fetch(
      `https://api-ca.ssactivewear.com/V2/products/?style=${styleID}`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
