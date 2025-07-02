import { Node, Edge } from 'reactflow';

export function validateDag(nodes: Node[], edges: Edge[]): boolean {
  if (nodes.length < 2) return false;
  const adj: Record<string, string[]> = {};
  nodes.forEach((node) => (adj[node.id] = []));
  edges.forEach((edge) => adj[edge.source].push(edge.target));

  const visited: Record<string, boolean> = {};
  const recStack: Record<string, boolean> = {};

  const hasCycle = (node: string): boolean => {
    if (!visited[node]) {
      visited[node] = true;
      recStack[node] = true;

      for (let neighbor of adj[node]) {
        if (!visited[neighbor] && hasCycle(neighbor)) return true;
        else if (recStack[neighbor]) return true;
      }
    }
    recStack[node] = false;
    return false;
  };

  for (let node of nodes) {
    if (hasCycle(node.id)) return false;
  }

  for (let node of nodes) {
    const connected = edges.some((e) => e.source === node.id || e.target === node.id);
    if (!connected) return false;
  }

  return true;
}