travel_app.directive('paymentMethod', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                // Xử lý sự kiện khi người dùng chọn một phương thức thanh toán
                scope.$apply(function () {
                    scope.selectedPaymentMethod = attrs.paymentMethod;
                });
            });
        }
    };
});