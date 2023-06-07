import React, { useCallback, useEffect  } from 'react'
import { Card } from 'components/ui'
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background } from 'reactflow';
import { useSelector } from 'react-redux'
import 'reactflow/dist/style.css';
import useDidMountEffect from 'utils/hooks/useDidMountEffect'
// import '../index.css';


  
  
const TaskOverview = ({  }) => {
    const realNode = useSelector(
        (state) => state.base.common.nodes
    )
    
    const initialNodes = [
      {
          id: '1',
          type: 'input',
          data: { label: 'Input Node' },
          position: { x: 250, y: 25 },
          style: { backgroundColor: '#6ede87', color: 'white' },
      },
      {
          id: '2',
          data: { label: <div>Default Node</div> },
          position: { x: 100, y: 125 },
          style: { backgroundColor: '#ff0072', color: 'white' },
      },
      {
          id: '3',
          type: 'output',
          data: { label: 'Output Node' },
          position: { x: 250, y: 250 },
          style: { backgroundColor: '#6865A5', color: 'white' },
      },
  ];
  const initialEdges = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', animated: true },
  ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const modelName = useSelector(
      (state) => state.base.common.modelName
  )
    useDidMountEffect(() => {
      if(modelName !== '') setNodes([])
    }, [realNode]);
    
    const nodeColor = (node) => {
        switch (node.type) {
          case 'input':
            return '#6ede87';
          case 'output':
            return '#6865A5';
          default:
            return '#ff0072';
        }
      };
    return (
        <Card className="w-full h-full" bodyClass="h-full">
           <ReactFlow 
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView 
            >
                <Background />
                <Controls showInteractive={false} />
                <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
            </ReactFlow>
        </Card>
    )
}

export default TaskOverview