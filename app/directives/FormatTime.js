travel_app.directive('formatTime', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function (viewValue) {
                if (viewValue) {
                    return $filter('date')(new Date(viewValue), 'yyyy-MM-ddTHH:mm:ss.sssZ');
                }
            });

            ngModelCtrl.$formatters.push(function (modelValue) {
                if (modelValue) {
                    return $filter('date')(new Date(modelValue), 'yyyy-MM-ddTHH:mm:ss.sssZ');
                }
            });
        }
    };
});
