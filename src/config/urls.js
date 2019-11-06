// let ip = '//10.59.210.19'
let ip = process.env.NODE_ENV == 'production'?'//10.59.210.19':'//117.34.118.44'
// let port = 8080
console.log("urls")
let port = process.env.NODE_ENV == 'production'?8080:33063
let port1 = 33066
export let urlList = {
  loginIn: ip + ':' + port1 + '/iocollection/loginIn',
  setData: ip + ':' + port1 + '/iocollection/setdata',
  wellInfo: ip + ':' + port1 + '/iocollection/deviceslist',
  realtime: ip + ':' + port1 + '/iocollection/getdata?tags=["0"]&info_type="1"',
  history: ip + ':' + port + '/getHistoryDatas',

  img: ip + ':' + port + '/basic/getfieldimage',
  userCreatUser: `${ip}:${port}/user/createuser`,
  userLoginIn: `${ip}:${port}/user/login`,
  userLoginOut: `${ip}:${port}/user/logoff`,
  userGetWellRealTimeData: `${ip}:${port}/realtime/getrealtimebywellid`,
  userGetFieldRealTimeData: `${ip}:${port}/realtime/getrealtimebyfieldid`,
  userGetHistoryData: `${ip}:${port}/history/gethistorybytagid`,
  userGetWellList: `${ip}:${port}/basic/getwellsbyfieldid`
}
