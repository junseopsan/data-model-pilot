import React, { useEffect, useState, memo } from 'react'
import { Handle, Position, NodeResizeControl } from 'reactflow';
import EntityTable from './EntityTable'

const TextUpdaterNode = (props) => {
  const { data, selected } = props;
  const [text, setText] = useState("");
  const controlStyle = {
    background: 'transparent',
    border: 'none',
  };
  const ResizeIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="#ff0071"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', right: 5, bottom: 5 }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="16 20 20 20 20 16" />
        <line x1="14" y1="14" x2="20" y2="20" />
        <polyline points="8 4 4 4 4 8" />
        <line x1="4" y1="4" x2="10" y2="10" />
      </svg>
    );
  }

  useEffect(()=>{
    setText(data.label)
  }, [data])
    
  return (
    <div className="text-updater-node">
      <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
        <ResizeIcon />
      </NodeResizeControl>
      <div className="entityTable">
        <div className="px-2 h-7 updater-title opacity-80" htmlFor="text">
          {text}
        </div>
      </div>
      <EntityTable entityId={data.id} />
      {/* <Handle id="top_left" isConnectableStart={true} position={Position.Top} style={{left: 20}} type="source"/> */}
      <Handle id="top"  isConnectableStart={true} position={Position.Top} type="source" />
      {/* <Handle id="top_right" isConnectableStart={true} position={Position.Top} style={{left: 200}} type="source"/> */}
      {/* <Handle id="right_top"  isConnectableStart={true} position={Position.Right} style={{top: 12}} type="source" /> */}
      <Handle id="right"  isConnectableStart={true} position={Position.Right} type="source" />
      {/* <Handle id="right_bottom"  isConnectableStart={true} position={Position.Right} style={{top: 62}} type="source" /> */}
      {/* <Handle id="left_top"  isConnectableStart={true} position={Position.Left} style={{top: 12}} type="source" /> */}
      <Handle id="left"  isConnectableStart={true} position={Position.Left} type="source" />
      {/* <Handle id="left_bottom"  isConnectableStart={true} position={Position.Left} style={{top: 62}} type="source" /> */}
      {/* <Handle id="bottom_left" isConnectableStart={true} position={Position.Bottom} style={{left: 20}} type="source"/> */}
      <Handle id="bottom"  isConnectableStart={true} position={Position.Bottom} type="source" />
      {/* <Handle id="bottom_right" isConnectableStart={true} position={Position.Bottom} style={{left: 200}} type="source"/> */}
    </div>
  );
}
export default memo(TextUpdaterNode);
