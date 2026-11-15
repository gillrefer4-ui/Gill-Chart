# Gill Chart

Gill Chart is a standalone, dependency-free website for image-based analysis of
MetaTrader 5 (MT5) gold charts. Upload a chart-timeframe PNG, JPG, or WEBP image
and a separate higher-timeframe image. The browser automatically analyzes both;
no crop or separate scan action is required. The local rules in
`chart-rules.js` classify swing structure and breaks, read candle and axis
prices when available, and estimate timeframe from X-axis timestamps.
`index.html` applies pixel-processing rules to locate candle shapes, the
current-price line, and axis marks. When both timeframes confirm a directional
structure, a corrective swing and confirming chart-timeframe BOS are detected,
and price levels are readable, the app shows a BUY/SELL candidate and draws
entry, stop-loss, and take-profit lines on the chart-timeframe image. Otherwise,
it reports **NO TRADE**.

The Gill Chart lessons are included in the page as reference material, and a
subset is implemented as explicit JavaScript rules; the site is not trained by
chat and does not call any remote AI, API, or market-data feed. Axis text
reading uses the browser's built-in `TextDetector` locally when available;
browsers without it report prices and timeframe as unavailable.
Image-derived values and structure are estimates and can be wrong. Upload two
XAUUSD images, with the second image on a strictly larger timeframe than the
chart used for entry; the app does not independently verify the instrument
symbol. Trade levels are estimates derived from the visible current price and
swing points, not a guarantee.

Uploaded images and their local history stay in the browser's IndexedDB
database. Nothing is sent to a server.

## Run locally

Open `index.html` in a modern browser. If the browser restricts local storage
for pages opened directly from disk, serve this folder with any static file
server and open its local address instead.

Each image accepts PNG, JPG, and WEBP files up to 15 MB. Analysis starts once
the images load. The rules work best when screenshots clearly show contrasting
candles and chart axes; timeframe and price recognition depend on browser
support for local `TextDetector`. This is an image-analysis prototype, not a
broker or trade-execution system; confirm all readings independently.
