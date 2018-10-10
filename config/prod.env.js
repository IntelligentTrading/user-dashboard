'use strict'
module.exports = {
  NODE_ENV: '"production"',
  NODE_SVC_API_KEY: `"${process.env.NODE_SVC_API_KEY}"`,
  ITT_NODE_SERVICES: `"${process.env.ITT_NODE_SERVICES}/api"`,
  ITT_API_HOST: `"${process.env.ITT_API_HOST}"`,
  ITT_API_KEY: `"${process.env.ITT_API_KEY}"`,
  ITF_ETH_PAYMENT_WALLET: `"${process.env.ITF_ETH_PAYMENT_WALLET}"`
}
