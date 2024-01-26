import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
  } from '@tanstack/react-table'
import { Table, Input } from 'components/ui';
import { useSelector } from 'react-redux'

const { Tr, Th, Td, THead, TBody } = Table

function EntityTable(props) {
    const { entityId } = props;
    const { itemMenu } = useSelector((state) => state.base.common);

    const columns = useMemo(
        () => [
            { header: 'Type', accessorKey: 'type', width: 50,},
            { header: 'EntityContent', accessorKey: 'entityContent' },
        ],
        []
    )
    const [data, setData] = useState(() => [
      {
        "id": "1",
        "type": "###",
        "entityContent": "text"
      },
    ])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const checkDom = (item) => {
        return `${item.nullCheck ? 'Null Yes ' : ''}${item.discCheck ? '식별 Yes' : ''}`
    };

    const generatorDom = () => {
        return itemMenu.filter(item => item.id === entityId).map((item, i) => (
            <div className='h-auto px-2 mt-2 border border-gray-200 rounded-md updater-title !font-light opacity-80' key={i}>
                {item.title} {checkDom(item)}
            </div>
        ))
    }
    
    return (
        <>
            {generatorDom()}
            {/* <Table compact>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id} >
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id} className={cell.id.split('_')[1]}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table> */}
        </>
    )
}

export default EntityTable;