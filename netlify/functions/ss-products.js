const SS_USER = process.env.SS_USER || '424896';
const SS_PASS = process.env.SS_PASS || '989d630c-9919-4c9c-a9ff-ed1a23677eac';

exports.handler = async function(event) {
  const credentials = Buffer.from(`${SS_USER}:${SS_PASS}`).toString('base64');
  
  // Fetch styles first (lighter payload, has category info)
  const url = 'https://api-ca.ssactivewear.com/V2/styles/';
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `API error: ${response.status} ${response.statusText}` 
        })
      };
    }

    const data = await response.json();

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
