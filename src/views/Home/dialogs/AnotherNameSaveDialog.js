import React, { useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setModelInfo } from 'store/base/commonSlice'

/**
 * 다른 이름 저장 팝업
 * @param {data {IsSaveDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const AnotherNameSavelDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const modelInfo = useSelector(
        (state) => state.base.common.modelInfo
    )

    const onChange = (e) => {
        setText(e.target.value);
    };
    const okayAnotherSaveName = () =>{
        dispatch(setModelInfo({...modelInfo, anotherSaveName: text}))
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
                isOpen={data.IsSaveDialogOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                bodyOpenClassName="overflow-hidden"
            >
                <h5 className="mb-4">다른 이름 저장</h5>
                <div>
                    <Input placeholder="새로운 파일명을 입력해주세요." onChange={onChange} value={text} />
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={closeDialog}
                    >
                        닫기
                    </Button>
                    <Button variant="solid" onClick={okayAnotherSaveName} >
                        저장
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default AnotherNameSavelDialog