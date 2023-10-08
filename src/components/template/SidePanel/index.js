import React, { useMemo, useState, useEffect } from 'react'
import classNames from 'classnames'
import { Drawer } from 'components/ui'
import { HiOutlineCog } from 'react-icons/hi'
import SidePanelContent from './SidePanelContent'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import { setPanelExpand } from 'store/theme/themeSlice'
import { useSelector, useDispatch } from 'react-redux'
import { BiUndo, BiRedo } from "react-icons/bi";
import EventBus from "../../../utils/hooks/EventBus";
import { setIsUndo, setIsRedo} from 'store/base/commonSlice'

export const SidePanel = (props) => {
    const dispatch = useDispatch()

    const { className, ...rest } = props

    const panelExpand = useSelector((state) => state.theme.panelExpand)

    const direction = useSelector((state) => state.theme.direction)

    const openPanel = () => {
        dispatch(setPanelExpand(true))
    }

    const closePanel = () => {
        dispatch(setPanelExpand(false))
        const bodyClassList = document.body.classList
        if (bodyClassList.contains('drawer-lock-scroll')) {
            bodyClassList.remove('drawer-lock-scroll', 'drawer-open')
        }
    }
    const [undo, setUndo] = useState(true);
    const [redo, setRedo] = useState(true);
    const isUndo = useSelector(
        (state) => state.base.common.isUndo
    )
    const isRedo = useSelector(
        (state) => state.base.common.isRedo
    )
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    useEffect(()=>{
        console.log(isUndo)
        setUndo(isUndo)
    }, [isUndo])
    
    useEffect(()=>{
        console.log(isRedo)
        setRedo(isRedo)
    }, [isRedo])

    const onClickUndoRedo = (type) => {
        if(!undo && type === 'U'){
            EventBus.emit("UNDO-EVENT", null);
            EventBus.emit("SHOW-MSG", '실행이 취소되었습니다.');
            return false
        }
        if(!redo && type === 'R'){
            EventBus.emit("REDO-EVENT", null);
            EventBus.emit("SHOW-MSG", '실행을 되돌렸습니다.');
            return false
        }
        return false;
    }
    const isUndodisabled = () => {
        if(undo) return 'opacity-50'
        else  return ''
    }
    const isRedodisabled = () => {
        if(redo) return 'opacity-50'
        else  return ''
    }

    return (
        <>
            <div
                className={classNames('text-2xl', className, isUndodisabled())}
                onClick={() => onClickUndoRedo('U')}
            >
                <BiUndo />
            </div>
            <div
                className={classNames('text-2xl', className, isRedodisabled())}
                onClick={() => onClickUndoRedo('R')}
            >
                <BiRedo />
            </div>
            <div
                className={classNames('text-2xl', className)}
                onClick={openPanel}
                {...rest}
            >
                <HiOutlineCog />
            </div>
            <Drawer
                title="Theme Config"
                isOpen={panelExpand}
                onClose={closePanel}
                onRequestClose={closePanel}
                placement={direction === 'rtl' ? 'left' : 'right'}
                width={375}
            >
                <SidePanelContent callBackClose={closePanel} />
            </Drawer>
        </>
    )
}

export default withHeaderItem(SidePanel)
