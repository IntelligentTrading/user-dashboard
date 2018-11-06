// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
import _ from 'lodash'
import router from './route/router'
import store from './store/store'

Vue.use(ElementUI)
Vue.use(VueClipboard)


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  var destination = to.fullPath.split('/')[1]
  var tokenPayload = to.fullPath.split('/')[2]

  console.log('Checking token...')
  console.log(localStorage.token)
  console.log(tokenPayload)
  if (localStorage.token != tokenPayload)
    localStorage.removeItem('token')

  if (to.fullPath == '/error') {
    next()
  }
  else if (destination != 'Me' && (!store.state.settings || !store.state.settings.subscriptions)) {
    if (localStorage.token) next('/Me/' + localStorage.token)
    else if (tokenPayload) {
      store.dispatch('storeToken', tokenPayload)
      next('/Me/' + localStorage.token)
    } else next('/error')
  }
  else
    next()
})

/* eslint-disable no-new */
var vm = new Vue({
  router,
  store,
  el: '#main',
  components: { App },
  template: '<App/>',
})
