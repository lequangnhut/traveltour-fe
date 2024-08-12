travel_app.directive('resizeMap', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$on('tabChanged', function (event, data) {
                // Kiểm tra xem tab nào được chuyển đổi
                if (data.tabName === 'mapTab') {
                    // Gọi phương thức resize của bản đồ
                    if (scope.mapTrips) {
                        scope.mapTrips.resize();
                    }
                }
            });
        }
    };
});