// 创建文件：id-validator.d.ts
declare module 'id-validator' {
  export default class {
    isValid: (id: string) => boolean
    getInfo: (id: string) => {
      sex: number // 0 1
    }
  }
}
