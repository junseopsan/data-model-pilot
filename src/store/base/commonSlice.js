import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    modelInfo:{
        modelName: '',
        anotherSaveName: '',
        isNewModel: false,
        isNewOpen: false
    },
    nodes: [
        {
            id: '1',
            type: 'input',
            data: { label: '121212Input Node' },
            position: { x: 250, y: 25 },
            style: { backgroundColor: '#6ede87', color: 'white' },
        },
        {
            id: '2',
            data: { label: '123123123 Node' },
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
        { id: 'e2-3', source: '2', target: '1', animated: false },
    ],
}

export const commonSlice = createSlice({
    name: 'base/common',
    initialState,
    reducers: {
        setCurrentRouteKey: (state, action) => {
            state.currentRouteKey = action.payload
        },
        setModelInfo: (state, action) => {
            state.modelInfo = action.payload
        },
        setNodes: (state, action) => {
            state.nodes = action.payload
        },
        setEdges: (state, action) => {
            state.edges = action.payload
        },
    },
})

export const { setCurrentRouteKey, setModelInfo, setNodes, setEdges } = commonSlice.actions

export default commonSlice.reducer
