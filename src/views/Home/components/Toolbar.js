import React, { useState, useEffect } from 'react'
import { Card, Button } from 'components/ui'
import { Tooltip } from 'components/ui'
import NewModelDialog from '../dialogs/NewModelDialog'
import NewEntityDialog from '../dialogs/NewEntityDialog'
import AnotherNameSaveDialog from '../dialogs/AnotherNameSaveDialog'
import { useSelector, useDispatch } from 'react-redux'
import Files from 'react-files'
import { setStoreData, setModelInfo, setEntityInfo } from 'store/base/commonSlice'

const Toolbar = () => {
    const dispatch = useDispatch()
    const [IsEntityDialogOpen, setIsEntityDialogOpen] = useState(false)
    const [IsModelDialogOpen, setIsModelDialogOpen] = useState(false)
    const [IsSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [entityTitle, setEntityTitle] = useState("");
    const modelInfo = useSelector(
        (state) => state.base.common.modelInfo
    )
    const onClickToolbarBtn = (actionName) => {
        alert(`${actionName} 이 클릭되었습니다.`)
    }
    
    const storeData = useSelector(
        (state) => state.base.common.storeData
    )
    
    useEffect(()=>{
        const nodeLength = storeData.nodes?.length
        setEntityTitle(`엔터티 ${Number(nodeLength)+1}`)
    }, [storeData])
    
    /**
     * 다른 이름 저장에 값 변경에 대한 다운로드 실행
     */
    useEffect(() => {
        const exceptThings = ['', undefined]
        if(!exceptThings.includes(modelInfo.anotherSaveName)) exportJsonData(modelInfo.anotherSaveName)
    }, [modelInfo.anotherSaveName])
    /**
     * 저장
     */
    const exportJsonData = (name) => {
        if(!modelInfo.isNewModel) alert('새 모델을 생성해주세요.')
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
         })
    }

    const onClickAddEntity = () =>{
        if(!modelInfo.isNewModel){
            alert('먼저 새 모델을 작성해주세요.')
            return false;
        }
        dispatch(setEntityInfo({entityName:entityTitle, isNewEntity: true}))
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h4>도구 모음</h4>
            </div>
            <div className="mt-4">
            <NewEntityDialog data={{IsEntityDialogOpen}} onDialogClose={() => setIsEntityDialogOpen(false)}  />
            <NewModelDialog data={{IsModelDialogOpen}} onDialogClose={() => setIsModelDialogOpen(false)}  />
            <AnotherNameSaveDialog data={{IsSaveDialogOpen}} onDialogClose={() => setIsSaveDialogOpen(false)}  />
            <Tooltip title="새 모델" placement="top">
                <Button onClick={() => setIsModelDialogOpen(true)} size="sm" className="mr-1">
                    N
                </Button>
            </Tooltip>
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
            </Tooltip>
            <Tooltip title="저장" placement="top">
                <Button onClick={() => exportJsonData('dataModelPilot')} size="sm" className="mr-1">
                    S
                </Button>
            </Tooltip>
            <Tooltip title="다른 이름 저장" placement="top">
                <Button onClick={() => setIsSaveDialogOpen(true)} size="sm" className="mr-1">
                    SA
                </Button>
            </Tooltip>
            </div>
            <div className="mt-2">
            <Tooltip title="엔터티 추가" placement="top">
                <Button onClick={() => onClickAddEntity()} size="sm" className="mr-1">
                    E
                </Button>
            </Tooltip>
            <Tooltip title="식별 관계 추가" placement="top">
                <Button onClick={() => onClickToolbarBtn('R1')} size="sm" className="mr-1">
                    R1
                </Button>
            </Tooltip>
            <Tooltip title="비식별 관계 추가" placement="top">
                <Button onClick={() => onClickToolbarBtn('R2')} size="sm" className="mr-1">
                    R2
                </Button>
            </Tooltip>
            </div>
            <div className="mt-2">
            <Tooltip title="되돌리기" placement="top">
                <Button onClick={() => onClickToolbarBtn('U')} size="sm" className="mr-1">
                    UD
                </Button>
            </Tooltip>
            <Tooltip title="다시실행" placement="top">
                <Button onClick={() => onClickToolbarBtn('R')} size="sm" className="mr-1">
                    RD
                </Button>
            </Tooltip>
            </div>
        </Card>
    )
}

export default Toolbar
