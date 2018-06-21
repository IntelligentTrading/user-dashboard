// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Login from './components/Login'
import Settings from './components/Settings'
import ErrorPage from './components/ErrorPage'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter)
Vue.use(ElementUI)

Vue.config.productionTip = false


const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: ErrorPage,
      props: true
    },
    {
      path: '/login/:id',
      component: Login,
      props: true
    },
    {
      path: '/settings/:id',
      component: Settings,
      props: true,
      name: 'Settings'
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#main',
  components: { App },
  template: '<App/>',
})
