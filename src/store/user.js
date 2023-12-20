import { defineStore } from "pinia";
export const userStore = defineStore("user", {
  state: () => {
    return {
      urlList: [],
    };
  },
  actions: {
    addUrl (itemLink) { // 不能用箭头函数
      this.urlList.push(itemLink)
    }
  },
  //整个仓库持久化存储
  persist: {
    enabled: true,
    //指定字段存储，并且指定存储方式：
    strategies: [
      { storage: localStorage, paths: ['urlList'] }, // accessToken字段用 localstorage存储
    ],
  },
});