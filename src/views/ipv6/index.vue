<template>
  <div class="main p-4 bg-base-100">
    <div role="alert" class="alert shadow-lg bg-base-200 p-4 rounded-lg">
      <div class="flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-8 w-8 text-primary" fill="none"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h1 class="font-bold text-primary text-xl">IPv6 网络测试工具</h1>
          <p class="text-base-content/70">检测您的网络 IPv6 连接状态和配置情况</p>
        </div>
      </div>
    </div>

    <div class="card bg-base-200 shadow-lg rounded-lg mt-4 p-4">
      <div class="network-status">
        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title text-base-content/70">网络类型</div>
            <div class="stat-value text-primary">{{ networkType }}</div>
          </div>
          <div class="stat">
            <div class="stat-title text-base-content/70">IPv6 得分</div>
            <div class="stat-value text-secondary">{{ ipv6Score }}/10</div>
          </div>
        </div>

        <div class="mt-4 space-y-2 text-base-content">
          <p>IPv4 地址: <strong>{{ ipv4Address || '正在检测...' }}</strong></p>
          <p>IPv6 地址: <strong>{{ ipv6Status }}</strong></p>
          <p>运营商（ISP）: <strong>{{ ispStatus }}</strong></p>
        </div>

        <div class="alert mt-4" :class="hasIPv6 ? 'alert-success' : 'alert-warning'" v-if="networkChecked">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ hasIPv6 ? 'IPv6 连接正常' : '未检测到 IPv6 连接' }}</span>
          </div>
        </div>

        <button @click="testIPv6" class="btn btn-primary w-full mt-4">
          {{ testing ? '测试中...' : '开始 IPv6 测试' }}
        </button>
      </div>
    </div>

    <div class="card bg-base-200 shadow-lg rounded-lg mt-4 p-4">
      <div class="card-title flex justify-between items-center">
        <h2 class="text-xl font-bold text-base-content">测试项目</h2>
        <button class="btn btn-ghost btn-sm" @click="toggleTestDetails">
          {{ showTestDetails ? '收起' : '展开' }}
        </button>
      </div>
      
      <div v-show="showTestDetails" class="space-y-4 mt-4">
        <div v-for="(test, index) in testResults" :key="index" 
          class="collapse collapse-arrow bg-base-300 hover:bg-base-300/80">
          <input type="checkbox" />
          <div class="collapse-title flex items-center justify-between">
            <span class="font-medium text-base-content">{{ test.name }}</span>
            <div class="flex items-center gap-2">
              <span :class="getStatusClass(test.status)">{{ test.status }}</span>
              <span class="text-sm text-base-content/60">({{ test.time }})</span>
            </div>
          </div>
          <div class="collapse-content bg-base-200/50">
            <p class="text-sm text-base-content/70">{{ test.description }}</p>
            <p v-if="test.detail" class="text-sm text-primary mt-2">{{ test.detail }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-200 shadow-lg rounded-lg mt-4 p-4">
      <div class="card-title flex justify-between items-center">
        <h2 class="text-xl font-bold text-base-content">常见问题</h2>
        <button class="btn btn-ghost btn-sm" @click="toggleFAQ">
          {{ showFAQ ? '收起' : '展开' }}
        </button>
      </div>
      <div v-show="showFAQ" class="space-y-4 mt-4">
        <div v-for="(faq, index) in faqs" :key="index" class="collapse collapse-arrow bg-base-300">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium text-base-content">
            {{ faq.question }}
          </div>
          <div class="collapse-content bg-base-200/50">
            <p class="text-base-content/70">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const networkType = ref('检测中...');
const ipv4Address = ref('');
const ipv6Address = ref('');
const isp = ref('检测中...');
const hasIPv6 = ref(false);
const dnsSupportsIPv6 = ref(false);
const ipv6Score = ref(0);
const networkChecked = ref(false);
const testing = ref(false);
const showFAQ = ref(false);
const showTestDetails = ref(false);
const testResults = ref([
  {
    name: 'IPv4 域名连接测试',
    status: '等待测试',
    time: '-',
    description: '通过一个 DNS 只有 A 记录的域名加载对象。一般使用的是 IPv4，如果纯 IPv6 用户的运营商采用了 NAT64、DNS64 或代理服务器方案，他们也能成功加载。',
    detail: ''
  },
  {
    name: 'IPv6 域名连接测试',
    status: '等待测试',
    time: '-',
    description: '通过一个 DNS 只有 AAAA 记录的域名加载对象。一般使用的是 IPv6，尚未接入 IPv6 互联网的用户很可能失败，但只要是迅速失败，目前就没有大问题。',
    detail: ''
  },
  {
    name: '双栈域名连接测试',
    status: '等待测试',
    time: '-',
    description: '验证你的浏览器能否连接兼备 IPv4 和 IPv6 记录的网站。纯 IPv4 主机应该能（通过 IPv4）顺利连接。',
    detail: ''
  },
  {
    name: '双栈域名大数据包传输测试',
    status: '等待测试',
    time: '-',
    description: '验证你能否连接双栈服务器并收发大数据包。如果这项测试超时，无论是什么原因，你在世界 IPv6 日都会遇上麻烦。',
    detail: ''
  },
  {
    name: '无域名 IPv4 连接测试',
    status: '等待测试',
    time: '-',
    description: '这项测试直接通过 IPv4 地址发起连接，大多数人都应当成功，除非用的是纯 IPv6。',
    detail: ''
  },
  {
    name: '无域名 IPv6 连接测试',
    status: '等待测试',
    time: '-',
    description: '这项测试直接通过 IPv6 地址发起连接，意在排除 DNS 问题的干扰后测试 IPv6。',
    detail: ''
  },
  {
    name: 'IPv6 大数据包传输测试',
    status: '等待测试',
    time: '-',
    description: '验证 IPv6 能否传输大数据包。如果这项测试超时，但其他 IPv6 测试成功，那么可能存在 PMTUD 问题。',
    detail: ''
  },
  {
    name: '测试运营商 DNS 是否接入 IPv6',
    status: '等待测试',
    time: '-',
    description: '测试你的 DNS 服务器（通常由运营商提供）能否访问纯 IPv6 的 DNS 权威服务器。',
    detail: ''
  },
  {
    name: '查询 IPv4 运营商',
    status: '等待测试',
    time: '-',
    description: '尝试识别你的 IPv4 运营商。',
    detail: ''
  },
  {
    name: '查询 IPv6 运营商',
    status: '等待测试',
    time: '-',
    description: '尝试识别你的 IPv6 运营商。如果 IPv4 和 IPv6 运营商名称不一致，那么你可能使用了隧道。',
    detail: ''
  }
]);

const faqs = ref([
  {
    question: '这个测试的原理是什么？',
    answer: '本测试完全由客户端的 JavaScript 脚本完成。为了测试可达性，服务器会向仅支持 IPv6 的、双栈的等各种域名发出一系列 Ajax 请求，对这些请求的成败及耗时进行考量。',
  },
  {
    question: '为什么此网站只能通过 IPv4 访问？',
    answer: '没错，我们没有 AAAA 记录，这是有意的。部分用户无法访问双栈网站，要是他们连接不上，就无法得知问题所在。这也是当下内容提供商所处的一大困境，而我就在这么一个提供商工作。因此，主要的测试页面需要使用 IPv4（原生的或转换后的均可）。有朝一日，当“故障”用户的比例显著下降后，我会考虑为 test-ipv6.com 部署双栈。',
  },
  {
    question: '所谓的“故障”是什么意思？',
    answer: '现在一部分用户虽然用上了 IPv6，但要么用的是性能不佳的公共隧道，要么连上了故障或不理想的线路。可是既然他们连上了，RFC 3484 的地址选择算法往往就会选择 IPv6，然后试着用这条烂线路。而浏览器可能要过 75 秒以上才会放弃连接！',
  },
  {
    question: '统计信息有多大的参考价值？',
    answer: '被统计的都是自愿访问这个网站的人，不能代表普通网民。这个网站的目标本来就不是提供统计信息，而是让大家知道他们是否已经准备好迎接 IPv6 世界了（无论他们是否加入！）。',
  },
  {
    question: '你的测试和内容提供商的有什么差别？',
    answer: '内容提供商统计的是用户故障情况的宏观数据，目前还不会反馈给用户。这些数据很大程度上会决定他们什么时候放弃纯 IPv4，部署 IPv6。',
  },
  {
    question: '你真的会看反馈信息吗？',
    answer: '我会的，谢谢！但要注意，你得留下联系方式我才能联系上你。如果你没有留下联系方式，我仍然表示感谢，但我将无法回答你的问题。',
  },
  {
    question: '还有什么方式能联系你？',
    answer: '我希望你能使用联系表，因为它能提供你的网络状况，也不会有邮件过滤的问题。 但也欢迎你直接发邮件到 jfesler@test-ipv6.com。',
  },
  {
    question: '此网站是开源的吗？',
    answer: '是的，此网站是开源的。你可以在 GitHub 上找到相关代码。',
  },
]);

const ipv6Status = computed(() => {
  if (ipv6Address.value) return ipv6Address.value;
  if (networkChecked.value && !hasIPv6.value) return '未检测到 IPv6 地址';
  return '正在检测...';
});

const ispStatus = computed(() => {
  if (isp.value !== '检测中...') return isp.value;
  if (networkChecked.value) return '检测失败';
  return '正在检测...';
});

const toggleFAQ = () => {
  showFAQ.value = !showFAQ.value;
};

const toggleTestDetails = () => {
  showTestDetails.value = !showTestDetails.value;
};

const checkNetwork = async () => {
  try {
    // 检测 IPv4
    const ipv4Response = await fetch('https://api.ipify.org?format=json');
    const ipv4Data = await ipv4Response.json();
    ipv4Address.value = ipv4Data.ip;

    // 检测 IPv6（添加超时处理）
    const ipv6Promise = fetch('https://api6.ipify.org?format=json', {
      signal: AbortSignal.timeout(5000) // 5秒超时
    });

    try {
      const ipv6Response = await ipv6Promise;
      const ipv6Data = await ipv6Response.json();
      ipv6Address.value = ipv6Data.ip;
      hasIPv6.value = true;
    } catch (error) {
      console.log('IPv6 check failed:', error);
      ipv6Address.value = '';
      hasIPv6.value = false;
    }
    
    // 获取 ISP 信息（使用 ipapi.co 作为备选）
    try {
      const ispResponse = await fetch(`https://ipapi.co/${ipv4Address.value}/json/`);
      const ispData = await ispResponse.json();
      isp.value = ispData.org || ispData.isp || '未知运营商';
    } catch (ispError) {
      // 如果第一个 API 失败，尝试使用备选 API
      try {
        const backupIspResponse = await fetch(`https://ip-api.com/json/${ipv4Address.value}`);
        const backupIspData = await backupIspResponse.json();
        isp.value = backupIspData.isp || '未知运营商';
      } catch (backupError) {
        isp.value = '获取运营商信息失败';
      }
    }

    // 计算 IPv6 得分
    calculateIPv6Score();
  } catch (error) {
    console.error('Network check failed:', error);
    hasIPv6.value = false;
    ipv4Address.value = '检测失败';
  } finally {
    networkChecked.value = true;
    networkType.value = hasIPv6.value ? 'IPv4 + IPv6 双栈' : 'IPv4 单栈';
  }
};

const calculateIPv6Score = () => {
  let score = 0;
  if (hasIPv6.value) score += 5;
  if (dnsSupportsIPv6.value) score += 2;
  if (ipv6Address.value) score += 3;
  ipv6Score.value = score;
};

const getStatusClass = (status) => {
  const classes = {
    '成功': 'text-success',
    '失败': 'text-error',
    '超时': 'text-warning',
    '等待测试': 'text-gray-500',
    '测试中': 'text-info'
  };
  return classes[status] || 'text-gray-500';
};

const runTest = async (testIndex, testFn) => {
  const test = testResults.value[testIndex];
  test.status = '测试中';
  const startTime = performance.now();
  
  try {
    const result = await testFn();
    test.status = result.success ? '成功' : '失败';
    test.detail = result.detail || '';
  } catch (error) {
    test.status = error.name === 'TimeoutError' ? '超时' : '失败';
    test.detail = error.message;
  } finally {
    const endTime = performance.now();
    test.time = `${((endTime - startTime) / 1000).toFixed(3)}s`;
  }
};

const testIPv6 = async () => {
  testing.value = true;
  try {
    await Promise.all([
      // IPv4 域名连接测试
      runTest(0, async () => {
        const response = await fetch('https://ipv4.ipv6ready.me/ip/?callback=?', {
          signal: AbortSignal.timeout(5000)
        });
        return { success: response.ok, detail: 'IPv4 连接成功' };
      }),

      // IPv6 域名连接测试
      runTest(1, async () => {
        const response = await fetch('https://ipv6.ipv6ready.me/ip/?callback=?', {
          signal: AbortSignal.timeout(5000)
        });
        return { success: response.ok, detail: 'IPv6 连接成功' };
      }),

      // 双栈域名连接测试
      runTest(2, async () => {
        const response = await fetch('https://ds.ipv6ready.me/ip/?callback=?', {
          signal: AbortSignal.timeout(5000)
        });
        return { success: response.ok, detail: '双栈连接成功' };
      }),

      // 双栈域名大数据包传输测试
      runTest(3, async () => {
        const response = await fetch('https://ds.ipv6ready.me/ip/?callback=?&size=1600&fill=xxx...xxx', {
          signal: AbortSignal.timeout(6000)
        });
        return { success: response.ok, detail: '大数据包传输成功' };
      }),

      // 无域名 IPv4 连接测试
      runTest(4, async () => {
        const response = await fetch('https://163.44.117.45/ip/?callback=?', {
          signal: AbortSignal.timeout(5000)
        });
        return { success: response.ok, detail: '直连 IPv4 成功' };
      }),

      // 无域名 IPv6 连接测试
      runTest(5, async () => {
        const response = await fetch('https://[2400:8500:2002:3319:163:44:117:45]:80/ip/?callback=?', {
          signal: AbortSignal.timeout(5000)
        });
        return { success: response.ok, detail: '直连 IPv6 成功' };
      }),

      // IPv6 大数据包传输测试
      runTest(6, async () => {
        const response = await fetch('https://mtu1280.ipv6ready.me/ip/?callback=?&size=1600&fill=xxx...xxx', {
          signal: AbortSignal.timeout(5000)
        });
        return { success: response.ok, detail: 'IPv6 大数据包传输成功' };
      }),

      // DNS IPv6 支持测试
      runTest(7, async () => {
        const response = await fetch('https://ds.v6ns.ipv6ready.me/ip/?callback=?', {
          signal: AbortSignal.timeout(16000)
        });
        return { success: response.ok, detail: 'DNS 支持 IPv6' };
      }),

      // IPv4 运营商查询
      runTest(8, async () => {
        const response = await fetch('https://ipv4.lookup.test-ipv6.com/ip/?callback=?&asn=1', {
          signal: AbortSignal.timeout(5000)
        });
        const data = await response.json();
        return { success: true, detail: `IPv4 ASN: ${data.asn || '未知'}` };
      }),

      // IPv6 运营商查询
      runTest(9, async () => {
        const response = await fetch('https://ipv6.lookup.test-ipv6.com/ip/?callback=?&asn=1', {
          signal: AbortSignal.timeout(5000)
        });
        const data = await response.json();
        return { success: true, detail: `IPv6 ASN: ${data.asn || '未知'}` };
      })
    ]);
  } catch (error) {
    console.error('Tests failed:', error);
  } finally {
    testing.value = false;
  }
};

const checkDNSSupport = async () => {
  try {
    const dnsResponse = await fetch('https://dns.google/resolve?name=ipv6.google.com&type=AAAA');
    const dnsData = await dnsResponse.json();
    dnsSupportsIPv6.value = dnsData.Answer && dnsData.Answer.length > 0;
  } catch (error) {
    console.error('DNS check failed:', error);
    dnsSupportsIPv6.value = false;
  }
};

onMounted(async () => {
  await checkNetwork();
  await checkDNSSupport();
});
</script>

<style scoped>
.main {
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
}

.network-status {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats {
  width: 100%;
}

@media (max-width: 640px) {
  .stats {
    flex-direction: column;
  }
}

.collapse-arrow .collapse-title:after {
  transition: all 0.25s;
}

.collapse[open] .collapse-title:after {
  transform: rotate(180deg);
}

.alert {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.collapse-title {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

.collapse-content {
  padding: 1rem;
}
</style>
