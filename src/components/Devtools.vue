<template>
  <div class="changeData p-4 bg-base-100">
    <textarea 
      class="textarea w-full textarea-bordered bg-base-100 text-base-content" 
      placeholder="请输入加密内容,支持引号输入" 
      cols="63" rows="5" 
      v-model="msg">
    </textarea>

    <div class="res p-4 bg-base-200 rounded-lg shadow-md mt-4">
      <div class="flex gap-4 mb-4">
        <button @click="handlChangeData" class="btn btn-primary">转化数据</button>
        <div class="tooltip" :data-tip="clickMsg">
          <button @click="copyText(res)" class="btn btn-secondary">复制结果</button>
        </div>
        <button onclick="my_modal_4.showModal()" class="btn btn-accent">配置</button>
        <select v-model="selectedValue" @change="handlChangeData" 
          class="select select-bordered bg-base-100">
          <option>解密</option>
          <option>加密</option>
        </select>
      </div>

      <div class="mockup-code bg-base-300 text-base-content">
        <pre v-html="res" class="whitespace-pre-wrap break-all"></pre>
      </div>
    </div>

    <dialog id="my_modal_4" class="modal">
      <div class="modal-box w-11/12 max-w-5xl bg-base-200">
        <h3 class="font-bold text-lg text-base-content">加密配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">密钥key</span>
          </label>
          <input type="text" 
            @change="handlChangeData" 
            v-model="key" 
            placeholder="密钥key"
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
import { codeToHtml } from 'shiki'
import { encrypt, decrypt } from '../utils'
import { userStore } from '../store/user'
import { computed, ref } from 'vue';

const msg = ref(``)
const clickMsg = ref(`点击复制`)
const res = ref(``)
const { SM4Key, addKey } = userStore()

const key = computed({
  get () {
    return SM4Key
  },
  set (val) {
    addKey(val)
  }
})

const selectedValue = ref('解密')

const copyText = (text) => {
  const textareaC = document.createElement('textarea')
  textareaC.setAttribute('readonly', 'readonly')
  textareaC.value = JSON.stringify(text)
  document.body.appendChild(textareaC)
  textareaC.select()
  const result = document.execCommand('copy')
  document.body.removeChild(textareaC)
  clickMsg.value = '复制成功'
  return result
}

const handlChangeData = async () => {
  clickMsg.value = '点击复制'
  if (!msg.value) return
  try {
    const code = selectedValue.value === '解密' 
      ? decrypt(msg.value.replace(/['""']/g, '')) 
      : encrypt(msg.value, '')
    
    let html = null
    if (code && (code.includes('}') || code.includes(']'))) {
      html = await codeToHtml(code, {
        lang: 'json5',
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'one-dark-pro' : 'min-light'
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
}

/* 适配代码高亮在暗色模式下的显示 */
:deep(.mockup-code) {
  background-color: var(--base-300);
  color: var(--base-content);
}

:deep(.mockup-code pre) {
  color: inherit;
}

:deep(.shiki) {
  background-color: transparent !important;
}

:deep(.shiki code) {
  color: var(--base-content);
}
</style>