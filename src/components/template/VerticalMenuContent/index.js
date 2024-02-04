import React, { useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import { Menu, Checkbox, Input} from 'components/ui'
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
import { setItemMenu, setModelInfo, setFocusInfo, setEntityInfo } from 'store/base/commonSlice'
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
    const inputRef = useRef();
    const dispatch = useDispatch();
    const [sideNav, setSideNav] = useState([]);
    const [defaulExpandKey, setDefaulExpandKey] = useState([])
    const [isInput, setIsInput] = useState(false);
    const { activedRoute } = useMenuActive(navigationTree, routeKey)
    const { focusInfo, storeData, itemMenu } = useSelector(state => state.base.common);

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

    const checkboxChecked = (name) => {
        const { key } = focusInfo;
        return itemMenu.some(s => (s.key === key && s[name]));
    };

    const onCheckbox = (e) => {
        const { name, checked } = e.target;
        const { key } = focusInfo;

        dispatch(setItemMenu(
            itemMenu.map(item => {
                const obj = { ...item };
                if (obj.key === key) {
                    obj[name] = checked;
                }
                return obj;
            })
        ))
    };

    const onClickDescriptionArea = (e) => {
        e.stopPropagation();
        setIsInput(true);
        setTimeout(() => {
            inputRef.current.focus();
        }, 0);
    }

    const onInputFocusOut = () => {
        const { id } = focusInfo;
        if(focusInfo.focusArea === 'entity'){
            const fined = _.find(storeData.nodes, f => f.id === id);
            console.log(fined)
            const node = { ...fined.data, description: inputRef.current.value };
            setIsInput(false);
            dispatch(
                setEntityInfo(
                    {
                        entityName: node.label,
                        entityDescription: node.description,
                        entityType: 'update',
                        entityId: node.id
                    }
                )
            )
        }else if(focusInfo.focusArea === 'model'){
            dispatch(setModelInfo({ modelName: focusInfo.focusName, modelDescription: inputRef.current.value, isNewModel: true }))
        }
    }

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
                {
                    focusArea === 'property' ? (
                        <div className='p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80 h-[150px]'>
                            {
                                <>
                                    <Checkbox name='nullCheck' onClick={onCheckbox} checked={checkboxChecked('nullCheck')}>Null허용여부</Checkbox>
                                    <Checkbox name='discCheck' onClick={onCheckbox} checked={checkboxChecked('discCheck')}>식별허용여부</Checkbox>
                                </>
                            }
                        </div>
                    ) : (
                        isInput ? 
                            <Input
                                className="p-1 mt-1 h-[150px] rounded-md"
                                ref={inputRef}
                                style={{ width: '300px' }}
                                defaultValue={focusDescription}
                                onBlur={onInputFocusOut}
                                textArea
                            />
                            : (
                                <div onClick={onClickDescriptionArea} className='p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80 h-[150px] hover:border-red-700 hover:border-2 hover:cursor-pointer'  >
                                    { focusDescription }
                                </div>
                            )
                    )
                }
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
                    <div className='h-[200px] px-2 py-2 mt-1 mb-16 text-sm font-bold card-border card sm:px-1 md:px-2 mb-[83px]'>
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
