import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    edgeType: '',
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
    storeProperties: [
        {
            id:'',
            contents:[
                {
                    number: '',
                    typeName: '',
                    discrimination: '',
                    isNecessary: ''
                }
            ]
        }
    ],
}

export const commonSlice = createSlice({
    name: 'base/common',
    initialState,
    reducers: {
        setCurrentRouteKey: (state, action) => {
            state.currentRouteKey = action.payload
        },
        setEdgeType: (state, action) => {
            state.edgeType = action.payload
        },
        setModelInfo: (state, action) => {
            state.modelInfo = action.payload
        },
        setEntityInfo: (state, action) => {
            state.entityInfo = action.payload
        },
        setProperties: (state, action) => {
            state.storeProperties = action.payload
        },
        setStoreData: (state, action) => {
            state.storeData = action.payload
        },
    },
})

export const { setCurrentRouteKey, setEdgeType, setModelInfo, setEntityInfo, setProperties, setStoreData } = commonSlice.actions

export default commonSlice.reducer
