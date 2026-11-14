# Gill Chart

Gill Chart is a standalone, dependency-free workspace for preparing MetaTrader 5
(MT5) gold chart screenshots and photos for analysis. It supports image upload,
cropping, local history, a forex/XAUUSD reference, a manual candle-reading
worksheet, a manual market-structure worksheet, and a browser-local chart-image
scan. The scan applies fixed pixel-processing rules to candle shapes, the
current-price line, and X/Y-axis markings in the cropped image. It estimates
swing structure and can draw provisional entry, stop-loss (SL), and take-profit
(TP) guides over the chart when its structure and correction checks agree.

The scan uses no AI, external API, remote service, or market-data feed. Axis
text is not OCR'd into numeric prices or a timeframe, so levels are visual
image coordinates that must be checked against the chart. Candle, line, and
swing detection are visual heuristics and can misread screenshots. The TP line
is an illustrative 1:2 risk projection, not a detected future swing; a single
chart cannot confirm higher-timeframe structure. Verify the chart, actual
prices, timeframe, higher-timeframe bias, and every level before trading.
Uploaded images and their history are stored in the browser's local IndexedDB
database.

## Run locally

Open `index.html` in a modern browser. If the browser restricts local storage
for pages opened directly from disk, serve this folder with any static file
server and open its local address instead.

The page accepts PNG, JPG, and WEBP images up to 15 MB. Crop the chart with its
candles, current-price line, and axes visible, then select “Scan chart.” The
browser checks for contrasting candle bodies, excludes the rightmost candle as
possibly still forming, estimates swings, checks the price line and axis
markings, and looks for a close-confirmed BOS after a two-candle correction.
If the image evidence is unclear, it reports NO TRADE. The optional manual
worksheets remain available for entering price values and swing points.
