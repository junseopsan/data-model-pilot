import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
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
    storeData: [],
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
        setStoreData: (state, action) => {
            state.storeData = action.payload
        },
    },
})

export const { setCurrentRouteKey, setModelInfo, setEntityInfo, setStoreData } = commonSlice.actions

export default commonSlice.reducer
