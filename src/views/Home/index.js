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

    return (
        <div className="flex flex-col h-full">
            <DataModelHeader />
            <div className="flex flex-col h-full xl:flex-row">
                <div className="flex flex-col gap-2">
                    {/* <div className="xl:w-full h-1/2">
                        <Toolbar />
                    </div> */}
                    {/* <div className="xl:w-full h-1/2">
                        <Subject  />
                    </div> */}
                </div>
                <div className="flex flex-col flex-auto gap-2 ">
                    <TaskOverview />
                </div>
            </div>
            <div className="flex flex-row justify-between flex-auto gap-4 mt-1">
                {/* <div className="xl:w-[20%]">
                    <Entity />
                </div>
                <div className="xl:w-[60%]">
                    <Property />
                </div>
                <div className="xl:w-[20%]">
                    <DetailInfo />
                </div> */}
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
