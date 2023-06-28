import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Card, Table, Checkbox } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'

const { Tr, Th, Td, THead, TBody } = Table

const EntityArea = () => {
    const [selectedRow, setSelectedRow] = useState('')
    const storeNodes = useSelector(
        (state) => state.base.common.storeNodes
    )
    const [data, setData] = React.useState(() => [])
    
    useEffect(()=>{
        const getTitleList = storeNodes.map( item => ({ title:item.data.title }))
        setData(getTitleList)
    },[storeNodes])

    const onRowClick = (row => {
        console.log(row.id)
        // setSelectedRow(row.id)
    })
    
    const columns = useMemo(
        () => [
            {
                header: '엔터티 명',
                accessorKey: 'title',
            },
        ],
        []
    )
    
     const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        // setSelectedRow('')
    }, []);

    return (
        <Card className="" bodyClass="h-72 max-h-72 entityArea">
            <div className="flex items-center justify-between mb-6">
                엔터티 영역 
            </div>
            <Table compact>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}  className={row.id === selectedRow ? 'rowOn' : ''}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
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
        </Card>
    )
}

export default EntityArea
