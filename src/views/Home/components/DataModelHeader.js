import React from 'react'

const ProjectDashboardHeader = ({ data }) => {
    return (
        <div>
            <h4 className="mb-1">모델명 : {data}</h4>
            {/* <p>You have {data.taskCount} tasks on hand.</p> */}
        </div>
    )
}

export default ProjectDashboardHeader
