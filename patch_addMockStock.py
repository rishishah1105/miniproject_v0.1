import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

add_mock_stock_func = '''
  const addMockStock = async (symbol: string, name: string) => {
    setStocks(prev => {
      if (prev.find(s => s.symbol === symbol)) return prev;
      return [generateMockStock(symbol, name), ...prev];
    });

    try {
      const yahooSymbol = symbol + '.NS';
      const res1D = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=5m&range=1d`);
      const res1W = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=15m&range=5d`);
      const res1M = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=1mo`);
      const res3M = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=3mo`);
      const res1Y = await fetch(`/api/finance/v8/finance/chart/${yahooSymbol}?interval=1d&range=1y`);

      if (res1D.ok && res1W.ok && res1M.ok && res3M.ok && res1Y.ok) {
        const data1D = await res1D.json();
        const data1W = await res1W.json();
        const data1M = await res1M.json();
        const data3M = await res3M.json();
        const data1Y = await res1Y.json();

        const parseChartData = (data: any): CandlestickPoint[] => {
          const result = data.chart.result[0];
          const timestamps = result.timestamp;
          const quote = result.indicators.quote[0];
          
          if (!timestamps || !quote) return [];
          
          return timestamps.map((ts: number, i: number) => {
            return {
              time: ts as any,
              open: quote.open[i] || 0,
              high: quote.high[i] || 0,
              low: quote.low[i] || 0,
              close: quote.close[i] || 0,
              volume: quote.volume[i] || 0
            };
          }).filter((p: any) => p.open !== 0 && p.close !== 0);
        };

        const history1D = parseChartData(data1D);
        const history1W = parseChartData(data1W);
        const history1M = parseChartData(data1M);
        const history3M = parseChartData(data3M);
        const history1Y = parseChartData(data1Y);

        if (history1D.length > 0) {
          const lastCandle = history1D[history1D.length - 1];
          const prevCandle = history1D.length > 1 ? history1D[history1D.length - 2] : lastCandle;
          const livePrice = lastCandle.close;
          const prevClose = data1D.chart.result[0].meta.chartPreviousClose || prevCandle.close;
          const change = livePrice - prevClose;
          const changePct = (change / prevClose) * 100;
          
          const high24h = Math.max(...history1D.map(p => p.high));
          const low24h = Math.min(...history1D.map(p => p.low));

          setStocks(prev => prev.map(s => {
            if (s.symbol === symbol) {
              return {
                ...s,
                price: livePrice,
                previousClose: prevClose,
                change24h: change,
                change24hPercent: changePct,
                high24h,
                low24h,
                history1D,
                history1W: history1W.length > 0 ? history1W : history1D,
                history1M: history1M.length > 0 ? history1M : history1D,
                history3M: history3M.length > 0 ? history3M : history1D,
                history1Y: history1Y.length > 0 ? history1Y : history1D,
                isSimulated: false
              };
            }
            return s;
          }));
        }
      }
    } catch (e) {
      console.error('Failed to fetch data for', symbol, e);
    }
  };
'''

if 'const addMockStock' not in content:
    content = content.replace('const logActivity = () => {', add_mock_stock_func + '\n  const logActivity = () => {')
    content = content.replace('quests,\n', 'quests,\n        addMockStock,\n')
    
with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
