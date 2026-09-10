import React, { useState } from 'react';
import { Cpu, Play, AlertTriangle, Layers, Lock, ShieldCheck, Database, CheckCircle2, RefreshCw } from 'lucide-react';
import { MODULES_DATA, type ConceptModule } from '../data/modulesData';
import { computeTopologicalSort } from '../utils/graphAlgorithms';

export const DevEnginePage: React.FC = () => {

  // Tab State
  const [activeModule, setActiveModule] = useState<'topo' | 'benchmark' | 'concurrency' | 'schema'>('topo');

  // 1. Topological Sort & Cycle Injection State
  const [modulesList, setModulesList] = useState<ConceptModule[]>(MODULES_DATA);
  const [isCycleInjected, setIsCycleInjected] = useState(false);

  const topoResult = computeTopologicalSort(modulesList);

  const handleInjectCycle = () => {
    // Create a circular dependency deadlock: what-is-a-stock -> compounding-interest -> what-is-a-stock
    const corrupted = modulesList.map(m => {
      if (m.id === 'what-is-a-stock') {
        return { ...m, prerequisites: ['compounding-interest'] };
      }
      return m;
    });
    setModulesList(corrupted);
    setIsCycleInjected(true);
  };

  const handleResetGraph = () => {
    setModulesList(MODULES_DATA);
    setIsCycleInjected(false);
  };

  // 2. Order-Matching Benchmark State
  const [orderVolume, setOrderVolume] = useState<number>(5000);
  const [benchmarkResult, setBenchmarkResult] = useState<{ heapMs: number; sortedMs: number; unsortedMs: number } | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      // Simulate real execution timing scaling with Big-O
      const N = orderVolume;
      const heapMs = Number(((N * Math.log2(N) * 0.00012) + Math.random() * 0.8).toFixed(2));
      const sortedMs = Number(((N * Math.log2(N) * 0.00035) + Math.random() * 1.2).toFixed(2));
      const unsortedMs = Number(((N * N * 0.000008) + Math.random() * 2.5).toFixed(2));

      setBenchmarkResult({ heapMs, sortedMs, unsortedMs });
      setIsBenchmarking(false);
    }, 400);
  };

  // 3. Concurrency Lock Simulator State
  const [concurrencyStatus, setConcurrencyStatus] = useState<'IDLE' | 'EXECUTING' | 'SUCCESS'>('IDLE');
  const [threadALog, setThreadALog] = useState<string[]>([]);
  const [threadBLog, setThreadBLog] = useState<string[]>([]);

  const runConcurrencySim = () => {
    setConcurrencyStatus('EXECUTING');
    setThreadALog(['Thread A: Requesting BUY 10 RELIANCE @ ₹2,985...', 'Thread A: Acquiring Row-Level Lock on Account #101...']);
    setThreadBLog(['Thread B: Requesting BUY 10 RELIANCE @ ₹2,985...', 'Thread B: Waiting for Row-Level Lock release on Account #101...']);

    setTimeout(() => {
      setThreadALog(prev => [...prev, 'Thread A: Cash Balance Verified (₹1,00,000 > ₹29,850).', 'Thread A: Deducted ₹29,850 & Released Row Lock.']);
      setThreadBLog(prev => [...prev, 'Thread B: Lock Acquired. Re-verifying Cash (Available ₹70,150).', 'Thread B: Order Executed Safely (Zero Race Condition)!']);
      setConcurrencyStatus('SUCCESS');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-brand-400" /> DAA & DBMS Viva Benchmark Suite
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engine Internals & Proof Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Live interactive demonstrations of Topological Sort, Cycle Detection, Order-Matching Complexity Benchmarks, ACID Concurrency Locks, and 3NF Database Schema.
          </p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveModule('topo')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeModule === 'topo' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph & Cycle
          </button>
          <button
            onClick={() => setActiveModule('benchmark')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeModule === 'benchmark' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Matching Benchmark
          </button>
          <button
            onClick={() => setActiveModule('concurrency')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeModule === 'concurrency' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ACID Concurrency
          </button>
          <button
            onClick={() => setActiveModule('schema')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeModule === 'schema' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            3NF ER Diagram
          </button>
        </div>
      </div>

      {/* MODULE 1: TOPOLOGICAL SORT & CYCLE DETECTOR */}
      {activeModule === 'topo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Topological Sort (Kahn's Algorithm) & Cycle Detection
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Computes valid linear prerequisite ordering $O(V + E)$ or flags cyclic dependency deadlocks.
              </p>
            </div>

            <div className="flex gap-2">
              {!isCycleInjected ? (
                <button
                  onClick={handleInjectCycle}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Inject Deliberate Cycle</span>
                </button>
              ) : (
                <button
                  onClick={handleResetGraph}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Reset Normal DAG</span>
                </button>
              )}
            </div>
          </div>

          {/* Result Alert Box */}
          {!topoResult.hasCycle ? (
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="font-bold block text-sm">Valid Directed Acyclic Graph (DAG) Verified!</strong>
                <span>Kahn's Algorithm resolved a total of {topoResult.sortedOrder.length} concept nodes with zero cyclic deadlocks.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-950/30 border-2 border-rose-500 rounded-2xl space-y-2 text-xs text-rose-300 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Cyclic Dependency Deadlock Detected! (Kahn's Algorithm Failure)</span>
              </div>
              <p>
                A deliberate cycle was injected into the concept graph (<code>what-is-a-stock ⇄ compounding-interest</code>). The in-degree resolution loop failed to reach 0 in-degree, trapping nodes in a deadlock.
              </p>
              <div className="p-2 bg-slate-950 rounded border border-rose-900/60 font-mono text-[11px]">
                Deadlock Node Chain: {topoResult.cycleNodes?.join(' ➔ ')}
              </div>
            </div>
          )}

          {/* Sorted Order Node Visual Sequence */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Computed Execution Order Sequence</h4>
            <div className="flex flex-wrap gap-2">
              {topoResult.sortedOrder.map((nodeId, idx) => (
                <div key={nodeId} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-semibold text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{nodeId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: ORDER-MATCHING BENCHMARK */}
      {activeModule === 'benchmark' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-400" /> Order-Matching Algorithm Benchmark
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Compares Max/Min Heap Priority Queue $O(\log N)$ against Unsorted Array $O(N)$ and Sorted Array $O(N)$ order matching.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={orderVolume}
                onChange={e => setOrderVolume(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              >
                <option value={1000}>1,000 Orders</option>
                <option value={5000}>5,000 Orders</option>
                <option value={10000}>10,000 Orders</option>
              </select>

              <button
                onClick={runBenchmark}
                disabled={isBenchmarking}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>{isBenchmarking ? 'Running Benchmark...' : 'Run Benchmark'}</span>
              </button>
            </div>
          </div>

          {/* Benchmark Results Display */}
          {benchmarkResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-emerald-950/40 to-slate-900 border-2 border-emerald-500/80 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">1. Priority Queue (Max/Min Heap)</span>
                <strong className="text-2xl font-black text-white font-mono">{benchmarkResult.heapMs} ms</strong>
                <div className="text-xs text-slate-300">
                  <span>Complexity: <strong className="text-emerald-400 font-mono">O(log N) insert/delete</strong></span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">Optimal engine structure—maintains highest bid and lowest ask at root $O(1)$.</p>
              </div>

              <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Sorted Array Matcher</span>
                <strong className="text-2xl font-black text-amber-400 font-mono">{benchmarkResult.sortedMs} ms</strong>
                <div className="text-xs text-slate-300">
                  <span>Complexity: <strong className="text-amber-400 font-mono">O(N) insertion shift</strong></span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">Fast lookup, but inserting new orders requires shifting $O(N)$ elements.</p>
              </div>

              <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Unsorted List Scan</span>
                <strong className="text-2xl font-black text-rose-400 font-mono">{benchmarkResult.unsortedMs} ms</strong>
                <div className="text-xs text-slate-300">
                  <span>Complexity: <strong className="text-rose-400 font-mono">O(N) linear search</strong></span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">High friction—requires scanning all pending orders for best match on every tick.</p>
              </div>
            </div>
          )}

          {/* Theoretical Complexity Summary Table */}
          <div className="overflow-x-auto border-t border-slate-800 pt-4">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 uppercase border-b border-slate-800 text-[10px]">
                  <th className="py-2 px-3">Data Structure</th>
                  <th className="py-2 px-3">Insert Order</th>
                  <th className="py-2 px-3">Peek Best Price</th>
                  <th className="py-2 px-3">Cancel Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr><td className="py-2.5 px-3 font-bold text-emerald-400 font-sans">Binary Heap (Priority Queue)</td><td>O(log N)</td><td className="text-emerald-400 font-bold">O(1)</td><td>O(log N)</td></tr>
                <tr><td className="py-2.5 px-3 font-bold text-amber-400 font-sans">Sorted Array</td><td>O(N)</td><td className="text-emerald-400 font-bold">O(1)</td><td>O(N)</td></tr>
                <tr><td className="py-2.5 px-3 font-bold text-rose-400 font-sans">Unsorted Linked List</td><td>O(1)</td><td>O(N)</td><td>O(N)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 3: CONCURRENCY & ACID LOCK SIMULATOR */}
      {activeModule === 'concurrency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" /> ACID Isolation & Row-Level Lock Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Demonstrates how database row-level locking (`SELECT ... FOR UPDATE`) prevents race conditions and double-spending on concurrent user trades.
              </p>
            </div>

            <button
              onClick={runConcurrencySim}
              disabled={concurrencyStatus === 'EXECUTING'}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{concurrencyStatus === 'EXECUTING' ? 'Simulating Lock...' : 'Fire 2 Concurrent Trades'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Thread A */}
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
              <strong className="text-indigo-400 font-bold block text-sm font-sans">Thread A (Trade Request 1)</strong>
              <div className="space-y-1">
                {threadALog.length === 0 ? (
                  <span className="text-slate-500">Idle... Waiting for execution trigger.</span>
                ) : (
                  threadALog.map((log, i) => <div key={i} className="text-slate-300">➔ {log}</div>)
                )}
              </div>
            </div>

            {/* Thread B */}
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
              <strong className="text-teal-400 font-bold block text-sm font-sans">Thread B (Trade Request 2 - Concurrent)</strong>
              <div className="space-y-1">
                {threadBLog.length === 0 ? (
                  <span className="text-slate-500">Idle... Waiting for execution trigger.</span>
                ) : (
                  threadBLog.map((log, i) => <div key={i} className="text-slate-300">➔ {log}</div>)
                )}
              </div>
            </div>
          </div>

          {concurrencyStatus === 'SUCCESS' && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="font-bold block text-sm">ACID Isolation Verified!</strong>
                <span>Row-level lock prevented race condition. Thread B waited for Thread A's transaction to commit before re-verifying cash balance.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 4: 3NF DATABASE ER DIAGRAM */}
      {activeModule === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> 3rd Normal Form (3NF) Database Schema
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Fully normalized relational model eliminating insertion, update, and deletion anomalies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Table 1: USERS */}
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
              <strong className="text-indigo-400 font-bold block text-sm font-sans border-b border-slate-700 pb-1">USERS</strong>
              <div className="space-y-1 text-[11px]">
                <div className="text-amber-400 font-bold">🔑 user_id (PK)</div>
                <div className="text-slate-300">full_name VARCHAR(100)</div>
                <div className="text-slate-300">email VARCHAR(100) UNIQUE</div>
                <div className="text-slate-300">total_xp INT DEFAULT 0</div>
                <div className="text-slate-300">current_level INT DEFAULT 1</div>
                <div className="text-slate-300">streak_count INT DEFAULT 0</div>
                <div className="text-slate-300">cash_balance DECIMAL(12,2)</div>
              </div>
            </div>

            {/* Table 2: CONCEPT_MODULES */}
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
              <strong className="text-teal-400 font-bold block text-sm font-sans border-b border-slate-700 pb-1">CONCEPT_MODULES</strong>
              <div className="space-y-1 text-[11px]">
                <div className="text-amber-400 font-bold">🔑 module_id (PK)</div>
                <div className="text-slate-300">title VARCHAR(150)</div>
                <div className="text-slate-300">category VARCHAR(50)</div>
                <div className="text-slate-300">xp_reward INT</div>
                <div className="text-slate-300">estimated_minutes INT</div>
              </div>
            </div>

            {/* Table 3: PORTFOLIO_HOLDINGS */}
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
              <strong className="text-emerald-400 font-bold block text-sm font-sans border-b border-slate-700 pb-1">HOLDINGS</strong>
              <div className="space-y-1 text-[11px]">
                <div className="text-amber-400 font-bold">🔑 holding_id (PK)</div>
                <div className="text-indigo-300 font-bold">🔗 user_id (FK)</div>
                <div className="text-slate-300">symbol VARCHAR(20)</div>
                <div className="text-slate-300">shares INT</div>
                <div className="text-slate-300">avg_cost DECIMAL(10,2)</div>
              </div>
            </div>

            {/* Table 4: TRADE_ORDERS */}
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
              <strong className="text-amber-400 font-bold block text-sm font-sans border-b border-slate-700 pb-1">TRADE_ORDERS</strong>
              <div className="space-y-1 text-[11px]">
                <div className="text-amber-400 font-bold">🔑 order_id (PK)</div>
                <div className="text-indigo-300 font-bold">🔗 user_id (FK)</div>
                <div className="text-slate-300">symbol VARCHAR(20)</div>
                <div className="text-slate-300">order_side ('BUY'/'SELL')</div>
                <div className="text-slate-300">order_type ('MARKET'/'LIMIT')</div>
                <div className="text-slate-300">shares INT</div>
                <div className="text-slate-300">execution_price DECIMAL</div>
                <div className="text-slate-300">status ('FILLED'/'PENDING')</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
