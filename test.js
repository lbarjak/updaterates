const updRates = require("./update.rates.js");

updRates.updateRates();

setTimeout(function () {
    var rates = updRates.getRates();
    for (i = 1060; i < rates.length; i++) {
        console.log(rates[i]);
    }
}, 1000);