import React, { useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch } from 'react-redux'
import { setStoreData, setModelInfo } from 'store/base/commonSlice'

/**
 * 새 모델 팝업
 * @param {data {IsDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const NewModelDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const onChange = (e) => {
        setText(e.target.value);
    };
    const okayModelName = () =>{
        dispatch(setModelInfo({modelName:text, isNewModel: true}))
        dispatch(setStoreData([]))
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
                isOpen={data.IsModelDialogOpen}
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