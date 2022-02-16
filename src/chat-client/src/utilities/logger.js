/* eslint-disable no-console */

const isProduction = process.env.NODE_ENV === 'production'

exports.log = (message, ...args) => {
    if (!isProduction) console.log(message, args)
}

exports.error = (err) => {
    if (!isProduction) console.error(err)
}