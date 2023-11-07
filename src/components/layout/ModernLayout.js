import React from 'react'
import Header from 'components/template/Header'
import SidePanel from 'components/template/SidePanel'
import UserDropdown from 'components/template/UserDropdown'
import MobileNav from 'components/template/MobileNav'
import SideNav from 'components/template/SideNav'
import View from 'views'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import HomeHeaderItem from 'components/template/HomeHeaderItem'
import { Card, Button, Notification, toast } from 'components/ui'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <HomeHeaderItem />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
}

const HeaderActionsMiddle = () => {
    const modelInfo = useSelector(
        (state) => state.base.common.modelInfo
    )
    return (
        <>
            <div className={classNames('titleBox')}>
                {modelInfo.modelName}
            </div>
        </>
    )
}

const ModernLayout = (props) => {
    return (
        <div className="flex flex-col flex-auto app-layout-modern">
            <div className="flex flex-auto min-w-0">
                <div className="relative flex flex-col flex-auto w-full min-w-0 min-h-screen bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700"
                        headerEnd={<HeaderActionsStart />}
                        headerMiddle={<HeaderActionsMiddle />}

                        headerStart={<HeaderActionsEnd />}
                    />
                    <View {...props} />
                </div>
                <SideNav />
            </div>
        </div>
    )
}

export default ModernLayout
