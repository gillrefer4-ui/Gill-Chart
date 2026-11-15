# Gill Chart

Gill Chart is a standalone, dependency-free website for image-based analysis of
MetaTrader 5 (MT5) gold charts. Select or drop a PNG, JPG, or WEBP chart image
and the browser automatically analyzes it; no crop or separate scan action is
required. The JavaScript in `index.html` applies pixel-processing rules to
estimated candle shapes, swing structure, a possible current-price line, and
visible X/Y-axis marks.

The Gill Chart lessons are included in the page as reference material. They
were translated into explicit JavaScript rules; the site is not trained by
chat, and does not use AI, an external API, remote service, or market-data
feed. This image scan does not OCR numeric prices or reliably determine the
timeframe or higher-timeframe bias. In keeping with the lessons' structure-first
and multi-timeframe requirements, it reports **NO TRADE** from a single image
and does not invent entry, stop-loss, or take-profit prices. The pixel-based
readings are estimates and may be wrong.

Uploaded images and their local history stay in the browser's IndexedDB
database. Nothing is sent to a server.

## Run locally

Open `index.html` in a modern browser. If the browser restricts local storage
for pages opened directly from disk, serve this folder with any static file
server and open its local address instead.

The page accepts PNG, JPG, and WEBP images up to 15 MB. Analysis starts once the
image loads. The rules work best when the screenshot clearly shows contrasting
candles and chart axes. This is an image-analysis prototype, not a broker or
trade-execution system; confirm all readings independently.
