<!--
 * @Date: 2023-09-19
 * @LastEditTime: 2023-12-20 16:37:21
 * @LastEditors: xkloveme
 * @FileDesc:new page
 * @FilePath: /black-tool/src/components/Qrcode.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="main p-4">
    <div class="flex w-full flex-wrap">
      <div class="grid h-150 flex-grow card bg-base-300 rounded-box place-items-center">
        <textarea v-model="qr" class="textarea textarea-info w-full h-full text-emerald bg-black" cols="33" rows="5"
          placeholder="请输入链接" ref="refInput"></textarea>
      </div>
      <div class="divider divider-horizontal"> -> </div>
      <div class="grid h-150 flex-grow card bg-base-300 rounded-box place-items-center">
        <div class="flex">
          <button @click="openAddLink" class="btn btn-outline btn-secondary mr-4 w-50">保存链接</button>
          <button onclick="my_modal_4.showModal()" class="btn btn-outline btn-accent w-50">查看列表</button>
        </div>
        <qrcode-vue :value="newQr" :size="300" level="H" />
      </div>
    </div>


    <dialog id="my_modal_3" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">保存链接到配置</h3>
        <div class="w-full">
          <label class="label">
            <span class="label-text">链接标题</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="linkConfig.title" placeholder="标题"
            class="input input-bordered w-full" />
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text">链接地址</span>
          </label>
          <input type="text" @change="handlChangeData" v-model="linkConfig.url" placeholder="链接地址"
            class="input input-bordered w-full text-emerald" />
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
      <div class="modal-box  max-w-5xl">
        <div>
          <table class="table w-full table-zebra">
            <!-- head -->
            <thead>
              <tr class="bg-base-100 text-emerald my-2">
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
                  <button className="btn btn-active btn-link text-blue lowercase text-left">{{ item.url }}</button>
                  <br />
                  <span class="badge badge-ghost badge-sm text-emerald">{{ item.title }}</span>
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
let qr = ref('')
// https://yyfbxt.szhz.hangzhou.gov.cn:8068/web/mgop/gov-open/zj/2002207948/reserved/jump.html?
// https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002271810/lastTest/jump.html?debug=true#/?
let newQr = computed(() => `https://yyfbxt.szhz.hangzhou.gov.cn:8068/web/mgop/gov-open/zj/2002207948/reserved/jump.html?url=${encodeURIComponent(qr.value)}`)

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

</script>

<style scoped lang="scss"></style>
