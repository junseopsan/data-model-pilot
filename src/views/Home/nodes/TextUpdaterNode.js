import { useCallback,useEffect, useState} from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 300 };

function TextUpdaterNode({ data, isConnectable }) {
    const [text, setText] = useState("");
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);
    const onTitleChange = (e) => {
        setText(e.target.value);
    };

    useEffect(() => {
        setText(data.title)
    }, [data.title])
    
  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">
            <input id="title" name="title" value={text} onChange={onTitleChange} className="nodrag" />
        </label>
        <textarea id="content" name="content" onChange={onChange} className="nodrag" />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;