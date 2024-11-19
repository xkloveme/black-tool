<template>
  <div class="changeData p-4 bg-white">
    <textarea 
      class="textarea w-full border border-gray-200 bg-white text-gray-700" 
      placeholder="请输入表头" 
      cols="63" rows="5" 
      v-model="msg">
    </textarea>

    <div class="flex justify-center my-4">
      <button @click="handlChangeData" class="btn btn-primary">
        转化数据
        <svg class="icon" height="20" p-id="7940" t="1600052679408" version="1.1" viewBox="0 0 1024 1024" width="20"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 223.361 656.774 H 501.401 V 368.029 H 223.361 v 288.745 Z M 3.3391 394.331 v 231.082 c 0 37.8764 25.5309 31.3608 25.5309 31.3608 h 122.984 V 368.029 H 24.7458 s -21.4067 -0.678536 -21.4067 26.3028 Z m 1007.51 90.0756 c -35.2839 -34.4771 -377.398 -287.565 -377.398 -287.565 s -39.4069 -38.9818 -39.4069 19.456 v 151.729 h -0.414226 v 288.746 h 0.055993 v 161.675 c 0 47.9112 38.0065 6.25133 38.0065 6.25133 l 376.25 -291.311 c -0.000602 0.001204 28.6214 -23.9553 2.90681 -48.9811 Z m 0 0"
          fill="#fff" p-id="7941" />
      </svg>
      </button>
    </div>

    <div class="res p-4 bg-white rounded-lg shadow-md">
      <div class="flex gap-4 mb-4">
        <button @click="handlChangeData" class="btn btn-secondary">点击转化</button>
        <div class="tooltip" :data-tip="clickMsg">
          <button @click="copyText(res)" class="btn btn-primary">复制</button>
        </div>
        <button onclick="my_modal_4.showModal()" class="btn btn-accent">配置</button>
      </div>

      <div class="mockup-code bg-gray-50 text-gray-700">
        <pre v-html="res"></pre>
      </div>
    </div>

    <dialog id="my_modal_4" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">表格生成配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">生成标题key(默认title)</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="title" placeholder="title" class="input input-bordered w-full " />
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text">生成数据key(默认dataIndex)</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="dataIndex" placeholder="dataIndex" class="input input-bordered w-full max-w-xs" />
        </div>
        <div class="modal-action">
          <form method="dialog">

            <button class="btn">关闭</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import pinyin from './../pinyin'

export default {
  name: 'changeData',
  data () {
    return {
      title: 'title',
      dataIndex: "dataIndex",
      msg: ``,
      clickMsg: '点击复制',
      res: [],
    }
  },
  methods: {
    copyText (text) {
      var textareaC = document.createElement('textarea');
      textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
      textareaC.value = text;
      document.body.appendChild(textareaC); //将textarea添加为body子元素
      textareaC.select();
      var res = document.execCommand('copy');
      document.body.removeChild(textareaC);//移除DOM元素
      this.clickMsg = '复制成功'
      return res;
    },
    handlChangeData () {
      this.clickMsg = '点击复制'
      if (this.msg.indexOf(',') > -1) {
        this.res = JSON.stringify(this.formatting(','), null, '\t')
      } else if (this.msg.indexOf('，') > -1) {
        this.res = JSON.stringify(this.formatting('，'), null, '\t')
      } else {
        this.res = JSON.stringify(this.formatting(/[\s\n]/), null, '\t')
      }
    },
    formatting (str) {
      let arr = []
      this.msg.split(str).map((item) => {
        if (item) {
          arr.push({
            [this.title]: item,
            [this.dataIndex]: pinyin.firstWordToPinyin(item),
            customRender:
              item.indexOf('时间') > -1
                ? // eslint-disable-next-line no-unused-vars
                (text, row, index) => {
                  // eslint-disable-next-line no-undef
                  const h = props.$createElement // 需要创建h函数
                  // eslint-disable-next-line no-undef
                  return h('div', props.county[text])
                }
                : undefined,
          })
        }
      })
      return arr
    },
  },
}
</script>

<style scoped>
.changeData {
  min-height: 500px;
}

.res {
  min-height: 500px;
  color: var(--text-primary);
}
</style>
