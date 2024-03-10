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
})

travel_app.directive('dateTimeFormatter', function() {
    return {
        restrict: 'A',
        scope: {
            dateTimeString: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('dateTimeString', function(newValue, oldValue) {
                if (newValue) {
                    var dateTime = new Date(newValue);
                    var day = dateTime.getDate();
                    var month = dateTime.getMonth() + 1;
                    var year = dateTime.getFullYear();

                    var formattedDate = day + "/" + month + "/" + year;
                    element.text(formattedDate);
                }
            });
        }
    };
});