travel_app.controller('HotelInfomationController', function ($scope) {
    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalWatchImg = function () {
        $('#change-profile').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeModalWatchImg = function () {
        $('#change-profile').modal('hide');
    };
})