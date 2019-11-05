import 'whatwg-fetch'
import { urlList } from '../config/urls.js'
var md5 = require('js-md5')

export const loginIn = async (user) => {
  try {
    const res = await fetch(`${urlList.loginIn}?user="${user.name}"&code="${md5(user.code)}"`, {
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
    const res = await fetch(`${urlList.realtime}?device_id="14"`, {
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
// 2019.11.03
// export const userCreat = async (user) => {
//   try {
//     const res = await fetch(`${urlList.userCreatUser}`, {
//       method: 'post',
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       headers: {
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify(user)
//       // mode: 'cors', // no-cors, cors, *same-origin
//     })
//     if (res.ok) {
//       const data = await res.json()
//       return data
//     }
//   } catch (e) {
//     console.log('err +++++', e)
//   }
// }

export const userLoginIn = async (user = {
  'userId': '000',
  'encryptedPwd': 'admin'
}) => {
  try {
    const res = await fetch(`${urlList.userLoginIn}`, {
      method: 'post',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user)
      // mode: 'cors', // no-cors, cors, *same-origin
    })
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}

// export const userLoginOut = async (user) => {
//   try {
//     const res = await fetch(`${urlList.userLoginIn}`, {
//       method: 'post',
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       headers: {
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify(user)
//       // mode: 'cors', // no-cors, cors, *same-origin
//     })
//     if (res.ok) {
//       const data = await res.json()
//       return data
//     }
//   } catch (e) {
//     console.log('err +++++', e)
//   }
// }

export const userGetWellRealTimeData = async (wellid = 1) => {
  try {
    let datas = {}
    // eslint-disable-next-line eqeqeq
    const res = await fetch(`${urlList.userGetWellRealTimeData}?wellid=${wellid}`, {
      method: 'get',
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    })
    if (res.ok) {
      datas = await res.json()
    }
    return datas
  } catch (e) {
    console.log('err +++++', e)
  }
}
export const userGetFieldRealTimeData = async (fieldId = 1) => {
  try {
    let datas = {}
    // eslint-disable-next-line eqeqeq
    const res = await fetch(`${urlList.userGetFieldRealTimeData}?fieldid=${fieldId}`, {
      method: 'get',
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    })
    if (res.ok) {
      datas = await res.json()
    }
    return datas
  } catch (e) {
    console.log('err +++++', e)
  }
}
export const userGetWellList = async (fieldid = 1) => {
  try {
    const res = await fetch(`${urlList.userGetWellList}?fieldid=${fieldid}`, {
      method: 'get',
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    })
    if (res.ok) {
      const data = await res.json()
      return data.info
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}
export const userGetWellHistory = async (tagName, start, end) => {
  try {
    // let start = createTime('yyyy-MM-dd hh:mm:ss', starts)
    // let end = createTime('yyyy-MM-dd hh:mm:ss', ends)
    const res = await fetch(`${urlList.userGetHistoryData}?tagnamearr=${tagName}&starttime=${start}&endtime=${end}`, {
      method: 'get',
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    })
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (e) {
    console.log('err +++++', e)
  }
}

function createTime (fmt, v) { 
  var date = new Date(v)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}
