export default async function handler(req, res) {
  const accountNumber = process.env.SS_ACCOUNT_NUMBER;
  const apiKey = process.env.SS_API_KEY;
  const baseUrl = 'https://api-ca.ssactivewear.com/V2';
  const auth = 'Basic ' + Buffer.from(accountNumber + ':' + apiKey).toString('base64');
  const headers = { 'Authorization': auth, 'Accept': 'application/json' };

  try {
    const r = await fetch(baseUrl + '/products/?mediatype=json', { headers });
    if (!r.ok) return res.status(r.status).json({ error: 'SS API error', status: r.status });
    const skus = await r.json();
    if (!Array.isArray(skus)) return res.status(500).json({ error: 'Unexpected response' });

    const styleMap = {};
    skus.forEach((sku) => {
      const sid = sku.styleID;
      if (!sid) return;
      if (!styleMap[sid]) {
        styleMap[sid] = {
          id: sid, styleID: sid, brandName: sku.brandName || '', styleName: sku.styleName || '',
          title: sku.title || sku.styleName || '',
          baseCategory: (function() {
            var brand = (sku.brandName||'').toLowerCase(), name = (sku.styleName||'').toLowerCase();
            if (name.indexOf('hoodie')!==-1||name.indexOf('hood')!==-1) return 'Hoodies';
            if (name.indexOf('fleece')!==-1||name.indexOf('crewneck')!==-1) return 'Sweatshirts';
            if (name.indexOf('cap')!==-1||name.indexOf('hat')!==-1) return 'Headwear';
            if (name.indexOf('bag')!==-1||name.indexOf('tote')!==-1) return 'Bags';
            if (name.indexOf('tank')!==-1) return 'Tank Tops';
            if (name.indexOf('long')!==-1) return 'Long Sleeve';
            if (brand.indexOf('sport')!==-1||brand.indexOf('champion')!==-1) return 'Activewear';
            if (brand.indexOf('yp')!==-1||brand.indexOf('otto')!==-1||brand.indexOf('richardson')!==-1) return 'Headwear';
            return 'T-Shirts';
          })(),
          image: sku.colorFrontImage ? 'https://cdn.ssactivewear.com/'+sku.colorFrontImage : sku.styleImage ? 'https://cdn.ssactivewear.com/'+sku.styleImage : '',
          price: Infinity, colorMap: {}, sizeSet: new Set(),
        };
      }
      const s = styleMap[sid];
      const price = parseFloat(sku.piecePrice || sku.customerPrice || 0);
      if (price > 0 && price < s.price) s.price = price;
      const cn = sku.colorName || 'Default';
      if (!s.colorMap[cn]) {
        const cc = sku.color1 || sku.colorCode || '#cccccc';
        s.colorMap[cn] = { name: cn, hex: cc.startsWith('#') ? cc : '#'+cc, image: sku.colorFrontImage ? 'https://cdn.ssactivewear.com/'+sku.colorFrontImage : '', swatch: sku.colorSwatchImage ? 'https://cdn.ssactivewear.com/'+sku.colorSwatchImage : '' };
      }
      if (sku.sizeName) s.sizeSet.add(sku.sizeName);
    });

    const sizeOrder = ['OSFA','XS','S','M','L','XL','2XL','3XL','4XL','5XL'];
    const products = Object.values(styleMap).slice(0,200).map((s) => ({
      id: s.id, styleID: s.styleID, brandName: s.brandName, styleName: s.styleName,
      title: s.title, baseCategory: s.baseCategory, image: s.image,
      price: s.price === Infinity ? 0 : s.price,
      colors: Object.values(s.colorMap),
      sizes: sizeOrder.filter(sz => s.sizeSet.has(sz)),
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
