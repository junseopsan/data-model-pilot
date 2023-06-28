import React, { memo, useEffect, useState } from 'react'
import { Handle, Position, NodeResizer } from 'reactflow';
import EntityTable from './EntityTable'
import { useDispatch, useSelector } from 'react-redux'
import { setStoreNodes } from 'store/base/commonSlice'
import cloneDeep from 'lodash/cloneDeep'

const TextUpdaterNode = ({ data, isConnectable, selected}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const [nodeId, setNodeId] = useState("");
    const storeNodes = useSelector(
      (state) => state.base.common.storeNodes
  )
    const onTitleChange = (e) => {
        setText(e.target.value);
        console.log(e.target.value)
        console.log(nodeId)
        
        const getNode = storeNodes.filter(item => item.id === nodeId)
        const clonedNode = cloneDeep(getNode);
        clonedNode[0].data.title = e.target.value
        console.log(clonedNode)
        // dispatch(setStoreNodes([]))
        const list =[...clonedNode, ...storeNodes.filter(item => item.id !== nodeId)].sort((a, b) => {return a.id.split('-')[1]-b.id.split('-')[1]});

        dispatch(setStoreNodes(list))
    };
    useEffect(()=>{
      setText(data.title)
      console.log(data)
      setNodeId(data.id)

      // storeNodes[0].data.title = '111'
    }, [])

  return (
    <div className="text-updater-node">
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="entityTable">
        <label htmlFor="text">
            {/* <span>{{nodeId}}</span> */}
            <input id="title" className="updater-title" name="title" value={text} onChange={onTitleChange} />
        </label>
        <EntityTable />
        {/* <textarea id="content" name="content"  className="nodrag" /> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default memo(TextUpdaterNode);