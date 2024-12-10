<template>
  <div class="main p-4">
    <button class="btn btn-outline btn-sm gap-2 float-right text-sm hover:text-base-100" @click="openHosts">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        </svg>
        Hosts 文件
      </button>
    <h1 class="title">GitHub Proxy    </h1>
    
    <!-- 顶部提示框 -->
    <div role="alert" class="alert shadow-lg bg-base-200 p-4 rounded-lg">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-8 w-8 text-primary" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h1 class="font-bold text-primary text-xl">GitHub Proxy</h1>
            <p class="text-base-content/70">加速 GitHub 文件下载、Releases、archive、gist 等资源</p>
          </div>
        </div>

      </div>

    </div>

    <!-- 主要内容卡片 -->
    <div class="card bg-base-200 shadow-lg rounded-lg mt-4 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input type="text" v-model="githubUrl" placeholder="请贴入来自 GitHub 的链接" class="input input-bordered w-full" />
        </div>
        <button class="btn btn-outline btn-primary w-full sm:w-auto" @click="generateProxyUrl" :disabled="!githubUrl">
          ⚡ 加速下载
        </button>
      </div>

      <!-- 加速源选择 -->
      <div class="mt-4">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span class="text-base-content/70">加速源:</span>
            <select v-model="selectedProxy" class="select select-bordered">
              <option v-for="proxy in availableProxies" :key="proxy" :value="proxy">
                {{ proxy }}
              </option>
            </select>
            <button class="btn btn-outline" @click="testProxies">
              在线节点检测
            </button>
          </div>

        </div>
      </div>

      <!-- 重要提示 -->
      <div class="alert alert-warning mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>重要提示：公益服务，请勿滥用。加速源来自网络收集整合，在此感谢每一位分享者。</span>
      </div>
    </div>

    <!-- 节点测试/使用说明卡片 -->
    <div class="card bg-base-200 shadow-lg rounded-lg mt-4 p-4">
      <div class="card-title">
        <h2 class="text-xl font-bold text-base-content">{{ showTestResults ? '节点测试' : '使用说明' }}</h2>
        <button class="btn btn-ghost btn-sm" @click="toggleView">
          {{ showTestResults ? '查看说明' : '节点测试' }}
        </button>
      </div>

      <!-- 节点测试结果 -->
      <div v-if="showTestResults" class="mt-4">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>加速节点</th>
                <th>延迟</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proxy in proxyTestResults" :key="proxy.url">
                <td class="whitespace-nowrap">{{ proxy.url }}</td>
                <td>{{ proxy.latency }}ms</td>
                <td>
                  <span :class="proxy.status === '成功' ? 'text-success' : 'text-error'">
                    {{ proxy.status }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-outline btn-sm btn-primary" @click="selectProxy(proxy.url)">
                    选择
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 使用说明 -->
      <div v-else class="mt-4 space-y-4">
        <div class="text-base-content/70">
          <p>1. 支持以下资源的下载：</p>
          <ul class="list-disc list-inside ml-4 mt-2">
            <li>GitHub 文件下载</li>
            <li>Releases 文件下载</li>
            <li>archive 下载</li>
            <li>gist 下载</li>
            <li>raw.githubusercontent.com 文件</li>
          </ul>
        </div>

        <div class="text-base-content/70">
          <p>2. 页面合法输入示例：</p>
          <div class="bg-base-300 p-2 rounded-lg mt-2 space-y-2 text-sm">
            <p>Raw 文件：<code>raw.githubusercontent.com/.../main/file.txt</code></p>
            <p>分支源码：<code>github.com/user/repo/archive/refs/heads/main.zip</code></p>
            <p>Releases：<code>github.com/user/repo/releases/download/tag/file</code></p>
            <p>源码包：<code>github.com/user/repo/archive/refs/tags/version.zip</code></p>
          </div>
        </div>

        <div class="text-base-content/70">
          <p>3. 终端命令行示例：</p>
          <div class="space-y-4">
            <div>
              <p class="font-bold">git clone:</p>
              <pre
                class="bg-base-300 p-2 rounded-lg mt-2 text-sm">git clone https://{{ selectedProxy }}/github.com/user/repo</pre>
            </div>
            <div>
              <p class="font-bold">wget:</p>
              <pre
                class="bg-base-300 p-2 rounded-lg mt-2 text-sm">wget https://{{ selectedProxy }}/github.com/user/repo/archive/main.zip</pre>
            </div>
            <div>
              <p class="font-bold">curl:</p>
              <pre
                class="bg-base-300 p-2 rounded-lg mt-2 text-sm">curl -O https://{{ selectedProxy }}/github.com/user/repo/archive/main.zip</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const githubUrl = ref('');
const selectedProxy = ref('https://gh-proxy.com');
const proxyList = ref([]);
const proxyTestResults = ref([]);
const showTestResults = ref(false);
const availableProxies = ref([]);

// 获取代理列表
const fetchProxyList = async () => {
  try {
    const response = await fetch('https://akams.cn/api/mirrors/github');
    const data = await response.json();
    if (data.code === 200 && data.data) {
      proxyList.value = data.data;
      availableProxies.value = [...proxyList.value];
    }
  } catch (error) {
    console.error('Failed to fetch proxy list:', error);
  }
};

const toggleView = () => {
  showTestResults.value = !showTestResults.value;
  if (showTestResults.value && proxyTestResults.value.length === 0) {
    testProxies();
  }
};

// 测试代理节点
const testProxies = async () => {
  showTestResults.value = true;
  proxyTestResults.value = [];
  availableProxies.value = [];

  const testUrl = 'https://raw.githubusercontent.com/microsoft/vscode/main/LICENSE.txt';

  // 测试所有节点，不限制数量
  const tests = proxyList.value.map(async proxy => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${proxy}/${testUrl}`, {
        signal: AbortSignal.timeout(5000)
      });
      const latency = Date.now() - startTime;
      const success = response.ok;
      if (success) {
        availableProxies.value.push(proxy);
      }
      return {
        url: proxy,
        latency,
        status: success ? '成功' : '失败'
      };
    } catch (error) {
      return {
        url: proxy,
        latency: '-',
        status: '失败'
      };
    }
  });

  const results = await Promise.allSettled(tests);
  proxyTestResults.value = results
    .map(result => result.value)
    .filter(result => result)
    .sort((a, b) => {
      if (a.status === '失败') return 1;
      if (b.status === '失败') return -1;
      return a.latency - b.latency;
    });

  if (availableProxies.value.length > 0 && !availableProxies.value.includes(selectedProxy.value)) {
    selectedProxy.value = availableProxies.value[0];
  }
};

// 选择代理节点
const selectProxy = (proxy) => {
  selectedProxy.value = proxy;
};

// 生成代理链接
const generateProxyUrl = () => {
  if (!githubUrl.value) return;

  const proxyUrl = `${selectedProxy.value}/${githubUrl.value}`;
  window.open(proxyUrl, '_blank');
};

const openHosts = () => {
  const hostsUrl = `${selectedProxy.value}/https://raw.githubusercontent.com/oopsunix/hosts/refs/heads/main/hosts_github`;
  window.open(hostsUrl, '_blank');
};

onMounted(() => {
  fetchProxyList();
});
</script>

<style scoped>
.main {
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
}

.title {
  font-size: 80px;
  font-family: "Chillax-Variable", sans-serif;
  background: linear-gradient(to right, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
}

@media (max-width: 640px) {
  .input-group {
    flex-direction: column;
  }

  .input-group>* {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .input-group> :last-child {
    margin-bottom: 0;
  }
}
</style>