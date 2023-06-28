export {}
// 学习枚举（enums）
// 创建枚举类型
enum Direction {
  Up,
  Down,
  Left,
  Right
}
// 给枚举指定默认值
enum Direction2 {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3
}
// 给枚举设置起始值
enum Direction3 {
  Up = 5,
  Down,
  Left,
  Right
}
// 给枚举设置字符串
enum Direction4 {
  Up = 'up',
  Down = 'Down',
  Left = 'left',
  Right = 'Right'
}
// 定义一个修改移动方向的方法
const moveTo = (dir: Direction4) => {
  console.log('向着' + dir + '方向移动')
}

moveTo(Direction4.Right)

// 应用场景：
// 1.0 0 -> 男 1 -> 女
enum Gender {
  'man' = 0,
  'woman' = 1
}
type Obj = {
  name: string
  age: number
  gender: Gender
}
const obj: Obj = {
  name: 'xjj',
  age: 18,
  gender: Gender.man
}
// 2. 1 -> 待付款  5 -> 已付款  8 -> 已完成
enum Status {
  wait = 1,
  pay = 5,
  finished = 8
}
type Order = {
  status: Status // 类型
}
const myOrder: Order = {
  status: Status.pay // 值
}
