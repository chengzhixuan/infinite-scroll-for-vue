<template>
    <div @scroll="scrollTops" class="InfiniteScrollContainer">
        <div v-if="listAll.length > 0" class="InfiniteScroll" :style="{ height: listHeight + 10 + 'px' }">
            <div class="InfiniteScrollTop" :style="{ height: (renderList[0] ? renderList[0].scrollTop : 0) + 'px' }"></div>
            <div class="InfiniteScrollItem" :ref="'InfiniteScrollItem' + item.infiniteScrollId" v-for="(item, index) in renderList" :key="item.infiniteScrollId + '_' + item.infiniteScrollKey">
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
                renderList: [],
                listAll: [],
                scrollTop: 0,
            };
        },
        props: {
            // 数据列表
            datas: {
                default: () => {
                    return [];
                },
                type: Array,
            },
            // 计算默认高度
            defHeight: {
                default: 50,
                type: Number,
            },
        },
        watch: {
            datas(v) {
                this.init();
            },
        },
        computed: {
            listHeight() {
                let height = 0;
                this.listAll.forEach((i) => {
                    height += i.scrollHeight;
                });
                return height;
            },
        },
        mounted() {
            setTimeout(() => {
                console.log(44444);
                if (document.querySelector(".InfiniteScrollContainer")) {
                    this.scrollHeight = document.querySelector(".InfiniteScrollContainer").offsetHeight;
                }
            }, 100);
            this.init();
        },
        methods: {
            init() {
                if (this.datas.length > 0) {
                    this.listAll = JSON.parse(JSON.stringify(this.datas));
                    this.listAll.forEach((i, index) => {
                        i.infiniteScrollId = index;
                        i.hasRenderDom = false;
                        i.infiniteScrollKey = Date.parse(new Date());
                        i.scrollTop = index === 0 ? 0 : this.listAll[index - 1].scrollTop + this.listAll[index - 1].scrollHeight;
                        i.scrollHeight = this.defHeight;
                    });
                    this.renderList = this.listAll.slice(0, 20);
                    this.$nextTick(() => {
                        this.renderList.forEach((i) => {
                            this.renderListHeightChange(i);
                        });
                    });
                }
            },
            scrollTops(e) {
                if (Math.abs(e.target.scrollTop - this.scrollTop) > this.defHeight) {
                    let hasTop = e.target.scrollTop > this.scrollTop; // true 往下滚动    false往上滚动
                    this.scrollTop = e.target.scrollTop;
                    this.getRenderList(hasTop ? 1 : 2);
                }
            },
            // 获取渲染列表 scroll 1往下滚动  2往上滚动
            getRenderList(scroll) {
                let listAll = this.listAll;
                if (scroll === 2) {
                    listAll = [...this.listAll].reverse();
                    for (let i = 0; i < listAll.length; i++) {
                        if (i < listAll.length - 1) {
                            listAll[i].scrollTop = listAll[i + 1].scrollTop + listAll[i + 1].scrollHeight;
                        }
                        this.renderListHas(listAll[i], this.itemHasShow(listAll[i]));
                    }
                } else {
                    for (let i = 0; i < listAll.length; i++) {
                        if (i > 0) {
                            listAll[i].scrollTop = listAll[i - 1].scrollTop + listAll[i - 1].scrollHeight;
                        }
                        this.renderListHas(listAll[i], this.itemHasShow(listAll[i]));
                    }
                }
            },
            renderListHas(v, hasSHow) {
                let index = -1;
                this.renderList.forEach((i, inx) => {
                    if (v.infiniteScrollId === i.infiniteScrollId) {
                        index = inx;
                    }
                });
                if (hasSHow && index !== -1) {
                    this.renderList[index] = v;
                } else if (hasSHow && index === -1) {
                    if (this.renderList.length > 0 && v.infiniteScrollId < this.renderList[this.renderList.length - 1].infiniteScrollId) {
                        this.renderList.unshift(v);
                    } else {
                        this.renderList.push(v);
                    }
                    this.$nextTick(() => {
                        this.renderListHeightChange(v);
                    });
                } else if (hasSHow === false && index !== -1) {
                    this.renderList.splice(index, 1);
                }
            },
            renderListHeightChange(v) {
                if (!v.hasRenderDom) {
                    let offsetHeight = this.$refs["InfiniteScrollItem" + v.infiniteScrollId][0].offsetHeight;
                    this.listAll[v.infiniteScrollId].scrollHeight = offsetHeight;
                    v.scrollTop = v.infiniteScrollId === 0 ? 0 : this.listAll[v.infiniteScrollId - 1].scrollTop + this.listAll[v.infiniteScrollId - 1].scrollHeight;
                    v.scrollHeight = offsetHeight;
                    v.hasRenderDom = true;
                    this.listAll.push();
                }
            },
            // 订单是否在可视区域
            itemHasShow(item) {
                if (item.scrollTop < this.scrollTop && item.scrollTop + item.scrollHeight > this.scrollTop + this.scrollHeight) {
                    return true;
                } else if (item.scrollTop > this.scrollTop && item.scrollTop < this.scrollTop + this.scrollHeight) {
                    return true;
                } else {
                    return item.scrollTop + item.scrollHeight > this.scrollTop - 300 && item.scrollTop + item.scrollHeight < this.scrollTop + this.scrollHeight + 300;
                }
            },
            getAllList() {
                let list = [];
                this.listAll.forEach((e) => {
                    let i = Object.assign({}, e);
                    delete i.infiniteScrollId;
                    delete i.hasRenderDom;
                    delete i.infiniteScrollKey;
                    delete i.scrollTop;
                    delete i.scrollHeight;
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
    }
    .InfiniteScroll {
        display: flex;
        flex-flow: column nowrap;
        flex-shrink: 0;
        position: relative;
        .InfiniteScrollTop {
            flex-shrink: 0;
        }
        .InfiniteScrollItem {
            width: 100%;
            flex-shrink: 0;
        }
    }
</style>
