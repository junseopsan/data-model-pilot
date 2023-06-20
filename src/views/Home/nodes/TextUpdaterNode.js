import React, { useEffect, useState } from 'react'
import { Handle, Position } from 'reactflow';
import EntityTable from './EntityTable'

function TextUpdaterNode({ data, isConnectable }) {
    const [text, setText] = useState("");
    
    const onTitleChange = (e) => {
        setText(e.target.value);
    };
    useEffect(()=>{
      setText(data.title)
    }, [])

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">
            <input id="title" className="updater-title" name="title" value={text} onChange={onTitleChange} />
        </label>
        <EntityTable />
        {/* <textarea id="content" name="content"  className="nodrag" /> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;