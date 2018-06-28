// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import Main from './components/Main'
import Subscription from './components/Subscription'
import Notifications from './components/Notifications'
import Wizard from './components/Wizard'
import Coins from './components/Coins'
import ErrorPage from './components/ErrorPage'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
import db from './db'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    telegram_chat_id: 0,
    settings: undefined,
    all_transaction_currencies: []
  },
  mutations: {
    telegramId(state, id) {
      state.telegram_chat_id = id
    },
    settings(state, settings) {
      state.settings = settings
    },
    all_transaction_currencies(state, transaction_currencies) {
      state.all_transaction_currencies = transaction_currencies
    },
    indicators(state, indicators) {
      state.indicators = indicators
    }
  },
  actions: {
    save(context, payload) {
      return db.save(payload.chat_id, payload.settings).then((response) => {
        console.log('Settings saved')
        return response.json().then(updatedUser => {
          context.commit("settings", updatedUser.settings)
        }).catch(err => {
          alert('Error saving settings...')
          console.log(err)
        }).then(() => {
          vm.$emit('save', false)
        })
      })
    },
    resetCoinsToDefault(context) {
      return db.resetCoins(context.state.telegram_chat_id).then((response) => {
        console.log('Settings saved')
        return response.json().then(updatedUser => {
          context.commit("settings", updatedUser.settings)
        }).catch(err => {
          alert('Error saving settings...')
          console.log(err)
        }).then(() => vm.$emit('reset', false))
      })
    }
  }
})


const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: ErrorPage,
      props: true
    },
    {
      path: '/main/:id',
      component: Main,
      props: true
    },
    {
      path: '/Subscription',
      component: Subscription,
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
    }
  ]
})

/* eslint-disable no-new */
var vm = new Vue({
  router,
  store,
  el: '#main',
  components: { App },
  template: '<App/>',
})
