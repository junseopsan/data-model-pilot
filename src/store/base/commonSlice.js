import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    modelName: '',
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
    },
})

export const { setCurrentRouteKey } = commonSlice.actions
export const { setModelName } = commonSlice.actions

export default commonSlice.reducer
