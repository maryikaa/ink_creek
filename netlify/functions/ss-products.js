exports.handler = async function (event) {
  const accountNumber = process.env.SS_ACCOUNT_NUMBER;
  const apiKey = process.env.SS_API_KEY;
  const baseUrl = 'https://api-ca.ssactivewear.com/V2';

  const auth =
    'Basic ' +
    Buffer.from(accountNumber + ':' + apiKey).toString('base64');

  const headers = {
    'Authorization': auth,
    'Accept': 'application/json',        // ← ДОБАВЛЕНО
    'Content-Type': 'application/json',
  };

  try {
    const stylesRes = await fetch(
      baseUrl + '/products/?mediatype=json', // ← ИЗМЕНЕНО
      { headers }
    );

    // Диагностика
    console.log('SS status:', stylesRes.status);
    const text = await stylesRes.text();
    console.log('SS preview:', text.slice(0, 300));

    let styles;
    try {
      styles = JSON.parse(text);
    } catch (e) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'SS API returned non-JSON',
          preview: text.slice(0, 300),
          httpStatus: stylesRes.status,
        }),
      };
    }

    if (!Array.isArray(styles)) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Invalid API response',
          raw: styles,
        }),
      };
    }

    const limited = styles.slice(0, 50);

    const products = await Promise.all(
      limited.map(async (style) => {
        try {
          const varRes = await fetch(
            baseUrl + '/products/' + style.styleID + '/?mediatype=json', // ← ИЗМЕНЕНО
            { headers }
          );
          const variants = await varRes.json();

          const colorMap = {};
          let minPrice = Infinity;
          const sizeSet = new Set();

          if (Array.isArray(variants)) {
            variants.forEach((v) => {
              const cn = v.colorName || 'Default';
              const cc = v.colorCode || '#cccccc';
              const img = v.colorFrontImage || v.styleImage || '';

              if (!colorMap[cn]) {
                colorMap[cn] = {
                  name: cn,
                  hex: cc.startsWith('#') ? cc : '#' + cc,
                  image: img
                    ? 'https://www.ssactivewear.com/' + img
                    : '',
                };
              }

              const price = parseFloat(v.piecePrice || v.ourPrice || 0);
              if (price > 0 && price < minPrice) {
                minPrice = price;
              }

              if (v.sizeName) sizeSet.add(v.sizeName);
            });
          }

          const colors = Object.values(colorMap);
          const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
          let sizes = sizeOrder.filter(
            (s) => sizeSet.has(s) || sizeSet.size === 0
          );
          if (sizes.length === 0) sizes = Array.from(sizeSet);
          const finalSizes =
            sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'];

          return {
            id: style.styleID,
            styleID: style.styleID,
            brandName: style.brandName,
            styleName: style.styleName,
            title: style.title,
            baseCategory: style.baseCategory,
            image:
              'https://www.ssactivewear.com/' + (style.styleImage || ''),
            brandImage:
              'https://www.ssactivewear.com/' + (style.brandImage || ''),
            price: minPrice === Infinity ? 0 : minPrice,
            colors: colors,
            sizes: finalSizes.length ? finalSizes : ['S', 'M', 'L', 'XL'],
          };
        } catch (e) {
          return {
            id: style.styleID,
            styleID: style.styleID,
            brandName: style.brandName || '',
            title: style.title || '',
            baseCategory: style.baseCategory || '',
            image:
              'https://www.ssactivewear.com/' + (style.styleImage || ''),
            price: 0,
            colors: [],
            sizes: ['S', 'M', 'L', 'XL'],
          };
        }
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(products),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
