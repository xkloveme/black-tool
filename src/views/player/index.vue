<template>
  <div id="player-container">
    <div class="input-section">
      <div class="input-group">
        <input 
          v-model="videoUrl" 
          class="url-input"
          placeholder="输入视频直链(支持MP4/M3U8/HLS/DASH)或选择直播源"
          @keyup.enter="handleUrlInput"
        >
        <select 
          class="source-select"
          v-model="selectedSource"
          @change="handleSourceChange"
        >
          <option value="">选择直播源</option>
          <option 
            v-for="source in quickSources" 
            :key="source.url"
            :value="source.url"
          >
            {{ source.name }}
          </option>
        </select>
      </div>
      <button 
        class="load-btn" 
        @click="handleUrlInput" 
        :disabled="loading || !videoUrl.trim()"
      >
        <span class="loading-spinner" v-if="loading"></span>
        {{ loading ? '加载中...' : '播放' }}
      </button>
    </div>
    
    <div v-if="videoUrl.trim() || playlist.length" class="main-content">
      <div class="video-container">
        <div v-if="!hasVideo" class="default-cover">
          <div class="cover-text">
            <h3>欢迎使用在线播放器</h3>
            <p>请输入播放地址开始观看</p>
          </div>
        </div>
       
        
        <div ref="dplayerRef" class="dplayer" :class="{ 'hidden': !hasVideo }"></div>
        
        <transition name="fade">
          <div v-if="showChannelInfo" class="channel-overlay">
            <div class="channel-info-content">
              <div class="channel-header">
                <img v-if="currentChannel?.tvgLogo" 
                     :src="currentChannel.tvgLogo" 
                     class="channel-logo"
                     @error="handleLogoError"
                >
                <div class="channel-title">
                  <div class="playing-badge">
                    <span class="dot"></span>
                    正在播放
                  </div>
                  <div class="channel-name">{{ currentChannel?.name || getVideoFileName(videoUrl) }}</div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="player-controls">
          <button class="control-btn" @click="toggleSidebar">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/>
            </svg>
            {{ sidebarCollapsed ? '显示频道' : '隐藏频道' }}
          </button>
        </div>

        <transition name="fade">
          <div v-show="!sidebarCollapsed" class="floating-primary-sidebar">
            <div class="sidebar-header">
              <h3>频道分类</h3>
              <button class="close-btn" @click="toggleSidebar">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div class="group-list">
              <div v-for="(group, groupName) in sortedGroupedPlaylist" 
                   :key="groupName" 
                   class="group-item"
                   :class="{ 'active': activeGroup === groupName }"
                   @click="selectGroup(groupName)"
              >
                <span class="group-name">{{ groupName || '未分组' }}</span>
                <span class="group-count">{{ group.length }} 个频道</span>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <transition name="slide-right">
        <div v-if="activeGroup" class="secondary-sidebar">
          <div class="sidebar-header">
            <h3>{{ activeGroup }}</h3>
            <button class="close-btn" @click="closeSecondary">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          <ul class="channel-list">
            <li v-for="(channel, index) in activeGroupChannels" 
                :key="channel.url"
                :class="{ active: currentIndex === getGlobalIndex(activeGroup, index) }"
                @click="playVideo(channel, getGlobalIndex(activeGroup, index))"
            >
              <div class="channel-info">
                <div class="channel-main">
                  <span class="channel-number">{{ getGlobalIndex(activeGroup, index) + 1 }}. </span>
                  <span class="channel-name">{{ getVideoName(channel) }}</span>
                </div>
                <div class="channel-meta">
                  <span v-if="isIPv6(channel.url)" class="meta-tag ipv6-tag">IPv6</span>
                  <span v-if="getStreamQuality(channel.url)" class="meta-tag quality-tag">
                    {{ getStreamQuality(channel.url) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <img v-else src="../../assets/bg.webp" alt="默认封面" class="cover-image">
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import DPlayer from 'dplayer';
import Hls from 'hls.js';

// 响应式状态
const dplayerRef = ref(null);
const player = ref(null);
const loading = ref(false);
const playlist = ref([]);
const currentIndex = ref(0);
const error = ref(null);
const videoUrl = ref('');
const collapsedGroups = ref({});
const groupedPlaylist = computed(() => {
  const groups = {};
  playlist.value.forEach(channel => {
    const groupName = channel.groupTitle || '未分组';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(channel);
  });
  return groups;
});

// 添加计算属性：排序后的分组列表
const sortedGroupedPlaylist = computed(() => {
  const groups = { ...groupedPlaylist.value };
  // 按分组名称排序
  return Object.keys(groups)
    .sort((a, b) => {
      if (a === '未分组') return 1;
      if (b === '未分组') return -1;
      return a.localeCompare(b);
    })
    .reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
});

// 添加新的响应式状态
const showChannelInfo = ref(false);
const currentChannel = ref(null);
const sidebarCollapsed = ref(false);
const activeGroup = ref(null);
const activeGroupChannels = computed(() => {
  if (!activeGroup.value) return [];
  return groupedPlaylist.value[activeGroup.value] || [];
});
const hasVideo = ref(false);

// 添加选中的直播源状态
const selectedSource = ref('');

// 方法
const handleUrlInput = async () => {
  if (!videoUrl.value) {
    showMessage('请输入播放地址', 'warning');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // 判断是否是M3U文件
    if (videoUrl.value.toLowerCase().endsWith('.m3u') || 
        videoUrl.value.toLowerCase().endsWith('.m3u8')) {
      // 加载M3U播放列表
      const response = await fetch(videoUrl.value);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      playlist.value = parseM3U(text);
      
      if (playlist.value.length > 0) {
        await playVideo(playlist.value[0], 0);
        showMessage('播放列表加载成功', 'success');
      } else {
        showMessage('没有找到有效的媒体链接', 'warning');
      }
    } else {
      // 直接播放视频链接
      await playDirectVideo(videoUrl.value);
    }
  } catch (err) {
    console.error('加载失败:', err);
    error.value = '加载失败，请检查地址是否正确';
    showMessage('加载失败，请检查地址是否正确', 'error');
  } finally {
    loading.value = false;
  }
};

const playDirectVideo = async (url) => {
  try {
    if (player.value) {
      player.value.destroy();
    }
    
    if (!dplayerRef.value) {
      throw new Error('播放器容器未找到');
    }

    const videoType = getVideoType(url);
    
    player.value = new DPlayer({
      container: dplayerRef.value,
      video: {
        url: url,
        type: videoType,
        customType: {
          hls: function (video, player) {
            const hls = new Hls();
            hls.loadSource(video.src);
            hls.attachMedia(video);
          }
        }
      },
      autoplay: true,
      live: videoType === 'hls',
      preload: 'auto',
    });

    hasVideo.value = true;
    showChannelOverlay({ name: getVideoFileName(url) });

  } catch (err) {
    console.error('播放器初始化失败:', err);
    showMessage('播放失败，请检查视频地址', 'error');
    hasVideo.value = false;
  }
};

const getVideoType = (url) => {
  const ext = url.toLowerCase().split('?')[0].split('.').pop();
  switch (ext) {
    case 'm3u8':
      return 'hls';
    case 'mp4':
      return 'auto';
    case 'flv':
      return 'flv';
    default:
      return 'auto';
  }
};

const getVideoFileName = (url) => {
  try {
    const urlObj = new URL(url);
    const fileName = urlObj.pathname.split('/').pop();
    return decodeURIComponent(fileName) || '未知视频';
  } catch {
    return '未知视频';
  }
};

const parseM3U = (data) => {
  const lines = data.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:-1')) {
      currentChannel = {};
      
      // 解析tvg-name, tvg-id, tvg-logo, group-title
      const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
      const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupTitleMatch = line.match(/group-title="([^"]+)"/);
      
      // 解析频道名称（在最后一个逗号后面）
      const nameMatch = line.match(/,\s*(.+)$/);

      currentChannel.tvgName = tvgNameMatch?.[1] || '';
      currentChannel.tvgId = tvgIdMatch?.[1] || '';
      currentChannel.tvgLogo = tvgLogoMatch?.[1] || '';
      currentChannel.groupTitle = groupTitleMatch?.[1] || '';
      currentChannel.name = nameMatch?.[1] || currentChannel.tvgName;
      
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel);
      }
      currentChannel = {};
    }
  }

  return channels;
};

