<template>
  <div class="changeData p-4 bg-base-100 min-h-[500px]">
    <textarea 
      class="textarea w-full textarea-bordered bg-base-100 text-base-content" 
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
          fill="currentColor" p-id="7941" />
      </svg>
      </button>
    </div>

    <div class="res p-4 bg-base-200 rounded-lg shadow-md">
      <div class="flex gap-4 mb-4">
        <button @click="handlChangeData" class="btn btn-secondary">点击转化</button>
        <div class="tooltip" :data-tip="clickMsg">
          <button @click="copyText(res)" class="btn btn-primary">复制</button>
        </div>
        <button onclick="my_modal_4.showModal()" class="btn btn-accent">配置</button>
      </div>

      <div class="mockup-code bg-base-300 text-base-content">
        <pre v-html="res"></pre>
      </div>
    </div>

    <dialog id="my_modal_4" class="modal">
      <div class="modal-box w-11/12 max-w-5xl bg-base-200">
        <h3 class="font-bold text-lg text-base-content">表格生成配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">生成标题key(默认title)</span>
          </label>
          <input type="text" 
            @change="handlChangeData" 
            v-model="title" 
            placeholder="title" 
            class="input input-bordered w-full bg-base-100" />
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text">生成数据key(默认dataIndex)</span>
          </label>
          <input type="text" 
            @change="handlChangeData" 
            v-model="dataIndex" 
            placeholder="dataIndex" 
            class="input input-bordered w-full bg-base-100" />
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

<script setup>
import { ref } from 'vue'
import pinyin from './../pinyin'

const title = ref('title')
const dataIndex = ref('dataIndex')
const msg = ref('')
const clickMsg = ref('点击复制')
const res = ref([])

const copyText = (text) => {
  var textareaC = document.createElement('textarea')
  textareaC.setAttribute('readonly', 'readonly')
  textareaC.value = text
  document.body.appendChild(textareaC)
  textareaC.select()
  var result = document.execCommand('copy')
  document.body.removeChild(textareaC)
  clickMsg.value = '复制成功'
  return result
}

const formatting = (str) => {
  let arr = []
  msg.value.split(str).map((item) => {
    if (item) {
      arr.push({
        [title.value]: item,
        [dataIndex.value]: pinyin.firstWordToPinyin(item),
        customRender:
          item.indexOf('时间') > -1
            ? (text, row, index) => {
                const h = props.$createElement
                return h('div', props.county[text])
              }
            : undefined,
      })
    }
  })
  return arr
}

const handlChangeData = () => {
  clickMsg.value = '点击复制'
  if (msg.value.indexOf(',') > -1) {
    res.value = JSON.stringify(formatting(','), null, '\t')
  } else if (msg.value.indexOf('，') > -1) {
    res.value = JSON.stringify(formatting('，'), null, '\t')
  } else {
    res.value = JSON.stringify(formatting(/[\s\n]/), null, '\t')
  }
}
</script>

<style scoped>
.res {
  min-height: 500px;
}

/* 适配代码高亮在暗色模式下的显示 */
:deep(.mockup-code) {
  background-color: var(--base-300);
  color: var(--base-content);
}

:deep(.mockup-code pre) {
  color: inherit;
}
</style>
