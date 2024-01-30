<!--
 * @Date: 2023-09-19
 * @LastEditTime: 2024-01-30 11:42:39
 * @LastEditors: xkloveme
 * @FileDesc:new page
 * @FilePath: /black-tool/src/components/Qrcode.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="main p-4">
    <div role="alert" class="alert shadow-lg bg-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="ext-emerald stroke-current shrink-0 h-6 w-6" fill="none"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="w-full text-center">
        <h1 class="font-bold text-blue text-lg text-center">浙里办二维码调试单点登录工具</h1>
        <div class="text-xs">1.调试应用（包含本地应用）链接填入后,<span class="text-blue text-blod">直接使用浙里办APP扫码使用</span><br>
          2.应用绕过了浙里办不安全域名，可以调试任何链接<br>
          3.兼容单点登录，自动带入ticketId</div>
      </div>
      <select v-model="appid" class="select select-warning w-full max-w-xs">
        <option disabled selected>选择应用</option>
        <option v-for="(item,key) of objList" :value="key">{{item}}</option>
      </select>
    </div>
    <div class="flex w-full flex-wrap mt-4">
      <div class="grid h-150 flex-grow card bg-base-300 rounded-box place-items-center">
        <textarea v-model="qr" class="textarea textarea-info w-full h-full text-emerald bg-black" cols="33" rows="5"
          placeholder="请输入链接" ref="refInput"></textarea>
          <button  class="btn text-blue mt-2">当前URL链接:</button>
          <qrcode-vue :value="qr" :size="360" level="H" class="my-4"/>
      </div>
      <div class="divider divider-horizontal"> -> </div>
      <div class="grid h-150 flex-grow card bg-base-300 rounded-box place-items-center bg-black">
        <qrcode-vue :value="newQr" :size="360" level="H" />
        <div class="flex">
          <button @click="openAddLink" class="btn btn-outline btn-secondary mr-4 w-40">保存链接</button>
          <button onclick="my_modal_4.showModal()" class="btn btn-outline btn-accent w-40">查看列表</button>
        </div>
       
      </div>
    </div>


    <dialog id="my_modal_3" class="modal ">
      <div class="modal-box w-11/12 max-w-5xl bg-gray-700">
        <h3 class="font-bold text-lg">保存链接到配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">链接标题</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="linkConfig.title" placeholder="标题"
            class="input input-bordered w-full bg-gray-600" />
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text">链接地址</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="linkConfig.url" placeholder="链接地址"
            class="input input-bordered w-full text-emerald bg-gray-600" />
        </div>
        <!-- <iframe ref="iframe" :src="iframeUrl" frameborder="0"></iframe> -->
        <div class="modal-action">
          <form method="dialog">
            <button @click="saveLink" class="btn btn-accent mr-4">保存</button>
            <button class="btn">关闭</button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog id="my_modal_4" class="modal">
      <div class="modal-box  max-w-5xl bg-gray-900">
        <div>
          <table class="table w-full table-zebra">
            <!-- head -->
            <thead>
              <tr class="bg-gray-900 text-emerald my-2">
                <th align="center">操作</th>
                <th align="left">标题和链接</th>
              </tr>
            </thead>
            <tbody>
              <!-- row 1 -->
              <tr v-for="(item, index) in urlList" :key="item.url" class="border-b border-gray-500">
                <th class="flex w-30 mt-4">
                  <button @click="dellink(index)" class="btn btn-outline btn-xs btn-secondary">删除</button>

                  <form method="dialog">
                    <button @click="handlUseLink(item)" class="btn btn-outline btn-xs btn-accent  ml-4"
                      for="my_modal_4">使用</button>
                  </form>
                </th>
                <td class="w-5/6 overflow-hidden">
                  <a :href="item.url" target="_blank" className="btn btn-active btn-link text-blue lowercase text-left">{{
                    item.url }}</a>
                  <br />
                  <span class="badge badge-ghost badge-lg text-red text-left text-lg p-2">{{ item.title }}</span>
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
const { urlList } = storeToRefs(userStore())
console.log("===🐛=== ~ file: Qrcode.vue:112 ~ store:", urlList);
let appid = ref('2002389987')
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

let objList = ref({})
function getApp () {
  fetch('https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001895658/lastTest/config.json').then(res => res.text()).then(data => {
    let arr = data.trim().split('\n')
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
      let v = arr[i]
      if (v.includes('//') && v.match(/[\u4e00-\u9fa5（）()]+/g)) {
        let key = arr[i + 1].match(/"(.*?)":/)[1]
        obj[key] = v.match(/[\u4e00-\u9fa5（）()]+/g)?.join('')
      }
    }
    objList.value = obj
    console.log("===🐛=== ~ fetch ~ data:", obj);
  })
}
getApp()

</script>

<style scoped lang="scss"></style>
