let ip = '//117.34.118.44'
let port1 = 33066
let port2 = 33063
export let urlList = {
  wellInfo: ip + ':' + port1 + '/iocollection/deviceslist',
  realtime: ip + ':' + port1 + '/iocollection/getdata?tags=["0"]&info_type="1"',
  history: ip + ':' + port2 + '/getHistoryDatas',
  img: 'http://117.34.118.44:33063/getFieldImage'
}
