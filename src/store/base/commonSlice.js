import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    modelName: '',
    nodes: [
        {
            id: '1',
            type: 'input',
            data: { label: 'Input Node' },
            position: { x: 250, y: 25 },
            style: { backgroundColor: '#6ede87', color: 'white' },
        },
        {
            id: '2',
            data: { label: <div>111 22 33 55 Default Node</div> },
            position: { x: 100, y: 125 },
            style: { backgroundColor: '#ff0072', color: 'white' },
        },
        {
            id: '3',
            type: 'output',
            data: { label: 'Output Node' },
            position: { x: 250, y: 250 },
            style: { backgroundColor: '#6865A5', color: 'white' },
        },
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3', animated: true },
    ],
}

export const commonSlice = createSlice({
    name: 'base/common',
    initialState,
    reducers: {
        setCurrentRouteKey: (state, action) => {
            state.currentRouteKey = action.payload
        },
        setModelName: (state, action) => {
            state.modelName = action.payload
        },
        setNodes: (state, action) => {
            state.nodes = action.payload
        },
        setEdges: (state, action) => {
            state.edges = action.payload
        },
    },
})

export const { setCurrentRouteKey, setModelName, setNodes, setEdges } = commonSlice.actions

export default commonSlice.reducer
