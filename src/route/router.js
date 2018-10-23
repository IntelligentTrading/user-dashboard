import Vue from 'vue'
import VueRouter from 'vue-router'
import Me from '../components/Me'
import Main from '../components/Main'
import Subscription from '../components/Subscription'
import Payment from '../components/Payment'
import Notifications from '../components/Notifications'
import Wizard from '../components/Wizard'
import Coins from '../components/Coins'
import ErrorPage from '../components/ErrorPage'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/me/:token',
      component: Me,
      props: true
    },
    {
      path: '/main/:token',
      component: Main,
      props: true
    },
    {
      path: '/Subscription',
      component: Subscription,
      props: true
    },
    {
      path: '/Payment/:preferredPaymentMethod',
      component: Payment,
      props: true
    },
    {
      path: '/Wizard',
      component: Wizard,
      props: true
    },
    {
      path: '/Coins',
      component: Coins,
      props: true,
      name: 'Coins'
    },
    {
      path: '/Notifications',
      component: Notifications,
      props: true,
      name: 'Notifications'
    },
    {
      path: '/error',
      component: ErrorPage,
      props: true,
      name: 'ErrorPage'
    }
  ]
})