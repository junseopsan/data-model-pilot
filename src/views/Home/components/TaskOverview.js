import React, { useCallback, useState, useEffect  } from 'react'
import { Card } from 'components/ui'
import ReactFlow, { useNodesState, useEdgesState, addEdge, applyEdgeChanges, applyNodeChanges, MiniMap, Controls, Background } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux'
import TextUpdaterNode from '../nodes/TextUpdaterNode';
import '../../../assets/styles/reactFlow/text-updater-node.css'
import { setStoreNodes } from 'store/base/commonSlice'

import 'reactflow/dist/style.css';
  
// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

const TaskOverview = () => {
    const dispatch = useDispatch()
    const storeNodes = useSelector(
        (state) => state.base.common.storeNodes
    )
    const storeEdges = useSelector(
        (state) => state.base.common.storeEdges
    )

    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const modelInfo = useSelector(
      (state) => state.base.common.modelInfo
    )
    const entityInfo = useSelector(
      (state) => state.base.common.entityInfo
    )

    const onNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes]
    );
    const onEdgesChange = useCallback(
      (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      [setEdges]
    );
    const onConnect = useCallback(
      (connection) => setEdges((eds) => addEdge(connection, eds)),
      [setEdges]
    );
    
    useEffect(() => {
      if(modelInfo.isNewModel) setNodes([])
      if(modelInfo.isNewOpen){
        setNodes(storeNodes)
        setEdges(storeEdges)
      } 

      setNodes(storeNodes)
    }, [storeNodes, storeEdges]);


    useEffect(()=> {
      if(entityInfo.isNewEntity){
        const newEntityInfo = { 
          id: `node-${storeNodes.length}`, 
          type: 'textUpdater', 
          position: { x: storeNodes.length*1+storeNodes.length*200, y: 0 }, 
          data: { title: entityInfo.entityName, id: `node-${storeNodes.length}` },
          style: {
            width: 220,
            height: 200,
          },
      }
      const nodes = storeNodes.concat(newEntityInfo)
      // // console.log('newEntityInfo', newEntityInfo)
      //   console.log('nodes', nodes)
        dispatch(setStoreNodes(nodes))
      } 
    },[entityInfo])

    
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
              onConnect={onConnect}
              nodeTypes={nodeTypes}
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
