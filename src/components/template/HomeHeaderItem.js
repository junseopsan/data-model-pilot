import React, { useMemo, useState, useEffect } from 'react'
import {  Dropdown, Spinner } from 'components/ui'
import classNames from 'classnames'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import { useSelector, useDispatch } from 'react-redux'
import VerticalMenuIcon from '../../components/template/VerticalMenuContent/VerticalMenuIcon'
import { Trans } from 'react-i18next'
import { MenuItem, Tooltip } from 'components/ui'
import { Link } from 'react-router-dom'
import NewModelDialog from '../../views/Home/dialogs/NewModelDialog'
import NewEntityDialog from '../../views/Home/dialogs/NewEntityDialog'
import AnotherNameSaveDialog from '../../views/Home/dialogs/AnotherNameSaveDialog'
import EventBus from "../../utils/hooks/EventBus";
import { setStoreData, setEdgeType, setModelInfo, setEntityInfo} from 'store/base/commonSlice'
import Files from 'react-files'
import { MdFiberNew } from "react-icons/md";
import { CiSaveUp2, CiSaveUp1, CiMemoPad } from "react-icons/ci";
import { AiOutlineFolderOpen, AiOutlineMinusSquare, AiOutlineMinus, AiOutlineDash } from "react-icons/ai";