const getVideoName = (channel) => {
  return channel.name || '未命名频道';
};

const showMessage = (message, type) => {
  const oldToast = document.querySelector('.toast');
  if (oldToast) {
    oldToast.remove();
  }

  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast toast-center z-50';
  
  const alert = document.createElement('div');
  
  switch(type) {
    case 'success':
      alert.className = 'alert alert-success min-h-0 message-alert';
      break;
    case 'warning':
      alert.className = 'alert alert-warning min-h-0 message-alert';
      break;
    case 'error':
      alert.className = 'alert alert-error min-h-0 message-alert';
      break;
    default:
      alert.className = 'alert alert-info min-h-0 message-alert';
  }

  alert.innerHTML = `
    <span class="message-text">${message}</span>
  `;

  toastContainer.appendChild(alert);
  document.body.appendChild(toastContainer);

  requestAnimationFrame(() => {
    alert.classList.add('show');
  });

  setTimeout(() => {
    alert.classList.add('hide');
    setTimeout(() => {
      toastContainer.remove();
    }, 300);
  }, 2700);
};

const playVideo = async (channel, index) => {
  try {
    if (player.value) {
      player.value.destroy();
    }
    
    if (!dplayerRef.value) {
      throw new Error('播放器容器未找到');
    }

    currentIndex.value = index;
    player.value = new DPlayer({
      container: dplayerRef.value,
      video: {
        url: channel.url,
        type: 'hls',
        customType: {
          hls: function (video, player) {
            const hls = new Hls();
            hls.loadSource(video.src);
            hls.attachMedia(video);
          }
        }
      },
      autoplay: true,
      live: true,
      preload: 'auto',
    });

    hasVideo.value = true;
    showChannelOverlay(channel);

  } catch (err) {
    console.error('播放器初始化失败:', err);
    error.value = '播放器初始化失败，请刷新页面重试';
    showMessage('播放器初始化失败', 'error');
    hasVideo.value = false;
  }
};

