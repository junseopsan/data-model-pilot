import React, { useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setEdges, setModelInfo, setNodes } from 'store/base/commonSlice'

const NewModelDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const onChange = (e) => {
        setText(e.target.value);
    };
    const okayModelName = () =>{
        dispatch(setModelInfo({modelName:text, isNewModel: true}))
        dispatch(setNodes([]))
        dispatch(setEdges([]))
        setText('')
        onDialogClose()
    }
    const closeDialog = () => {
        setText('')
        onDialogClose()
    }
    return (
        <div>
            <Dialog
                isOpen={data.dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                bodyOpenClassName="overflow-hidden"
            >
                <h5 className="mb-4">새 모델 작성</h5>
                <div>
                    <Input placeholder="모델 명을 입력해주세요." onChange={onChange} value={text} />
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={closeDialog}
                    >
                        닫기
                    </Button>
                    <Button variant="solid" onClick={okayModelName} >
                        확인
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default NewModelDialog