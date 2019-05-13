const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()
  const yearMonthDay = [year, month, day].map(formatNumber).join('-');
  const hourMinute = [hour, minute].map(formatNumber).join(':');
  return `${yearMonthDay} ${hourMinute}`;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}