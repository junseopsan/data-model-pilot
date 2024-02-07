import React, { useCallback, useState, useEffect, useMemo, useRef, useReducer  } from 'react'
import { Card } from 'components/ui'
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  // useNodes,
  // useNodeId,
  useReactFlow,
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
import { setStoreData, setIsUndo, setIsRedo, setFocusInfo, setItemMenu } from 'store/base/commonSlice'
import TextUpdaterNode from '../nodes/TextUpdaterNode';
import useUndoRedo from '../../../utils/hooks/useUndoRedo.ts';
import EventBus from "../../../utils/hooks/EventBus";
import 'reactflow/dist/style.css';
import '../../../assets/styles/reactFlow/text-updater-node.css'
import _ from 'lodash';

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const proOptions = { account: 'paid-pro', hideAttribution: true };

const TaskOverview = () => {
    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const edgeUpdateSuccessful = useRef(true);
    const { setViewport, zoomIn, zoomOut } = useReactFlow();
    const handleTransform = useCallback(() => {
      setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
    }, [setViewport]);
    
    const dispatch = useDispatch()
    const { storeData, entityInfo, modelInfo, edgeType, itemMenu } = useSelector(state => state.base.common)

    const defaultEdgeOptions = {
      type: 'smoothstep',
      // markerEnd: 'logo' ,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
      animated: edgeType
    };

    const onNodeClick = (e, element) =>{
      const description = element.data.description
      const text = element.data.label
      dispatch(setFocusInfo({ focusArea: 'entity', focusName: text, focusDescription: description, id: element.id}))
    };

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
    
    useEffect(() => {
      EventBus.on("FLOW-SAVE", () => {
        onSave()
      });
      return () => {
        EventBus.off("FLOW-SAVE");
      };
    }, []);

    // node 수정 액션
    // useEffect(() => {
    //   EventBus.on("CHANGE-NODES", (data) => {
    //     let flow = rfInstance?.toObject();
    //     if(flow && flow.nodes.length > 0){
    //       const getNodes = flow.nodes.map(item => item.id === data.id ? data : item)
    //       console.log('change nodes');
    //       setNodes(getNodes);
    //     }
    //   });
    //   return () => {
    //     EventBus.off("CHANGE-NODES");
    //   };
    // }, [rfInstance]);

    useEffect(()=> {
      dispatch(setIsUndo(canUndo))
      dispatch(setIsRedo(canRedo))
    },[canUndo, canRedo])

    useEffect(()=> {
      const { entityType, entityName, entityDescription } = entityInfo;

      switch (entityType) {
        case 'add':
          onAdd(entityInfo);
          break;
        case 'update':
          {
            let flow = rfInstance?.toObject();
            if (flow) {
              const getNodes = _.map(flow.nodes, item => {
                if (item.id === entityInfo.entityId) {
                  return { ...item, data: { ...item.data, label: entityName, description: entityDescription }}
                }
                return item;
              });
              setNodes(getNodes);
            }
          }
          break;
        case 'delete':
          // 추후 삭제 로직 
          break;
        default: break;
      }
    },[entityInfo])
    
    useEffect(()=> {
      const getEdgeType = edgeType ? '비식별관계선' : '식별관계선'
      if(edgeType !== '') triggerMessage(`${getEdgeType}이 선택되었습니다.`)
    },[edgeType])

    useEffect(()=>{
      onLoadUpdate()
    },[modelInfo])
    
    // useEffect(()=>{
    //   console.log('storeData', storeData)
    // },[storeData])

    useEffect(() => {
      onSave()
    },[nodes, edges])

    const onLoadUpdate =() => {
      if(modelInfo.isNewOpen){
        setNodes(storeData.nodes || []);
        setEdges(storeData.edges || []);
      }
    };    

    const onSave = useCallback((type) => {
      if (rfInstance) {
        const flow = rfInstance.toObject();
        console.log('flow ::', flow)
        dispatch(setStoreData(flow))
      }
      
    }, [rfInstance]);
    
    const onAdd = useCallback((data) => {
      const newNode = {
        id: data.entityId, 
        type: 'textUpdater',
        data: { label: data.entityName, description: data.entityDescription, id: data.entityId },
        itemMenu:[],
        position: {
          x: Math.random() * 1500,
          y: Math.random() * 390,
        },
        style: { width: 220, height: 200, },
      };
      takeSnapshot();
      setNodes((nds) => nds.concat(newNode))
    }, [setNodes, takeSnapshot]);

    const onConnect = (cont) => {
      propertyCopy(cont);
      takeSnapshot();
      setEdges((eds) => addEdge(cont, eds));
    };

    const onEdgeUpdate = (oldEdge, newEdge) => {
      propertyCopy(newEdge);
      setEdges((eds) => updateEdge(oldEdge, newEdge, eds));
    };

    const onEdgeUpdateStart = useCallback(() => {
      edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    }, []);

    const propertyCopy = (item) => {
      // source = 시작ID, target = 도착ID
      const { source, target } = item;

      // 시작한 엔터티의 식별체크가 Y인 리스트
      const discList = _.filter(itemMenu, f => (f.id === source && f.discCheck));
      const targetList = _.filter(itemMenu, f => f.id === target);

      // copy할 title가 같으면 제외함
      const diffList = _.differenceBy(discList, targetList, 'title');

      const copyList = _.map(diffList, (item) => {
        return {
          ...item,
          id: target,
          key: `${target}_${item.title}`
        }
      });

      dispatch(setItemMenu([ ...itemMenu, ...copyList ]));
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
              onEdgeUpdate={onEdgeUpdate}
              onEdgeUpdateStart={onEdgeUpdateStart}
              onEdgeUpdateEnd={onEdgeUpdateEnd}
              
              style={{ backgroundColor: '#1a202c' }}

              >
                <Background />
                <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
                <Controls showZoom={false} showInteractive={false} fitViewOptions={{duration:1000}}></Controls>
                <Panel position="bottom-center">
                  <div hidden>
                    <button id="undo" disabled={canUndo} onClick={undo} />
                    <button id="redo" disabled={canRedo} onClick={redo}/>
                  </div>
                </Panel>
                <Panel position="bottom-left">
                  <div className="!relative flex flex-col justify-between !bottom-[27px]">
                    <button className="p-2 leading-[1px] font-bold text-black bg-white h-[27px] !w-[26px]" onClick={() => zoomIn({ duration: 800 })}>+</button>
                    <button className="p-2 leading-[1px] font-bold text-black bg-white h-[27px] !w-[26px]" onClick={() => zoomOut({ duration: 800 })}>-</button>
                  </div>
                </Panel>
            </ReactFlow>
        </Card>
    )
}

function ReactFlowWrapper(props) {
  const reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };
  return (
    <ReactFlowProvider>
      <TaskOverview {...props} />
    </ReactFlowProvider>
  );
}

export default ReactFlowWrapper;
