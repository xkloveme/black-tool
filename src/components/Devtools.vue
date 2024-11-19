<template>
  <div class="changeData p-4">
    <textarea 
      class="textarea w-full border border-gray-200 bg-white text-gray-700" 
      placeholder="请输入加密内容,支持引号输入" 
      cols="63" rows="5" 
      v-model="msg">
    </textarea>

    <div class="res p-4 bg-white rounded-lg shadow-md mt-4">
      <div class="flex gap-4 mb-4">
        <button @click="handlChangeData" class="btn btn-primary">转化数据</button>
        <div class="tooltip" :data-tip="clickMsg">
          <button @click="copyText(res)" class="btn btn-secondary">复制结果</button>
        </div>
        <button onclick="my_modal_4.showModal()" class="btn btn-accent">配置</button>
        <select v-model="selectedValue" @change="handlChangeData" 
          class="select select-bordered">
          <option>解密</option>
          <option>加密</option>
        </select>
      </div>

      <div v-html="res" class="bg-gray-50 p-4 rounded-md text-gray-700 break-words">
      </div>
    </div>
    <dialog id="my_modal_4" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">加密配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">密钥key</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="key" placeholder="密钥key"
            class="input input-bordered w-full " />
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
import { codeToHtml } from 'shiki'
import { encrypt, decrypt } from '../utils'
import { userStore } from '../store/user'
import { computed, ref } from 'vue';

let msg = ref(``)
let clickMsg = ref(`点击复制`)
let res = ref(``)
const { SM4Key, addKey } = userStore()
// let key = computed(() => SM4Key)
const key = computed({
  get () {
    return SM4Key
  },
  set (val) {
    addKey(val)
  }
})
let selectedValue = ref('解密')
function copyText (text) {
  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = JSON.stringify(text);
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  clickMsg.value = '复制成功'
  return res;
}
async function handlChangeData () {
  clickMsg.value = '点击复制'
  if (!msg.value) return
  try {
    let code = selectedValue.value === '解密' ? decrypt(msg.value.replace(/['"“‘]/g, '')) : encrypt(msg.value, '')
    let html = null
    if (code && (code.includes('}') || code.includes(']'))) {
      html = await codeToHtml(code, {
        lang: 'json5',
        theme: 'min-dark'
      })
    } else {
      html = code
    }
    res.value = html
  } catch (error) {
    res.value = {}
  }
}
</script>

<style scoped>
.changeData {
  min-height: 500px;
  background-color: var(--background-gray);
}
</style>