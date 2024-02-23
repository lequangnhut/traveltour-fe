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
