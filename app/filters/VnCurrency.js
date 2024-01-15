travel_app.filter('vnCurrency', function () {
    return function (input) {
        if (!input) {
            return input;
        }

        input = parseFloat(input);

        if (isNaN(input)) {
            return input;
        }

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(input);
    };
});
