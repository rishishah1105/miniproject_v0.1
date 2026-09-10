import re

with open('src/pages/SimulatorPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace emerald with green, rose with red globally
content = content.replace('emerald-', 'green-').replace('rose-', 'red-')

new_return = '''
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0a0a0a] text-slate-300 font-sans overflow-hidden border-t border-slate-800">
      {/* Portfolio Summary Header Bar (Tight) */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#111111] border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-6 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">CASH</span>
            <strong className="text-white">{formatMoney(cashBalance)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">EQUITY</span>
            <strong className="text-indigo-400">{formatMoney(totalEquity)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">UNREALIZED</span>
            <strong className={totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}>
              {totalPnL >= 0 ? '+' : ''}{formatMoney(totalPnL)} ({pnlPercent.toFixed(2)}%)
            </strong>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] font-bold text-slate-400">{marketStatusText}</span>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Watchlist */}
        <div className="w-64 flex flex-col border-r border-slate-800 bg-[#0d0d0d] shrink-0">
          <div className="p-2 border-b border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search NSE symbol..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  setSearchIndex(-1);
                }}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full bg-[#1a1a1a] border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-slate-500 font-mono"
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-slate-700 shadow-2xl z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <div
                      key={res.symbol}
                      onMouseEnter={() => setSearchIndex(i)}
                      onClick={() => {
                        addMockStock(res.symbol, res.name);
                        setSelectedSymbol(res.symbol);
                        setSearchQuery('');
                        setShowDropdown(false);
                        setSearchIndex(-1);
                      }}
                      className={`px-2 py-1.5 cursor-pointer flex flex-col ${i === searchIndex ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
                    >
                      <span className="font-bold text-white text-xs font-mono">{res.symbol}</span>
                      <span className="text-slate-500 text-[10px] truncate">{res.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stocks.map(s => {
              const isSelected = s.symbol === selectedSymbol;
              const isPositive = s.change24h >= 0;
              return (
                <div
                  key={s.symbol}
                  onClick={() => {
                    setSelectedSymbol(s.symbol);
                    if (orderType === 'LIMIT') setLimitPriceInput(s.price.toString());
                  }}
                  className={`px-3 py-2 cursor-pointer flex justify-between items-center border-b border-slate-800/50 ${
                    isSelected ? 'bg-slate-800' : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white font-mono">{s.symbol}</span>
                    <span className="text-[10px] text-slate-500 max-w-[100px] truncate">{s.name}</span>
                  </div>
                  <div className="flex flex-col items-end font-mono">
                    <span className="text-xs text-white">{s.price.toFixed(2)}</span>
                    <span className={`text-[10px] ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{s.change24hPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANEL: Chart */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          {/* OHLC Stats Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0d0d0d]">
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{currentStock.symbol}</h2>
                {currentStock.isSimulated && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded uppercase tracking-wider">
                    Simulated Data
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-lg">{currentStock.price.toFixed(2)}</span>
                  <span className={`${currentStock.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {currentStock.change24h >= 0 ? '+' : ''}{currentStock.change24h.toFixed(2)} ({currentStock.change24hPercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <div className="flex gap-3 text-[10px]">
                  <div><span className="text-slate-500 mr-1">O</span><span className="text-slate-300">{(historyData[historyData.length - 1]?.open || currentStock.price).toFixed(2)}</span></div>
                  <div><span className="text-slate-500 mr-1">H</span><span className="text-slate-300">{currentStock.high24h.toFixed(2)}</span></div>
                  <div><span className="text-slate-500 mr-1">L</span><span className="text-slate-300">{currentStock.low24h.toFixed(2)}</span></div>
                  <div><span className="text-slate-500 mr-1">C</span><span className="text-slate-300">{currentStock.previousClose.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Controls */}
          <div className="flex items-center gap-4 px-4 py-1.5 border-b border-slate-800 bg-[#111111] text-[10px]">
            <div className="flex gap-0.5">
              {(['candlestick', 'line', 'area', 'bar'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-2 py-1 rounded uppercase font-bold ${chartType === type ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex gap-0.5 font-bold">
              {(['1D', '1W', '1M'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf as any)}
                  className={`px-2 py-1 rounded ${chartTimeframe === tf ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex gap-0.5 font-bold">
              <button onClick={() => setShowSMA(!showSMA)} className={`px-2 py-1 rounded border ${showSMA ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}>SMA</button>
              <button onClick={() => setShowEMA(!showEMA)} className={`px-2 py-1 rounded border ${showEMA ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}>EMA</button>
              <button onClick={() => setShowBollinger(!showBollinger)} className={`px-2 py-1 rounded border ${showBollinger ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}>BB</button>
              <button onClick={() => setShowRSI(!showRSI)} className={`px-2 py-1 rounded border ${showRSI ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}>RSI</button>
              <button onClick={() => setShowMACD(!showMACD)} className={`px-2 py-1 rounded border ${showMACD ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}>MACD</button>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-0">
            <TradingChart 
              data={historyData}
              type={chartType as any}
              showSMA={showSMA}
              showEMA={showEMA}
              showBollinger={showBollinger}
              showRSI={showRSI}
              showMACD={showMACD}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Order Entry & Depth */}
        <div className="w-72 flex flex-col border-l border-slate-800 bg-[#0d0d0d] shrink-0">
          {/* Order Entry */}
          <div className="p-3 border-b border-slate-800">
            <div className="flex font-bold text-xs mb-3 bg-[#1a1a1a] rounded p-0.5">
              <button
                onClick={() => setOrderSide('BUY')}
                className={`flex-1 py-1.5 rounded-sm ${orderSide === 'BUY' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >BUY</button>
              <button
                onClick={() => setOrderSide('SELL')}
                className={`flex-1 py-1.5 rounded-sm ${orderSide === 'SELL' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >SELL</button>
            </div>
            <form onSubmit={handleOrderSubmit} className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-slate-500">TYPE</span>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={orderType === 'MARKET'} onChange={() => setOrderType('MARKET')} className="accent-slate-500" /> MKT
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={orderType === 'LIMIT'} onChange={() => { setOrderType('LIMIT'); setLimitPriceInput(currentStock.price.toString()); }} className="accent-slate-500" /> LMT
                  </label>
                </div>
              </div>
              {orderType === 'LIMIT' && (
                <div className="flex items-center bg-[#1a1a1a] border border-slate-700 rounded px-2">
                  <span className="text-slate-500 w-12 text-[10px]">PRICE</span>
                  <input type="number" step="0.05" required value={limitPriceInput} onChange={e => setLimitPriceInput(e.target.value)} className="w-full bg-transparent py-1.5 text-right text-white focus:outline-none" />
                </div>
              )}
              <div className="flex items-center bg-[#1a1a1a] border border-slate-700 rounded px-2">
                <span className="text-slate-500 w-12 text-[10px]">QTY</span>
                <input type="number" min="1" required value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-full bg-transparent py-1.5 text-right text-white focus:outline-none" />
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
                <span className="text-slate-500">MARGIN REQ</span>
                <span className="text-white">{formatMoney(estimatedCost)}</span>
              </div>
              <button type="submit" className={`w-full py-2 font-bold uppercase rounded ${orderSide === 'BUY' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                {orderSide} {quantity} {currentStock.symbol}
              </button>
            </form>
          </div>

          {/* Order Depth */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-slate-800">
            <div className="px-3 py-1.5 bg-[#111111] border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase flex justify-between">
              <span>Order Book</span>
              <span>Sprd: {(currentStock.price * 0.001).toFixed(2)}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px]">
              <table className="w-full text-right">
                <thead>
                  <tr className="text-slate-600">
                    <th className="font-normal pb-1 text-left">BID</th>
                    <th className="font-normal pb-1">QTY</th>
                    <th className="font-normal pb-1 text-left pl-2">ASK</th>
                    <th className="font-normal pb-1">QTY</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStock.orderBook.bids.slice(0, 10).map((bid: any, i: number) => {
                    const ask = currentStock.orderBook.asks[i];
                    return (
                      <tr key={i} className="hover:bg-slate-800/50">
                        <td className="text-green-500 text-left py-0.5">{bid.price.toFixed(2)}</td>
                        <td className="text-slate-400">{bid.amount}</td>
                        <td className="text-red-500 text-left pl-2 py-0.5">{ask.price.toFixed(2)}</td>
                        <td className="text-slate-400">{ask.amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Accordions (Open Orders, Holdings) */}
          <div className="flex flex-col h-1/3 bg-[#0a0a0a]">
            <div className="flex bg-[#111111] border-b border-slate-800">
              <button onClick={() => setActiveTab('holdings')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase transition-colors ${activeTab === 'holdings' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>Holdings</button>
              <button onClick={() => setActiveTab('orders')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase transition-colors ${activeTab === 'orders' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>Orders</button>
              <button onClick={() => setActiveTab('history')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase transition-colors ${activeTab === 'history' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>History</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px]">
              {activeTab === 'holdings' && (
                <div className="space-y-2">
                  {Object.values(holdings).length === 0 ? <div className="text-slate-600 text-center py-4">Empty</div> : 
                    Object.values(holdings).map((h: any) => {
                      const p = stocks.find(s => s.symbol === h.symbol)?.price || h.avgCost;
                      const val = h.shares * p;
                      return (
                        <div key={h.symbol} className="flex justify-between items-center p-1.5 bg-[#1a1a1a] rounded cursor-pointer" onClick={() => { setSelectedSymbol(h.symbol); setOrderSide('SELL'); }}>
                          <div><span className="font-bold text-white">{h.symbol}</span> <span className="text-slate-500">x{h.shares}</span></div>
                          <div className={p >= h.avgCost ? 'text-green-500' : 'text-red-500'}>{val.toFixed(2)}</div>
                        </div>
                      )
                    })
                  }
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="space-y-2">
                  {openOrders.length === 0 ? <div className="text-slate-600 text-center py-4">Empty</div> : 
                    openOrders.map((o: any) => (
                      <div key={o.id} className="flex justify-between items-center p-1.5 bg-[#1a1a1a] rounded">
                        <div>
                          <span className={o.side === 'BUY' ? 'text-green-500' : 'text-red-500'}>{o.side}</span> <span className="font-bold text-white">{o.symbol}</span>
                          <div className="text-slate-500">{o.shares} @ {o.targetPrice.toFixed(2)}</div>
                        </div>
                        <button onClick={() => cancelOrder(o.id)} className="text-slate-500 hover:text-white px-2">X</button>
                      </div>
                    ))
                  }
                </div>
              )}
              {activeTab === 'history' && (
                <div className="space-y-2">
                  {tradeLog.length === 0 ? <div className="text-slate-600 text-center py-4">Empty</div> : 
                    tradeLog.map((l: any) => (
                      <div key={l.id} className="p-1.5 bg-[#1a1a1a] rounded flex justify-between">
                        <div><span className={l.side === 'BUY' ? 'text-green-500' : 'text-red-500'}>{l.side}</span> <span className="font-bold text-white">{l.symbol}</span></div>
                        <div className="text-right"><div className="text-white">{l.total.toFixed(2)}</div><div className="text-slate-600 text-[9px]">{l.timestamp}</div></div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
'''

start_idx = content.find('return (')
if start_idx != -1:
    content = content[:start_idx] + 'return (' + new_return + ');\n};\n'
    with open('src/pages/SimulatorPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully updated SimulatorPage.tsx')
else:
    print('Failed to find return statement')
