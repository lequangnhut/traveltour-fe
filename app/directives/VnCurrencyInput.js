travel_app.directive('vnCurrencyInput', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function (data) {
                var transformedInput = data.replace(/[^0-9.]/g, '');

                transformedInput = $filter('vnCurrency')(transformedInput);

                ngModelController.$setViewValue(transformedInput);
                ngModelController.$render();
                return transformedInput;
            });
        }
    };
});

