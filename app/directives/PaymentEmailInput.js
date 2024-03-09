travel_app.directive('emailInput', function() {
    return {
        restrict: 'E', // Directive này sẽ được sử dụng như một thẻ HTML
        scope: {
            showEmail: '=', // Ràng buộc với biến showEmail trong scope cha
            email: '=ngModel' // Ràng buộc với biến email trong scope cha
        },
        template: '<div ng-show="showEmail">' +
            '<label>Email khách lưu trú:</label>' +
            '<input type="email" class="form-control" ng-model="email" required>' +
            '<p style="font-size: 14px">Email này dùng để gửi gmail xác nhận đặt phòng của khách</p>' +
            '<div class="invalid-feedback">Vui lòng nhập email của khách.</div>' +
            '</div>'
    };
});