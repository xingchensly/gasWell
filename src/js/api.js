import 'whatwg-fetch'
import { urlList } from '../config/urls.js'

export const getWellInfo=async ()=>{
  try{
    const res=await fetch(`${urlList.wellInfo}`, {
      method: 'get'
    })
    if(res.ok){
      const data=await res.json();
      return data;
    }
  }catch(e){
    console.log('err +++++', ex)
  }
}
export const getRealTimeData=async (deviceId)=>{
  try{
    let devId=deviceId==undefined?'device_id="14"':'device_id='+deviceId;
    const res=await fetch(`${urlList.realtime}&${devId}`, {
      method: 'get'
    })
    if(res.ok){
      const data=await res.json();
      return data;
    }
  }catch(e){
    console.log('err +++++', ex)
  }
}
export const getHistoryData=async (tagArr, st, et)=>{
  try{
    const res=await fetch(`${urlList.history}?tagArr=${tagArr}&startTime=${st}&endTime=${et}`, {
      method: 'get'
    })
    if(res.ok){
      const data=await res.json();
      return data;
    }
  }catch(e){
    console.log('err +++++', ex)
  }
}

