/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-dupe-keys */
let colors = [
  '#3FB1E3',
  '#6BE6C1',
  '#F0EE7F',
  '#626C91',
  '#1A4968',
  '#5C658A',
  '#FFEE51'
]
// let defaultStyle = {
//   axis: {
//     // splitLine: { show: false },
//     // axisLine: {
//     //   lineStyle: {
//     //     color: '#fff'
//     //   }
//     // },
//     // axisLabel: {
//     //   color: '#fff',
//     //   fontSize: 10
//     // }
//   },
//   legend: {
//     // textStyle: {
//     //   color: '#fff'
//     // }
//   }
// }
export let chartValve = {
  // ...defaultStyle.axis,
  series: [
    {
      name: '阀门开度',
      type: 'gauge',
      detail: {formatter: '{value}%'},
      data: [{value: 0, name: '阀门开度'}]
    }
  ]
}

export let chartDataList = {
  lineArea2: {
    dataZoom: {
      type: 'inside'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      // ...defaultStyle.legend,
      // data: ['油压','累计流量','套压', '瞬时流量']
      data: ['油压', '累计流量', '套压', '瞬时流量', '光伏板电压']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        // ...defaultStyle.axis,
        type: 'time',
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        // ...defaultStyle.axis,
        type: 'value'
      }
    ],
    series: [
      {
        smooth: true,
        symbol: 'none',
        name: '油压',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '累计流量',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '套压',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '瞬时流量',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '光伏板电压',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: []
      }
    ],
    color: colors
  },
  zs_chart:{
    dataZoom: {
      type: 'inside'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      // ...defaultStyle.legend,
      // data: ['油压','累计流量','套压', '瞬时流量']
      data: ['油压', '累计流量', '套压']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        // ...defaultStyle.axis,
        type: 'time',
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        // ...defaultStyle.axis,
        type: 'value'
      }
    ],
    series: [
      {
        smooth: true,
        symbol: 'none',
        name: '油压',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '累计流量',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '套压',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      }
    ],
    color: colors
  },
  jx_chart:{
    dataZoom: {
      type: 'inside'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      // ...defaultStyle.legend,
      // data: ['油压','累计流量','套压', '瞬时流量']
      data: ['油压', '累计流量', '套压']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        // ...defaultStyle.axis,
        type: 'time',
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        // ...defaultStyle.axis,
        type: 'value'
      }
    ],
    series: [
      {
        smooth: true,
        symbol: 'none',
        name: '油压',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '累计流量',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      },
      {
        smooth: true,
        symbol: 'none',
        name: '套压',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: []
      }
    ],
    color: colors
  }
}
