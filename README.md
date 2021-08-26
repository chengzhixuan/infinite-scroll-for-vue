# infinite-scroll-for-vue
vue不定高的无限滚动插件
## 安装

Using npm:

```bash
$ npm install infinite-scroll-for-vue
```

Using yarn:

```bash
$ yarn add infinite-scroll-for-vue
```
## 配置 Attributes
```js
{
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
}
```

## 方法 Methods

```js
{
  getAllList // 获取列表全部数据
}
```
## Example

```js
<template>
    <div id="app">
        <div style="height: 100%">
            <Scroll ref="Scroll" :datas="list">
                <template v-slot:default="slotProps">
                    <div class="TestItem">
                        <span>{{ slotProps.item.name }}|{{ slotProps.item.scrollTop }} | {{ slotProps.item.scrollHeight }}</span>
                        <span>{{ slotProps.item.text }}</span>
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
            for (let i = 0; i <= 4000; i++) {
                if (i % x === 0) {
                    this.list.push({ name: i, text: this.randomString(Math.random() * 5000) });
                } else {
                    this.list.push({ name: i, text: this.randomString(Math.random() * 1000) });
                }
            }
        },
        methods: {
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
```