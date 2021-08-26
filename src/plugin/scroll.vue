<template>
    <div @scroll="scrollTops" class="InfiniteScrollContainer">
        <div class="InfiniteScrollHeight" :style="{ height: listHeight + 'px' }"></div>
        <div class="InfiniteScroll" :style="{ transform: 'translate3d(0,' + (renderList[0] ? renderList[0].infiniteScrollTop : 0) + 'px,0)' }">
            <div class="InfiniteScrollItem" :data-key="item.infiniteScrollId" :ref="'InfiniteScrollItem' + item.infiniteScrollId" v-for="(item, index) in renderList" :key="item.infiniteScrollId + '_' + item.infiniteScrollKey">
                <slot :item="item" :index="index" />
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Scroll",
        data() {
            return {
                scrollHeight: 0, // 屏幕的可视区域高度
                renderList: [], // 要渲染的的列表
                listAll: [], // 总列表
                scrollTop: 0, // 滚动了多少距离
            };
        },
        // 搭建成了组件 外部传入的数据
        props: {
            //数据列表
            datas: {
                default: () => {
                    return [];
                },
                type: Array,
            },
            //计算默认高度
            defHeight: {
                default: 50,
                type: Number,
            },
            // 预估一个页面+预渲染的部分能最少展示多少条数据
            showCount: {
                default: 30,
                type: Number,
            },
        },
        watch: {
            // 传入的数据变化重新获取列表
            datas(v) {
                this.init();
            },
        },
        computed: {
            // 容器内占位的高度计算
            listHeight() {
                let height = 0;
                this.listAll.forEach((i) => {
                    height += i.infiniteScrollHeight;
                });
                return height;
            },
        },
        mounted() {
            this.getInfiniteScrollHeight();
            this.init();
        },
        methods: {
            // 获取可见区的高度
            getInfiniteScrollHeight() {
                if (document.querySelector(".InfiniteScrollContainer")) {
                    this.scrollHeight = document.querySelector(".InfiniteScrollContainer").offsetHeight;
                }
            },
            init() {
                if (this.datas.length > 0) {
                    this.listAll = JSON.parse(JSON.stringify(this.datas));
                    this.listAll.forEach((i, index) => {
                        i.infiniteScrollId = index; // 存入当前行的下标
                        i.hasRenderDom = false; // 当前行是否渲染过
                        i.infiniteScrollKey = Date.parse(new Date()); // vue-for循环使用的唯一值
                        i.infiniteScrollTop = index === 0 ? 0 : this.listAll[index - 1].infiniteScrollTop + this.listAll[index - 1].infiniteScrollHeight; // 当前的行的距离列表顶部的距离
                        i.infiniteScrollHeight = this.defHeight; // 单行的高度
                    });
                    this.renderList = this.listAll.slice(0, this.showCount); // 获取初始渲染的列表
                    this.$nextTick(() => {
                        this.renderList.forEach((i) => {
                            this.renderListHeightChange(i);
                        });
                    });
                }
            },
            // 列表渲染出来 获取列表的真实高度
            renderListHeightChange(v) {
                if (!v.hasRenderDom) {
                    let id = v.infiniteScrollId;
                    let offsetHeight = this.$refs["InfiniteScrollItem" + id][0].offsetHeight;
                    this.listAll[id].infiniteScrollHeight = offsetHeight;
                    this.listAll[id].hasRenderDom = true;
                    // 重新统计下高度 防止滚动过快时列表后面的列表的scrollTop小于前面的scrollTop
                    for (let i = 0; i < this.listAll.length; i++) {
                        if (i > 0) {
                            this.listAll[i].infiniteScrollTop = this.listAll[i - 1].infiniteScrollTop + this.listAll[i - 1].infiniteScrollHeight;
                        }
                    }
                }
            },
            scrollTops(e) {
                // 滚动超出多少距离进行计算
                if (Math.abs(e.target.scrollTop - this.scrollTop) > this.defHeight) {
                    this.scrollTop = e.target.scrollTop;
                    this.getRenderList();
                }
            },
            // 订单是否在可视区域
            itemHasShow(item) {
                if (item.infiniteScrollTop < this.scrollTop && item.infiniteScrollTop + item.infiniteScrollHeight > this.scrollTop + this.scrollHeight) {
                    return true;
                } else if (item.infiniteScrollTop > this.scrollTop && item.infiniteScrollTop < this.scrollTop + this.scrollHeight) {
                    return true;
                } else {
                    return item.infiniteScrollTop + item.infiniteScrollHeight > this.scrollTop - 300 && item.infiniteScrollTop + item.infiniteScrollHeight < this.scrollTop + this.scrollHeight + 300;
                }
            },
            getRenderList() {
                for (let i = 0; i < this.listAll.length; i++) {
                    if (this.itemHasShow(this.listAll[i])) {
                        let count = i + this.showCount;
                        this.renderList = this.listAll.slice(i, Math.min(count, this.listAll.length)); // 获取渲染的列表
                        this.$nextTick(() => {
                            this.renderList.forEach((i) => {
                                this.renderListHeightChange(i);
                            });
                        });
                        break;
                    }
                }
            },
            // 插件修改后获取数据
            getAllList() {
                let list = [];
                this.listAll.forEach((e) => {
                    let i = Object.assign({}, e);
                    delete i.infiniteScrollId;
                    delete i.infiniteScrollKey;
                    delete i.infiniteScrollTop;
                    delete i.infiniteScrollHeight;
                    list.push(i);
                });
                return list;
            },
        },
    };
</script>
<style lang="less" scoped>
    .InfiniteScrollContainer {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
    }
    .InfiniteScrollHeight {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
    }
    .InfiniteScroll {
        display: flex;
        flex-flow: column nowrap;
        flex-shrink: 0;
        position: relative;
        .InfiniteScrollItem {
            width: 100%;
            flex-shrink: 0;
        }
    }
</style>
