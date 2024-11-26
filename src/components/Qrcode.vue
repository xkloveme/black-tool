<!--
 * @Date: 2023-09-19
 * @LastEditTime:2024-11-26 15:12:57
 * @LastEditors:xkloveme
 * @FileDesc:new page
 * @FilePath:/black-tool/src/components/Qrcode.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="main p-4 bg-base-100">
    <div role="alert" class="alert shadow-lg bg-base-200 p-4 rounded-lg flex flex-col md:flex-row items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-8 w-8 text-primary" fill="none"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="w-full text-center">
        <h1 class="font-bold text-primary text-xl">浙里办二维码调试单点登录工具</h1>
        <div class="text-base-content text-sm">
          1.调试应用（包含本地应用）链接填入后,<span class="text-primary font-medium">直接使用浙里办APP扫码使用</span><br>
          2.应用绕过了浙里办不安全域名，可以调试任何链接<br>
          3.兼容单点登录，自动带入ticketId
        </div>
      </div>
      <select v-model="appid" class="select select-bordered w-full mt-2 bg-base-100">
        <option disabled selected>选择应用</option>
        <option v-for="(item,key) in config" :value="item.key">{{item.name}}</option>
      </select>
    </div>

    <div class="flex w-full flex-wrap mt-4 gap-4">
      <div class="grid flex-grow card bg-base-200 rounded-lg shadow-md p-4 place-items-center">
        <textarea v-model="qr" 
          class="textarea w-full h-full bg-base-100 textarea-bordered" 
          cols="33" rows="5"
          placeholder="请输入链接" 
          ref="refInput">
        </textarea>
        <button class="btn btn-primary mt-4">当前URL链接:</button>
        <qrcode-vue :value="qr" :size="360" level="H" class="my-4 bg-white p-2 rounded"/>
        <a :href="qr" target="_blank" class="mt-4 text-primary">{{ decodeURIComponent(qr) }}</a>
      </div>

      <div class="divider divider-horizontal text-primary"> -> </div>

      <div class="grid flex-grow card bg-base-200 rounded-lg shadow-md p-4 place-items-center">
        <qrcode-vue :value="newQr" :size="360" level="H" class="bg-white p-2 rounded"/>
        <div class="flex gap-4 mt-4">
          <button @click="openAddLink" class="btn btn-primary">保存链接</button>
          <button onclick="my_modal_4.showModal()" class="btn btn-secondary">查看列表</button>
        </div>
      </div>
    </div>

    <!-- 弹窗部分样式修改 -->
    <dialog id="my_modal_3" class="modal">
      <div class="modal-box w-11/12 max-w-5xl bg-base-200">
        <h3 class="font-bold text-lg">保存链接到配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">链接标题</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="linkConfig.title" placeholder="标题"
            class="input input-bordered w-full bg-base-100" />
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text">链接地址</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="linkConfig.url" placeholder="链接地址"
            class="input input-bordered w-full bg-base-100" />
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button @click="saveLink" class="btn btn-accent mr-4">保存</button>
            <button class="btn">关闭</button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog id="my_modal_4" class="modal">
      <div class="modal-box max-w-5xl bg-base-300">
        <div>
          <table class="table w-full table-zebra">
            <thead>
              <tr class="text-primary">
                <th align="center">操作</th>
                <th align="left">标题和链接</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in urlList" :key="item.url" class="border-b border-base-content/20">
                <th class="flex w-30 mt-4">
                  <button @click="dellink(index)" class="btn btn-outline btn-xs btn-secondary">删除</button>
                  <form method="dialog">
                    <button @click="handlUseLink(item)" class="btn btn-outline btn-xs btn-accent ml-4"
                      for="my_modal_4">使用</button>
                  </form>
                </th>
                <td class="w-5/6 overflow-hidden">
                  <a :href="item.url" target="_blank" class="link text-primary lowercase text-left">{{
                    item.url }}</a>
                  <br />
                  <span class="badge badge-ghost badge-lg p-2">{{ item.title }}</span>
                </td>
              </tr>
            </tbody>
          </table>
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
import { storeToRefs } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { userStore } from '../store/user'
import config from '../../public/config.json'
const { urlList } = storeToRefs(userStore())
console.log("===🐛=== ~ file: Qrcode.vue:112 ~ store:", urlList);
let appid = ref('2002271810')
let qr = ref('')
// https://yyfbxt.szhz.hangzhou.gov.cn:8068/web/mgop/gov-open/zj/2002207948/reserved/jump.html?
// https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002271810/lastTest/jump.html?debug=true#/?
// 临安一网监督
// let newQr = computed(() => `https://yyfbxt.szhz.hangzhou.gov.cn:8068/web/mgop/gov-open/zj/2002207948/reserved/jump.html?url=${encodeURIComponent(qr.value)}`)
// 嘉善一网监督
let newQr = computed(() => `https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/${appid.value}/lastTest/jump.html?url=${encodeURIComponent(qr.value)}`)
let linkConfig = ref({
  title: '',
  url: ''
})
let iframeUrl = ref('')
let iframe = ref()
function openAddLink () {
  if (qr.value) {
    linkConfig.value.url = qr.value
    iframeUrl.value = qr.value
    // nextTick(() => {
    //   iframe.value.onload = function () {
    //     console.log(iframe.value.contentWindow.document, 88)
    //     // let iframeDocument = iframe.value?.contentDocument || iframe.value?.contentWindow.document;
    //     // console.log(iframe, 66, iframeDocument, 77);
    //   }
    //   my_modal_3.showModal()
    // })
    fetch(qr.value).then(res => res.text()).then(data => {
      let matches = data.match(/<title>(.*?)<\/title>/)
      linkConfig.value.title = matches[1]
      my_modal_3.showModal()
    }).catch(
      () => {
        linkConfig.value.title = ''
        my_modal_3.showModal()
      }
    )
  } else {
    alert('请输入链接')
  }
}
function saveLink () {
  if (linkConfig.value.title && linkConfig.value.url) {
    urlList.value.unshift(JSON.parse(JSON.stringify(linkConfig.value)))
  }
}
function dellink (index) {
  urlList.value.splice(index, 1)
}
function handlUseLink (item) {
  qr.value = item.url
  console.log(linkConfig.value)
}
const refInput = ref(null)
const getFocus = () => {
  nextTick(() => {
    refInput.value.focus();
  })
}
getFocus()

