import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
  } from '@tanstack/react-table'
import { Table, Input } from 'components/ui'

const { Tr, Th, Td, THead, TBody } = Table

function EntityTable() {
    const columns = useMemo(
        () => [
            { header: 'Type', accessorKey: 'type',width: 50,},
            { header: 'EntityContent', accessorKey: 'entityContent' },
        ],
        []
    )
    const [data, setData] = useState(() => [
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
        "entityContent": "text"
      },
      {
        "type": "#",
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
    
    return (
        <>
            <Table compact>
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
            </Table>
        </>
    )
}

export default EntityTable;