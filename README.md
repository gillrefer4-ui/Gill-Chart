# Gill Chart

Gill Chart is a standalone, dependency-free workspace for preparing MetaTrader 5
(MT5) gold chart screenshots and photos for analysis. It currently supports
image upload, cropping, and local history only; chart reading, market data,
analysis, and entry/TP/SL levels are not implemented. It does not connect to a
server, GitHub, or an analysis service. Uploaded images and their history are
stored in the browser's local IndexedDB database.

## Run locally

Open `index.html` in a modern browser. If the browser restricts local storage
for pages opened directly from disk, serve this folder with any static file
server and open its local address instead.

The page accepts PNG, JPG, and WEBP images up to 15 MB. You can drag a crop
around the chart and save that focused image locally. The crop is user-selected;
chart-element detection, analysis, and trade signals are not implemented.