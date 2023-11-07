import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'

const navigationConfig = [
    {
        key: 'titleMenu',
        title: '주제 영역',
        type: 'title',
        authority: [],
        subMenu: [
            {
                key: '1',
                title: '고객',
                type: 'item',
                subMenu: []
            },
            {
                key: '2',
                title: '상품',
                type: 'item',
                subMenu: []
            },
        ],
    },
    {
        key: 'entityMenu',
        path: '',
        title: '엔터티 영역',
        type: 'collapse',
        authority: [],
        subMenu: [
            {
                key: 'entity',
                title: '엔터티',
                type: 'collapse',
                subMenu: [
                    {
                        key: 'entityMenu1',
                        title: 'Entity Menu item 1',
                        type: 'item',
                        subMenu: [],
                    },
                    {
                        key: 'entityMenu2',
                        title: 'Entity Menu item 2',
                        type: 'item',
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default navigationConfig