// 切换分组展开/折叠
const toggleGroup = (groupName) => {
  collapsedGroups.value[groupName] = !collapsedGroups.value[groupName];
};

// 获取频道在整个列表中的索引
const getGlobalIndex = (groupName, localIndex) => {
  let globalIndex = 0;
  for (const [name, channels] of Object.entries(groupedPlaylist.value)) {
    if (name === groupName) {
      return globalIndex + localIndex;
    }
    globalIndex += channels.length;
  }
  return localIndex;
};

// 判断分组是否包含当前播放的频道
const hasActiveChannel = (group) => {
  return group.some((channel, index) => 
    currentIndex.value === getGlobalIndex(group[0].groupTitle || '未分组', index)
  );
};

// 获取流媒体质量
const getStreamQuality = (url) => {
  if (url.includes('_1080')) return 'HD';
  if (url.includes('_720')) return '720P';
  if (url.includes('_480')) return '480P';
  return '';
};

// 全部展开/折叠
const expandAllGroups = () => {
  Object.keys(groupedPlaylist.value).forEach(groupName => {
    collapsedGroups.value[groupName] = false;
  });
};

const collapseAllGroups = () => {
  Object.keys(groupedPlaylist.value).forEach(groupName => {
    collapsedGroups.value[groupName] = true;
  });
};

// 处理频道信息显示
const showChannelOverlay = (channel) => {
  // 先清除之前的定时器
  if (window.channelInfoTimer) {
    clearTimeout(window.channelInfoTimer);
  }
  
  currentChannel.value = channel;
  showChannelInfo.value = true;
  
  // 设置新的定时器
  window.channelInfoTimer = setTimeout(() => {
    showChannelInfo.value = false;
  }, 3000);
};

// 处理logo加载错误
const handleLogoError = (event) => {
  event.target.style.display = 'none';
};

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  // 如果隐藏分类，同时关闭二级菜单
  if (sidebarCollapsed.value) {
    activeGroup.value = null;
  }
};

// 选择分组
const selectGroup = (groupName) => {
  activeGroup.value = groupName;
};

// 关闭二级菜单
const closeSecondary = () => {
  activeGroup.value = null;
};

// 生命周期钩子
onMounted(() => {
  // 不再自动加载 M3U
});

onUnmounted(() => {
  if (window.channelInfoTimer) {
    clearTimeout(window.channelInfoTimer);
  }
  if (player.value) {
    player.value.destroy();
  }
});

// 添加新的方法
const isIPv6 = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.includes(':');
  } catch {
    return false;
  }
};

