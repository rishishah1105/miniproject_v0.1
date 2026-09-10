import { MODULES_DATA, type ConceptModule } from '../data/modulesData';

export interface PathResult {
  targetId: string;
  path: ConceptModule[];
  prerequisitesCount: number;
}

// 1. BFS / Dijkstra Shortest Path to Target Concept
export const findShortestPathToTopic = (targetId: string): PathResult => {
  const targetModule = MODULES_DATA.find(m => m.id === targetId);
  if (!targetModule) return { targetId, path: [], prerequisitesCount: 0 };

  const requiredIds = new Set<string>();
  const queue: string[] = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const mod = MODULES_DATA.find(m => m.id === currentId);
    if (mod) {
      mod.prerequisites.forEach(reqId => {
        if (!requiredIds.has(reqId)) {
          requiredIds.add(reqId);
          queue.push(reqId);
        }
      });
    }
  }

  // Topological order of prerequisites leading to target
  const sortedPath = MODULES_DATA.filter(m => requiredIds.has(m.id) || m.id === targetId);
  return {
    targetId,
    path: sortedPath,
    prerequisitesCount: requiredIds.size
  };
};

// 2. Topological Sort (Kahn's Algorithm)
export const computeTopologicalSort = (modules: ConceptModule[]): { sortedOrder: string[]; hasCycle: boolean; cycleNodes?: string[] } => {
  const inDegree: Record<string, number> = {};
  const graph: Record<string, string[]> = {};

  modules.forEach(m => {
    inDegree[m.id] = 0;
    graph[m.id] = [];
  });

  modules.forEach(m => {
    m.prerequisites.forEach(reqId => {
      if (graph[reqId]) {
        graph[reqId].push(m.id);
        inDegree[m.id] = (inDegree[m.id] || 0) + 1;
      }
    });
  });

  const queue: string[] = [];
  Object.keys(inDegree).forEach(id => {
    if (inDegree[id] === 0) queue.push(id);
  });

  const sortedOrder: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sortedOrder.push(current);

    (graph[current] || []).forEach(neighbor => {
      inDegree[neighbor] -= 1;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  const hasCycle = sortedOrder.length !== modules.length;
  const cycleNodes = hasCycle ? Object.keys(inDegree).filter(id => inDegree[id] > 0) : undefined;

  return { sortedOrder, hasCycle, cycleNodes };
};
