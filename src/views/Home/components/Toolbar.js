import React from 'react'
import { Card, Button } from 'components/ui'
// import Event from 'views/account/ActivityLog/components/Event'
// import TimelineAvatar from 'views/account/ActivityLog/components/TimelineAvatar'
// import { useNavigate } from 'react-router-dom'
// import isEmpty from 'lodash/isEmpty'

const onClickToolbarBtn = (actionName) => {
    alert(`${actionName} 이 클릭되었습니다.`)
}
const Toolbar = () => {
    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>도구 모음</h4>
            </div>
            <div className="mt-4">
                <Button onClick={() => onClickToolbarBtn('N')} size="sm" className="mr-1">
                    N
                </Button>
                <Button onClick={() => onClickToolbarBtn('O')} size="sm" className="mr-1">
                    O
                </Button>
                <Button onClick={() => onClickToolbarBtn('S')} size="sm" className="mr-1">
                    S
                </Button>
                <Button onClick={() => onClickToolbarBtn('SA')} size="sm" className="mr-1">
                    SA
                </Button>
            </div>
            <div className="mt-2">
                <Button onClick={() => onClickToolbarBtn('E')} size="sm" className="mr-1">
                    E
                </Button>
                <Button onClick={() => onClickToolbarBtn('R1')} size="sm" className="mr-1">
                    R1
                </Button>
                <Button onClick={() => onClickToolbarBtn('R2')} size="sm" className="mr-1">
                    R2
                </Button>
            </div>
            <div className="mt-2">
                <Button onClick={() => onClickToolbarBtn('+')} size="sm" className="mr-1">
                    +
                </Button>
                <Button onClick={() => onClickToolbarBtn('-')} size="sm" className="mr-1">
                    -
                </Button>
                <Button onClick={() => onClickToolbarBtn('ㅁ')} size="sm" className="mr-1">
                    ㅁ
                </Button>
            </div>
            <div className="mt-2">
                <Button onClick={() => onClickToolbarBtn('U')} size="sm" className="mr-1">
                    U
                </Button>
                <Button onClick={() => onClickToolbarBtn('R')} size="sm" className="mr-1">
                    R
                </Button>
            </div>
        </Card>
    )
}

export default Toolbar
