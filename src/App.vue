<template>
    <div id="app">
        <Scroll :datas="list">
            <template v-slot:default="slotProps">
                <div class="TestItem">
                    {{ slotProps.item.name }}
                </div>
            </template>
        </Scroll>
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
            for (let i = 0; i <= 500; i++) {
                this.list.push({ name: i });
            }
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
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }
    .TestItem {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        &:hover {
            border-color: #66b1ff;
            border: 1px solid #66b1ff;
        }
    }
</style>
