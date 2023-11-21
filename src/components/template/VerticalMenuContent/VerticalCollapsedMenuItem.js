import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'components/ui'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { TiPlus } from "react-icons/ti";
import EventBus from "../../../utils/hooks/EventBus";

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {
    const [subMenu, setSubMenu] = useState([]);
    const [isData, setIsData] = useState(false);
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
                     
    const openPropertyDialog = (entity) => {
        console.log('entityTitle', entity)
        EventBus.emit("PROPERTY-OPEN-EVENT", entity);
    }
    
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
        list.length > 0 ? setIsData(true) : setIsData(false)
        setSubMenu(list)
    
    }, [storeData])
    
    return (
        // 엔터티  
        <>
            <MenuCollapse
                label={
                    <>
                    <div className="flex flex-row items-center justify-center justify-between w-[65px]">
                        <div>
                            <Trans
                                defaults={`${nav.title}`}
                            /> 
                        </div>
                        <div onClick={() => { openPropertyDialog(nav)}} className='relative transition duration-300 ease-in-out z-index: 10 hover:text-red-700 '>
                            <TiPlus />
                        </div>
                    </div>
                    </>
                }
                key={nav.key}
                eventKey={nav.key}
                expanded={false}
                isData={isData}
                className="mb-2"
            >
                {nav.itemMenu.map((itemMenu) => (
                    <MenuItem eventKey={itemMenu.key} key={itemMenu.key} >
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

const CollapsedItem = ({ nav, onLinkClick, userAuthority, direction }) => {
    const menuItem = (
        <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
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
                                <Trans
                                    defaults={`${subNav.title}`}
                                />
                            </span>
                        ) : (
                            <span>
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
    const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false)
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
