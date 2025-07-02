import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls as FlowControls,
  Background,
  Connection,
  Edge,
  Node,
  useReactFlow,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { validateDag } from '../hooks/useDagValidation';
import { getLayoutedElements } from '../utils/layout';
import JsonPreview from './JsonPreview';

const nodeWidth = 172;
const nodeHeight = 36;

let id = 0;
const getId = () => `node_${id++}`;

const CustomNode = ({ data }: any) => (
  <div style={{ padding: 10, border: '1px solid #777', borderRadius: 5, background: '#fff' }}>
    <Handle type="target" position={Position.Left} />
    <div>{data.label}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const nodeTypes = { custom: CustomNode };

const Graph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [isValidDag, setIsValidDag] = useState(false);
  const { fitView } = useReactFlow();

  const addNode = () => {
    const label = prompt('Enter node label');
    if (!label) return;
    const newNode: Node = {
      id: getId(),
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback((params: Connection) => {
    if (params.source === params.target) return;
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, []);

  const onSelectionChange = (elements: any) => {
    setSelected(elements);
  };

  const handleDelete = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete') {
      const nodeIds = selected.filter((el) => el.type === 'node').map((el) => el.id);
      const edgeIds = selected.filter((el) => el.type === 'edge').map((el) => el.id);
      setNodes((nds) => nds.filter((n) => !nodeIds.includes(n.id)));
      setEdges((eds) => eds.filter((e) =>
        !edgeIds.includes(e.id) &&
        !nodeIds.includes(e.source) &&
        !nodeIds.includes(e.target)
      ));
    }
  }, [selected]);

  useEffect(() => {
    window.addEventListener('keydown', handleDelete);
    return () => window.removeEventListener('keydown', handleDelete);
  }, [handleDelete]);

  useEffect(() => {
    setIsValidDag(validateDag(nodes, edges));
  }, [nodes, edges]);

  const autoLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setTimeout(() => fitView(), 100);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ padding: 10, background: '#eee' }}>
        <button onClick={addNode}>Add Node</button>
        <button onClick={autoLayout}>Auto Layout</button>
        <span style={{ marginLeft: 20 }}>DAG Status: {isValidDag ? '✅ Valid DAG' : '❌ Invalid DAG'}</span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <FlowControls />
        <Background />
      </ReactFlow>
      <JsonPreview nodes={nodes} edges={edges} />
    </div>
  );
};

export default Graph;
