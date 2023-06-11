import React, { useState, useEffect } from 'react'
import { Card, Button } from 'components/ui'
import { Tooltip } from 'components/ui'
import NewModelDialog from './NewModelDialog'
import AnotherNameSaveDialog from './AnotherNameSaveDialog'
import { useSelector, useDispatch } from 'react-redux'
import Files from 'react-files'
import { setEdges, setNodes, setModelInfo } from 'store/base/commonSlice'

// import Event from 'views/account/ActivityLog/components/Event'
// import TimelineAvatar from 'views/account/ActivityLog/components/TimelineAvatar'
// import { useNavigate } from 'react-router-dom'
// import isEmpty from 'lodash/isEmpty'

const Toolbar = () => {
    const dispatch = useDispatch()
    const [IsDialogOpen, setIsDialogOpen] = useState(false)
    const [IsSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const modelInfo = useSelector(
        (state) => state.base.common.modelInfo
    )
    const onClickToolbarBtn = (actionName) => {
        alert(`${actionName} 이 클릭되었습니다.`)
    }
    const realNode = useSelector(
        (state) => state.base.common.nodes
    )
    const realEdge = useSelector(
        (state) => state.base.common.edges
    )
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
        // create file in browser
        const fileName = name;
        const json = JSON.stringify({nodes:[...realNode], edges:[...realEdge]}, null, 2);
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
            dispatch(setNodes(result.nodes))
            dispatch(setEdges(result.edges))

            dispatch(setModelInfo({...modelInfo, isNewOpen: true}))

         })
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
            <NewModelDialog data={{IsDialogOpen}} onDialogClose={() => setIsDialogOpen(false)}  />
            <AnotherNameSaveDialog data={{IsSaveDialogOpen}} onDialogClose={() => setIsSaveDialogOpen(false)}  />
            <Tooltip title="새 모델" placement="top">
                <Button onClick={() => setIsDialogOpen(true)} size="sm" className="mr-1">
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
                <Button onClick={() => onClickToolbarBtn('E')} size="sm" className="mr-1">
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
