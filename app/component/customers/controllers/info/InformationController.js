travel_app.controller("InformationController", function ($scope) {
    $scope.selectedImageSrc = null;

    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalChangeProfile = function () {
        $('#change-profile').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeModalChangeProfile = function () {
        $('#change-profile').modal('hide');
    };


    /**
     * Hàm định nghĩa sự kiện thay đổi hình ảnh
     * @param event
     * @param elementId
     */
    $scope.selectedImageSrc = '/assets/customers/images/user/avata-user-default.png';
    $scope.displaySelectedImage = function () {
        const fileInput = document.getElementById('avata');

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                console.log('New image selected:', e.target.result);
                $scope.$apply(function () {
                    $scope.selectedImageSrc = e.target.result;
                });
            };

            reader.readAsDataURL(fileInput.files[0]);
        }
    };

    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalChangePhoneNumber = function () {
        $('#change-phoneNumber').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeModalChangePhoneNumber = function () {
        $('#change-phoneNumber').modal('hide');
    };

    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalChangeEmail = function () {
        $('#change-email').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeModalChangeEmail = function () {
        $('#change-email').modal('hide');
    };

    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalChangeAddress = function () {
        $('#change-address').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeModalChangeAddress = function () {
        $('#change-address').modal('hide');
    };
})