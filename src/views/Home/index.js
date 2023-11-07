import React, { useState, useEffect } from 'react'
// import {  useSelector } from 'react-redux'
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
            <div className="flex flex-col h-full xl:flex-row">
                <div className="flex flex-col gap-2">
                </div>
                <div className="flex flex-col flex-auto gap-2 ">
                    <TaskOverview />
                </div>
            </div>
        </div>
    )
}

export default Home
