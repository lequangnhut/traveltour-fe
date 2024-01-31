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

travel_app.directive('vietnamCurrencyInput', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function (viewValue) {
                return parseFloat(viewValue.replace(/[^\d.]/g, ''));
            });

            ngModelController.$formatters.push(function (modelValue) {
                return $filter('currency')(modelValue, '', 0);
            });

            element.on('input', function () {
                ngModelController.$viewValue = $filter('currency')(ngModelController.$modelValue, '', 0);
                ngModelController.$render();
            });
        }
    };
}]);
