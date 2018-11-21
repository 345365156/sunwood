/**
 * filter 和 formatter
 */

// 小数转换为百分数
const percentCheck = (num) => {
  if (num === 0) {
    return '0%'
  } else if (!num) {
    return '0%'
  } else {
    return (num * 100) + '%'
  }
}

// 性别formatter
const sexFormatter = (sex) => {
  if (sex === 1) {
    return '男'
  } else if (sex === 2) {
    return '女'
  } else {
    return ''
  }
}

// 任务状态formatter
const taskStatusFormatter = (status) => {
  switch (status) {
    case 1:
      return '待处理'
    case 2:
      return '已处理'
    case 3:
      return '追踪中'
    case 4:
      return '已完成'
  }
}

// 有效应用Formatter
const taskAPPFormatter = (appType) => {
  switch (appType) {
    case 1:
      return '钱包到'
  }
}

// 处理结果
const dealResultFormatter = (deal) => {
  if (deal === 1) {
    return '已呼通'
  } else {
    return '未呼通'
  }
}

// 追踪状态
const trackStatusFormatter = (status) => {
  if (status === 1) {
    return '追踪中'
  } else {
    return '追踪结束'
  }
}

// 是否为空
const nullCheck = (val) => {
  return (val !== null && val !== '') ? val : '--'
}
export default {
  percentCheck,
  sexFormatter,
  taskStatusFormatter,
  taskAPPFormatter,
  dealResultFormatter,
  trackStatusFormatter,
  nullCheck
}
