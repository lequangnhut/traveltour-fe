travel_app.filter('vnCurrency', function () {
    return function (input) {
        if (input === undefined || input === null) {
            return '';
        }

        input = parseFloat(input);

        if (isNaN(input)) {
            return '';
        }

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(input);
    };
});


travel_app.filter('removeCurrencySymbol', function () {
    return function (input) {
        if (input === undefined || input === null) {
            return '';
        }

        input = parseFloat(input);

        if (isNaN(input)) {
            return '';
        }

        var formattedCurrency = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(input);

        formattedCurrency = formattedCurrency.replace(/ ?[₫đ] ?/g, '').trim();

        return formattedCurrency;
    };
});

