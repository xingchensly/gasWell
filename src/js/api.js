import 'whatwg-fetch'
import { urlList } from '../config/urls.js'

export let getRealTimeData = (cb) => {
  // if (!city) return
  fetch(`${urlList.realtime}`, {
    method: 'get'
  })
    .then(res => {
      return res.json()
    })
    .then(data => {
      cb && cb(data)
    })
    .catch(err => {
      console.log('请求错误', err)
    })
}
export let getHistoryData = (tagArr, st, et, cb) => {
  // if (!city) return
  fetch(`${urlList.history}?tagArr=${tagArr}&startTime=${st}&endTime=${et}`, {
    method: 'get'
  })
    .then(res => {
      return res.json()
    })
    .then(data => {
      cb && cb(data)
    })
    .catch(err => {
      console.log('请求错误', err)
    })
}
