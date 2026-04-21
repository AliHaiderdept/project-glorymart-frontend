function shortenLabel(label) {
  const text = String(label || "Product").trim();
  if (!text) return "Product";
  return text.length > 24 ? `${text.slice(0, 21)}...` : text;
}

export function createFallbackImage(label) {
  const title = shortenLabel(label);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#102030"/>
          <stop offset="100%" stop-color="#1d3a56"/>
        </linearGradient>
      </defs>
      <rect width="900" height="900" fill="url(#g)"/>
      <circle cx="710" cy="180" r="130" fill="rgba(255,255,255,0.07)"/>
      <circle cx="160" cy="760" r="180" fill="rgba(255,255,255,0.05)"/>
      <text x="50%" y="48%" fill="#d5e8ff" text-anchor="middle" font-size="58" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Image Unavailable</text>
      <text x="50%" y="56%" fill="#9fc3e8" text-anchor="middle" font-size="38" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function normalizeImageUrl(url, label) {
  if (typeof url !== "string" || !url.trim()) {
    return createFallbackImage(label);
  }

  // via.placeholder is frequently blocked or unstable on some networks.
  if (/via\.placeholder\.com/i.test(url)) {
    return createFallbackImage(label);
  }

  return url;
}
