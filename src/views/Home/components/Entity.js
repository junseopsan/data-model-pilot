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


function IndeterminateCheckbox({ indeterminate, onChange, ...rest }) {
    const ref = useRef(null)
    
    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])
    
    return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />
}

const EntityArea = () => {
    const dispatch = useDispatch()
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = React.useState(() => [])
    const getData = useSelector(
        (state) => state.base.common.storeData
    )
    useEffect(()=>{
        if(getData && getData.nodes?.length > 0){
            const getTitleList = getData.nodes.map(item => item.data)
            setData(getTitleList)
        }
    },[getData])
    
    // useEffect(()=>{
    //     console.log(rowSelection)
    // },[rowSelection])

    // const onRowClick = (row => {
    // })
    
    const columns = useMemo(
        () => [
            {
                id: 'select',
                cell: ({ row }) => (
                  <div className="px-1">
                    <IndeterminateCheckbox
                      {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                      }}
                    />
                  </div>
                ),
              },
            {
                header: '엔터티 명',
                accessorKey: 'label',
            },
        ],
        []
    )
    
     const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: true, //enable row selection for all rows
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        enableMultiRowSelection: false
    })
    return (
        <Card className="" bodyClass="h-72 max-h-72 entityArea">
            <div className="flex items-center justify-between mb-6">
                엔터티 영역  
            </div>
            <Table compact >
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id} >
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
                            <Tr key={row.id}>
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
