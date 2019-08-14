import Socket from './socket.js'

window.WS = new Socket({
  url: 'ws://39.107.242.157',
  port: '9000',
  isHeartEvent: false,
  // 心跳时间（单位:ms）
  // 'heartBeat':5000,
  // 发送心跳信息（支持json传入）(这个一般内容不重要，除非后端变态)
  // 'heartMsg':'hello',
  // 开起重连
  'reconnect': false
  // 重连间隔时间（单位:ms）
  // 'reconnectTime':5000,
  // 重连次数
  // 'reconnectTimes':10
})
