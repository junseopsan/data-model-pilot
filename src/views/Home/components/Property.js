import React, { useMemo } from 'react'
import { Card, Button, Table, Tag } from 'components/ui'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'

const { Tr, Th, Td, THead, TBody } = Table


const Property = () => {
    const columns = useMemo(
        () => [
            {
                header: '순번',
                accessorKey: 'number',
            },
            {
                header: '속성명',
                accessorKey: 'name',
            },
            {
                header: '식별',
                accessorKey: 'discrimination',
            },
            {
                header: '필수',
                accessorKey: 'necessary',
            },
        ],
        []
    )

    const data = [
        {
            number: '1',
            name: 'Member',
            discrimination: true,
            necessary: false,
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card className="w-full" bodyClass="h-72 max-h-72">
            <div className="flex items-center justify-between mb-6">
                속성 영역
            </div>
            <Table >
                <THead className="sticky top-0">
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
                <TBody className="overflow-auto">
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

export default Property
