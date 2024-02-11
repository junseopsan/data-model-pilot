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
      // markerEnd: 'logo', <-- 이것을 선택하면 edge 타입이 커스텀 svg 파일로 변경됨.
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
      animated: edgeType
    };

    /**
     * 엔터티 클릭 이벤트
     * @param {*} e 
     * @param {*} element 
     */
    const onNodeClick = (e, element) =>{
      const description = element.data.description
      const text = element.data.label
      dispatch(setFocusInfo({ focusArea: 'entity', focusName: text, focusDescription: description, id: element.id}))
    };
    
    /**
     * 관계선 클릭 이벤트
     * @param {*} e 
     * @param {*} element 
     */
    const onEdgeClick = (e, element) =>{
      dispatch(setFocusInfo({ focusArea: 'edge', id: element.id, focusEdgeType: element.markerEnd.type}))
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
        // <style>.cls-1{fill:none;stroke:#000;stroke-linecap:round;stroke-miterlimit:10;stroke-width:6px;}</style>
        <Card className="w-full h-full" bodyClass="h-full">
            <svg style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                <marker
                  id="logo"
                  viewBox="0 0 40 40"
                  markerHeight={20}
                  markerWidth={20}
                  refX={20}
                  refY={40}
                >
                  <path
                    d="M35 23H25C23.8954 23 23 23.8954 23 25V35C23 36.1046 23.8954 37 25 37H35C36.1046 37 37 36.1046 37 35V25C37 23.8954 36.1046 23 35 23Z"
                    stroke="#1A192B"
                    stroke-width="2"
                    fill="white"
                  />
                  <path
                    d="M35 3H25C23.8954 3 23 3.89543 23 5V15C23 16.1046 23.8954 17 25 17H35C36.1046 17 37 16.1046 37 15V5C37 3.89543 36.1046 3 35 3Z"
                    stroke="#FF0072"
                    stroke-width="2"
                    fill="white"
                  />
                  <path
                    d="M15 23H5C3.89543 23 3 23.8954 3 25V35C3 36.1046 3.89543 37 5 37H15C16.1046 37 17 36.1046 17 35V25C17 23.8954 16.1046 23 15 23Z"
                    stroke="#1A192B"
                    stroke-width="2"
                    fill="white"
                  />
                  <path
                    d="M15 3H5C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H15C16.1046 17 17 16.1046 17 15V5C17 3.89543 16.1046 3 15 3Z"
                    stroke="#1A192B"
                    stroke-width="2"
                    fill="white"
                  />
                  <path
                    d="M17 13C18.6569 13 20 11.6569 20 10C20 8.34315 18.6569 7 17 7C15.3431 7 14 8.34315 14 10C14 11.6569 15.3431 13 17 13Z"
                    fill="white"
                  />
                  <path
                    d="M23 13C24.6569 13 26 11.6569 26 10C26 8.34315 24.6569 7 23 7C21.3431 7 20 8.34315 20 10C20 11.6569 21.3431 13 23 13Z"
                    fill="white"
                  />
                  <path
                    d="M30 20C31.6569 20 33 18.6569 33 17C33 15.3431 31.6569 14 30 14C28.3431 14 27 15.3431 27 17C27 18.6569 28.3431 20 30 20Z"
                    fill="white"
                  />
                  <path
                    d="M30 26C31.6569 26 33 24.6569 33 23C33 21.3431 31.6569 20 30 20C28.3431 20 27 21.3431 27 23C27 24.6569 28.3431 26 30 26Z"
                    fill="white"
                  />
                  <path
                    d="M17 33C18.6569 33 20 31.6569 20 30C20 28.3431 18.6569 27 17 27C15.3431 27 14 28.3431 14 30C14 31.6569 15.3431 33 17 33Z"
                    fill="white"
                  />
                  <path
                    d="M23 33C24.6569 33 26 31.6569 26 30C26 28.3431 24.6569 27 23 27C21.3431 27 20 28.3431 20 30C20 31.6569 21.3431 33 23 33Z"
                    fill="white"
                  />
                  <path
                    d="M30 25C31.1046 25 32 24.1046 32 23C32 21.8954 31.1046 21 30 21C28.8954 21 28 21.8954 28 23C28 24.1046 28.8954 25 30 25Z"
                    fill="#1A192B"
                  />
                  <path
                    d="M17 32C18.1046 32 19 31.1046 19 30C19 28.8954 18.1046 28 17 28C15.8954 28 15 28.8954 15 30C15 31.1046 15.8954 32 17 32Z"
                    fill="#1A192B"
                  />
                  <path
                    d="M23 32C24.1046 32 25 31.1046 25 30C25 28.8954 24.1046 28 23 28C21.8954 28 21 28.8954 21 30C21 31.1046 21.8954 32 23 32Z"
                    fill="#1A192B"
                  />
                  <path opacity="0.35" d="M22 9.5H18V10.5H22V9.5Z" fill="#1A192B" />
                  <path opacity="0.35" d="M29.5 17.5V21.5H30.5V17.5H29.5Z" fill="#1A192B" />
                  <path opacity="0.35" d="M22 29.5H18V30.5H22V29.5Z" fill="#1A192B" />
                  <path
                    d="M17 12C18.1046 12 19 11.1046 19 10C19 8.89543 18.1046 8 17 8C15.8954 8 15 8.89543 15 10C15 11.1046 15.8954 12 17 12Z"
                    fill="#1A192B"
                  />
                  <path
                    d="M23 12C24.1046 12 25 11.1046 25 10C25 8.89543 24.1046 8 23 8C21.8954 8 21 8.89543 21 10C21 11.1046 21.8954 12 23 12Z"
                    fill="#FF0072"
                  />
                  <path
                    d="M30 19C31.1046 19 32 18.1046 32 17C32 15.8954 31.1046 15 30 15C28.8954 15 28 15.8954 28 17C28 18.1046 28.8954 19 30 19Z"
                    fill="#FF0072"
                  />
                </marker>
              </defs>
            </svg>
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
              onEdgeClick={onEdgeClick}
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
