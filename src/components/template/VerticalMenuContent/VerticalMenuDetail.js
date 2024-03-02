import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, Input, Button} from 'components/ui'
import { setItemMenu, setModelInfo, setEntityInfo, setEdgeInfo } from 'store/base/commonSlice';
import _ from 'lodash';

const VerticalMenuDetail = () => {
  const PROPERTY_LIST = [
    { id: 'physical', text: '물리명' },
    { id: 'domain', text: '도메인명' },
    { id: 'infoType', text: '인포타입' },
    { id: 'dataType', text: '타이터타입' }
  ]
  const EDGE_LIST = [
    { id: 'firstType', text: 'Zero, One or More', type: 'ZeroOneOrMore', refY: 10.5 },
    { id: 'secondType', text: 'One or More', type: 'OneorMore', refY: 10.5 },
    { id: 'thirdType', text: 'Zero or One', type: 'ZeroOrOne', refY: 17 },
  ]
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { modelInfo, focusInfo, storeData, itemMenu } = useSelector(state => state.base.common);
  const [isInput, setIsInput] = useState(false);

  const checkboxChecked = (name, dynamicData) => {
    const { key, id } = focusInfo;
    return _.some(dynamicData, s => ((s.key || s.id) === (key || id) && s[name]));
  };

  const onCheckboxProperty = (e) => {
    const { name, checked } = e.target;
    const { key } = focusInfo;

    dispatch(setItemMenu(
      itemMenu.map(item => {
        const obj = { ...item };
        if (obj.key === key) {
          obj[name] = checked;
        }
        return obj;
      })
    ))
  };

  const onCheckboxEdge = (e) => {
    const { name, checked } = e.target;
    const { id } = focusInfo;
    const fined = _.find(storeData.edges, f => f.id === id);

    if (fined) {
      let animated = fined.animated;
      if (name === 'discCheck') {
        animated = !checked;
      }
      dispatch(setEdgeInfo({
        ...fined,
        animated,
        [name]: checked
      }));
    }
  };


  const onClickDescriptionArea = (e) => {
    e.stopPropagation();
    setIsInput(true);
    setTimeout(() => {
        inputRef.current.focus();
    }, 0);
  }

  const onInputFocusOut = () => {
    const { id, focusArea, focusName } = focusInfo;
    if (focusArea === 'entity') {
        const fined = _.find(storeData.nodes, f => f.id === id);
        const node = { ...fined.data, description: inputRef.current.value };
        dispatch(
          setEntityInfo(
            {
              entityName: node.label,
              entityDescription: node.description,
              entityType: 'update',
              entityId: node.id
            }
          )
        )
    } else if (focusArea === 'model') {
      dispatch(setModelInfo({ modelName: focusName, modelDescription: inputRef.current.value, isNewModel: true }))
    }
    setIsInput(false);
  }

  const onClickEdgeType = (edge) => {
    const { id } = focusInfo;
    const fined = _.find(storeData.edges, f => f.id === id);
    const getMarkerEnd = fined.animated === '' ? `_${edge.type}` : edge.type
    dispatch(setEdgeInfo({ ...fined, refY: edge.refY, markerEnd: getMarkerEnd, btnType: edge.type}));
  }

  const generatorDomProperty = (description) => {
    return (
      <div className='h-auto p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80'>
        <>
          <div>
            <Checkbox name='nullCheck' onClick={onCheckboxProperty} checked={checkboxChecked('nullCheck', itemMenu)}>Null허용여부</Checkbox>
            <Checkbox name='discCheck' onClick={onCheckboxProperty} checked={checkboxChecked('discCheck', itemMenu)}>식별허용여부</Checkbox>
          </div>
          {
            _.map(PROPERTY_LIST, (item, i) => (
              <div key={i} className="flex items-center mt-0 justify-left">
                <div className='w-[62px]'>
                  {item.text}
                </div>
                <div>
                <Input
                  id={item.id}
                  className="p-1 mt-1 ml-2 h-[auto] rounded-md"
                  style={{ width: '200px' }}
                  defaultValue={description}
                  onBlur={(e) => console.log('e', e.target.id)}
                  placeholder={`${item.text}을 입력해주세요.`}
                />
                </div>
              </div>
            ))
          }
        </>
      </div>
    )
  }
  const generatorDomEdge = (description) => {
    const { id } = focusInfo;
    const fined = _.find(storeData?.edges, f => f.id === id);
    return (
      <div className='h-auto p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80'>
        <>
          <div className='flex justify-around w-full py-4'>
            <Checkbox name='nullCheck' onClick={onCheckboxEdge} checked={checkboxChecked('nullCheck', storeData.edges)}>Null허용여부</Checkbox>
            <Checkbox name='discCheck' onClick={onCheckboxEdge} checked={checkboxChecked('discCheck', storeData.edges)}>식별여부</Checkbox>
          </div>
          {
            _.map(EDGE_LIST, (item, i) => (
              <div key={i} className="flex items-center justify-center mt-0">
                <Button
                  variant={fined?.btnType === item.type ? 'solid' : 'twoTone'}
                  color="red-600" size="md" className='w-[100%] text-center mt-2'
                  onClick={() => onClickEdgeType(item)}
                >
                  {item.text}
                </Button>
              </div>
            ))
          }
        </>
      </div>
    )
  }

  const generatorDomDetail = (description) => {
    let element = null;

    if (isInput) {
      element = (
        <Input
          className="p-1 mt-1 h-[100px] rounded-md"
          ref={inputRef}
          style={{ width: '300px' }}
          defaultValue={description}
          onBlur={onInputFocusOut}
          textArea
          placeholder="상세정보를 입력해주세요."
        />
      )
    } else {
      element = (
        <div onClick={onClickDescriptionArea} className='p-1 mt-1 overflow-y-scroll border border-gray-200 rounded-md opacity-80 h-[100px] hover:border-red-700 hover:border-2 hover:cursor-pointer'  >
          {description}
        </div>
      )
    }

    return element;
  }

  const focusGaneratorDom = () => {
    const { modelname, modelDescription } = modelInfo;
    const { id, focusArea, focusName, focusDiscription, focusEdgeType } = focusInfo;
    let title = '';
    let label = '';
    let description = '';
    let edgeMarkType = 'arrowclosed';
    const fined = _.find(storeData.nodes, f => f.id === id);
    if (fined) {
      label = fined.data.label;
      description = fined.data.description;
    }
    
    switch (focusArea) {
      case 'model':
        title = '모델명';
        label = modelname;
        description = modelDescription;
        break;
      case 'entity':
        title = '엔터티명';
        break;
      case 'property':
        title = '속성명';
        label = focusName;
        description = focusDiscription;
        break;
      case 'edge':
        title = null;
        label = null;
        description = null;
        edgeMarkType = focusEdgeType;
        break;
      default:  break;
    }
    return (
      <>
        <div className='h-5'>{title ? `${title}:` : ` `}  {label}</div>
        {focusArea === 'property' && generatorDomProperty(description)}
        {focusArea === 'edge' && generatorDomEdge(edgeMarkType)}
        {focusArea !== 'edge' && generatorDomDetail(description)}
      </>
    )
  }

  return focusGaneratorDom();
};

export default VerticalMenuDetail;