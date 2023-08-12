import React, { memo, useEffect, useState } from 'react'
import { Handle, Position, NodeResizer } from 'reactflow';
import EntityTable from './EntityTable'
import { useDispatch, useSelector } from 'react-redux'
import { setStoreData, setUpdateData } from 'store/base/commonSlice'
import cloneDeep from 'lodash/cloneDeep'

const TextUpdaterNode = ({ data, isConnectableStart, selected}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const [nodeId, setNodeId] = useState("");
    const getData = useSelector(
      (state) => state.base.common.storeData
    )
    const handleStyle = { opacity: 0 };

    const onTitleChange = (e) => {
        setText(e.target.value);
        const clonedNode = cloneDeep(getData);
        clonedNode.nodes.filter(item=> item.id === nodeId)[0].data.label = e.target.value
        dispatch(setStoreData(clonedNode))
    };
    
    useEffect(()=>{
      setText(data.label)
      setNodeId(data.id)
    }, [])

  return (
    <div className="text-updater-node">
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
      <div className="entityTable">
        <label htmlFor="text">
            <input id="title" className="updater-title" name="title" value={text} onChange={onTitleChange} />
        </label>
        <EntityTable />
      </div>
      <Handle id="top" style={handleStyle} isConnectableStart={true} position={Position.Top} type="source" />
      <Handle id="right" style={handleStyle} isConnectableStart={true} position={Position.Right} type="source" />
      <Handle id="bottom" style={handleStyle} isConnectableStart={true} position={Position.Bottom} type="source" />
      <Handle id="left" style={handleStyle} isConnectableStart={true} position={Position.Left} type="source" />
    </div>
  );
}

export default memo(TextUpdaterNode);