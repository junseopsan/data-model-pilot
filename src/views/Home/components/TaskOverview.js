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
  applyEdgeChanges
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
  const dispatch = useDispatch()
    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const [markerEnd, setMarkerEnd] = useState({ type: 'arrow' });
    const [markerStart, setMarkerStart] = useState({type: ''});
    const edgeUpdateSuccessful = useRef(true);
    const [edgeSelected, setEdgeSelected] = useState({ selected: false, id: '' });
    const { setViewport, zoomIn, zoomOut } = useReactFlow();
    const { storeData, entityInfo, modelInfo, edgeType, itemMenu, edgeInfo, focusInfo } = useSelector(state => state.base.common)
    const FitViewOption = {
      minZoom: 1,
      maxZoom: 1,
      duration: 500,
    }
    const defaultEdgeOptions = {
      type: 'smoothstep',
      markerStart: markerStart,
      markerEnd: markerEnd,
      style: { strokeWidth: 2 },
      animated: edgeType,
      edgeType: '',
      nullCheck: false,
      discCheck: edgeType ? false : true
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

    const onEdgesChange = useCallback(
      (changes) => {
        setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
        setMarkerEnd({ type: MarkerType.ArrowClosed })
        if(changes[0].selected) setEdgeSelected(changes[0])
        else {
          setEdgeSelected({ selected: false, id: '' })
          dispatch(setFocusInfo({ focusArea: 'model', focusName: modelInfo.modelName, focusDescription: modelInfo.modelDescription }))
        } 
      },
      [setEdges],
    );

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
      dispatch(setFocusInfo({ focusArea: 'edge', id: element.id, focusEdgeType: element.markerEnd.type, nullCheck: element.nullCheck}))
    };

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

    useEffect(() => {
      if (edgeInfo.id) {
        if(edgeInfo.animated && edgeInfo.nullCheck) setMarkerStart('..ZeroOrOne')
        
        setMarkerEnd(edgeInfo.markerEnd)
        setMarkerStart(edgeInfo.markerStart)
        const edgeList = _.uniqBy(_.concat(edgeInfo, storeData?.edges), 'id');
        setEdges(edgeList);
      }
    }, [edgeInfo]);
    
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

    const markerPathD = (edge, type) => {
      const { nullCheck, discCheck } = edge;
      let d = ""
      // 동그라미에 다리가 두개인 속성
      const typeOne = "M20.7,17.5l-9.2-7l9-7c0.2-0.1,0.4-0.3,0.4-0.6c0-0.2,0-0.5-0.1-0.6c-0.1-0.2-0.3-0.3-0.6-0.4c-0.3,0-0.5,0-0.6,0.2L11,8.7V0.9C11,0.4,10.6,0,10.1,0S9.2,0.4,9.2,0.9v1.5C8.4,1.9,7.5,1.7,6.5,1.7C2.9,1.7,0,5.6,0,10.5c0,4.9,2.9,8.8,6.6,8.8c0.9,0,1.8-0.3,2.7-0.8v1.6c0,0.5,0.4,0.9,0.9,0.9s0.9-0.4,0.9-0.9v-7.8l8.5,6.6c0.2,0.2,0.3,0.2,0.6,0.2c0.3,0,0.5-0.2,0.7-0.3l0.1-0.1C21.2,18.3,21.1,17.9,20.7,17.5z M7.2,17.4c-0.2,0-0.5,0.1-0.7,0.1c-2.6,0-4.8-3.2-4.8-7c0-3.8,2.2-7,4.8-7c1,0,1.9,0.4,2.7,1.2v11.6C8.5,16.9,7.9,17.3,7.2,17.4z"
      //  동그라미만 있는 속성
      const typeTwo = "M11.9,0.4c-0.1-0.1-0.1-0.2-0.3-0.3C11.5,0.1,11.3,0,11.2,0c0,0-0.1,0-0.1,0c-0.5,0-0.9,0.4-0.9,0.9v1.6C9.3,2,8.3,1.7,7.2,1.7c-4,0-7.2,3.9-7.2,8.8s3.2,8.8,7.2,8.8c1.1,0,2.1-0.3,3-0.8v1.6c0,0.5,0.4,0.9,0.9,0.9s0.9-0.4,0.9-0.9c0,0,0,0,0-0.1c0-0.1,0-0.1,0-0.2c0-0.1,0-0.2,0-0.3c0-0.1,0-0.3,0-0.4c0-0.2,0-0.4,0-0.5c0-0.2,0-0.4,0-0.6c0-0.2,0-0.5,0-0.7c0-0.3,0-0.5,0-0.8c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-1c0-0.3,0-0.7,0-1c0-0.3,0-0.7,0-1c0-0.3,0-0.7,0-1c0-0.3,0-0.7,0-1c0-0.3,0-0.7,0-1c0-0.3,0-0.7,0-1c0-0.3,0-0.6,0-1c0-0.3,0-0.6,0-0.9c0-0.3,0-0.6,0-0.9c0-0.3,0-0.5,0-0.8c0-0.2,0-0.5,0-0.7c0-0.2,0-0.4,0-0.7c0-0.2,0-0.4,0-0.6c0-0.2,0-0.3,0-0.5c0-0.2,0-0.4,0-0.6C12,0.8,12,0.6,11.9,0.4z M7.2,17.5c-3,0-5.4-3.1-5.4-7c0-3.8,2.5-7,5.4-7c1.1,0,2.1,0.4,3,1.2v11.6C9.3,17.1,8.3,17.5,7.2,17.5z"
      // 다리만 두개인 속성
      const typeThree = "M13,18.5c0-0.3-0.1-0.5-0.4-0.6L2.3,10.6l10.3-7.2c0.4-0.2,0.5-0.7,0.2-1.2c-0.2-0.4-0.7-0.5-1.2-0.2L1.7,9V0.9C1.7,0.4,1.3,0,0.9,0C0.4,0,0,0.4,0,0.9v19.5c0,0.5,0.4,0.9,0.9,0.9c0.5,0,0.9-0.4,0.9-0.9v-8.1l9.9,6.9c0.2,0.2,0.4,0.2,0.6,0.2c0.1,0,0.4,0,0.7-0.3C13,18.9,13.1,18.7,13,18.5z"
      // markerStart null true, 비식별 관계선
      const typeFour = "M0,1c0,0.2,0,0.4,0,0.6c0,0.2,0,0.3,0,0.5c0,0.2,0,0.4,0,0.6C0,3,0,3.2,0,3.4s0,0.5,0,0.7c0,0.3,0,0.5,0,0.8s0,0.6,0,0.9c0,0.3,0,0.6,0,0.9c0,0.4,0,0.7,0,1c0,0.3,0,0.7,0,1s0,0.7,0,1c0,0.3,0,0.7,0,1c0,0.3,0,0.7,0,1s0,0.7,0,1c0,0.3,0,0.7,0,1c0,0.4,0,0.7,0,1c0,0.3,0,0.6,0,0.9c0,0.3,0,0.6,0,0.9c0,0.3,0,0.5,0,0.8c0,0.2,0,0.5,0,0.7c0,0.2,0,0.4,0,0.6c0,0.1,0,0.3,0,0.5c0,0.1,0,0.3,0,0.4c0,0.1,0,0.2,0,0.3s0,0.1,0,0.2s0,0.1,0,0.1C0,20.6,0.4,21,0.9,21s0.9-0.4,0.9-0.9v-1.6c0.9,0.5,1.9,0.8,3,0.8c4,0,7.2-3.9,7.2-8.8S8.8,1.7,4.8,1.7c-1.1,0-2.1,0.3-3,0.8V0.9C1.8,0.4,1.4,0,0.9,0L0.8,0C0.7,0,0.5,0.1,0.4,0.1C0.2,0.2,0.2,0.3,0.1,0.4C0,0.6,0,0.8,0,1z M1.8,16.3V4.7c0.9-0.8,1.9-1.2,3-1.2c2.9,0,5.4,3.2,5.4,7c0,3.9-2.4,7-5.4,7C3.7,17.5,2.7,17.1,1.8,16.3z"
      
      if (nullCheck && !discCheck) {
        d = typeFour;
      } else {
        switch (type) {
          // 식별관계선은 _ 로 표시한다.
          case '_ZeroOneOrMore': d = typeOne; break;
          case '_OneorMore': d = typeTwo; break;
          case '_ZeroOrOne': d = typeThree; break;
          // 비식별관계선은 .. 로 표시한다.
          case '..ZeroOneOrMore': d = typeOne; break;
          case '..OneorMore': d = typeThree; break;
          case '..ZeroOrOne': d = typeTwo; break;
        }
      }
      
      return d;
    }

    const EdgeItem = ({ edges }) => {
      const { id, nullCheck } = focusInfo
      // if(nullCheck) setMarkerStart(typeTwo)
      return (
        <>
          {
            _.map(edges, (item, i) => (
              <div key={`${i}`} >
                <svg strokeWidth="20" style={{ position: 'absolute', top: 0, left: 0, zIndex: '9999' }}>
                  <defs>
                    <marker
                      id={`..ZeroOrOne`}
                      viewBox="0 0 40 40"
                      markerWidth={20}
                      markerHeight={20}
                      refX={18}
                      refY={item.refY}
                      orient="auto"
                    >
                      <path style={{fill: '#B1B1B7'}} d={markerPathD(item, '..ZeroOrOne')}/>
                    </marker>
                  </defs>
                </svg>
                <svg  strokeWidth="20" style={{ position: 'absolute', top: 0, left: 0, zIndex: '9999' }}>
                  <defs>
                    <marker
                      id={item.markerEnd}
                      viewBox="0 0 40 40"
                      markerWidth={20}
                      markerHeight={20}
                      refX={item.refX}
                      refY={item.refY}
                      orient="auto"
                    >
                      <path style={{fill:'#B1B1B7'}} d={markerPathD(item, item.markerEnd)}/>
                    </marker>
                  </defs>
                </svg>
              </div>
            ))
          }
        </>
      )
    }
    
    return (
        <Card className="w-full h-full" bodyClass="h-full">
           <EdgeItem edges={storeData?.edges} />
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
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
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
  return (
    <ReactFlowProvider>
      <TaskOverview {...props} />
    </ReactFlowProvider>
  );
}

export default ReactFlowWrapper;
