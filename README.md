# Gill Chart

Gill Chart is a standalone, dependency-free website for image-based analysis of
MetaTrader 5 (MT5) gold charts. Select or drop a PNG, JPG, or WEBP chart image
and the browser automatically analyzes it; no crop or separate scan action is
required. The local rules in `chart-rules.js` classify swing structure and
breaks, read candle and axis prices when available, and estimate timeframe from
X-axis timestamps. `index.html` applies pixel-processing rules to locate candle
shapes, the current-price line, and axis marks.

The Gill Chart lessons are included in the page as reference material, and a
subset is implemented as explicit JavaScript rules; the site is not trained by
chat and does not call any remote AI, API, or market-data feed. Axis text
reading uses the browser's built-in `TextDetector` locally when available;
browsers without it report prices and timeframe as unavailable.
Image-derived values and structure are estimates and can be wrong. In keeping
with the lessons' multi-timeframe requirement, the site reports **NO TRADE**
from a single image and does not invent a trade without confirming
higher-timeframe bias.

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
