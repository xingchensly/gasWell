let ip = '//117.34.118.57'
let port1 = 33066
let port2 = 33063
export let urlList = {
  realtime: ip + ':' + port1 + '/iocollection/getdata?device_id="14"&tags=["0"]&info_type="1"',
  history: ip + ':' + port2 + '/getHistoryDatas'
}
