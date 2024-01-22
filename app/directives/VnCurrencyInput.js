travel_app.directive('formatPriceInput', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function (inputValue) {
                let rawValue = inputValue.replace(/[^0-9]/g, '');
                let price = parseInt(rawValue);

                if (!isNaN(price)) {
                    let formattedValue = price.toLocaleString('en-US');
                    ngModelCtrl.$setViewValue(formattedValue);
                    ngModelCtrl.$render();
                    return price;
                }

                return inputValue;
            });
        }
    };
});
