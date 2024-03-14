import React, { useState, useEffect, useRef } from 'react'
import { Menu, Dropdown, Input } from 'components/ui'
import { Trans } from 'react-i18next'
import { TiPlus } from "react-icons/ti";
import EventBus from "../../../utils/hooks/EventBus";
import { setEntityInfo, setItemMenu, setFocusInfo, setPropertyInfo } from 'store/base/commonSlice'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash';

const { MenuItem, MenuCollapse } = Menu

// 엔터티 영역 첫번째 Node
const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {
    const dispatch = useDispatch();
    const inputRef = useRef();
    const inputMenuNewRef = useRef();
    const inputMenusRef = useRef([]);

    const [isData, setIsData] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isInput, setIsInput] = useState({ entity: false, propertyKey: '',  isProperty: false });
    const { propertyInfo, itemMenu, storeData, focusInfo } = useSelector(state => state.base.common);

    // const openPropertyDialog = (event, entity) => {
    //     event.stopPropagation()
    //     EventBus.emit("PROPERTY-OPEN-EVENT", entity);
    // }
    // const openEntityDialog = (event, entity) => {
    //     event.stopPropagation()
    //     EventBus.emit("ENTITY-UPDATE-EVENT", entity);
    // }

    const onPropertyAdd = (e) => {
        e.stopPropagation();
        setIsData(true);
        setExpanded(true);
        setIsInput({ entity: false, propertyKey: '',  isProperty: true });
        setTimeout(() => {
            inputMenuNewRef.current.focus();
        })
    }

    const onClickEntityInfo = (e, item) => {
        e.stopPropagation();
        const { title, description, type, key } = item;
        dispatch(setEntityInfo({
            entityName: title,
            entityDescription: description,
            entityType: type,
            entityId: key
        }));
        dispatch(setFocusInfo({
            id: key,
            focusArea: 'entity',
            focusName: title,
            focusDiscription: description
        }));
    }
    
    const onClickEntity = (e) => {
        e.stopPropagation();
        setIsInput({ entity: true, propertyId: '', isProperty: false });
        setTimeout(() => {
            inputRef.current.focus();
        }, 0);
    }

    const onMenuItem = (item) => {
        dispatch(setFocusInfo({
            key: item.key,
            focusArea: 'property',
            focusName: item.title,
            focusDiscription: ''
        }))
    }

    const onClickMenuItem = (e, item, idx) => {
        e.stopPropagation();
        setIsInput({ entity: false, propertyKey: item.key, isProperty: false });
        setTimeout(() => {
            inputMenusRef.current[idx].focus();
        }, 0);
    }

    const onInputFocusOut = () => {
        if (inputRef.current.value) {
            const fined = _.find(storeData.nodes, f => f.id === nav.key);
            const node = { ...fined.data, label: inputRef.current.value };
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
        }
        setIsInput({ entity: false, propertyKey: '', isProperty: false });
    }

    const onInputFocusOutProperty = (e, menu) => {
        const { id, key } = menu;
        const { value } = e.target;

        const isCheck = _.some(itemMenu, s => s.key !== key && (s.id === id && s.title === value));
        if (propertyValidation(isCheck)) {
            if (value) {
                const list = _.map(itemMenu, item => {
                    if (item.key === key) {
                        return { ...item, title: value }
                    }
                    return item;
                });
                dispatch(setItemMenu(list));
                dispatch(setFocusInfo({ ...focusInfo, focusName: value }));
            }
        }
        setIsInput({ entity: false, propertyKey: '', isProperty: false });
    }

    const onInputFocusOutPropertyNew = (e, entity) => {
        const { value } = e.target;
        if (propertyValidation(_.some(entity.itemMenu, s=> s.title === value))) {
            if (value) {
                dispatch(
                    setPropertyInfo({
                        propertyName: value,
                        entityKey: entity.key,
                        isNewProperty: true,
                        nullCheck: false,
                        discCheck: false
                    })
                );
            }
        }
        setIsInput({ entity: false, propertyId: '', isProperty: false });
    }

    const propertyValidation = (isCheck) => {
        if (isCheck) {
            EventBus.emit("SHOW-MSG", '동일한 속성명이 존재합니다.');
        } else {
            return true;
        }
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
                            discCheck: false,
                            physical: '',
                            domain: '',
                            infoType: '',
                            dataType: ''
                        })
                    }
                })
                dispatch(setItemMenu(itemMenu.concat(itemMenus)))
            }
        }
    }, [propertyInfo]);
    
    return (
        // 엔터티 영역 
        <>
            <MenuCollapse
                label={
                    <>
                        <div className="flex flex-row items-center justify-between w-[265px]">
                            <div
                                onClick={onClickEntity}
                                className='relative transition duration-300 ease-in-out entityNavText z-index: 99 hover:text-red-700 hover:font-bold'
                            >
                                {
                                    isInput.entity ?
                                        <Input
                                            ref={inputRef}
                                            style={{ width: '240px', height: '35px' }}
                                            defaultValue={nav.title}
                                            onBlur={onInputFocusOut}
                                        />
                                    :
                                        <Trans defaults={`${nav.title}`} />
                                }
                            </div>
                            <div
                                onClick={onPropertyAdd}
                                className='relative ml-2 transition duration-300 ease-in-out z-index: 99 hover:text-red-700'
                            >
                                <TiPlus />
                            </div>
                        </div>
                    </>
                }
                key={nav.key}
                eventKey={nav.key}
                expanded={expanded}
                isData={isData}
                onClick={(e) => onClickEntityInfo(e, nav)}
                onToggle={(v) => setExpanded(v)}
            >
                {nav.itemMenu?.map((itemMenu, i) => (
                    <MenuItem eventKey={itemMenu.key} key={i} onClick={() => onMenuItem(itemMenu)}>
                        {
                            isInput.propertyKey === itemMenu.key ?
                                <Input
                                    ref={r => inputMenusRef.current[i] = r}
                                    style={{ width: '140px', height: '35px' }}
                                    defaultValue={itemMenu.title}
                                    onBlur={e => onInputFocusOutProperty(e, itemMenu)}
                                />
                            :   <span onClick={(e) => onClickMenuItem(e, itemMenu, i)}>
                                    <Trans
                                        defaults={`${itemMenu.title}`}
                                    />
                                </span>
                        }
                    </MenuItem>
                ))}
                {
                    isInput.isProperty && (
                        <MenuItem>
                            <Input
                                ref={inputMenuNewRef}
                                style={{ width: '140px', height: '35px' }}
                                defaultValue=''
                                onBlur={e => onInputFocusOutPropertyNew(e, nav)}
                            />
                        </MenuItem>
                    )
                }
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
