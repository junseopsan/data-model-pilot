import React, { useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch } from 'react-redux'
import { setStoreData, setModelInfo, setFocusInfo } from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";

/**
 * 새 모델 팝업
 * @param {data {IsDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const NewModelDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");

    const onChange = (e) => {
        setText(e.target.value);
    };
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    };
    const modelValidation = () => {
        if(text === '') EventBus.emit("SHOW-MSG", '모델 명을 입력해주세요.'); 
        else if(description === '') EventBus.emit("SHOW-MSG", '모델 정의를 입력해주세요.'); 
        else return true
    }
    const okayModelName = () =>{
        if(modelValidation()){
            dispatch(setModelInfo({ modelName:text, modelDescription:description, isNewModel: true }))
            dispatch(setStoreData([]))
            dispatch(setFocusInfo({ focusArea: 'model', focusName: text, focusDescription: description }))
            setText('')
            setDescription('')
            onDialogClose()
        }

    }
    const closeDialog = () => {
        setText('')
        setDescription('')
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
                <div className="mt-2">
                    <Input placeholder="모델 정의를 입력해주세요." onChange={onChangeDescription} value={description} textArea />
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