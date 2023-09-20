import React from 'react'
import Header from 'components/template/Header'
import SidePanel from 'components/template/SidePanel'
import UserDropdown from 'components/template/UserDropdown'
import MobileNav from 'components/template/MobileNav'
import SideNav from 'components/template/SideNav'
import View from 'views'
import { MenuItem } from 'components/ui'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from '../../components/template/VerticalMenuContent/VerticalMenuIcon'
import { Trans, useTranslation } from 'react-i18next'


const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <MenuItem key={'home'} eventKey={'home'} className="mb-2">
                <Link
                    to={'/home'}
                    className="flex items-center w-full h-full"
                >
                    <>
                    <VerticalMenuIcon icon={'home'} />
                        <span>
                            <Trans
                                i18nKey={'nav.home'}
                                defaults={'Home'}
                            />
                        </span>
                    </>
                    
                </Link>
            </MenuItem>
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

const ModernLayout = (props) => {
    return (
        <div className="flex flex-col flex-auto app-layout-modern">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="relative flex flex-col flex-auto w-full min-w-0 min-h-screen bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View {...props} />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
