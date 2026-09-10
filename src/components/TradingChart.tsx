import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import type { ISeriesApi } from 'lightweight-charts';
import type { CandlestickPoint } from '../data/stocksData';
import { useEffect, useRef } from 'react';

interface TradingChartProps {
  data: CandlestickPoint[];
  type: 'candlestick' | 'line' | 'area' | 'bar' | 'step';
  showSMA: boolean;
  showEMA: boolean;
  showBollinger: boolean;
  showRSI: boolean;
  showMACD: boolean;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  data,
  type,
  showSMA,
  showEMA,
  showBollinger,
  showRSI,
  showMACD,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);


  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
      },
      autoSize: true,
    });
    chartRef.current = chart;

    let mainSeries: any;

    if (type === 'candlestick') {
      mainSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
    } else if (type === 'line' || type === 'step') {
      mainSeries = chart.addLineSeries({
        color: '#6366f1',
        lineWidth: 2,
        lineType: type === 'step' ? 1 : 0,
      });
    } else if (type === 'area') {
      mainSeries = chart.addAreaSeries({
        lineColor: '#6366f1',
        topColor: 'rgba(99, 102, 241, 0.4)',
        bottomColor: 'rgba(99, 102, 241, 0.0)',
      });
    } else if (type === 'bar') {
      mainSeries = chart.addBarSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
      });
    }

    seriesRef.current = mainSeries;

    // Add Volume pane
    const volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay by default
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // leave space for chart
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.remove();
    };
  }, [type]);

  useEffect(() => {
    if (!seriesRef.current || !data || data.length === 0) return;

    // Process data for lightweight-charts
    // time needs to be unix timestamp or string 'YYYY-MM-DD'
    // Since our mock data uses '2-digit' hour format (e.g. "14:30"), we need to construct a valid JS timestamp
    // For simplicity, we can just use fake sequential timestamps starting from a recent day

    let baseTime = new Date().getTime() - data.length * 15 * 60 * 1000;

    const formattedData = data.map((d) => {
      baseTime += 15 * 60 * 1000;
      return {
        time: Math.floor(baseTime / 1000) as any,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        value: d.close, // for line/area
      };
    });

    const volumeData = data.map((d, i) => {
      const isUp = d.close >= d.open;
      return {
        time: formattedData[i].time,
        value: d.volume,
        color: isUp ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
      };
    });

    if (type === 'candlestick' || type === 'bar') {
      seriesRef.current.setData(formattedData);
    } else {
      seriesRef.current.setData(formattedData.map(d => ({ time: d.time, value: d.value })));
    }

    volumeSeriesRef.current.setData(volumeData);

    // Indicator helpers
    const calculateSMA = (period: number) => {
      const result = [];
      for (let i = 0; i < formattedData.length; i++) {
        if (i < period - 1) continue;
        let sum = 0;
        for (let j = 0; j < period; j++) sum += formattedData[i - j].close;
        result.push({ time: formattedData[i].time, value: sum / period });
      }
      return result;
    };

    const calculateEMA = (period: number) => {
      const result = [];
      const k = 2 / (period + 1);
      let ema = formattedData[0].close;
      for (let i = 0; i < formattedData.length; i++) {
        ema = (formattedData[i].close - ema) * k + ema;
        if (i >= period - 1) {
          result.push({ time: formattedData[i].time, value: ema });
        }
      }
      return result;
    };

    const calculateBollinger = (period: number, multiplier: number) => {
      const upper = [];
      const lower = [];
      for (let i = period - 1; i < formattedData.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) sum += formattedData[i - j].close;
        const sma = sum / period;
        let sqSum = 0;
        for (let j = 0; j < period; j++) sqSum += Math.pow(formattedData[i - j].close - sma, 2);
        const stdDev = Math.sqrt(sqSum / period);
        upper.push({ time: formattedData[i].time, value: sma + multiplier * stdDev });
        lower.push({ time: formattedData[i].time, value: sma - multiplier * stdDev });
      }
      return { upper, lower };
    };

    const calculateRSI = (period: number) => {
      const result = [];
      let gains = 0, losses = 0;
      for (let i = 1; i <= period && i < formattedData.length; i++) {
        const diff = formattedData[i].close - formattedData[i - 1].close;
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }
      let avgGain = gains / period;
      let avgLoss = losses / period;

      for (let i = period; i < formattedData.length; i++) {
        if (i > period) {
          const diff = formattedData[i].close - formattedData[i - 1].close;
          avgGain = (avgGain * (period - 1) + (diff >= 0 ? diff : 0)) / period;
          avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
        }
        const rs = avgGain / (avgLoss === 0 ? 1 : avgLoss);
        const rsi = 100 - (100 / (1 + rs));
        result.push({ time: formattedData[i].time, value: rsi });
      }
      return result;
    };

    const calculateMACD = () => {
      const ema12 = calculateEMA(12);
      const ema26 = calculateEMA(26);
      const macdLine = [];
      const offset = 26 - 12;

      for (let i = 0; i < ema26.length; i++) {
        macdLine.push({
          time: ema26[i].time,
          value: ema12[i + offset].value - ema26[i].value
        });
      }

      const signalLine = [];
      const period = 9;
      const k = 2 / (period + 1);
      if (macdLine.length > 0) {
        let ema = macdLine[0].value;
        for (let i = 0; i < macdLine.length; i++) {
          ema = (macdLine[i].value - ema) * k + ema;
          if (i >= period - 1) {
            signalLine.push({ time: macdLine[i].time, value: ema });
          }
        }
      }

      const histogram = [];
      const sigOffset = macdLine.length - signalLine.length;
      for (let i = 0; i < signalLine.length; i++) {
        const histVal = macdLine[i + sigOffset].value - signalLine[i].value;
        histogram.push({
          time: signalLine[i].time,
          value: histVal,
          color: histVal >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
        });
      }

      return { macdLine, signalLine, histogram };
    };

    // Remove old indicator series if they exist
    if (chartRef.current.sma20Series) { chartRef.current.removeSeries(chartRef.current.sma20Series); chartRef.current.sma20Series = null; }
    if (chartRef.current.sma50Series) { chartRef.current.removeSeries(chartRef.current.sma50Series); chartRef.current.sma50Series = null; }
    if (chartRef.current.sma200Series) { chartRef.current.removeSeries(chartRef.current.sma200Series); chartRef.current.sma200Series = null; }
    if (chartRef.current.ema20Series) { chartRef.current.removeSeries(chartRef.current.ema20Series); chartRef.current.ema20Series = null; }
    if (chartRef.current.bbUpperSeries) { chartRef.current.removeSeries(chartRef.current.bbUpperSeries); chartRef.current.bbUpperSeries = null; }
    if (chartRef.current.bbLowerSeries) { chartRef.current.removeSeries(chartRef.current.bbLowerSeries); chartRef.current.bbLowerSeries = null; }

    if (rsiSeriesRef.current) { chartRef.current.removeSeries(rsiSeriesRef.current); rsiSeriesRef.current = null; }
    if (macdSeriesRef.current) { chartRef.current.removeSeries(macdSeriesRef.current); macdSeriesRef.current = null; }
    if (macdSignalSeriesRef.current) { chartRef.current.removeSeries(macdSignalSeriesRef.current); macdSignalSeriesRef.current = null; }
    if (macdHistSeriesRef.current) { chartRef.current.removeSeries(macdHistSeriesRef.current); macdHistSeriesRef.current = null; }

    // Dynamic margin adjustment for sub-panes
    let mainBottom = 1.0;
    if (showRSI && showMACD) mainBottom = 0.6;
    else if (showRSI || showMACD) mainBottom = 0.75;

    seriesRef.current.priceScale().applyOptions({ scaleMargins: { top: 0.1, bottom: 1 - mainBottom + 0.05 } });
    volumeSeriesRef.current.priceScale().applyOptions({ scaleMargins: { top: mainBottom - 0.15, bottom: 1 - mainBottom } });

    if (showSMA) {
      const sma20Series = chartRef.current.addLineSeries({ color: '#f97316', lineWidth: 1, title: 'SMA 20' });
      sma20Series.setData(calculateSMA(20));
      chartRef.current.sma20Series = sma20Series;

      const sma50Series = chartRef.current.addLineSeries({ color: '#3b82f6', lineWidth: 1, title: 'SMA 50' });
      sma50Series.setData(calculateSMA(50));
      chartRef.current.sma50Series = sma50Series;

      const sma200Series = chartRef.current.addLineSeries({ color: '#ef4444', lineWidth: 1, title: 'SMA 200' });
      sma200Series.setData(calculateSMA(200));
      chartRef.current.sma200Series = sma200Series;
    }

    if (showEMA) {
      const ema20Series = chartRef.current.addLineSeries({ color: '#8b5cf6', lineWidth: 1, title: 'EMA 20', lineStyle: LineStyle.Dashed });
      ema20Series.setData(calculateEMA(20));
      chartRef.current.ema20Series = ema20Series;
    }

    if (showBollinger) {
      const bb = calculateBollinger(20, 2);
      const bbUpperSeries = chartRef.current.addLineSeries({ color: '#d946ef', lineWidth: 1, title: 'BB Upper' });
      bbUpperSeries.setData(bb.upper);
      chartRef.current.bbUpperSeries = bbUpperSeries;

      const bbLowerSeries = chartRef.current.addLineSeries({ color: '#d946ef', lineWidth: 1, title: 'BB Lower' });
      bbLowerSeries.setData(bb.lower);
      chartRef.current.bbLowerSeries = bbLowerSeries;
    }

    if (showRSI) {
      const rsiScaleId = 'rsi';
      const rsiTop = showMACD ? 0.65 : 0.8;
      const rsiSeries = chartRef.current.addLineSeries({ color: '#14b8a6', lineWidth: 1, priceScaleId: rsiScaleId, title: 'RSI' });
      rsiSeries.priceScale().applyOptions({ scaleMargins: { top: rsiTop, bottom: showMACD ? 0.2 : 0 } });
      rsiSeries.setData(calculateRSI(14));
      rsiSeriesRef.current = rsiSeries;
    }

    if (showMACD) {
      const macdScaleId = 'macd';
      const macdTop = 0.8;

      const { macdLine, signalLine, histogram } = calculateMACD();

      const macdHistSeries = chartRef.current.addHistogramSeries({ priceScaleId: macdScaleId });
      macdHistSeries.priceScale().applyOptions({ scaleMargins: { top: macdTop, bottom: 0 } });
      macdHistSeries.setData(histogram);
      macdHistSeriesRef.current = macdHistSeries;

      const macdLineSeries = chartRef.current.addLineSeries({ color: '#22c55e', lineWidth: 1, priceScaleId: macdScaleId, title: 'MACD' });
      macdLineSeries.setData(macdLine);
      macdSeriesRef.current = macdLineSeries;

      const signalLineSeries = chartRef.current.addLineSeries({ color: '#ef4444', lineWidth: 1, priceScaleId: macdScaleId, title: 'Signal' });
      signalLineSeries.setData(signalLine);
      macdSignalSeriesRef.current = signalLineSeries;
    }

  }, [data, type, showSMA, showEMA, showBollinger, showRSI, showMACD]);

  return (
    <div className="w-full h-full relative" ref={chartContainerRef} />
  );
};
