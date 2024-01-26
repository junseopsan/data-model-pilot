import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'components/ui'
import { Trans } from 'react-i18next'
import { TiPlus } from "react-icons/ti";
import EventBus from "../../../utils/hooks/EventBus";
import { setItemMenu, setFocusInfo } from 'store/base/commonSlice'
import { useSelector, useDispatch } from 'react-redux'

const { MenuItem, MenuCollapse } = Menu

// 엔터티 영역 첫번째 Node
const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {
    const dispatch = useDispatch()
    const [isData, setIsData] = useState(false);
    // const [itemMenu, setItemMenu] = useState([]);
    const propertyInfo = useSelector(
        (state) => state.base.common.propertyInfo
    )
    const itemMenu = useSelector(
        (state) => state.base.common.itemMenu
    )
    const entityInfo = useSelector(
        (state) => state.base.common.entityInfo
    )
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
    const openPropertyDialog = (event, entity) => {
        event.stopPropagation()
        EventBus.emit("PROPERTY-OPEN-EVENT", entity);
    }
    const openEntityDialog = (event, entity) => {
        event.stopPropagation()
        EventBus.emit("ENTITY-UPDATE-EVENT", entity);
    }
    const onMenuItem = (item) => {
        dispatch(setFocusInfo({
            focusArea: 'property',
            focusName: item.title,
            focusDiscription: ''
        }))
    }

    useEffect(() => {
        nav.itemMenu?.length > 0 ? setIsData(true) : setIsData(false)
    }, [nav])
    
    useEffect(() => {
        if(propertyInfo.isNewProperty){
            if(nav.key === propertyInfo.entityKey){
                let itemMenus = []
                storeData.nodes?.forEach((item, key) => {
                    if(item.id === propertyInfo.entityKey){
                        itemMenus.push({   
                            id: item.id,
                            key: `${propertyInfo.entityKey}_${propertyInfo.propertyName}`,
                            title: propertyInfo.propertyName,
                            type: 'item',
                            subMenu: [],
                            nullCheck: false,
                            discCheck: false
                        })
                    }
                })
                dispatch(setItemMenu(itemMenu.concat(itemMenus)))
            }
        }
    }, [propertyInfo])
    
    return (
        // 엔터티 영역 
        <>
            <MenuCollapse
                label={
                    <>
                        <div className="flex flex-row items-center justify-between w-[65px]">
                            <div onClick={(event) => { openEntityDialog(event, nav)}} className='relative transition duration-300 ease-in-out z-index: 99 hover:text-red-700 hover:font-bold'>
                                <Trans defaults={`${nav.title}`} />
                            </div>
                            <div onClick={(event) => { openPropertyDialog(event, nav)}} className='relative ml-2 transition duration-300 ease-in-out z-index: 99 hover:text-red-700'>
                                <TiPlus /> 
                            </div>
                        </div>
                    </>
                }
                key={nav.key}
                eventKey={nav.key}
                expanded={true}
                isData={isData}
                className="mb-2"
            >
                {nav.itemMenu?.map((itemMenu, i) => (
                    <MenuItem eventKey={itemMenu.key} key={i} onClick={() => onMenuItem(itemMenu)}>
                        <span>
                            <Trans
                                defaults={`${itemMenu.title}`}
                            />
                        </span>
                    </MenuItem>
                ))}
            </MenuCollapse>
        </>
    )
}

const CollapsedItem = ({ entity, onLinkClick, userAuthority, direction }) => {
    const menuItem = (
        <MenuItem key={entity.key} eventKey={entity.key} className="mb-2">
        </MenuItem>
    )
    const [subMenu, setSubMenu] = useState([]);
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )

    useEffect(() => {
        let list = []
        storeData.nodes?.forEach(item => {
            list.push({
                key: item.id,
                title: item.data.label,
                description: item.data.description,
                type: 'item',
                subMenu: []
            })
        })
        setSubMenu(list)
    
    }, [storeData])

    return (
        <>
            <Dropdown
                trigger="hover"
                renderTitle={menuItem}
                placement={
                    direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'
                }
            >
                {subMenu.map((subNav) => (
                    <Dropdown.Item eventKey={subNav.key} key={subNav.key}>
                        {subNav.title ? (
                            <span>
                                ㅌㅌㅌㅌ
                                <Trans
                                    defaults={`${subNav.title}`}
                                />
                            </span>
                        ) : (
                            <span>
                                ㅋㅋㅋㅋ
                                <Trans
                                    defaults={`${subNav.title}`}
                                />
                            </span>
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </>
     
    )
}

const VerticalCollapsedMenuItem = ({ sideCollapsed, ...rest }) => {
    return sideCollapsed ? (
        <>
            <CollapsedItem {...rest} />
        </>
    ) : (
        <>
            <DefaultItem {...rest} />
        </>
    )
}

export default VerticalCollapsedMenuItem
