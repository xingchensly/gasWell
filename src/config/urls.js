let ip = '//117.34.118.57'
let port1 = 33066
let port2 = 33063
export let urlList = {
  wellInfo:ip + ':' + port2 + '/getWellInfo',
  realtime: ip + ':' + port1 + '/iocollection/getdata?tags=["0"]&info_type="1"',
  history: ip + ':' + port2 + '/getHistoryDatas'
}
