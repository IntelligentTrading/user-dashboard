// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import Me from './components/Me'
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
    settings: {},
    all_transaction_currencies: [],
    subscriptionTemplates: [],
    signals: [],
    itt_usd_rate: undefined
  },
  mutations: {
    telegramChatId(state, id) {
      console.log('Saving id ' + id)
      state.telegram_chat_id = id
      return db.loadUserSettings(id).then(user => {
        console.log('User settings loaded...')
        state.settings = user.settings
      })
    },
    settings(state, settings) {
      state.settings = settings
    },
    all_transaction_currencies(state, transaction_currencies) {
      state.all_transaction_currencies = transaction_currencies
    },
    indicators(state, indicators) {
      state.settings.indicators = indicators
    },
    subscriptionTemplates(state, templates) {
      state.subscriptionTemplates = templates
    },
    exchanges(state, exchanges) {
      state.settings.exchanges = exchanges
    },
    signals(state, signals) {
      state.signals = signals
    },
    itt_usd_rate(state, itt_usd_rate) {
      state.itt_usd_rate = itt_usd_rate
    }
  },
  getters: {
    settings(state) {
      return state.settings
    },
    dbTransactionCurrencies(state) {
      return state.all_transaction_currencies
    }
  },
  actions: {
    async saveChatId(context, id) {
      return await context.commit('telegramChatId', id)
    },
    saveSetting(context, payload) {
      var newSettings = context.state.settings
      newSettings[payload.propName] = payload.propValue
      console.log(`Saving ${payload.propName}:${payload.propValue}`)
      console.log(newSettings)
      return db.save(payload.chatId, newSettings).then((response) => {
        return response.json().then(updatedUser => {
          console.log('Updated user')
          console.log(updatedUser.settings)
          context.commit("settings", updatedUser.settings)
        }).catch(err => {
          alert('Error saving settings...')
          console.log(err)
        }).then(() => {
          vm.$emit('save', false)
        })
      })
    },
    save(context, payload) {
      return db.save(payload.chat_id, payload.settings).then((response) => {
        return response.json().then(updatedUser => {
          console.log('Updated user')
          console.log(updatedUser.settings)
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
      path: '/me/:token',
      component: Me,
      props: true
    },
    {
      path: '/main/:token/:telegram_chat_id',
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
    },
    {
      path: '/error',
      component: ErrorPage,
      props: true,
      name: 'ErrorPage'
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
