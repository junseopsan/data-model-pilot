
import React, { useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch } from 'react-redux'
import { setPropertyInfo } from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";

/**
 * 엔터티 프로퍼티 추가 팝업
 * @param {data {IsDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const NewPropertyDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");

    const onChange = (e) => {
        setText(e.target.value);
    };
    const modelValidation = () => {
        if(text === '') EventBus.emit("SHOW-MSG", '속성 명을 입력해주세요.'); 
        else return true
    }
    const okayModelName = () =>{
        if(modelValidation()){
            dispatch(setPropertyInfo({propertyName:text, entityKey: data.selectEntity.key, isNewProperty: true}))
            setText('')
            onDialogClose()
        }
    }
    const closeDialog = () => {
        setText('')
        onDialogClose()
    }
    return (
        <div>
            <Dialog
                isOpen={data.IsPropertyDialogOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                bodyOpenClassName="overflow-hidden"
            >
                <h5 className="mb-4">{data.selectEntity.title} 엔터티 속성 추가</h5>
                <div>
                    <Input placeholder="속성 명을 입력해주세요." onChange={onChange} value={text} />
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

export default NewPropertyDialog