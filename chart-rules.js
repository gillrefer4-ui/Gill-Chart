(() => {
  "use strict";

  const TIMEFRAMES = [
    { name: "M1", minutes: 1 },
    { name: "M5", minutes: 5 },
    { name: "M15", minutes: 15 },
    { name: "M30", minutes: 30 },
    { name: "H1", minutes: 60 },
    { name: "H4", minutes: 240 },
    { name: "D1", minutes: 1440 },
    { name: "W1", minutes: 10080 },
    { name: "MN1", minutes: 43200 }
  ];

  function findSwings(candles) {
    const highs = [];
    const lows = [];
    for (let index = 2; index < candles.length - 2; index += 1) {
      const candle = candles[index];
      const neighbors = candles.slice(index - 2, index).concat(candles.slice(index + 1, index + 3));
      if (neighbors.every(item => candle.top < item.top)) highs.push({ index, y: candle.top });
      if (neighbors.every(item => candle.bottom > item.bottom)) lows.push({ index, y: candle.bottom });
    }
    return { highs, lows };
  }

  function classifyStructure(swings) {
    const highs = swings.highs.slice(-4);
    const lows = swings.lows.slice(-4);
    if (highs.length < 4 || lows.length < 4) return "Range / unclear";

    const risingHighs = highs.every((point, index) => index === 0 || point.y < highs[index - 1].y);
    const risingLows = lows.every((point, index) => index === 0 || point.y < lows[index - 1].y);
    const fallingHighs = highs.every((point, index) => index === 0 || point.y > highs[index - 1].y);
    const fallingLows = lows.every((point, index) => index === 0 || point.y > lows[index - 1].y);
    if (risingHighs && risingLows) return "Uptrend";
    if (fallingHighs && fallingLows) return "Downtrend";
    return "Range / unclear";
  }

  function detectBreaks(structure, candles, swings) {
    const closedCandles = candles.slice(0, -1);
    const lastClosed = closedCandles.at(-1);
    if (!lastClosed) return { bos: "Not confirmed", choch: "Not assessed" };

    const priorHigh = swings.highs.filter(point => point.index < closedCandles.length - 3).at(-1);
    const priorLow = swings.lows.filter(point => point.index < closedCandles.length - 3).at(-1);
    const bosUp = structure === "Uptrend" && priorHigh && lastClosed.close < priorHigh.y;
    const bosDown = structure === "Downtrend" && priorLow && lastClosed.close > priorLow.y;
    const chochDown = structure === "Uptrend" && priorLow && lastClosed.close > priorLow.y;
    const chochUp = structure === "Downtrend" && priorHigh && lastClosed.close < priorHigh.y;
    return {
      bos: bosUp ? "Upward close beyond the prior swing high"
        : bosDown ? "Downward close beyond the prior swing low"
          : "Not confirmed",
      choch: chochDown ? "Possible downward change of character"
        : chochUp ? "Possible upward change of character"
          : "Not confirmed"
    };
  }

  function parsePrice(text) {
    const cleaned = text.replace(/[^\d.,+-]/g, "");
    if (!/\d/.test(cleaned)) return null;
    let normalized = cleaned;
    if (cleaned.includes(",") && cleaned.includes(".")) {
      normalized = cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
    } else if (cleaned.includes(",")) {
      normalized = /,\d{1,3}$/.test(cleaned) ? cleaned.replace(",", ".") : cleaned.replace(/,/g, "");
    }
    const value = Number(normalized);
    return Number.isFinite(value) ? value : null;
  }

  function parseTimestamp(text) {
    const normalized = text.trim().replace(/\s+/g, " ");
    const isoLike = normalized.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T]+(\d{1,2}):(\d{2}))?/);
    if (isoLike) {
      const [, year, month, day, hour = "0", minute = "0"] = isoLike;
      return Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    }
    const parsed = Date.parse(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function priceAtY(y, marks) {
    for (let index = 1; index < marks.length; index += 1) {
      const upper = marks[index - 1];
      const lower = marks[index];
      if (y < upper.y || y > lower.y || lower.y === upper.y) continue;
      const ratio = (y - upper.y) / (lower.y - upper.y);
      return upper.price + ratio * (lower.price - upper.price);
    }
    return null;
  }

  function inferTimeframe(timeMarks, candles) {
    const sorted = timeMarks.slice().sort((a, b) => a.x - b.x);
    const estimates = [];
    for (let index = 1; index < sorted.length; index += 1) {
      const first = sorted[index - 1];
      const second = sorted[index];
      const candleCount = candles.filter(candle => candle.x > first.x && candle.x <= second.x).length;
      if (!candleCount || second.timestamp <= first.timestamp) continue;
      const minutesPerCandle = (second.timestamp - first.timestamp) / 60000 / candleCount;
      const closest = TIMEFRAMES.reduce((best, item) =>
        Math.abs(item.minutes - minutesPerCandle) < Math.abs(best.minutes - minutesPerCandle) ? item : best);
      const difference = Math.abs(closest.minutes - minutesPerCandle) / closest.minutes;
      if (difference <= 0.3) estimates.push(closest.name);
    }
    if (estimates.length < 2) return null;
    const counts = new Map();
    for (const estimate of estimates) counts.set(estimate, (counts.get(estimate) || 0) + 1);
    const [timeframe, votes] = [...counts].sort((a, b) => b[1] - a[1])[0];
    return votes >= 2 ? timeframe : null;
  }

  async function readAxes(image, scan) {
    if (typeof window.TextDetector !== "function") {
      return {
        timeframe: null,
        priceMarks: [],
        currentPrice: null,
        lastCandle: null,
        swingHighPrices: [],
        swingLowPrices: [],
        message: "This browser does not support local text recognition, so axis prices and timeframe could not be read."
      };
    }

    const detector = new window.TextDetector();
    let detections;
    try {
      detections = await detector.detect(image);
    } catch (error) {
      return {
        timeframe: null,
        priceMarks: [],
        currentPrice: null,
        lastCandle: null,
        swingHighPrices: [],
        swingLowPrices: [],
        message: `Local axis text recognition failed: ${error instanceof Error ? error.message : "unknown browser error"}.`
      };
    }
    const xScale = scan.width / image.naturalWidth;
    const yScale = scan.height / image.naturalHeight;
    const priceMarks = [];
    const timeMarks = [];
    for (const detection of detections) {
      const text = detection.rawValue.trim();
      const box = detection.boundingBox;
      const x = (box.x + box.width / 2) * xScale;
      const y = (box.y + box.height / 2) * yScale;
      if (x >= scan.xEnd && y >= scan.yStart && y <= scan.yEnd) {
        const price = parsePrice(text);
        if (price !== null) priceMarks.push({ y, price, text });
      } else if (y >= scan.yEnd && x >= scan.xStart && x <= scan.xEnd) {
        const timestamp = parseTimestamp(text);
        if (timestamp !== null) timeMarks.push({ x, timestamp, text });
      }
    }

    priceMarks.sort((a, b) => a.y - b.y);
    const distinctMarks = priceMarks.filter((mark, index) =>
      index === 0 || Math.abs(mark.y - priceMarks[index - 1].y) > 2);
    const timeframe = inferTimeframe(timeMarks, scan.candles);
    const currentPrice = scan.currentPriceY === null || distinctMarks.length < 2
      ? null
      : priceAtY(scan.currentPriceY, distinctMarks);
    const closedCandles = scan.candles.slice(0, -1);
    const lastCandle = closedCandles.at(-1);
    const mapCandle = candle => ({
      open: priceAtY(candle.open, distinctMarks),
      high: priceAtY(candle.top, distinctMarks),
      low: priceAtY(candle.bottom, distinctMarks),
      close: priceAtY(candle.close, distinctMarks)
    });

    return {
      timeframe,
      priceMarks: distinctMarks,
      currentPrice,
      lastCandle: distinctMarks.length >= 2 && lastCandle ? mapCandle(lastCandle) : null,
      swingHighPrices: scan.highs.map(point => priceAtY(point.y, distinctMarks)),
      swingLowPrices: scan.lows.map(point => priceAtY(point.y, distinctMarks)),
      message: distinctMarks.length < 2
        ? "Axis price labels were not read clearly enough to convert image positions into prices."
        : ""
    };
  }

  window.GillChartRules = Object.freeze({
    findSwings,
    classifyStructure,
    detectBreaks,
    readAxes
  });
})();
