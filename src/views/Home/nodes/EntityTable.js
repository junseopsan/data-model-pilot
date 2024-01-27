import React, { useState } from 'react'
import { useSelector } from 'react-redux'


function EntityTable(props) {
    const { entityId } = props;
    const { itemMenu } = useSelector((state) => state.base.common);
    const checkDom = (item) => {
        return `${item.nullCheck ? 'Null Yes ' : ''}${item.discCheck ? '식별 Yes' : ''}`
    };

    const generatorDom = () => {
        return itemMenu.filter(item => item.id === entityId).map((item, i) => (
            <div className='h-auto px-2 mt-1 updater-property' key={i}>
                {item.title} {checkDom(item)}
            </div>
        ))
    }
    
    return (
        <>
            {generatorDom()}
        </>
    )
}

export default EntityTable;