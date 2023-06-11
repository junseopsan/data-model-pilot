import React from 'react'
import { useSelector } from 'react-redux'

const ProjectDashboardHeader = () => {
    const modelName = useSelector(
        (state) => state.base.common.modelInfo.modelName
    )
    return (
        <div>
            <h4 className="mb-1">{modelName !== '' ? `모델명 : ${modelName}` : ''} </h4>
        </div>
    )
}

export default ProjectDashboardHeader
