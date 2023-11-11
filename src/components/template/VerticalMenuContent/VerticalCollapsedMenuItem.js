import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'components/ui'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'
import { useSelector } from 'react-redux'

const { MenuItem, MenuCollapse } = Menu


const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {
    const [subMenu, setSubMenu] = useState([]);
    const [isData, setIsData] = useState(false);
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
    
    useEffect(() => {
        let list = []
        storeData.nodes?.forEach(item => {
            list.push({
                key: item.id,
                title: item.data.label,
                type: 'item',
                subMenu: []
            })
        })
        console.log('storeData list',list)
        list.length > 0 ? setIsData(true) : setIsData(false)
        setSubMenu(list)
    
    }, [storeData])
    return (
        // 엔터티   
        <MenuCollapse
            label={
                <>
                    <span>
                        <Trans
                            defaults={`${nav.title}`}
                        />
                    </span>
                </>
            }
            key={nav.key}
            eventKey={nav.key}
            expanded={false}
            isData={isData}
            className="mb-2"
        >
            {nav.itemMenu.map((itemMenu) => (
                <MenuItem eventKey={itemMenu.key}>
                    <span>
                        <Trans
                            defaults={`${itemMenu.title}`}
                        />
                    </span>
                </MenuItem>
            ))}
        </MenuCollapse>
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
                type: 'item',
                subMenu: []
            })
        })
        console.log('storeData list',list)
        setSubMenu(list)
    
    }, [storeData])

    return (
        <Dropdown
            trigger="hover"
            renderTitle={menuItem}
            placement={
                direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'
            }
        >
            {subMenu.map((subNav) => (
                <Dropdown.Item eventKey={subNav.key}>
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
    )
}

const VerticalCollapsedMenuItem = ({ sideCollapsed, ...rest }) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
