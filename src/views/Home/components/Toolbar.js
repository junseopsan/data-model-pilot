import React, { useState, useEffect } from 'react'
import { Card, Button } from 'components/ui'
import { Tooltip } from 'components/ui'
import NewModelDialog from './NewModelDialog'

// import Event from 'views/account/ActivityLog/components/Event'
// import TimelineAvatar from 'views/account/ActivityLog/components/TimelineAvatar'
// import { useNavigate } from 'react-router-dom'
// import isEmpty from 'lodash/isEmpty'

const onClickToolbarBtn = (actionName) => {
    alert(`${actionName} 이 클릭되었습니다.`)
}

const Toolbar = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h4>도구 모음</h4>
            </div>
            <div className="mt-4">
            <NewModelDialog data={{dialogIsOpen}} onDialogClose={() => setIsOpen(false)}  />
            <Tooltip title="새 모델" placement="top">
                <Button onClick={() => setIsOpen(true)} size="sm" className="mr-1">
                    N
                </Button>
            </Tooltip>
            <Tooltip title="열기" placement="top">
                <Button onClick={() => onClickToolbarBtn('O')} size="sm" className="mr-1">
                    O
                </Button>
            </Tooltip>
            <Tooltip title="저장" placement="top">
                <Button onClick={() => onClickToolbarBtn('S')} size="sm" className="mr-1">
                    S
                </Button>
            </Tooltip>
            <Tooltip title="다른 이름 저장" placement="top">
                <Button onClick={() => onClickToolbarBtn('SA')} size="sm" className="mr-1">
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
