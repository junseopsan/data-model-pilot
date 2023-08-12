import React, { useState, useEffect } from 'react'
// import {  useSelector } from 'react-redux'
import DataModelHeader from './components/DataModelHeader'
import Toolbar from './components/Toolbar'
import Subject from './components/Subject'
import DetailInfo from './components/DetailInfo'
import TaskOverview from './components/TaskOverview'
import Entity from './components/Entity'
import Property from './components/Property'
import './index.css'

const Home = () => {
    // const [isAlertOpen, setIsAlertOpen] = useState(false)
    // const [alertText, setAlertText] = useState(false)

    // const getAlertInfo = useSelector((state) => state.base.common.alertInfo)

    // useEffect(()=>{
    //     console.log(getAlertInfo)
        // setIsAlertOpen(getAlertInfo.isAlertOpen)
        // setAlertText(getAlertInfo.alertText)
    // },[getAlertInfo])

    return (
        <div className="flex flex-col h-full gap-4">
            <DataModelHeader />
            <div className="flex flex-col gap-4 xl:flex-row h-1/2">
                <div className="flex flex-col gap-4">
                    <div className="xl:w-full h-1/2">
                        <Toolbar />
                    </div>
                    <div className="xl:w-full h-1/2">
                        <Subject  />
                    </div>
                </div>
                <div className="flex flex-col flex-auto gap-4 ">
                    <TaskOverview />
                </div>
            </div>
            <div className="flex flex-row justify-between flex-auto gap-4 mt-1">
            <div className="xl:w-[20%]">
                    <Entity />
                </div>
                <div className="xl:w-[60%]">
                    <Property />
                </div>
                <div className="xl:w-[20%]">
                    <DetailInfo />
                </div>
            </div>
            {/* { isAlertOpen && (
                <div class="backdrop" >
                    <div className='alert'>
                        <Alert triggerByToast closable rounded>{alertText ? alertText : ''}</Alert>
                    </div>
                </div>
            )
            } */}
        </div>
    )
}

export default Home
