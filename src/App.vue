<template>
    <div id="app">
        <button @click="getScroll">获取列表</button>
        <div style="height: 100%">
            <Scroll ref="Scroll" :datas="list" :defHeight="100">
                <template v-slot:default="slotProps">
                    <div class="TestItem">
                        <span>{{ slotProps.item.name }}|{{ slotProps.item.infiniteScrollTop }} | {{ slotProps.item.infiniteScrollHeight }}</span>
                        <span contenteditable @blur="(e) => change(e, slotProps.item)">{{ slotProps.item.text }}</span>
                        <input type="text" v-model="slotProps.item.text" />
                    </div>
                </template>
            </Scroll>
        </div>
    </div>
</template>
<script>
    export default {
        name: "App",
        components: {},
        data() {
            return {
                list: [],
            };
        },
        mounted() {
            let x = parseInt(Math.random() * 10);
            for (let i = 0; i <= 1000; i++) {
                if (i % x === 0) {
                    this.list.push({ name: i, text: this.randomString(Math.random() * 5000) });
                } else {
                    this.list.push({ name: i, text: this.randomString(Math.random() * 1000) });
                }
            }
        },
        methods: {
            getScroll(v) {
                console.log(this.list, this.$refs.Scroll.getAllList());
            },
            change(e, item) {
                item.text = e.target.innerText;
            },
            randomString(e) {
                e = e || 32;
                var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
                    a = t.length,
                    n = "";
                for (let i = 0; i < e; i++) {
                    n += t.charAt(Math.floor(Math.random() * a));
                }
                return n;
            },
        },
    };
</script>

<style lang="less">
    body {
        margin: 0px;
    }
    html,
    body,
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }
    button {
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .InfiniteScrollItem:nth-child(odd) {
        background: #efefef;
    }
    .InfiniteScrollItem:nth-child(even) {
        background: #fff;
    }
    .TestItem {
        width: 100%;
        height: 100%;
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        flex-flow: column nowrap;
        flex-shrink: 0;
        span {
            word-break: break-all;
        }
        &:hover {
            border-color: #66b1ff;
        }
    }
</style>
