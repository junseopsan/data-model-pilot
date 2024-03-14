import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Menu, Input } from 'components/ui'
import { TiPlus } from "react-icons/ti";
import { AuthorityCheck } from 'components/shared'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import VerticalMenuDetail from './VerticalMenuDetail';
import { themeConfig } from 'configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'
import useMenuActive from 'utils/hooks/useMenuActive'
import { useSelector, useDispatch } from 'react-redux'
import { setEntityInfo } from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";
import _ from 'lodash';

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
    } = props;
    
    const dispatch = useDispatch();
    const [sideNav, setSideNav] = useState([]);
    const [defaulExpandKey, setDefaulExpandKey] = useState([]);
    const [etInput, setEtInput] = useState(false);
    const { activedRoute } = useMenuActive(navigationTree, routeKey)
    const { storeData, itemMenu, modelInfo } = useSelector(state => state.base.common);
    const inputRef = useRef();

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

    const oBlurEtInput = (e) => {
        const { value } = e.target;
        const getNodeId = `randomnode_${new Date()}`;
        if (modelInfo.modelName) {
            if (value) {
                dispatch(
                    setEntityInfo(
                        {
                            entityName: e.target.value,
                            entityDescription: '',
                            entityType: 'add',
                            entityId: getNodeId
                        }
                    )
                );
            }            
        } else {
            EventBus.emit("SHOW-MSG", '먼저 새 모델을 작성해주세요.');
        }
        setEtInput(false);
    };

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
                <MenuGroup
                    key={nav.key}
                    label={
                        <div className="flex flex-row items-center justify-between">
                            엔터티 영역
                            <div
                                className='relative ml-2 transition duration-300 ease-in-out z-index: 99 hover:text-red-700'
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setEtInput(true);
                                    setTimeout(() => {
                                        inputRef.current.focus();
                                    });
                                }}
                            >
                                <TiPlus />
                            </div>
                        </div>
                        
                    }
                >
                    {
                        etInput && (
                            <Input
                                ref={inputRef}
                                onBlur={oBlurEtInput}
                            />
                        )
                    }
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
                    <div className='h-auto px-2 py-2 mt-1 text-sm font-bold card-border card sm:px-1 md:px-2 mb-[83px]'>
                        <VerticalMenuDetail />
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
