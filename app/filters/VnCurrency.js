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

travel_app.filter('vnCurrencyWord', function () {
    let ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    let tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    let hundreds = ['không trăm', 'một trăm', 'hai trăm', 'ba trăm', 'bốn trăm', 'năm trăm', 'sáu trăm', 'bảy trăm', 'tám trăm', 'chín trăm'];

    return function (number) {
        if (isNaN(number) || number < 0 || number >= 1000000000) {
            return 'Số không hợp lệ';
        }

        if (number === 0) {
            return 'Không đồng';
        }

        function convertNumberToString(num) {
            let words = '';

            if (num >= 1000000) {
                words += convertNumberToString(Math.floor(num / 1000000)) + ' triệu ';
                num %= 1000000;
            }

            if (num >= 1000) {
                words += convertNumberToString(Math.floor(num / 1000)) + ' nghìn ';
                num %= 1000;
            }

            if (num >= 100) {
                words += hundreds[Math.floor(num / 100)] + ' ';
                num %= 100;
            }

            if (num >= 10 && num <= 19) {
                words += 'Mười ';
                num %= 10;
            } else if (num >= 20) {
                words += tens[Math.floor(num / 10)] + ' ';
                num %= 10;
            }

            if (num > 0) {
                words += ones[num] + ' ';
            }

            return words.trim();
        }

        return convertNumberToString(number) + ' đồng';
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

