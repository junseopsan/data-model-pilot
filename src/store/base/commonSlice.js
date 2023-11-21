import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    edgeType: '',
    isUndo: true,
    isRedo: true,
    undoRedoBtn:'',
    propertyInfo:{
        propertyName: '',
        entityKey: '',
        isNewProperty: false,
    },
    entityInfo:{
        entityName: '',
        entityDescription: '',
        isNewEntity: false,
    },
    focusInfo:{
        focusArea: '',
        focusName: '',
        focusDescription: '',
    },
    modelInfo:{
        modelName: '',
        modelDescription: '',
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
        setEdgeType: (state, action) => {
            state.edgeType = action.payload
        },
        setIsUndo: (state, action) => {
            state.isUndo = action.payload
        },
        setIsRedo: (state, action) => {
            state.isRedo = action.payload
        },
        setFocusInfo: (state, action) => {
            state.focusInfo = action.payload
        },
        setModelInfo: (state, action) => {
            state.modelInfo = action.payload
        },
        setEntityInfo: (state, action) => {
            state.entityInfo = action.payload
        },
        setPropertyInfo: (state, action) => {
            state.propertyInfo = action.payload
        },
        setStoreData: (state, action) => {
            state.storeData = action.payload
        },
    },
})

export const { setCurrentRouteKey, setEdgeType, setIsUndo, setIsRedo, setFocusInfo, setModelInfo, setEntityInfo, setPropertyInfo, setStoreData  } = commonSlice.actions

export default commonSlice.reducer
