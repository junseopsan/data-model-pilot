import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

export default ({
    fromX,
    fromY,
    fromPosition,
    toX,
    toY,
    toPosition,
    connectionLineType,
    connectionLineStyle,
    }) => {

    const edgeType = useSelector(
        (state) => state.base.common.edgeType
    )

    return (
    <g>
        <path
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        className={ edgeType ? 'animated' : '' } 
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
        />
        <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
    );
};