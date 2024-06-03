import { defineStore } from "pinia";
export const userStore = defineStore("user", {
  state: () => {
    return {
      SM4Key: '',
      urlList: [],
    };
  },
  getters: {
    getkey () {
      return this.SM4Key;
    },
  },
  actions: {
    addKey (key) {
      this.SM4Key = key
    },
    addUrl (itemLink) { // 不能用箭头函数
      this.urlList.push(itemLink)
    }
  },
  //整个仓库持久化存储
  persist: {
    enabled: true,
    //指定字段存储，并且指定存储方式：
    strategies: [
      { storage: localStorage }, // accessToken字段用 localstorage存储
    ],
  },
});