function getApp () {
  console.log(config,111)
    //   let arr = config.trim().split('\n')
    // let obj = {}
    // for (let i = 0; i < arr.length; i++) {
    //   let v = arr[i]
    //   if (v.includes('//') && v.match(/[\u4e00-\u9fa5（）()]+/g)) {
    //     let key = arr[i + 1].match(/"(.*?)":/)[1]
    //     obj[key] = v.match(/[\u4e00-\u9fa5（）()]+/g)?.join('')
    //   }
    // }
    // objList.value = obj
    // console.log("===🐛=== ~ fetch ~ data:", obj);
  // fetch('https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001895658/lastTest/config.json').then(res => res.text()).then(data => {
  //   let arr = data.trim().split('\n')
  //   let obj = {}
  //   for (let i = 0; i < arr.length; i++) {
  //     let v = arr[i]
  //     if (v.includes('//') && v.match(/[\u4e00-\u9fa5（）()]+/g)) {
  //       let key = arr[i + 1].match(/"(.*?)":/)[1]
  //       obj[key] = v.match(/[\u4e00-\u9fa5（）()]+/g)?.join('')
  //     }
  //   }
  //   objList.value = obj
  //   console.log("===🐛=== ~ fetch ~ data:", obj);
  // })
}
// getApp()

</script>

<style scoped>
.main {
  min-height: calc(100vh - 64px);
}
</style>
