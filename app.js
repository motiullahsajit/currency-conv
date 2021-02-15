const fixerApi = `http://data.fixer.io/api/latest?access_key=c4e1e39fde219aee1f37b6c2a776f9e1`;
const axios = require('axios');

/*const getExchangeRate = (fromCurrency, toCurrency) => {
    axios.get(fixerApi).then((response) => {
        const rate = response.data.rates;
        const euro = 1 / rate[fromCurrency];
        const exchangeRate = euro * rate[toCurrency];
        console.log(exchangeRate);
    });
}
getExchangeRate('USD', 'EUR');*/


const getExchangeRate = async (fromCurrency, toCurrency) => {
    const response = await axios.get(fixerApi);

    const rate = response.data.rates;
    const euro = 1 / rate[fromCurrency];
    const exchangeRate = euro * rate[toCurrency];
    if (isNaN(exchangeRate)) {
        throw new Error(`Unable to get currenct ${fromCurrency} and ${toCurrency}`)
    }
    return exchangeRate;
}

//get countries
const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`)
        return response.data.map(country => country.name);
    } catch (error) {
        throw new Error('Unable to get countries that use ${toCurrency}');
    }

}

//convert currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const countries = await getCountries(toCurrency);
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You use use this in the following countries: ${countries}`;
}

convertCurrency('USD', 'EUR', 20)
    .then((meassage) => {
        console.log(meassage);
    })
    .catch((error) => {
        console.log(error);
    })