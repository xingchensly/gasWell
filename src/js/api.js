import 'whatwg-fetch'
import { urlList } from '../config/urls.js'
var md5 = require('js-md5')

export const loginIn = async (user) => {
  try {
    const res = await fetch(`${urlList.loginIn}?user="${user.name}"&code="${md5(user.code)}`, {
      method: 'get'
    })
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}

export const setWellData = async (deviceId, tagName, tagValue) => {
  try {
    const res = await fetch(`${urlList.setData}?device_id="${deviceId}"&tag_name="${tagName}"&tag_value="${tagValue}"`, {
      method: 'get'
    })
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}
export const getWellInfo = async () => {
  try {
    const res = await fetch(`${urlList.wellInfo}`, {
      method: 'get'
    })
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}
export const getRealTimeData = async (deviceId) => {
  try {
    let datas = {}
    // eslint-disable-next-line eqeqeq
    const res = await fetch(`${urlList.realtime}&device_id="14"`, {
      method: 'get'
    })
    if (res.ok) {
      datas = await res.json()
    }
    // eslint-disable-next-line eqeqeq
    if (deviceId != undefined) {
      let devId = deviceId
      const res2 = await fetch(`${urlList.realtime}&device_id="${devId}"`, {
        method: 'get'
      })
      if (res2.ok) {
        let datas2 = await res2.json()
        for (let key in datas2) {
          datas[key] = datas2[key]
        }
      }
    }
    return datas
  } catch (e) {
    console.log('err +++++', e)
  }
}
export const getHistoryData = async (tagArr, st, et) => {
  try {
    const res = await fetch(`${urlList.history}?tagArr=${tagArr}&startTime=${st}&endTime=${et}`, {
      method: 'get'
    })
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}
