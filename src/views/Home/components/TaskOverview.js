import React, { useCallback, useState, useEffect  } from 'react'
import { Card } from 'components/ui'
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background } from 'reactflow';
import { useSelector } from 'react-redux'
import 'reactflow/dist/style.css';
  
const TaskOverview = () => {
    const realNode = useSelector(
        (state) => state.base.common.nodes
    )
    const realEdge = useSelector(
        (state) => state.base.common.edges
    )

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const modelInfo = useSelector(
      (state) => state.base.common.modelInfo
    )
    
    useEffect(() => {
      setEdges(realEdge)
      setNodes(realNode)
    }, []);
    
    useEffect(() => {
      if(modelInfo.isNewModel) setNodes([])
      if(modelInfo.isNewOpen){
        setNodes(realNode)
        setEdges(realEdge)
      } 
    }, [realNode, realEdge]);

    
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