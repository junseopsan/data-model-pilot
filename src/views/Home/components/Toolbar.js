import React, { useState, useEffect } from 'react'
import { Card, Button, Notification, toast } from 'components/ui'
import { Tooltip } from 'components/ui'
import NewModelDialog from '../dialogs/NewModelDialog'
import NewEntityDialog from '../dialogs/NewEntityDialog'
import AnotherNameSaveDialog from '../dialogs/AnotherNameSaveDialog'
import { useSelector, useDispatch } from 'react-redux'
import Files from 'react-files'
import { setStoreData, setEdgeType, setModelInfo, setEntityInfo, setIsUndo, setIsRedo} from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";
import classNames from 'classnames'

const Toolbar = () => {
    const dispatch = useDispatch()
    const [IsEntityDialogOpen, setIsEntityDialogOpen] = useState(false)
    const [IsModelDialogOpen, setIsModelDialogOpen] = useState(false)
    const [IsSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [entityTitle, setEntityTitle] = useState("");
    const [undo, setUndo] = useState(true);
    const [redo, setRedo] = useState(true);

    const modelInfo = useSelector(
        (state) => state.base.common.modelInfo
    )
    const isUndo = useSelector(
        (state) => state.base.common.isUndo
    )
    const isRedo = useSelector(
        (state) => state.base.common.isRedo
    )
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )

    
    useEffect(()=>{
        setUndo(isUndo)
    }, [isUndo])
    
    useEffect(()=>{
        setRedo(isRedo)
    }, [isRedo])
    
    /**
     * 다른 이름 저장에 값 변경에 대한 다운로드 실행
     */
    useEffect(() => {
        const exceptThings = ['', undefined]
        if(!exceptThings.includes(modelInfo.anotherSaveName)) exportJsonData(modelInfo.anotherSaveName)
    }, [modelInfo.anotherSaveName])

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
     * 다른 이름 저장
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

    const onClickUndoRedo = (type) => {
        if(type === 'U'){
            EventBus.emit("UNDO-EVENT", null);
            EventBus.emit("SHOW-MSG", '실행이 취소되었습니다.');
            return false
        }
        if(type === 'R'){
            EventBus.emit("REDO-EVENT", null);
            EventBus.emit("SHOW-MSG", '실행을 되돌렸습니다.');
            return false
        }
        return false;
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    return (
        <div className="h-full">
            {/* <div className="flex items-center justify-between mb-2">
                <h4>도구 모음</h4>
            </div> */}
            <div>
                <NewEntityDialog data={{IsEntityDialogOpen}} onDialogClose={() => setIsEntityDialogOpen(false)}  />
                <NewModelDialog data={{IsModelDialogOpen}} onDialogClose={() => setIsModelDialogOpen(false)}  />
                <AnotherNameSaveDialog data={{IsSaveDialogOpen}} onDialogClose={() => setIsSaveDialogOpen(false)}  />
                <div className={classNames('toolBarDiv')}>
                    <Tooltip title="새 모델" placement="top">
                        <Button onClick={() => setIsModelDialogOpen(true)} size="sm" className="mr-1">
                            N
                        </Button>
                        <span className={classNames('flex justify-center items-center')}>새 모델 </span>
                    </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                    <Tooltip title="열기" placement="top">
                            <Files
                                className='files-dropzone'
                                onChange={importJsonData}
                                onError={handleError}
                                accepts={[".json"]}
                                maxFileSize={10000000}
                                minFileSize={0}
                                clickable
                            >
                                <Button size="sm" className="mr-1">
                            O
                        </Button>
                        </Files>
                        <span className={classNames('flex justify-center items-center')}> 열기 </span>
                    </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                    <Tooltip title="저장" placement="top">
                        <Button onClick={() => exportJsonData('dataModelPilot')} size="sm" className="mr-1">
                            S
                        </Button>
                        <span className={classNames('flex justify-center items-center')}> 저장 </span>
                    </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                    <Tooltip title="다른 이름 저장" placement="top">
                        <Button onClick={() => exportTheOhterJsonData()} size="sm" className="mr-1">
                            SA
                        </Button>
                        <span className={classNames('flex justify-center items-center')}> 다른 이름 저장 </span>
                    </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                    <Tooltip title="엔터티 추가" placement="top">
                        <Button onClick={() => onClickAddEntity()} size="sm" className="mr-1">
                        E
                        </Button>
                        <span className={classNames('flex justify-center items-center')}>엔터티 추가</span>
                    </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                <Tooltip title="식별 관계선 선택" placement="top">
                    <Button onClick={() => onClickChangeEdge('R1')} size="sm" className="mr-1">
                    R1
                    </Button>
                    <span className={classNames('flex justify-center items-center')}>식별 관계선 선택</span>
                </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                <Tooltip title="비식별 관계선 선택" placement="top">
                    <Button onClick={() => onClickChangeEdge('R2')} size="sm" className="mr-1">
                    R2
                    </Button>
                    <span className={classNames('flex justify-center items-center')}>비식별 관계선 선택</span>
                </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                    <Tooltip title="되돌리기" placement="top">
                        <Button onClick={() => onClickUndoRedo('U')} size="sm" className="mr-1" disabled={undo}  >
                        UD
                        </Button>
                        <span className={classNames('flex justify-center items-center')}>되돌리기</span>
                    </Tooltip>
                </div>
                <div className={classNames('toolBarDiv')}>
                <Tooltip title="다시실행" placement="top">
                    <Button onClick={() => onClickUndoRedo('R')} size="sm" className="mr-1" disabled={redo}>
                    RD
                    </Button>
                    <span className={classNames('flex justify-center items-center')}>다시실행</span>
                </Tooltip>    
                </div>
            {/* 
            <div className="mt-2">
            </div>
            <div className="mt-2">
        </div> */}
        </div>
        </div>
    )
}

export default Toolbar
