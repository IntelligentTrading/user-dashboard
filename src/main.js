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
import moment from 'moment'
import _ from 'lodash'

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
    },
    subscriptionTemplates(state) {
      return state.subscriptionTemplates
    },
    highestSubscriptionLevel(state) {

      var levels = {}
      levels.is_ITT_team = state.settings.is_ITT_team
      levels.isAdvanced = state.settings.staking && state.settings.staking.centomila
      levels.isPro = state.settings.staking && state.settings.staking.diecimila
      levels.isStarter = -1 * moment().diff(state.settings.subscriptions.paid, "days") > 0
      levels.isFreePlus = -1 * moment().diff(state.settings.subscriptions.beta, "days") > 0

      var highestLevel = 'free'
      if (levels.is_ITT_team) highestLevel = 'ITT'
      else if (levels.isAdvanced) highestLevel = 'centomila'
      else if (levels.isPro) highestLevel = 'diecimila'
      else if (levels.isStarter) highestLevel = 'paid'
      else if (levels.isFreePlus) highestLevel = 'beta'

      return highestLevel
    },
    indicators(state, getters) {

      var highestSubscriptionLevelTemp = getters.highestSubscriptionLevel
      var tooLowToEdit =
        highestSubscriptionLevelTemp == "free" || highestSubscriptionLevelTemp == "beta";

      return state.settings.indicators.map(indicator => {

        var signal = state.signals.filter(s => s.label == indicator.name)[0];
        var availableForPlan =
          signal.deliverTo.indexOf(highestSubscriptionLevelTemp.toLowerCase()) >= 0 || highestSubscriptionLevelTemp == 'ITT';

        indicator.canSee = true;
        indicator.canEdit = !tooLowToEdit;
        indicator.value = tooLowToEdit ? availableForPlan : indicator.enabled;

        return indicator;
      })
    },
    exchanges(state, getters) {

      var highestSubscriptionLevelTemp = getters.highestSubscriptionLevel == "ITT" ? "centomila" : getters.highestSubscriptionLevel;
      var tooLowToEdit =
        highestSubscriptionLevelTemp == "free" || highestSubscriptionLevelTemp == "beta";

      var subscriptionTemplate = state.subscriptionTemplates.filter(
        st => st.label == highestSubscriptionLevelTemp
      )[0];

      return state.settings.exchanges.map(exchange => {

        var availableForPlan =
          !subscriptionTemplate.exchanges ||
          subscriptionTemplate.exchanges.includes(exchange.label.toLowerCase());

        exchange.canSee = true;
        exchange.canEdit = !tooLowToEdit;
        exchange.value = tooLowToEdit
          ? availableForPlan
          : exchange.enabled;

        return exchange
      })
    },
    subscription(state) {
      if (!state.settings)
        return { plan: 'Loading...', daysLeft: '0' }

      if (state.settings.is_ITT_team)
        return { plan: "Advanced (ITF Team)", daysLeft: '∞' }

      if (state.settings.staking) {
        if (state.settings.staking.centomila) return { plan: "Advanced", daysLeft: '∞' }
        if (state.settings.staking.diecimila) return { plan: "Pro", daysLeft: '∞' }
      }

      if (state.settings.subscriptions) {
        var paidDaysLeft =
          Math.max(-1 * moment().diff(state.settings.subscriptions.paid, "days"), 0);
        var betaDaysLeft =
          Math.max(-1 * moment().diff(state.settings.subscriptions.beta, "days"), 0);

        return paidDaysLeft > 0
          ? { plan: "Starter", daysLeft: paidDaysLeft }
          : betaDaysLeft > 0 ? { plan: "FREE+", daysLeft: betaDaysLeft } : { plan: "FREE", daysLeft: '∞' };
      }
    },
    signalLabel: state => indicator => {
      var match = state.signals.find(s => s.label && s.label == indicator.name);
      return match && match.description ? match.description : indicator.name;
    },
    availableCounterCurrencies: (state, getters) => {

      return db.COUNTER_CURRENCIES.filter(counter => counter.available).map(counter => {

        var highestSubscriptionLevelTemp = getters.highestSubscriptionLevel == "ITT" ? "centomila" : getters.highestSubscriptionLevel;
        var tooLowToEdit = highestSubscriptionLevelTemp == "free";

        var subscriptionTemplate = state.subscriptionTemplates.filter(
          st => st.label == highestSubscriptionLevelTemp
        )[0];

        var availableForPlan =
          !subscriptionTemplate.counter ||
          subscriptionTemplate.counter.includes(counter.index);

        counter.canSee = true;
        counter.canEdit = !tooLowToEdit;
        counter.value = tooLowToEdit
          ? availableForPlan
          : state.settings.counter_currencies.includes(counter.index);

        return counter;
      });
    },
    availableTransactionCurrencies: (state, getters) => {

      var highestSubscriptionLevelTemp = getters.highestSubscriptionLevel == "ITT" ? "centomila" : getters.highestSubscriptionLevel;
      var enabledCounterCurrencies = getters.availableCounterCurrencies.filter(acc => acc.value)
      if (!enabledCounterCurrencies || enabledCounterCurrencies.length <= 0)
        return [];

      var atcs = getters.dbTransactionCurrencies.map(ticker => {
        var tooLowToEdit =
          highestSubscriptionLevelTemp == "free" || (highestSubscriptionLevelTemp == "beta" && !ticker.sources.includes("poloniex"));

        var subscriptionTemplate = getters.subscriptionTemplates.filter(st => st.label == highestSubscriptionLevelTemp)[0]
        var availableForPlan = !subscriptionTemplate.tickers || subscriptionTemplate.tickers.includes(ticker.symbol)

        ticker.canSee = ticker.counter_currencies.some(cc => enabledCounterCurrencies.map(ec => ec.index).includes(cc))
        ticker.canEdit = !tooLowToEdit;
        ticker.value = tooLowToEdit
          ? availableForPlan
          : state.settings.transaction_currencies.includes(ticker.symbol);

        return ticker;
      })

      return _.sortBy(atcs, t => { return parseInt(t.rank) })
    }
  },
  actions: {
    async saveChatId(context, id) {
      return await context.commit('telegramChatId', id)
    },
    async save(context, payload) {
      return db.save(payload.chat_id, payload.settings).then((response) => {
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
