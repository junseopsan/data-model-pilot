import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'components/ui'
import { AuthorityCheck } from 'components/shared'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import { themeConfig } from 'configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'
import useMenuActive from 'utils/hooks/useMenuActive'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { setStoreData } from 'store/base/commonSlice'
import { useDispatch } from 'react-redux'
import EventBus from "../../../utils/hooks/EventBus";

const { MenuGroup } = Menu

const VerticalMenuContent = (props) => {
    const {
        navMode = themeConfig.navMode,
        collapsed,
        routeKey,
        navigationTree = [],
        userAuthority = [],
        onMenuItemClick,
        direction = themeConfig.direction,
    } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [entity, setEntity] = useState([]);
    const [defaulExpandKey, setDefaulExpandKey] = useState([])

    const { activedRoute } = useMenuActive(navigationTree, routeKey)
    const focusInfo = useSelector(
        (state) => state.base.common.focusInfo
    )
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
    const propertyInfo = useSelector(
        (state) => state.base.common.propertyInfo
    )
    const changeEntity = useSelector(
        (state) => state.base.common.entityInfo
    )

    // useEffect(() => {
    //     EventBus.on("NEW-ENTITY-EVENT", () => {
    //         let list = []
    //         storeData.nodes?.forEach(item => {
    //             list.push({
    //                 ...item,
    //                 nav:{
    //                     key: item.id,
    //                     title: item.data.label,
    //                     description: item.data.description,
    //                     type: 'collapse',
    //                     menuType: 'entity',
    //                     itemMenu: [
    //                         // {
    //                         //     key: '1',
    //                         //     title: '아이템 1',
    //                         //     type: 'item',
    //                         //     subMenu: []
    //                         // }
    //                     ]
    //                 }
    //             })
    //             console.log('list', list)
    //         })
    //     });
    //     return () => {
    //       EventBus.off("NEW-ENTITY-EVENT");
    //     };
    //   }, []);

    useEffect(() => {
        let list = []
        storeData.nodes?.forEach(item => {
            list.push({
                    key: item.id,
                    title: item.data.label,
                    description: item.data.description,
                    type: 'collapse',
                    menuType: 'entity',
                    itemMenu: [
                        // {
                        //     key: '1',
                        //     title: '아이템 1',
                        //     type: 'item',
                        //     subMenu: []
                        // }
                    ]
            })
            console.log('list', list)
        })
        setEntity(list)
    }, [storeData])
   
    useEffect(() => {
        // entityKey: "randomnode_1700552431484"
        // propertyName: "zxczxc"
        if(propertyInfo.isNewProperty){
            const selectEntity = entity.filter(item => item.key === propertyInfo.entityKey)
            const list = selectEntity[0]?.itemMenu.push({
                key: `${propertyInfo.entityKey}`,
                title: propertyInfo.propertyName,
                type: 'item',
                subMenu: []
            })
    
            // const ssss = entity
            // debugger
            // setEntity(list)
            console.log('entity ::' , entity)
        }
        
    }, [propertyInfo])

    useEffect(() => {
        if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const getNavItem = (nav) => {
        if (nav.subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
            return (
                <VerticalSingleMenuItem
                    key={nav.key}
                    nav={nav}
                    onLinkClick={handleLinkClick}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                />
            )
        }

        if (nav.type === NAV_ITEM_TYPE_COLLAPSE) {
            return (
                <MenuGroup key={nav.key} label={`엔터티 영역`}>
                    {
                        
                        entity.length > 0 && (
                            entity.map((entityInfo) => (
                                <VerticalCollapsedMenuItem
                                    key={entityInfo.key}
                                    nav={entityInfo}
                                    onLinkClick={onMenuItemClick}
                                    sideCollapsed={collapsed}
                                    userAuthority={userAuthority}
                                    direction={direction}
                                />
                                )
                            )
                        )
                    }
                </MenuGroup>
            )
        }

        if (nav.type === NAV_ITEM_TYPE_TITLE) {
            if (nav.subMenu.length > 0) {
                return (
                    <AuthorityCheck
                        key={nav.key}
                        userAuthority={userAuthority}
                        authority={nav.authority}
                    >
                       <MenuGroup label={t(nav.translateKey) || nav.title}>
                            {nav.subMenu.map((subNav) =>
                                subNav.subMenu.length > 0 ? (
                                    <VerticalCollapsedMenuItem
                                        key={subNav.key}
                                        nav={subNav}
                                        onLinkClick={onMenuItemClick}
                                        sideCollapsed={collapsed}
                                        userAuthority={userAuthority}
                                        direction={direction}
                                    />
                                ) : (
                                    <VerticalSingleMenuItem
                                        key={subNav.key}
                                        nav={subNav}
                                        onLinkClick={onMenuItemClick}
                                        sideCollapsed={collapsed}
                                        userAuthority={userAuthority}
                                        direction={direction}
                                    />
                                )
                            )}
                        </MenuGroup>
                    </AuthorityCheck>
                )
            }
        }
    }

    return (
        <Menu
            className="px-4 pb-4"
            variant={navMode}
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaulExpandKey}
        >
            <>
                <div>
                    {navigationTree.map((nav) => getNavItem(nav))}
                </div>
                <div>
                    <div className='px-2 py-2 mt-1 mb-16 text-sm font-bold h-36 card-border card sm:px-1 md:px-2'>
                    {
                    <>
                        <div>{ focusInfo.focusArea === 'model' ? '모델명' : '엔터티명'} : { focusInfo.focusName }</div>
                        <div className='h-24 p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80'>{focusInfo.focusDescription}</div>
                    </>
                    }
                    </div>
                </div>
            </>
            
        </Menu>
    )
}

VerticalMenuContent.propTypes = {
    navMode: PropTypes.oneOf(['light', 'dark', 'themed', 'transparent']),
    collapsed: PropTypes.bool,
    routeKey: PropTypes.string,
    navigationTree: PropTypes.array,
    userAuthority: PropTypes.array,
    direction: PropTypes.oneOf(['rtl', 'ltr']),
}

export default VerticalMenuContent
