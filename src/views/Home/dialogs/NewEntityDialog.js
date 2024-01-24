import React, { useEffect, useState } from 'react'
import { Button, Dialog, Input } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setEntityInfo, setStoreData } from 'store/base/commonSlice'
import EventBus from "../../../utils/hooks/EventBus";
import cloneDeep from 'lodash/cloneDeep'

/**
 * New Node Dialog
 * @param {data {IsDialogOpen : boolean}}  팝업 오픈 여부 
 * @returns 
 */
const NewEntityDialog = ({ data, onDialogClose}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [entityLength, setEntityLength] = useState(0);

    const storeData = useSelector(
        (state) => state.base.common.storeData
    );
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
    const getNodeId = () => `randomnode_${+new Date()}`;
    const okayEntityName = () =>{
        if(entityValidation()){
            if(!data.isEntityUpdate) dispatch(setEntityInfo({entityName:text, entityDescription:description, isNewEntity: true, entityId: getNodeId()}))
            else{
                const clonedNode = cloneDeep(storeData);
                const changeNode = clonedNode.nodes.filter(item=> item.id === data.selectEntity.key)
                changeNode[0].data.label = text
                changeNode[0].data.description = description
                EventBus.emit("CHANGE-NODES", changeNode[0]);
            }
            setText('')
            setDescription('')
            onDialogClose()
        }
    }
    const closeDialog = () => {
        onDialogClose()
    }
    useEffect(() => {
        setText(data.selectEntity.title)
        setDescription(data.selectEntity.description)
    }, [data])
    
    return (
        <div>
            <Dialog
                isOpen={data.isEntityDialogOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                bodyOpenClassName="overflow-hidden"
            >
                <h5 className="mb-4">{data.isEntityUpdate ? '엔터티 수정' : '새 엔터티 작성'}</h5>
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