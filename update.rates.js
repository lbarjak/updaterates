var rates = require("./rates.json");
const https = require('https');
var date = require('date-and-time');

function updateRates() {

    var prevSeq = rates[rates.length - 1].seq;
    var firstDate = date.parse('9 Aug 15', 'D MMM YY');
    var startDate = date.addDays(firstDate, prevSeq - 3 + 1);
    startDate = date.format(startDate, 'YYYYMMDD');
    https.get('https://coinmarketcap.com/currencies/ethereum/historical-data/?start=' +
        startDate +
        '&end=20181231', (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                var rowsin = data.split("\n");
                var rowsout = [];
                for (i = 0; i < rowsin.length; i++) {
                    if (rowsin[i].includes("td class=\"text-left")) {
                        var row = {
                            seq: 0000,
                            date: rowsin[i].match(/(?<= )\d{2}/)[0] +
                                " " + rowsin[i].match(/(?<=>)\w+/)[0] + " " +
                                rowsin[i].match(/(?<= \d{2})\d{2}/)[0],
                            open: parseFloat(rowsin[++i].match(/(?<=>).{6}/)[0]),
                            high: parseFloat(rowsin[++i].match(/(?<=>).{6}/)[0]),
                            low: parseFloat(rowsin[++i].match(/(?<=>).{6}/)[0]),
                            close: parseFloat(rowsin[++i].match(/(?<=>).{6}/)[0])
                        };
                        rowsout.push(row);
                    }
                }
                var rowsout_reverse = [];
                for (i = rowsout.length - 1; i >= 0; i--) {
                    rowsout[i].seq = ++prevSeq;
                    rowsout_reverse.push(rowsout[i]);
                }
                rowsout_reverse.forEach(element => {
                    rates.push(element);
                });
            });

        }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

function getRates() {
    return rates;
}

module.exports = {
    updateRates,
    getRates
}

/*
{
        "seq": 1087,
        "date": "28 Jul 18",
        "open": 469.68,
        "high": 471.59,
        "low": 462.99,
        "close": 466.90
    }
*/