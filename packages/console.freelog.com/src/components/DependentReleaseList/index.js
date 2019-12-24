import Item from './Item.vue';
import DepDialog from './DepDialog/index.vue';

export default {
    name: 'DependentReleaseList',
    i18n: { // `i18n` 选项，为组件设置语言环境信息
        messages: {
            en: {
                addDependencies: 'Add Dependencies',
                mockDependency: 'Mock Dependency',
                notRely: 'Not Rely on this resource',
            },
            'zh-CN': {
                addDependencies: '添加依赖',
                mockDependency: 'Mock 依赖',
                notRely: '此资源没有依赖',
            },
        }
    },
    components: {
        Item,
        DepDialog,
    },
    props: {
        dataSource: {
            type: Array,
            default() {
                return [
                    // {
                    // id: '',
                    // name: '',
                    // isOnline: true,
                    // isLock: false,
                    // version?: '',
                    // }
                ];
            },
        },
        mockDataSource: {
            type: [Array, null],
            default() {
                return null;
                // return [
                // {
                //     id: '',
                //     name: '',
                // }
                // ];
            }
        },
        isLock: {
            type: Boolean,
            default: false,
        },
        currentID: {
            type: String,
            default: '',
        }
        // onChange: {
        //     type: Function,
        //     default(dataSource) {
        //
        //     },
        // },
    },
    data() {
        return {
            dialogVisible: false,
        };
    },
    methods: {
        onRemove(index) {
            // console.log(index, '1234aaaaa');
            this.$emit('onChange',
                this.dataSource.filter((i, j) => j !== index),
            );
        },
        onRemoveMock(index) {
            this.$emit('onChangeMock',
                this.mockDataSource.filter((i, j) => j !== index),
            );
        },
        addARelease(item) {
            console.log(item, 'ASDFASDCDSARFW');
            this.$emit('onChange', [
                ...this.dataSource,
                {
                    ...item,
                    // version: '^' + item.version,
                    version: (item.versions && item.versions.length > 0) ? '^' + item.versions[item.versions.length - 1] : '',
                    // customVersion: false,
                },
            ]);
        },
        addAMock(item) {
            // console.log(item, 'ASDFASDCDSARFW');
            this.$emit('onChangeMock', [
                ...this.mockDataSource,
                item,
            ]);
        },
        removeARelease(item) {
            // console.log(item, 'itemitemitem');
            this.$emit('onChange', this.dataSource.filter(i => i.id !== item.id));
        },
        removeAMock(item) {
            this.$emit('onChangeMock', this.mockDataSource.filter(i => i.id !== item.id));
        },
    },
    computed: {
        exists() {
            return this.dataSource.map(i => i.id);
        },
        existMocks() {
            return this.mockDataSource ? this.mockDataSource.map(i => i.id) : [];
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                window.document.body.style.overflowY = 'hidden';
            } else {
                window.document.body.style.overflowY = 'auto';
            }
        }
    }
}
