const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

exports.formatCurrency = function(value) { return formatter.format(value); }

setURIParameter = function (uri, key, value) {
  var updatedURI = new URL(uri);
  if (updatedURI.searchParams.has(key)) {
    updatedURI.searchParams.set(key, value);
  }
  else {
    updatedURI.searchParams.append(key, value);
  }
  return updatedURI.href;

}

setURIParameters = function (uri, paramValues) {
  Object.entries(paramValues).forEach(([paramKey, paramValue]) => {
    uri = setURIParameter(uri, paramKey, paramValue)
  });
  return uri;

}

exports.setSecurityHeaders = function (res, url) {
  res.set({
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": url,
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": [
      "default-src 'self'",
      // GTM
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      // GTM / GA tracking pixels
      "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com",
      "font-src 'self' data:",
      // GTM / GA network calls
      "connect-src 'self' " +
        " https://www.googletagmanager.com" +
        " https://*.google-analytics.com" +
        " https://*.analytics.google.com",
      // Required for the GTM <noscript> iframe
      "frame-src https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join("; "),
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  });
};