export const HomeHeaderItem = ({ className }) => {
    const [loading, setLoading] = useState(false)
    const [favoriteList, setFavoriteList] = useState([])
    const [toolbarHomeList, setToolbarHomeList] = useState([
        { index: 0, label: '신규', shortLabel: 'N', isFavorite: false}, 
        {index: 1, label: '열기', shortLabel: 'O', isFavorite: false},
        {index: 2, label: '저장', shortLabel: 'S', isFavorite: false},
        {index: 3, label: '다른 이름으로 저장', shortLabel: 'SA', isFavorite: false}
    ])
    const [toolbarModelItemList, setToolbarModelItemList] = useState([
        {index: 4, label: '엔터티 추가', shortLabel: 'E', isFavorite: false},
        {index: 5, label: '식별 관계선 선택', shortLabel: 'R1', isFavorite: false},
        {index: 6, label: '비식별 관계선 선택', shortLabel: 'R2', isFavorite: false},
        {index: 7, label: '메모 추가', shortLabel: 'MD', isFavorite: false}
    ])
    const locale = useSelector((state) => state.locale.currentLang)

    const dispatch = useDispatch()
    const [IsEntityDialogOpen, setIsEntityDialogOpen] = useState(false)
    const [IsModelDialogOpen, setIsModelDialogOpen] = useState(false)
    const [IsSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [entityTitle, setEntityTitle] = useState("");
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const modelInfo = useSelector(
        (state) => state.base.common.modelInfo
    )
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
    /**
     * 다른 이름으로 저장에 값 변경에 대한 다운로드 실행
     */
    useEffect(() => {
        const exceptThings = ['', undefined]
        if(!exceptThings.includes(modelInfo.anotherSaveName)) exportJsonData(modelInfo.anotherSaveName)
    }, [modelInfo.anotherSaveName])
    
    const onToolBarSelect = (shortLabel) => {
        if(shortLabel === 'N') setIsModelDialogOpen(true)
        if(shortLabel === 'S') exportJsonData('dataModelPilot')
        if(shortLabel === 'SA') exportTheOhterJsonData()
        if(shortLabel === 'E') onClickAddEntity()
        if(shortLabel === 'R1') onClickChangeEdge('R1')
        if(shortLabel === 'R2') onClickChangeEdge('R2')
    }

    /**
     * 즐겨찾기 버튼 클릭
     * @param {string} shortLabel 
     */
    const onFavoriteClick = (shortLabel, type) => {
        if(type === 'home'){
            const filterdItem = toolbarHomeList.filter(item => item.shortLabel === shortLabel)[0]
            filterdItem.isFavorite = !filterdItem.isFavorite
            toolbarHomeList.slice(filterdItem.index, 1, filterdItem)
            setToolbarHomeList(toolbarHomeList)
        }else{
            const filterdItem = toolbarModelItemList.filter(item => item.shortLabel === shortLabel)[0]
            filterdItem.isFavorite = !filterdItem.isFavorite
            toolbarModelItemList.slice(filterdItem.index, 1, filterdItem)
            setToolbarModelItemList(toolbarModelItemList)
        }
        const concatfavList = toolbarHomeList.concat(toolbarModelItemList)
        const favoList = concatfavList.filter(item => item.isFavorite === true).map(mapItem => ({shortLabel : mapItem.shortLabel, label: mapItem.label}))
        setFavoriteList(favoList)

        forceUpdate()
    }
    
    /**
     * 저장하기전 검사
     */
    const validEntityData = (type) => {
        const nodeLength = storeData.nodes?.length
        if(!modelInfo.isNewModel){
            EventBus.emit("SHOW-MSG", '먼저 새 모델을 작성해주세요.'); 
            return false;
        } 
        if(type === 'none' && storeData.length < 1 || type === 'none' && nodeLength < 1){
            EventBus.emit("SHOW-MSG", '엔터티를 하나 이상 추가해주세요.'); 
            return false;
        }
        return true
    }
    
    /**
     * 다른 이름으로 저장
     */
    const exportTheOhterJsonData = () => {
        if(validEntityData('none')) setIsSaveDialogOpen(true)
    }
    
    /**
     * 저장
     */
    const exportJsonData = (name) => {
        if(validEntityData('none')){
            // create file in browser
            const fileName = name;
            const json = JSON.stringify({modelTitle:modelInfo.modelName, ...storeData}, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const href = URL.createObjectURL(blob);
    
            // create "a" HTLM element with href to file
            const link = document.createElement("a");
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();
    
            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        }

    };  
    /**
     * 열기
     */
    const importJsonData = (files) => {
        const file = files[0]
        file.text()
        .then(value => {
            const result = JSON.parse(value)
            dispatch(setModelInfo({...modelInfo, modelName: result.modelTitle, isNewModel: true, isNewOpen: true}))
            delete result.modelTitle
            dispatch(setStoreData(result))
            // dispatch(setModelInfo({...modelInfo, isNewModel: false, isNewOpen: false}))
         })
    }

    /**
     * 엔터티 추가
     */
    const onClickAddEntity = () =>{
        if(validEntityData('pass')) dispatch(setEntityInfo({entityName:entityTitle, isNewEntity: true}))
    }

    /**
     * 관계선 선택
     * @param {R1 : 식별 관계선, R2 : 비식별 관계선} type 
     */
    const onClickChangeEdge = (type) => {
        if(validEntityData('none')){
            if(type === 'R1') dispatch(setEdgeType(false)) 
            else if(type === 'R2') dispatch(setEdgeType(true))
        }
        
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }
    

    const selectedHomeMenu = (
        <div className={classNames(className, 'flex items-center')}>
            {loading ? (
                <Spinner size={20} />
            ) : (
                <>
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
            )}
        </div>
    )
    const selectedModelMenu = (
        <div className={classNames(className, 'flex items-center')}>
            {loading ? (
                <Spinner size={20} />
            ) : (
            <>
                <MenuItem key={'ModelItem'} eventKey={'ModelItem'} className="mb-2">
                    <>
                    <VerticalMenuIcon icon={'table'} />
                        <span>
                            <Trans
                                i18nKey={'nav.ModelItem'}
                                defaults={'ModelItem'}
                            />
                        </span>
                    </>
                    
                </MenuItem>
            </>
            )}
        </div>
    )
    const getIconItem = (item) => {
        return (
            <>
                <div
                    className={classNames('text-2xl header-action-item header-action-item-hoverable')}
                >
                    { item === 'N' && (<MdFiberNew/>) }
                    { item === 'O' && (<AiOutlineFolderOpen/>) }
                    { item === 'O' && (<AiOutlineFolderOpen/>) }
                    { item === 'S' && (<CiSaveUp1/>) }
                    { item === 'SA' && (<CiSaveUp2/>) }
                    { item === 'E' && (<AiOutlineMinusSquare/>) }
                    { item === 'R1' && (<AiOutlineMinus/>) }
                    { item === 'R2' && (<AiOutlineDash/>) }
                    { item === 'MD' && (<CiMemoPad/>) }
                </div>
            </>
        )
    }

    return (
        <>
            <div>
                <NewEntityDialog data={{IsEntityDialogOpen}} onDialogClose={() => setIsEntityDialogOpen(false)}  />
                <NewModelDialog data={{IsModelDialogOpen}} onDialogClose={() => setIsModelDialogOpen(false)}  />
                <AnotherNameSaveDialog data={{IsSaveDialogOpen}} onDialogClose={() => setIsSaveDialogOpen(false)}  />
                <NewModelDialog data={{IsModelDialogOpen}} onDialogClose={() => setIsModelDialogOpen(false)}  />
            </div>
            <Dropdown renderTitle={selectedHomeMenu} placement="bottom-end">
                {toolbarHomeList.map((toolbar, key) => (
                    <div className={classNames('menu_box')} key={toolbar.index}>
                        {
                            (toolbar.label === '신규') && (
                                <>
                                    <Dropdown.Item
                                    className="justify-between mb-1 menu_items"
                                    eventKey={toolbar.shortLabel}
                                    key={toolbar.index}
                                    onClick={() => onToolBarSelect(toolbar.shortLabel)}
                                    >
                                        <div className={classNames('toolBarDiv')}>
                                            <div className={classNames('w-[80px]')}>
                                                {
                                                    toolbar.label === '신규' && (
                                                        <div className={classNames('MenuIconBox')} >
                                                            <MdFiberNew/>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <span className={classNames('flex w-full justify-start items-center ml-1')}>{toolbar.label} </span>
                                        </div>
                                    </Dropdown.Item>
                                    <div className={classNames('favoriteBox') }>
                                        <img
                                            onClick={() => onFavoriteClick(toolbar.shortLabel, 'home')}
                                            src={`${toolbar.isFavorite ? '/img/favoriteFull.png' : '/img/favorite.png'}`}
                                            alt={`favorite`}
                                        />
                                    </div>
                                </>
                            )
                        }
                        {
                            (toolbar.label === '열기') && (
                                <>
                                    <Files
                                        className='files-dropzone'
                                        onChange={importJsonData}
                                        onError={handleError}
                                        accepts={[".json"]}
                                        maxFileSize={10000000}
                                        minFileSize={0}
                                        clickable
                                    >
                                        <Dropdown.Item
                                            className="justify-between mb-1 menu_items"
                                            eventKey={toolbar.shortLabel}
                                            key={toolbar.index}
                                        >
                                            <div className={classNames('toolBarDiv openTool')}>
                                                <div className={classNames('w-[80px]')}>
                                                    <div className={classNames('MenuIconBox')} >
                                                        <AiOutlineFolderOpen/>
                                                    </div>
                                                </div>
                                                <span className={classNames('flex w-full justify-start items-center ml-1')}>{toolbar.label} </span>
                                            </div>
                                        </Dropdown.Item> 
                                    </Files>
                                    <div className={classNames('favoriteBox')}>
                                        <img
                                            onClick={() => onFavoriteClick(toolbar.shortLabel, 'home')}
                                            src={`${toolbar.isFavorite ? '/img/favoriteFull.png' : '/img/favorite.png'}`}
                                            alt={`favorite`}
                                        />
                                    </div>
                                </>
                            )
                        }
                        {
                            (!['신규', '열기'].includes(toolbar.label)) && (
                                <>
                                    <Dropdown.Item
                                    className="justify-between mb-1 menu_items"
                                    eventKey={toolbar.shortLabel}
                                    key={toolbar.index}
                                    onClick={() => onToolBarSelect(toolbar.shortLabel)}
                                    >
                                        <div className={classNames('toolBarDiv')}>
                                            <div className={classNames('w-[80px]')}>
                                                {
                                                    toolbar.shortLabel === 'S' &&(
                                                        <div className={classNames('MenuIconBox')} >
                                                            <CiSaveUp1/>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    toolbar.shortLabel === 'SA' &&(
                                                        <div className={classNames('MenuIconBox')} >
                                                            <CiSaveUp2/>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <span className={classNames('flex w-full justify-start items-center ml-1')}>{toolbar.label} </span>
                                        </div>
                                    </Dropdown.Item>
                                    <div className={classNames('favoriteBox')}>
                                        <img
                                            onClick={() => onFavoriteClick(toolbar.shortLabel, 'home')}
                                            src={`${toolbar.isFavorite ? '/img/favoriteFull.png' : '/img/favorite.png'}`}
                                            alt={`favorite`}
                                        />
                                    </div>
                                </>
                            )
                        }
                    </div>
                ))}
            </Dropdown>
            <Dropdown renderTitle={selectedModelMenu} placement="bottom-end">
                {toolbarModelItemList.map((toolbar, key) => (
                    <div className={classNames('menu_box')} key={toolbar.index}>
                        {
                            (!['신규', '열기'].includes(toolbar.label)) && (
                                <>
                                    <Dropdown.Item
                                    className="justify-between mb-1 menu_items"
                                    eventKey={toolbar.shortLabel}
                                    key={toolbar.index}
                                    onClick={() => onToolBarSelect(toolbar.shortLabel)}
                                    >
                                        <div className={classNames('toolBarDiv')}>
                                            <div className={classNames('w-[80px]')}>
                                                {
                                                    toolbar.shortLabel === 'E' && ( 
                                                        <div className={classNames('MenuIconBox')} > <AiOutlineMinusSquare/> </div>
                                                    )
                                                }
                                                {
                                                    toolbar.shortLabel === 'R1' && ( 
                                                        <div className={classNames('MenuIconBox')} > <AiOutlineMinus/> </div>
                                                    )
                                                }
                                                {
                                                    toolbar.shortLabel === 'R2' && ( 
                                                        <div className={classNames('MenuIconBox')} > <AiOutlineDash/> </div>
                                                    )
                                                }
                                                {
                                                    toolbar.shortLabel === 'MD' && ( 
                                                        <div className={classNames('MenuIconBox')} > <CiMemoPad/> </div>
                                                    )
                                                }
                                            </div>
                                            <span className={classNames('flex w-full justify-start items-center ml-1')}>{toolbar.label} </span>
                                        </div>
                                    </Dropdown.Item>
                                    <div className={classNames('favoriteBox')}>
                                        <img
                                            onClick={() => onFavoriteClick(toolbar.shortLabel, 'modelItem')}
                                            src={`${toolbar.isFavorite ? '/img/favoriteFull.png' : '/img/favorite.png'}`}
                                            alt={`favorite`}
                                        />
                                    </div>
                                </>
                            )
                        }
                    </div>
                ))}
            </Dropdown>
            <div className={classNames('text-2xl ltr:mr-2 rtl:ml-2 favoriteHeaderBox')} >
                {
                    favoriteList.map(item => {
                        return (
                            <div onClick={() => onToolBarSelect(item.shortLabel)} className={classNames('text-2xl header-action-item header-action-item-hoverable')}>
                                <Tooltip title={item.label} placement="bottom">
                                { item.shortLabel === 'N' && (<MdFiberNew/>) }
                                { item.shortLabel === 'O' && 
                                    (
                                        <Files
                                            className='files-dropzone'
                                            onChange={importJsonData}
                                            onError={handleError}
                                            accepts={[".json"]}
                                            maxFileSize={10000000}
                                            minFileSize={0}
                                            clickable
                                        >
                                            <AiOutlineFolderOpen/>
                                        </Files>
                                    ) 
                                }
                                { item.shortLabel === 'S' && (<CiSaveUp1/>) }
                                { item.shortLabel === 'SA' && (<CiSaveUp2/>) }
                                { item.shortLabel === 'E' && (<AiOutlineMinusSquare/>) }
                                { item.shortLabel === 'R1' && (<AiOutlineMinus/>) }
                                { item.shortLabel === 'R2' && (<AiOutlineDash/>) }
                                { item.shortLabel === 'MD' && (<CiMemoPad/>) }
                                </Tooltip>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default withHeaderItem(HomeHeaderItem)
