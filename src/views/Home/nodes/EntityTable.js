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

const EditableCell = ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <Input
            className="bg-transparent border-transparent hover:border-gray-300 focus:bg-white"
            size="sm"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
        />
    )
}

const defaultColumn = {
    cell: EditableCell
}

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip]
}

function EntityTable() {
    const columns = useMemo(
        () => [
            { header: 'Type', accessorKey: 'type' },
            { header: 'Contents', accessorKey: 'contents' },
        ],
        []
    )
    const [data, setData] = useState(() => [
      {
        "type": "1",
        "contents": "text"
      },
    ])
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
          updateData: (rowIndex, columnId, value) => {
            // Skip age index reset until after next rerender
            skipAutoResetPageIndex()
            setData(old =>
              old.map((row, index) => {
                if (index === rowIndex) {
                  return {
                    ...old[rowIndex],
                    [columnId]: value,
                  }
                }
                return row
              })
            )
          },
        },
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