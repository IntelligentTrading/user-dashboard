import rp from 'request-promise'

const serviceEndpoint = process.env.ITT_NODE_SERVICES;
const apiKey = process.env.NODE_SVC_API_KEY;

const coreApiUrl = `https://${process.env.ITT_API_HOST}/v2`
const coreApiKey = process.env.ITT_API_KEY
const itfHeaders = new Headers({
    "NSVC-API-KEY": apiKey,
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "Access-Control-Request-Method": "*"
})

const readableSettings = [
    { setting: "is_muted", readonly: false },
    { setting: "is_ITT_team", readonly: true },
    { setting: "is_crowd_enabled", readonly: false },
    { setting: "transaction_currencies", readonly: false },
    { setting: "counter_currencies", readonly: false },
    { setting: "horizon", readonly: false },
    { setting: "ittWalletReceiverAddress", readonly: true },
    { setting: "subscriptions", readonly: true },
    { setting: "indicators", readonly: false },
    { setting: "exchanges", readonly: false },
    { setting: "ittTransactions", readonly: true },
    { setting: "staking", readonly: true }
];


function save(chat_id, settings) {
    readableSettings.forEach(readableSetting => {
        if (readableSetting.readonly)
            delete settings[readableSetting.setting]
    })

    return fetch(`${serviceEndpoint}/users/${chat_id}`, {
        method: "PUT",
        headers: itfHeaders,
        mode: "cors",
        body: JSON.stringify(settings)
    });
}

function resetCoins(chat_id) {
    return fetch(`${serviceEndpoint}/users/${chat_id}/resetSignals`, {
        method: "PUT",
        headers: itfHeaders,
        mode: "cors"
    });
}

function loadTransactionCurrencies() {
    console.log(`Fetching ${serviceEndpoint}/tickers/transaction_currencies`);
    return fetch(`${serviceEndpoint}/tickers/transaction_currencies`, {
        headers: itfHeaders,
        mode: "cors"
    }).then(result => {
        return result.json().then(data => {
            return data;
        });
    }).catch(err => console.log(err));
}

function loadUserSettings(chat_id) {
    return fetch(`${serviceEndpoint}/users/${chat_id}`, {
        headers: itfHeaders,
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function loadUserStake(chat_id) {
    return fetch(`${serviceEndpoint}/staking/forceRefresh/${chat_id}`, {
        headers: itfHeaders,
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function loadSubscriptionTemplates() {
    return fetch(`${serviceEndpoint}/subscription`, {
        headers: itfHeaders,
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function loadSignals() {
    return fetch(`${serviceEndpoint}/signals`, {
        headers: itfHeaders,
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function loadIttPrice() {

    console.log('Fetching itt price...')
    return rp(`${coreApiUrl}/itt/`, {
        headers: {
            "API-KEY": coreApiKey,
            "Content-Type": "application/json"
        },
        json: true
    }).then(result => {
        console.log(result)
        return parseFloat(result.close).toFixed(3);
    }).catch(err => { console.log('Something went wrong!'); return null })
}


function loadEthPrice() {

    console.log('Fetching ETH price...')
    return fetch(`${serviceEndpoint}/tickers/transaction_currencies/ETH`, {
        headers: itfHeaders,
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function verifyStakingSignature(signatureObj) {
    return fetch(`${serviceEndpoint}/staking/verify`, {
        method: 'POST',
        headers: itfHeaders,
        mode: "cors",
        body: signatureObj
    }).then(result => {
        return result.json();
    })
}

function verifyEthSignature(signatureObj) {
    console.log('Verifying ETH signature...')
    return fetch(`${serviceEndpoint}/payment/verifyEthTransaction`, {
        method: 'POST',
        headers: itfHeaders,
        mode: "cors",
        body: signatureObj
    }).then(result => {
        return result.json();
    });
}

function setStakingAddress(telegram_chat_id, wallet) {
    console.log('Setting staking address...')
    return fetch(`${serviceEndpoint}/staking/wallet`, {
        method: 'POST',
        headers: itfHeaders,
        mode: "cors",
        body: JSON.stringify({ telegram_chat_id: telegram_chat_id, wallet: wallet })
    });
}

export default {
    save: save,
    READABLE_SETTINGS: readableSettings,
    COUNTER_CURRENCIES: [
        {
            symbol: "BTC",
            index: 0,
            enabled: true,
            available: true
        },
        {
            symbol: "ETH",
            index: 1,
            enabled: false,
            available: false
        },
        {
            symbol: "USDT",
            index: 2,
            enabled: true,
            available: true
        }
    ],
    loadTransactionCurrencies: loadTransactionCurrencies,
    loadUserSettings: loadUserSettings,
    loadSignals: loadSignals,
    resetCoins: resetCoins,
    loadIttPrice: loadIttPrice,
    loadSubscriptionTemplates: loadSubscriptionTemplates,
    loadEthPrice: loadEthPrice,
    verifyEthSignature: verifyEthSignature,
    verifyStakingSignature: verifyStakingSignature,
    loadUserStake: loadUserStake,
    setStakingAddress: setStakingAddress
}
