import React, { useCallback, memo, useEffect, useState } from 'react'
import { Handle, Position, NodeResizer } from 'reactflow';
import EntityTable from './EntityTable'
import { useDispatch, useSelector } from 'react-redux'
import { setStoreData, setUpdateData } from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";

const TextUpdaterNode = (props) => {
    const { data, selected } = props;
    const [text, setText] = useState("");
    // const storeData = useSelector(
    //   (state) => state.base.common.storeData
    // )
    // const [, updateState] = useState();
    // const forceUpdate = useCallback(()=> updateState({}), []) 
    useEffect(()=>{
      setText(data.label)
    }, [data])

    // function useForceUpdate(){
    //   const [value, setValue] = useState(0); // integer state
    //   return () => setValue(value => value + 1); // update state to force render
    //   // A function that increment 👆🏻 the previous state like here 
    //   // is better than directly setting `setValue(value + 1)`
    // }

    // const forceUpdate = useForceUpdate();
    // useEffect(()=>{

    //   const list = storeData.nodes.map(item => item.data.label)
    //   // list.forEach(item => {
    //   //   console.log(item)
    //   // });
    //   // debugger
    //   forceUpdate()
    // }, [data])

  return (
    <div className="!h-auto text-updater-node">
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
      <div className="entityTable">
        <div className="px-2 border-gray-200 rounded-md h-7 updater-title opacity-80" htmlFor="text">
          {text}
        </div>
        <EntityTable entityId={data.id} />
      </div>
      <Handle id="top_left" isConnectableStart={true} position={Position.Top} style={{left: 20}} type="source"/>
      <Handle id="top"  isConnectableStart={true} position={Position.Top} type="source" />
      <Handle id="top_right" isConnectableStart={true} position={Position.Top} style={{left: 200}} type="source"/>
      <Handle id="right_top"  isConnectableStart={true} position={Position.Right} style={{top: 12}} type="source" />
      <Handle id="right"  isConnectableStart={true} position={Position.Right} type="source" />
      <Handle id="right_bottom"  isConnectableStart={true} position={Position.Right} style={{top: 62}} type="source" />
      <Handle id="left_top"  isConnectableStart={true} position={Position.Left} style={{top: 12}} type="source" />
      <Handle id="left"  isConnectableStart={true} position={Position.Left} type="source" />
      <Handle id="left_bottom"  isConnectableStart={true} position={Position.Left} style={{top: 62}} type="source" />
      <Handle id="bottom_left" isConnectableStart={true} position={Position.Bottom} style={{left: 20}} type="source"/>
      <Handle id="bottom"  isConnectableStart={true} position={Position.Bottom} type="source" />
      <Handle id="bottom_right" isConnectableStart={true} position={Position.Bottom} style={{left: 200}} type="source"/>
    </div>
  );
}

export default TextUpdaterNode;