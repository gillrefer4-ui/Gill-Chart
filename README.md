# Gill Chart

Gill Chart is a standalone, dependency-free workspace for preparing MetaTrader 5
(MT5) gold chart screenshots and photos for analysis. It supports image upload,
cropping, local history, a forex/XAUUSD reference, and a manual candle-reading
worksheet that calculates candle type, body, and wick sizes from entered OHLC
values. It does not automatically read chart images, fetch market data, or
generate trade signals or entry/TP/SL levels. It does not connect to a server,
GitHub, or an analysis service. Uploaded images and their history are stored in
the browser's local IndexedDB database.

## Run locally

Open `index.html` in a modern browser. If the browser restricts local storage
for pages opened directly from disk, serve this folder with any static file
server and open its local address instead.

The page accepts PNG, JPG, and WEBP images up to 15 MB. You can drag a crop
around the chart and save that focused image locally. To use the worksheet, read
the timeframe, current price, and last closed candle values from the chart and
enter them manually. It validates OHLC ordering and produces the Lesson 02
reading format; it does not inspect the uploaded image.
