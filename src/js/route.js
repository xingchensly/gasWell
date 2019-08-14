// import VueRouter from 'vue-router'

// import course from '../modules/course.vue'
// import charts from '../modules/charts.vue'
// import management from '../modules/management.vue'
// import alert from '../modules/alert.vue'
// import alertCur from '../modules/alertCur.vue'
// import alertHistory from '../modules/alertHistory.vue'
// import chartAnalyse from '../modules/chartAnalyse.vue'
// import chartCabin from '../modules/chartCabin.vue'
// import chartSunEnergy from '../modules/chartSunEnergy.vue'
// import chartEdit from '../modules/chartEdit.vue'
// import chartQuery from '../modules/chartQuery.vue'
// import analysis from '../modules/analysis.vue'
// import login from '../modules/login.vue'
// import user from '../modules/user.vue'
// import gasPipeline from '../modules/gasPipeline.vue'
// import htap from '../modules/htap.vue'
// import metering from '../modules/metering.vue'
// import largeScreen from '../modules/largeScreen.vue'
// import personManage from '../modules/personManage.vue'
// import sourceManage from '../modules/sourceManage.vue'
// import roleManage from '../modules/roleManage.vue'

// export let routes = [{
//   path: '/user',
//   name: 'user',
//   component: user,
//   children: [{
//     path: '/course',
//     name: 'course',
//     component: course,
//     children: [{
//       path: 'gasPipeline',
//       name: 'gasPipeline',
//       component: gasPipeline
//     },
//     {
//       path: 'htap',
//       name: 'htap',
//       component: htap
//     }, {
//       path: 'metering',
//       name: 'metering',
//       component: metering
//     }, {
//       path: 'largeScreen',
//       name: 'largeScreen',
//       component: largeScreen
//     }
//     ]
//   },
//   {
//     path: '/alert',
//     name: 'alert',
//     component: alert,
//     children: [
//       {
//         path: 'alertCur',
//         name: 'alertCur',
//         component: alertCur
//       }, {
//         path: 'alertHistory',
//         name: 'alertHistory',
//         component: alertHistory
//       }
//     ]
//   },
//   {
//     path: '/charts',
//     name: 'charts',
//     component: charts,
//     children: [{
//       path: 'chartQuery',
//       name: 'chartQuery',
//       component: chartQuery
//     },
//     {

//       path: 'chartEdit',
//       name: 'chartEdit',
//       component: chartEdit
//     },
//     {

//       path: 'chartAnalyse',
//       name: 'chartAnalyse',
//       component: chartAnalyse
//     },
//     {

//       path: 'chartCabin',
//       name: 'chartCabin',
//       component: chartCabin
//     },
//     {

//       path: 'chartSunEnergy',
//       name: 'chartSunEnergy',
//       component: chartSunEnergy
//     }
//     ]
//   },
//   {
//     path: '/management',
//     name: 'management',
//     component: management,
//     children: [{
//       path: 'personManage',
//       name: 'personManage',
//       component: personManage
//     },
//     {
//       path: 'roleManage',
//       name: 'roleManage',
//       component: roleManage
//     }, {
//       path: 'sourceManage',
//       name: 'sourceManage',
//       component: sourceManage
//     }
//     ]
//   },
//   {
//     path: '/analysis',
//     name: 'analysis',
//     component: analysis
//   },
//   {
//     path: '/',
//     redirect: '/course'
//   }
//   ]
// },
// {
//   path: '/login',
//   name: 'login',
//   component: login
// },
// {
//   path: '/',
//   redirect: '/login'
// }
// ]
// export let router = new VueRouter({
//   routes
// })
// router.beforeEach((to, from, next) => {
//   next()
// })