const getGroupIndex = (groupName) => {
  return Object.keys(sortedGroupedPlaylist.value).indexOf(groupName) + 1;
};

// 修改快捷直播源配置
const quickSources = [
  {
    name: 'IPTV直播源',
    url: 'https://live.kilvn.com/iptv.m3u'
  },
  {
    name: 'IPTV4直播源',
    url: 'https://live.zbds.top/tv/iptv4.m3u'
  },
  {
    name: 'IPV6直播源',
    url: 'https://live.zbds.top/tv/iptv6.m3u'
  }
];

// 修改快捷源选择方法
const handleSourceChange = () => {
  if (selectedSource.value) {
    videoUrl.value = selectedSource.value;
    handleUrlInput();
  }
};
</script>

<style scoped>
#player-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.player-wrapper {
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.main-content {
  position: relative;
  height: calc(100vh - 180px);
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.primary-sidebar {
  width: 200px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: white;
  z-index: 2;
}

.secondary-sidebar {
  width: 360px;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  color: white;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.video-container {
  flex: 1;
  position: relative;
}

.dplayer {
  width: 100%;
  height: calc(100vh - 140px);
  background: #000;
}

.controls-panel {
  margin-top: 20px;
}

.load-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #409eff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.load-btn:hover {
  background: #66b1ff;
}

.load-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.playlist-wrapper {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.playlist-wrapper h3 {
  margin: 0 0 15px;
  color: #333;
  font-size: 16px;
}

.playlist-container {
  height: calc(100% - 60px);
  overflow-y: auto;
}

.playlist {
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist li {
  padding: 10px 15px 10px 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.playlist li:last-child {
  border-bottom: none;
}

.playlist li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.playlist li.active {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
}

.video-index {
  min-width: 24px;
  margin-right: 10px;
  color: #909399;
}

.video-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.group-title {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 自定义滚动条样式 */
.playlist-container::-webkit-scrollbar {
  width: 6px;
}

.playlist-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.playlist-container::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.error-message {
  text-align: center;
  padding: 20px;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 600px;
}

.retry-btn {
  margin-left: 10px;
  padding: 4px 12px;
  background: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #f78989;
}

/* 保持原有样式，添加输入框相关样式 */
.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
}

.input-group {
  flex: 1;
  display: flex;
  gap: 10px;
}

.url-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.url-input:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.source-select {
  width: 160px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  color: #606266;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23606266'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 32px;
}

.source-select:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.source-select:hover {
  border-color: #c0c4cc;
}

.source-select option {
  padding: 8px 12px;
}

.channel-group {
  border-bottom: 1px solid #eee;
}

.channel-group:last-child {
  border-bottom: none;
}

.group-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
  color: white;
}

.group-header:hover {
  background: rgba(255, 255, 255, 0.15);
}

.group-icon {
  transition: transform 0.3s;
  margin-right: 8px;
}

.group-icon.rotate-90 {
  transform: rotate(90deg);
}

.group-name {
  flex: 1;
  font-weight: 500;
  color: #606266;
}

.group-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.group-item:hover .group-count {
  background: rgba(255, 255, 255, 0.15);
}

.group-item.active .group-count {
  background: rgba(64, 158, 255, 0.3);
  color: #409eff;
}

.channel-logo {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  object-fit: contain;
}

.channel-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 添加 toast 相关样式 */
:global(.compact-toast) {
  @apply text-sm shadow-lg;
  margin-top: 1rem;
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.3s ease;
}

:global(.compact-toast.show) {
  transform: translateY(0);
  opacity: 1;
}

:global(.compact-toast.hide) {
  transform: translateY(-20px);
  opacity: 0;
}

:global(.toast) {
  top: 0.5rem;
}

:global(.toast .alert) {
  width: auto;
  max-width: 300px;
}

/* 添加新样式 */
.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.group-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  font-size: 12px;
  color: #606266;
  background: #f4f4f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #e9e9eb;
  color: #409eff;
}

.active-group .group-header {
  background: #e6f1fc;
  color: #409eff;
}

.channel-quality {
  font-size: 12px;
  color: #67c23a;
  margin-left: 8px;
}

/* 添加过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 侧边栏样式 */
.sidebar-playlist {
  width: 300px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  height: calc(100vh - 140px);
  transition: all 0.3s ease;
  border-radius: 8px;
  color: white;
}

.sidebar-playlist.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 频道信息浮层 */
.channel-overlay {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.channel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
}

.channel-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
}

.channel-title {
  flex: 1;
  text-align: left;
}

.playing-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #67c23a;
  font-size: 12px;
  margin-bottom: 4px;
}

