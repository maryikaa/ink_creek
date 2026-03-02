exports.handler = async function (event) {
  const accountNumber = process.env.SS_ACCOUNT_NUMBER;
  const apiKey = process.env.SS_API_KEY;
  const baseUrl = 'https://api-ca.ssactivewear.com/V2';

  const auth =
    'Basic ' +
    Buffer.from(accountNumber + ':' + apiKey).toString('base64');

  const headers = {
    'Authorization': auth,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    // S&S returns SKU-level data — group by styleID
    const res = await fetch(
      baseUrl + '/products/?mediatype=json',
      { headers }
    );

    console.log('SS status:', res.status);

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'SS API error', status: res.status }),
      };
    }

    const skus = await res.json();
    if (Array.isArray(skus) && skus.length) {
      console.log('FIRST SKU KEYS:', Object.keys(skus[0]));
      console.log('FIRST SKU SAMPLE:', JSON.stringify(skus[0]));
    }

    if (!Array.isArray(skus)) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unexpected response', raw: skus }),
      };
    }

    console.log('Total SKUs:', skus.length);

    // Group SKUs by styleID
    const styleMap = {};

    skus.forEach((sku) => {
      const sid = sku.styleID;
      if (!sid) return;

      if (!styleMap[sid]) {
        styleMap[sid] = {
          id: sid,
          styleID: sid,
          brandName: sku.brandName || '',
          styleName: sku.styleName || '',
          title: sku.title || sku.styleName || '',
          baseCategory: (function () {
            var brand = (sku.brandName || '').toLowerCase();
            var name = (sku.styleName || '').toLowerCase();
            if (brand.indexOf('gildan') !== -1) return 'T-Shirts';
            if (brand.indexOf('bella') !== -1) return 'T-Shirts';
            if (brand.indexOf('next level') !== -1) return 'T-Shirts';
            if (brand.indexOf('independent') !== -1) return 'T-Shirts';
            if (brand.indexOf('hanes') !== -1) return 'T-Shirts';
            if (brand.indexOf('port') !== -1) return 'T-Shirts';
            if (brand.indexOf('sport') !== -1) return 'Activewear';
            if (brand.indexOf('champion') !== -1) return 'Activewear';
            if (brand.indexOf('rabbit') !== -1) return 'Youth';
            if (brand.indexOf('yp') !== -1) return 'Headwear';
            if (brand.indexOf('otto') !== -1) return 'Headwear';
            if (brand.indexOf('richardson') !== -1) return 'Headwear';
            if (name.indexOf('hoodie') !== -1 || name.indexOf('hood') !== -1) return 'Hoodies';
            if (name.indexOf('fleece') !== -1 || name.indexOf('crewneck') !== -1) return 'Sweatshirts';
            if (name.indexOf('cap') !== -1 || name.indexOf('hat') !== -1) return 'Headwear';
            if (name.indexOf('bag') !== -1 || name.indexOf('tote') !== -1) return 'Bags';
            if (name.indexOf('tank') !== -1) return 'Tank Tops';
            if (name.indexOf('long') !== -1) return 'Long Sleeve';
            return 'T-Shirts';
          })(),
          image: sku.colorFrontImage
            ? 'https://cdn.ssactivewear.com/' + sku.colorFrontImage
            : sku.styleImage
            ? 'https://cdn.ssactivewear.com/' + sku.styleImage
            : '',
          brandImage: sku.brandImage
            ? 'https://cdn.ssactivewear.com/' + sku.brandImage
            : '',
          price: Infinity,
          colorMap: {},
          sizeSet: new Set(),
        };
      }

      const s = styleMap[sid];

      // Price — use lowest piecePrice
      const price = parseFloat(sku.piecePrice || sku.customerPrice || 0);
      if (price > 0 && price < s.price) s.price = price;

      // Colors
      const cn = sku.colorName || 'Default';
      if (!s.colorMap[cn]) {
        const cc = sku.color1 || sku.colorCode || '#cccccc';
        const img = sku.colorFrontImage
          ? 'https://cdn.ssactivewear.com/' + sku.colorFrontImage
          : '';
        const swatch = sku.colorSwatchImage
          ? 'https://cdn.ssactivewear.com/' + sku.colorSwatchImage
          : '';
        s.colorMap[cn] = {
          name: cn,
          hex: cc.startsWith('#') ? cc : '#' + cc,
          image: img,
          swatch: swatch,
        };
      }

      // Sizes
      if (sku.sizeName) s.sizeSet.add(sku.sizeName);
    });

    const sizeOrder = ['OSFA','XS','S','M','L','XL','2XL','3XL','4XL','5XL'];

    // Convert to array, limit to 200 styles
    const products = Object.values(styleMap)
      .slice(0, 200)
      .map((s) => {
        const sizes = sizeOrder.filter((sz) => s.sizeSet.has(sz));
        return {
          id: s.id,
          styleID: s.styleID,
          brandName: s.brandName,
          styleName: s.styleName,
          title: s.title,
          baseCategory: s.baseCategory,
          image: s.image,
          brandImage: s.brandImage,
          price: s.price === Infinity ? 0 : s.price,
          colors: Object.values(s.colorMap),
          sizes: sizes.length ? sizes : Array.from(s.sizeSet).slice(0, 7),
        };
      });

    console.log('Grouped styles:', products.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(products),
    };

  } catch (err) {
    console.error('Handler error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
