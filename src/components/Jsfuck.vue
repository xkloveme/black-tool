<script setup>
import { ref, onMounted } from 'vue'
import {JSFuck} from 'jsfuck'
const activeTab = ref('input')
const inputCode = ref('alert(1);')
const outputCode = ref('')
const canEval = ref(false)
const parentScope = ref(false)

const copyToClipboard = () => {
  if (outputCode.value.length === 0) {
    alert('没有内容可复制。')
    return
  }
  navigator.clipboard.writeText(outputCode.value).then(() => {
    alert('内容已复制到剪贴板！')
  }).catch(err => {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制。')
  })
}

const cleanCode = () => {
  inputCode.value = ''
  activeTab.value = 'input'
}

const encodeJSFuck = () => {
  if (inputCode.value.trim().length === 0) {
    alert('请先输入代码。')
    return
  }
  console.log(JSFuck)
  outputCode.value = JSFuck.encode(inputCode.value, canEval.value, parentScope.value)
  activeTab.value = 'output'
}

function runJs(){
  let value = eval(outputCode.value);

if (!canEval.value){
  alert('"' + value + '"');
}
return false;
}

const saveEncodedResult = () => {
  if (outputCode.value.length === 0) {
    alert('没有内容可保存。')
    return
  }

  const blob = new Blob([outputCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `jsfuck_encoded_${Date.now()}.js`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content p-4 font-sans">
    <div class="max-w-4xl mx-auto bg-base-200 rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <h1 class="text-3xl font-bold text-center text-primary mb-4">JSFuck</h1>
        <h2 class="text-xl text-center text-base-content/70 mb-6">JS加密</h2>

        <div class="text-sm text-center mb-4 text-base-content/80">
          前后端开发者常用工具
        </div>

        <div class="text-center mb-6">
          <p class="text-sm font-semibold text-base-content">
            JSFuck是一种怪异的JS代码加密方法，可将代码全都转换成"[]!()+"形式的字符。<br>
            严格的说，JSFuck加密更像是一种编码。
          </p>
        </div>

        <div class="text-xs opacity-80 mb-6 text-base-content/70">
          <p>
            可加密前端Web浏览器、后端Node.JS等环境下的标准JS代码。<br>
            JSFuck会使代码体积极度膨胀，因此只适宜少量代码加密，建议代码量不超过<span class="text-base font-medium">512字节</span>。<br>
            优点：加密结果非常怪异，完全不像JS代码，令人望而生畏。<br>
            缺点：对执行性能有很大影响、加密代码容易被还原。<br>
          </p>
          <p class="mt-2">注意：代码尽可能是规范JS语法，例如：一行变量定义以"；"号结尾，而非直接回车结束。</p>
          <p class="mt-2">
            TIP：少量JS代码或敏感信息（如密钥等）用JSFuk加密效果不错，<br>较多代码建议使用专业JS混淆加密工具等。
          </p>
        </div>

        <div class="mb-4">
          <button @click="activeTab = 'input'"
            :class="['px-4 py-2 rounded-t-lg transition-colors', 
              activeTab === 'input' 
                ? 'bg-primary text-primary-content' 
                : 'bg-base-300 text-base-content hover:bg-base-300/80']">
            JS源代码
          </button>
          <button @click="activeTab = 'output'"
            :class="['px-4 py-2 rounded-t-lg transition-colors', 
              activeTab === 'output' 
                ? 'bg-primary text-primary-content' 
                : 'bg-base-300 text-base-content hover:bg-base-300/80']">
            JSFuck JS加密结果
          </button>
        </div>

        <div class="bg-base-200 border border-base-300 rounded-lg p-4">
          <textarea v-if="activeTab === 'input'" 
            v-model="inputCode" 
            placeholder="请输入要加密的JS代码..."
            class="w-full h-40 textarea textarea-bordered bg-base-100 text-base-content focus:border-primary">
          </textarea>
          <div class="relative" v-else>
            <textarea v-model="outputCode" 
              placeholder="JSFuck加密结果将显示在这里..."
              class="w-full h-40 textarea textarea-bordered bg-base-300 text-base-content resize-none focus:outline-none"
              readonly>
            </textarea>
            <button @click="copyToClipboard"
              class="absolute right-2 top-2 btn btn-primary btn-sm">
              复制结果
            </button>
            <button @click="runJs" 
              class="absolute right-2 top-12 btn btn-warning btn-sm">
              运行代码
            </button>
          </div>
        </div>

        <div class="mt-4 flex flex-col space-y-2">
          <div class="flex items-center">
            <input id="eval" v-model="canEval" type="checkbox" class="checkbox checkbox-primary mr-2" />
            <label for="eval" class="text-sm text-base-content">可执行代码（如不启用，加密结果是编码后的字符串，而非可执行的代码。）</label>
          </div>
          <div class="flex items-center">
            <input id="scope" v-model="parentScope" type="checkbox" class="checkbox checkbox-primary mr-2" />
            <label for="scope" class="text-sm text-base-content">
              在父作用域中运行(例如"var a=1;"，不启用此选项时，变量a定义在"加密代码"局部作用域中，外部调用时会显示a是undefined，启用后变量a可以被"加密代码"外的其它代码访问。)
            </label>
          </div>
        </div>

        <div class="mt-6 flex justify-center space-x-4">
          <button @click="cleanCode" class="btn btn-error">
            清空JS源代码
          </button>
          <button @click="encodeJSFuck" class="btn btn-primary">
            JSFuck加密
          </button>
          <button @click="saveEncodedResult" class="btn btn-success">
            保存JS加密结果
          </button>
        </div>

        <h2 class="text-center my-4 text-base-content">Basics</h2>

        <ul class="pre text-base-content/80">
          <li>false => ![]</li>
          <li>true => !![]</li>
          <li>undefined => [][[]]</li>
          <li>NaN => +[![]]</li>
          <li>0 => +[]</li>
          <li>1 => +!+[]</li>
          <li>2 => !+[]+!+[]</li>
          <li>10 => [+!+[]]+[+[]]</li>
          <li>Array => []</li>
          <li>Number => +[]</li>
          <li>String => []+[]</li>
          <li>Boolean => ![]</li>
          <li>Function => []["filter"]</li>
          <li>eval => []["filter"]["constructor"]( CODE )()</li>
          <li>window => []["filter"]["constructor"]("return this")()</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pre {
  font-family: monospace;
  white-space: pre-wrap;
  padding: 1rem;
  background-color: var(--base-300);
  border-radius: 0.5rem;
}

.pre li {
  margin-bottom: 0.5rem;
}
</style>