import React from 'react';
import { Node, Edge } from 'reactflow';

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const JsonPreview: React.FC<Props> = ({ nodes, edges }) => {
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#f9f9f9', padding: 10, maxHeight: '30vh', width: 300, overflow: 'auto', border: '1px solid #ccc' }}>
      <h4>JSON Preview</h4>
      <pre>{JSON.stringify({ nodes, edges }, null, 2)}</pre>
    </div>
  );
};

export default JsonPreview;