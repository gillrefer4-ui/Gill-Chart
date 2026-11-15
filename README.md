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

Lesson 02 is included in the page and implemented in the local analysis: it
reports the last closed candle's OHLC, bullish/bearish/doji type, body and wick
sizes, and a brief interpretation, along with timeframe and current price when
readable. A body no larger than 10% of the full candle range is classified as a
doji; wicks longer than 10% of the range suggest rejection, while shorter or
absent wicks suggest acceptance. Image-derived readings are estimates; unclear
values are reported as unavailable rather than guessed. The site is not trained
by chat and does not call any remote AI, API, or market-data feed. Axis text
reading uses the browser's built-in `TextDetector` locally when available;
browsers without it report prices and timeframe as unavailable. A static image
cannot track live price movement over time.
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
