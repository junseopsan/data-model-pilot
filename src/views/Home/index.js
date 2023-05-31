import React, { useState, useEffect } from 'react'

import { Loading } from 'components/shared'
import { useDispatch, useSelector } from 'react-redux'
import DataModelHeader from './components/DataModelHeader'
import { getProjectDashboardData } from './store/dataSlice'
import Toolbar from './components/Toolbar'
import Subject from './components/Subject'
import DetailInfo from './components/DetailInfo'
import TaskOverview from './components/TaskOverview'
import Entity from './components/Entity'
import Property from './components/Property'
const Home = () => {
    const [dataModelName, setDataModelName] = useState('Data Model Pilot')

    return (
        <div className="flex flex-col h-full gap-4">
            <DataModelHeader data={dataModelName} />
            <div className="flex flex-col gap-4 xl:flex-row">
                <div className="flex flex-col gap-4">
                    <div className="xl:w-full">
                        <Toolbar  />
                    </div>
                    <div className="xl:w-full">
                        <Subject  />
                    </div>
                </div>
                <div className="flex flex-col flex-auto gap-4">
                    <TaskOverview />
                </div>
            </div>
            <div className="flex flex-row justify-between flex-auto gap-4">
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
        </div>
    )
}

export default Home
