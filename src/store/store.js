import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        telegram_chat_id: 0,
        settings: {},
        all_transaction_currencies: [],
        subscriptionTemplates: [],
        signals: [],
        itt_usd_rate: undefined,
        eth_usd_rate: undefined,
        token: undefined,
        paidTokens: 0
    },
    mutations: {
        token(state, token) {
            console.log('Saving token')
            localStorage.setItem('token', token)
            state.token = token
        },
        telegramChatId(state, id) {
            console.log('Saving id ' + id)
            state.telegram_chat_id = id
            return api.loadUserSettings(id).then(user => {
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
        },
        eth_usd_rate(state, eth_usd_rate) {
            state.eth_usd_rate = eth_usd_rate
        },
        stakingAddress(state, address) {
            return api.setStakingAddress(state.telegram_chat_id, address).then(code => {
                // changing locally waiting for a full refresh of the UI to sync properly.
                // not strongly needed since the backend is updated correctly at every set/reset of the wallet
                state.settings.staking.walletAddress = address
                state.settings.staking.veriSigned = false
                state.settings.staking.lastRetrievedBalance = 0
            })
        }
    },
    getters: {
        telegram_chat_id(state) {
            return state.telegram_chat_id
        },
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
            levels.isStarter = -1 * moment().diff(state.settings.subscriptions.paid, "hours") > 0
            levels.isFreePlus = -1 * moment().diff(state.settings.subscriptions.beta, "hours") > 0

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
                return { plan: "Pro (ITF Team)", daysLeft: '∞' }

            if (state.settings.staking && state.settings.staking.diecimila) {
                return { plan: "Pro", daysLeft: '∞' }
            }

            if (state.settings.subscriptions) {
                var paidHoursLeft =
                    Math.max(-1 * moment().diff(state.settings.subscriptions.paid, "hours"), 0);
                var betaHoursLeft =
                    Math.max(-1 * moment().diff(state.settings.subscriptions.beta, "hours"), 0);
                var paidDaysLeft =
                    Math.max(-1 * moment().diff(state.settings.subscriptions.paid, "days"), 0);
                var betaDaysLeft =
                    Math.max(-1 * moment().diff(state.settings.subscriptions.beta, "days"), 0);

                return paidHoursLeft > 0
                    ? { plan: "Pro", daysLeft: paidDaysLeft, hoursLeft: paidHoursLeft }
                    : { plan: "FREE", daysLeft: betaDaysLeft, hoursLeft: '∞' };
            }
        },
        paidTokens: state => {
            return _.sum(state.settings.ittTransactions.map(tx => tx.total_in_itt))
        },
        stakingBalance: state => {
            return state.settings.staking.veriSigned ? state.settings.staking.lastRetrievedBalance : 0
        },
        signalLabel: state => indicator => {
            var match = state.signals.find(s => s.label && s.label == indicator.name);
            return match && match.description ? match.description : indicator.name;
        },
        availableCounterCurrencies: (state, getters) => {

            return api.COUNTER_CURRENCIES.filter(counter => counter.available).map(counter => {

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
        storeToken(context, token) {
            context.commit('token', token)
        },
        async saveChatId(context, id) {
            return await context.commit('telegramChatId', id)
        },
        async save(context, payload) {
            return api.save(payload.chat_id, payload.settings).then((response) => {
                return response.json().then(updatedUser => {
                    context.commit("settings", updatedUser.settings)
                }).catch(err => {
                    alert('Error saving settings...')
                    console.log(err)
                })
            })
        },
        async setStakingWallet(context, address) {
            return await context.commit('stakingAddress', address)
        },
        resetCoinsToDefault(context) {
            return api.resetCoins(context.state.telegram_chat_id).then((response) => {
                console.log('Settings saved')
                return response.json().then(updatedUser => {
                    context.commit("settings", updatedUser.settings)
                }).catch(err => {
                    alert('Error saving settings...')
                    console.log(err)
                })
            })
        }
    }
})