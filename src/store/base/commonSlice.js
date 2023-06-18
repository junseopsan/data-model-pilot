import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    alertInfo:{
        isAlertOpen: false,
        alertText: '',
    },
    entityInfo:{
        entityName: '',
        isNewEntity: false,
    },
    modelInfo:{
        modelName: '',
        anotherSaveName: '',
        isNewModel: false,
        isNewOpen: false
    },
    storeNodes: [],
    storeEdges: [],
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
        setEntityInfo: (state, action) => {
            state.entityInfo = action.payload
        },
        setAlertInfo: (state, action) => {
            state.alertInfo = action.payload
        },
        setStoreNodes: (state, action) => {
            state.storeNodes = action.payload
        },
        setStoreEdges: (state, action) => {
            state.storeEdges = action.payload
        },
    },
})

export const { setCurrentRouteKey, setModelInfo, setEntityInfo, setStoreNodes, setStoreEdges, setAlertInfo } = commonSlice.actions

export default commonSlice.reducer
