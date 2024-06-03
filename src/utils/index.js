import { SM4 } from 'gm-crypto'
import {userStore} from '../store/user'
// const store = userStore()
// sm4对字符串加密
export function encrypt(originalData) {
  const { SM4Key } = userStore()
  if (originalData === '' || originalData === null || originalData === undefined)
    return originalData
  try {
    return SM4.encrypt(originalData + '', SM4Key, {
      inputEncoding: 'utf8',
      outputEncoding: 'hex',
    })
  } catch (error) {
    console.error('🐛: ~ encrypt ~ error:', originalData, error)
  }
}

// sm4对字符串解密
export function decrypt(encryptedData) {
  const { SM4Key } = userStore()
  try {
    const decryptedData = SM4.decrypt(encryptedData, SM4Key, {
      inputEncoding: 'hex',
      outputEncoding: 'utf8',
    })
    console.log("===🐛=== ~ decrypt ~ decryptedData:", decryptedData);
    try {
      return JSON.parse(decryptedData)
    } catch (error) {
      return decryptedData
    }
  } catch (error) {
    return encryptedData
  }
}