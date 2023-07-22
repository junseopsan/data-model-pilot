import React, { HTMLAttributes, HTMLProps, useCallback, useState, useEffect, useMemo  } from 'react'

import { Card } from 'components/ui'
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  applyEdgeChanges, 
  applyNodeChanges, 
  MiniMap, Controls, 
  Background
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux'
import TextUpdaterNode from '../nodes/TextUpdaterNode';
import '../../../assets/styles/reactFlow/text-updater-node.css'
import { setStoreData } from 'store/base/commonSlice'

import 'reactflow/dist/style.css';
  
// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const getNodeId = () => `randomnode_${+new Date()}`;

const TaskOverview = () => {
    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
    const dispatch = useDispatch()
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();
    const getData = useSelector(
      (state) => state.base.common.storeData
    )
    const entityInfo = useSelector(
      (state) => state.base.common.entityInfo
    )
    const modelInfo = useSelector(
      (state) => state.base.common.modelInfo
    )

    useEffect(()=>{
      onLoadUpdate()
    },[modelInfo.isNewOpen])

    useEffect(() => {
      onSave()
    },[nodes, edges])
    
    const onNodesChange = useCallback(
      (changes) =>{ 
        setNodes((nds) => applyNodeChanges(changes, nds))
      },
      [setNodes]
    );
    
    const onEdgesChange = useCallback(
      (changes) =>{
        setEdges((eds) => applyEdgeChanges(changes, eds))
      },
      [setEdges]
    );

    const onConnect = useCallback(
      (connection) => setEdges((eds) => addEdge(connection, eds)),
      [setEdges]
    );
    
    const onSave = useCallback(() => {
      if (rfInstance) {
        const flow = rfInstance.toObject();
        dispatch(setStoreData(flow))
      }
    }, [rfInstance]);

    // const onRestore = useCallback(() => {
    //   const restoreFlow = async () => {
    //     const flow = JSON.parse(localStorage.getItem(flowKey));
    //     if (flow) {
    //       const { x = 0, y = 0, zoom = 1 } = flow.viewport;
    //       setNodes(flow.nodes || []);
    //       setEdges(flow.edges || []);
    //       setViewport({ x, y, zoom });
    //     }
    //   };
    //   restoreFlow();
    // }, [setNodes, setViewport]);

    const onAdd = useCallback(() => {
      const newNode = {
        id: getNodeId(), 
        type: 'textUpdater',
        data: { label: 'new entity', id: getNodeId() },
        position: {
          x: Math.random() * 1500,
          y: Math.random() * 390,
        },
        style: { width: 220, height: 200, },
      };
      setNodes((nds) =>
        nds.concat(newNode)
      );
    }, [setNodes]);

    const onLoadUpdate =() => {
      if(modelInfo.isNewOpen){
        setNodes(getData.nodes || []);
        setEdges(getData.edges || []);
        setViewport(getData.viewport)
      }
    };

    useEffect(()=> {
      if(entityInfo.isNewEntity){
        onAdd()
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
              onInit={setRfInstance}
            >
                <Background />
                <Controls showInteractive={false} />
                <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
                <Panel position="top-right">
              </Panel>
            </ReactFlow>
        </Card>
    )
}

export default () => (
  <ReactFlowProvider>
    <TaskOverview />
  </ReactFlowProvider>
);
