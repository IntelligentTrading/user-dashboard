
const serviceEndpoint = process.env.ITT_NODE_SERVICES;
const apiKey = process.env.NODE_SVC_API_KEY;

const coreApiUrl = `https://${process.env.ITT_API_HOST}/v2`
const coreApiKey = process.env.ITT_API_KEY

const readableSettings = [
    { setting: "is_muted", readonly: false },
    { setting: "is_crowd_enabled", readonly: false },
    { setting: "transaction_currencies", readonly: false },
    { setting: "counter_currencies", readonly: false },
    { setting: "horizon", readonly: false },
    { setting: "ittWalletReceiverAddress", readonly: true },
    { setting: "subscriptions", readonly: true },
    { setting: "indicators", readonly: false },
    { setting: "ittTransactions", readonly: true }
];


function save(chat_id, settings) {

    readableSettings.forEach(readableSetting => {
        if (readableSetting.readonly)
            delete settings[readableSetting.setting]
    })

    return fetch(`${serviceEndpoint}/users/${chat_id}`, {
        method: "PUT",
        headers: new Headers({
            "NSVC-API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Request-Method": "*"
        }),
        mode: "cors",
        body: JSON.stringify(settings)
    });
}

function resetCoins(chat_id) {
    return fetch(`${serviceEndpoint}/users/${chat_id}/resetSignals`, {
        method: "PUT",
        headers: new Headers({
            "NSVC-API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Request-Method": "*"
        }),
        mode: "cors"
    });
}

function loadTransactionCurrencies() {
    console.log(`Fetching ${serviceEndpoint}/tickers/transaction_currencies`);
    return fetch(`${serviceEndpoint}/tickers/transaction_currencies`, {
        headers: new Headers({
            "NSVC-API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Request-Method": "*"
        }),
        mode: "cors"
    }).then(result => {
        return result.json().then(data => {
            return data;
        });
    }).catch(err => console.log(err));
}

function loadUserSettings(chat_id) {
    return fetch(`${serviceEndpoint}/users/${chat_id}`, {
        headers: new Headers({
            "NSVC-API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Request-Method": "*"
        }),
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function loadIndicators() {
    return fetch(`${serviceEndpoint}/signals`, {
        headers: new Headers({
            "NSVC-API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Request-Method": "*"
        }),
        mode: "cors"
    }).then(result => {
        return result.json();
    });
}

function loadIttPrice() {
    return fetch(`${coreApiUrl}/itt/`, {
        headers: new Headers({
            "API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "Access-Control-Request-Method": "*"
        }),
        mode: "cors"
    }).then(result => {
        return result.json().then(itt => { return parseFloat(itt.close).toFixed(3); })
    });
}

export default {
    save: save,
    READABLE_SETTINGS: readableSettings,
    COUNTER_CURRENCIES: [
        {
            symbol: "BTC",
            index: 0,
            enabled: true
        },
        {
            symbol: "ETH",
            index: 1,
            enabled: false
        },
        {
            symbol: "USDT",
            index: 2,
            enabled: true
        }
    ],
    loadTransactionCurrencies: loadTransactionCurrencies,
    loadUserSettings: loadUserSettings,
    loadIndicators: loadIndicators,
    resetCoins: resetCoins,
    loadIttPrice: loadIttPrice
}
