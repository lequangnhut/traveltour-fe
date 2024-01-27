travel_app.controller("InformationController", function ($scope, $location, $routeParams, $timeout, $http, CustomerInfoServiceCT) {
    $scope.selectedImageSrc = null;

    $scope.isLoading = true;

    const fileName = "default.jpg";
    const mimeType = "image/jpeg";

    $scope.hasImage = false;

    $scope.customer = {
        avatar: null,
        email: null,
        password: null,
        gender: null,
        fullName: null,
        birth: null,
        address: null,
        citizenCard: null,
        phone: null,
        isActive: null
    }


    $scope.customerList = [];
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang

    let searchTimeout;
    let customerId = $routeParams.id;

    $scope.emailError = false;
    $scope.phoneError = false;
    $scope.cardError = false;
    $scope.invalidBirth = false;

    //==================================================================================================

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

    //============================================================================================================

    $scope.getCustomer = function () {
        if (customerId !== undefined && customerId !== null && customerId !== "") {
            CustomerInfoServiceCT.findCustomerById(customerId).then(function successCallback(response) {
                if (response.status === 200) {
                    console.log(response)
                    $timeout(function () {
                        $scope.customer = response.data.data;
                        $scope.customer.birth = new Date(response.data.data.birth);
                    }, 0);
                }
            });
        }
    };

    $scope.getCustomer();

})