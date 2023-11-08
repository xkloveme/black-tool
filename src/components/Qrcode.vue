<!--
 * @Date: 2023-09-19
 * @LastEditTime: 2023-11-08 10:36:25
 * @LastEditors: xkloveme
 * @FileDesc:new page
 * @FilePath: /black-tool/src/components/Qrcode.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="main">
    <div class="flex w-full">
      <div class="grid h-150 flex-grow card bg-base-300 rounded-box place-items-center">
        <textarea v-model="qr" class="textarea textarea-info w-full h-full" cols="33" rows="5" placeholder="请输入链接"></textarea>
      </div>
      <div class="divider divider-horizontal"> -> </div>
      <div class="grid h-150 flex-grow card bg-base-300 rounded-box place-items-center"><qrcode-vue :value="newQr"
          :size="400" level="H" /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
let qr = ref('')
// https://yyfbxt.szhz.hangzhou.gov.cn:8068/web/mgop/gov-open/zj/2002207948/reserved/jump.html?
// https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002271810/lastTest/jump.html?debug=true#/?
let newQr = computed(() => `https://yyfbxt.szhz.hangzhou.gov.cn:8068/web/mgop/gov-open/zj/2002207948/reserved/jump.html?url=${encodeURIComponent(qr.value)}`)
</script>

<style scoped lang="scss"></style>
