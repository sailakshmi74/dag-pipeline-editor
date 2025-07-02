import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Graph from './components/Graph';

const App = () => {
  return (
    <ReactFlowProvider>
      <Graph />
    </ReactFlowProvider>
  );
};

export default App;