import React, { useCallback, useState, useEffect, useMemo  } from 'react'
import { Card } from 'components/ui'
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  // useNodes,
  // useNodeId,
  // useReactFlow,
  Panel,
  MiniMap, Controls, 
  Background,
  MarkerType,
  ConnectionMode,
  ConnectionLineType,
  // useOnSelectionChange
} from 'reactflow';
import ConnectionLine from './ConnectionLine';
import { Notification, toast } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setStoreData, setIsUndo, setIsRedo, setFocusInfo } from 'store/base/commonSlice'
import TextUpdaterNode from '../nodes/TextUpdaterNode';
import useUndoRedo from '../../../utils/hooks/useUndoRedo.ts';
import EventBus from "../../../utils/hooks/EventBus";
import 'reactflow/dist/style.css';
import '../../../assets/styles/reactFlow/text-updater-node.css'

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const getNodeId = () => `randomnode_${+new Date()}`;
const proOptions = { account: 'paid-pro', hideAttribution: true };

const TaskOverview = () => {
    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedEdges, setSelectedEdges] = useState([]);
    const dispatch = useDispatch()
    const storeData = useSelector(
      (state) => state.base.common.storeData
    )
    const entityInfo = useSelector(
      (state) => state.base.common.entityInfo
    )
    const modelInfo = useSelector(
      (state) => state.base.common.modelInfo
    )
    const edgeType = useSelector(
      (state) => state.base.common.edgeType
    )
    const defaultEdgeOptions = {
      type: 'smoothstep',
      // markerEnd: 'logo' ,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
      animated: edgeType
    };

    const onNodeClick = (event, element) =>{
      console.log('element', element)
      const description = element.data.description
      const text = element.data.label
      dispatch(setFocusInfo({focusArea: 'entity', focusName: text, focusDescription: description}))
    } ;

    // useOnSelectionChange({
    //   onChange: ({ nodes, edges }) => {
    //     setSelectedNodes(nodes.map((node) => node.id)[0]);
    //     setSelectedEdges(edges.map((edge) => edge.id));
    //     console.log(selectedNodes)
    //   },
    // });
    
    useEffect(() => {
      EventBus.on("SHOW-MSG", (msg) => {
        triggerMessage(msg)
      });
      return () => {
        EventBus.off("SHOW-MSG");
      };
    }, []);

    useEffect(() => {
      EventBus.on("UNDO-EVENT", () => {
        const undoBtn = document.getElementById("undo")
        undoBtn.click()
      });
      return () => {
        EventBus.off("UNDO-EVENT");
      };
    }, []);

    useEffect(() => {
      EventBus.on("REDO-EVENT", () => {
        const redoBtn = document.getElementById("redo")
        redoBtn.click()
      });
      return () => {
        EventBus.off("REDO-EVENT");
      };
    }, []);

    useEffect(()=> {
      dispatch(setIsUndo(canUndo))
      dispatch(setIsRedo(canRedo))
    },[canUndo, canRedo])

    useEffect(()=> {
      const getNewEntity = entityInfo
      if(entityInfo.isNewEntity){
        onAdd(entityInfo)
      } 
    },[entityInfo])
    
    useEffect(()=> {
      const getEdgeType = edgeType ? '비식별관계선' : '식별관계선'
      if(edgeType !== '') triggerMessage(`${getEdgeType}이 선택되었습니다.`)
    },[edgeType])

    useEffect(()=>{
      onLoadUpdate()
    },[modelInfo])

    useEffect(() => {
      onSave()
    },[nodes, edges ])
    
    const onConnect = useCallback(
      (connection) => {
        takeSnapshot();
        // 👇 make adding edges undoable
        setEdges((edges) => addEdge(connection, edges));
      },
      [setEdges, takeSnapshot]
    );

    const onSave = useCallback(() => {
      if (rfInstance) {
        const flow = rfInstance.toObject();
        dispatch(setStoreData(flow))
      }
    }, [rfInstance]);
    
    const onAdd = useCallback((data) => {
      const newNode = {
        id: getNodeId(), 
        type: 'textUpdater',
        data: { label: data.entityName, description: data.entityDescription, id: getNodeId() },
        position: {
          x: Math.random() * 1500,
          y: Math.random() * 390,
        },
        style: { width: 220, height: 200, },
      };
      takeSnapshot();
      setNodes((nds) =>
        nds.concat(newNode)
      );
      // EventBus.emit("NEW-ENTITY-EVENT");
    }, [setNodes, takeSnapshot]);

    const onLoadUpdate =() => {
      if(modelInfo.isNewOpen){
        setNodes(storeData.nodes || []);
        setEdges(storeData.edges || []);
      }
    };

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

    const FitViewOption = {
      minZoom: 1,
      maxZoom: 1,
      duration: 500,
    }

    const triggerMessage = (msg) => {
      toast.push(
          <Notification type="info" duration={2000}>
              {msg || '네!'}
          </Notification>,
          {
              placement: 'top-center',
          }
      )
    }
    
    return (
        <Card className="w-full h-full" bodyClass="h-full">
           <ReactFlow 
              nodes={nodes}
              edges={edges}
              style={{ backgroundColor: '#1a202c' }}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setRfInstance}
              
              proOptions={proOptions}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={defaultEdgeOptions}

              connectionLineType={ConnectionLineType.SmoothStep}
              connectionMode={ConnectionMode.Loose}
              connectionLineComponent={ConnectionLine}
              fitView
              fitViewOptions={FitViewOption}
              onNodeClick={onNodeClick}

              >
                <Background />
                <Controls showInteractive={false} />
                <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
                <Panel position="top-right">
              </Panel>
              <Panel position="bottom-center">
              <div hidden>
                <button id="undo" disabled={canUndo} onClick={undo} />
                <button id="redo" disabled={canRedo} onClick={redo}/>
              </div>
            </Panel>
            </ReactFlow>
        </Card>
    )
}

function ReactFlowWrapper(props) {
  return (
    <ReactFlowProvider>
      <TaskOverview {...props} />
    </ReactFlowProvider>
  );
}

export default ReactFlowWrapper;
