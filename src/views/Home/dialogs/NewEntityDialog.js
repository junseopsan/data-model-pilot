import React, { useEffect, useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setEntityInfo } from 'store/base/commonSlice'

/**
 * New Node Dialog
 * @param {data {IsDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const NewEntityDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const storeNodes = useSelector(
        (state) => state.base.common.storeNodes
    )
    const [text, setText] = useState("");
    useEffect(()=>{
        const nodeLength = storeNodes.length
        setText(`엔터티 ${Number(nodeLength)+1}`)
    }, [storeNodes])


    const onChange = (e) => {
        setText(e.target.value);
    };
    const okayEntityName = () =>{
        dispatch(setEntityInfo({entityName:text, isNewEntity: true}))
        onDialogClose()
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
                <h5 className="mb-4">새 엔티티 작성</h5>
                <div>
                    <Input placeholder="엔티티 명을 입력해주세요." onChange={onChange} value={text} />
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