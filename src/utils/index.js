import { sm4 } from 'jxk'
import {userStore} from '../store/user'
// const store = userStore()
// sm4对字符串加密
export function encrypt(originalData) {
  const { SM4Key } = userStore()
  if (originalData === '' || originalData === null || originalData === undefined) {
    return originalData;
  }
  try {
    return SM4Key ? sm4.encrypt(originalData + '', SM4Key) : originalData;
  } catch (error) {
    return originalData;
  }
}

// sm4对字符串解密
export function decrypt(encryptedData) {
  const { SM4Key } = userStore()
  if (encryptedData === '' || encryptedData === null || encryptedData === undefined) {
    return encryptedData;
  }
  try {
    return SM4Key ? sm4.decrypt(encryptedData, SM4Key) : encryptedData;
  } catch (error) {
    return encryptedData;
  }
}