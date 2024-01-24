import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Menu, Checkbox } from 'components/ui'
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
import { useDispatch, useSelector } from 'react-redux'
import { itemMenu, setItemMenu } from 'store/base/commonSlice'
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
    const [sideNav, setSideNav] = useState([]);
    const [defaulExpandKey, setDefaulExpandKey] = useState([])
    const { activedRoute } = useMenuActive(navigationTree, routeKey)
    const focusInfo = useSelector(
        (state) => state.base.common.focusInfo
    )
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
    const itemMenu = useSelector(
        (state) => state.base.common.itemMenu
    )

    useEffect(() => {
        let nav = []
        storeData.nodes?.forEach((item, key) => {
            const getItemMenu = itemMenu.filter(property => property.id === item.id)
            nav.push({
                    key: item.id,
                    title: item.data.label,
                    description: item.data.description,
                    type: 'collapse',
                    menuType: 'entity',
                    itemMenu: getItemMenu
            })
        })
        setSideNav(nav)
    }, [storeData, itemMenu])

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
                        sideNav?.length > 0 && (
                            sideNav.map((entity) => (
                                <VerticalCollapsedMenuItem
                                    key={entity.key}
                                    nav={entity}
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
                       <MenuGroup label={nav.title}>
                            {nav.subMenu.map((subNav) =>
                                subNav.subMenu.length > 0 ? (
                                    <VerticalCollapsedMenuItem
                                        key={subNav.key}
                                        entity={subNav}
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

    const onCheckbox = (e) => {
        const { name, checked } = e.target;
        console.log('e', e, name, checked);
        // useDispatch(
        //     setItemMenu()
        // )
    };

    const focusGaneratorDom = () => {
        const { focusArea, focusName, focusDescription } = focusInfo;
        let title = '';
        switch (focusArea) {
            case 'model': title = '모델명'; break;
            case 'entity': title = '엔터티명'; break;
            case 'property': title = '속성명'; break;
            default:  break;
        }
        return (
            <>
                <div className='h-5'>{title ? `${title}:` : ` `}  {focusName}</div>
                <div className='h-24 p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80'>
                    {
                        focusArea === 'property' ? 
                        <>
                            <Checkbox name='null' onClick={onCheckbox} checked>Null허용여부</Checkbox>
                            <Checkbox name='disc' onClick={onCheckbox}>식별허용여부</Checkbox>
                        </>
                        : focusDescription
                    }
                    
                </div>
            </>
        )
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
                    {focusGaneratorDom()}
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
