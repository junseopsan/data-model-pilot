import React, { useEffect, useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setEntityInfo, setStoreData } from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";

/**
 * New Node Dialog
 * @param {data {IsDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const NewEntityDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");

    const onChange = (e) => {
        setText(e.target.value);
    };
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    };
    const entityValidation = () => {
        if(text === '') EventBus.emit("SHOW-MSG", '엔터티 명을 입력해주세요.'); 
        else if(description === '') EventBus.emit("SHOW-MSG", '엔터티 정의를 입력해주세요.'); 
        else return true
    }
    const okayEntityName = () =>{
        if(entityValidation()){
            dispatch(setEntityInfo({entityName:text, entityDescription:description, isNewEntity: true}))
            setText('')
            setDescription('')
            onDialogClose()
        }
    }
    const closeDialog = () => {
        onDialogClose()
    }
    
    return (
        <div>
            <Dialog
                isOpen={data.IsEntityDialogOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                bodyOpenClassName="overflow-hidden"
            >
                <h5 className="mb-4">새 엔터티 작성</h5>
                <div>
                    <Input placeholder="엔터티 명을 입력해주세요." onChange={onChange} value={text} />
                </div>
                <div className="mt-2">
                    <Input placeholder="엔터티 정의를 입력해주세요." onChange={onChangeDescription} value={description} textArea />
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={closeDialog}
                    >
                        닫기
                    </Button>
                    <Button variant="solid" onClick={okayEntityName} >
                        확인
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default NewEntityDialog