.channel-name {
  color: white;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fixed-header {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  gap: 10px;
}

.main-content {
  margin-top: 60px;
  display: flex;
  height: calc(100vh - 60px);
  position: relative;
}

.video-container {
  flex: 1;
  position: relative;
  background: #000;
}

.floating-primary-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 240px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  color: white;
  z-index: 2;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-primary-sidebar.collapsed {
  width: 40px;
  overflow: hidden;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.group-index {
  font-size: 12px;
  color: #909399;
  min-width: 30px;
}

.secondary-sidebar {
  width: 360px;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.channel-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-number {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  min-width: 36px;
}

.channel-meta {
  display: flex;
  gap: 8px;
  margin-left: 36px;
  font-size: 11px;
}

.meta-tag {
  padding: 1px 6px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.ipv6-tag {
  background: rgba(64, 158, 255, 0.15);
  color: #409eff;
}

.quality-tag {
  background: rgba(103, 194, 58, 0.15);
  color: #67c23a;
}

/* 列表项悬停和激活状态 */
.channel-list li {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.channel-list li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.channel-list li.active {
  background: rgba(64, 158, 255, 0.15);
}

.channel-list li.active .channel-number,
.channel-list li.active .channel-name {
  color: #409eff;
}

/* 动画效果 */
.dot {
  width: 6px;
  height: 6px;
  background: #67c23a;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 5px rgba(103, 194, 58, 0.5);
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .fixed-header {
    top: 60px;
    padding: 10px;
  }

  .player-controls {
    bottom: 80px;
  }

  .control-btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  .channel-overlay {
    width: 90%;
    bottom: 120px;
  }
}

.player-controls {
  position: absolute;
  bottom: 60px;
  right: 20px;
  z-index: 10;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.channel-overlay {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 16px 24px;
  border-radius: 8px;
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.channel-info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.current-playing {
  font-size: 12px;
  color: #909399;
}

.channel-name {
  font-size: 18px;
  font-weight: 500;
  color: white;
}

.channel-number {
  font-size: 14px;
  color: #409eff;
}

.channel-list li {
  padding: 12px 16px;
}

.channel-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-number {
  color: #909399;
  font-size: 14px;
}

/* 优化移动端样式 */
@media (max-width: 768px) {
  .fixed-header {
    top: 60px;
    padding: 10px;
  }

  .player-controls {
    bottom: 80px;
  }

  .control-btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  .channel-overlay {
    width: 90%;
    bottom: 120px;
  }
}

.default-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1a1a1a;
  color: white;
}

.cover-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cover-text {
  text-align: center;
}

.cover-text h3 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
  color: white;
}

.cover-text p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.dplayer.hidden {
  display: none;
}

/* 消息提示样式 */
:global(.toast) {
  position: fixed;
  top: 20px !important;
  left: 50% !important;
  transform: translateX(-50%);
  pointer-events: none;
}

:global(.message-alert) {
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 !important;
  min-width: 280px;
  text-align: center;
  backdrop-filter: blur(8px);
}

:global(.message-text) {
  font-size: 14px;
  font-weight: 500;
}

:global(.message-alert.show) {
  transform: translateY(0);
  opacity: 1;
}

:global(.message-alert.hide) {
  transform: translateY(-20px);
  opacity: 0;
}

/* 不同类型消息的样式 */
:global(.alert-success) {
  background: rgba(103, 194, 58, 0.9) !important;
  border: 1px solid rgba(103, 194, 58, 0.2);
  color: white !important;
}

:global(.alert-warning) {
  background: rgba(230, 162, 60, 0.9) !important;
  border: 1px solid rgba(230, 162, 60, 0.2);
  color: white !important;
}

:global(.alert-error) {
  background: rgba(245, 108, 108, 0.9) !important;
  border: 1px solid rgba(245, 108, 108, 0.2);
  color: white !important;
}

:global(.alert-info) {
  background: rgba(64, 158, 255, 0.9) !important;
  border: 1px solid rgba(64, 158, 255, 0.2);
  color: white !important;
}
</style>
