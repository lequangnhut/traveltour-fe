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

    $scope.customerUpdate = {
        avatar: [],
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
    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    /**
     * Phương thức hiển thị modal
     */
    $scope.showModalChangeProfile = function (id) {
        if (!$scope.customerUpdate) {
            console.error("Error: $scope.agent is not defined or null");
            return;
        }
        fillModalWithData(id);
        $('#change-profile').modal('show');
    };

    $scope.showModalChangePhoneNumber = function (id) {
        if (!$scope.customer) {
            console.error("Error: $scope.agent is not defined or null");
            return;
        }
        fillModalPhoneWithData(id);
        $('#change-phoneNumber').modal('show');
    }

    $scope.showModalChangeEmail = function (id) {
        if (!$scope.customer) {
            console.error("Error: $scope.agent is not defined or null");
            return;
        }
        fillModalEmailWithData(id);
        $('#change-email').modal('show');
    };

    //============================================================================================================

    $scope.getCustomer = function () {
        if (customerId !== undefined && customerId !== null && customerId !== "") {
            CustomerInfoServiceCT.findCustomerById(customerId).then(function successCallback(response) {
                if (response.status === 200) {
                    $timeout(function () {
                        $scope.customer = response.data.data;
                        $scope.customer.birth = new Date(response.data.data.birth);
                        $scope.customerUpdate = $scope.customer
                        $scope.users = response.data.data;
                        $scope.users.birth = new Date(response.data.data.birth);
                    }, 0);
                }
            });
        }
    };
    $scope.getCustomer();


    function fillModalWithData(id) {
        if (id !== undefined && id !== null && id !== "") {
            CustomerInfoServiceCT.findCustomerById(id).then(function successCallback(response) {
                if (response.status === 200) {
                    $timeout(function () {
                        $scope.customerUpdate = response.data.data;
                        $scope.customerUpdate.birth = new Date(response.data.data.birth);
                    }, 0);
                }
            });
        }
    }

    function fillModalPhoneWithData(id) {
        if (id !== undefined && id !== null && id !== "") {
            CustomerInfoServiceCT.findCustomerById(id).then(function successCallback(response) {
                if (response.status === 200) {
                    $timeout(function () {
                        $scope.customerUpdate = response.data.data;
                    }, 0);
                }
            });
        }
    }

    //==================================================================================================

    //Modal update

    $scope.updateBasicProfile = () => {
    }

    $scope.getCurrentImageSource = function () {
        if ($scope.customer.avatar && typeof $scope.customer.avatar === 'string' && $scope.customer.avatar.startsWith('http')) {
            $scope.tourImgNoCloud = $scope.customer.avatar;
            return $scope.customer.avatar;
        } else if ($scope.customer.avatar && typeof $scope.customer.avatar === 'string') {
            return $scope.customer.avatar;
        }
    };

    $scope.uploadTourImage = function (file) {
        if (file && !file.$error) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $scope.customer.avatar = e.target.result;
                $scope.tourImgNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }

    };

    function urlToFile(url, fileName, mimeType) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new File([blob], fileName, {type: mimeType}));
    }

    //form update
    $scope.updateTourSubmit = () => {
        const dataTour = new FormData();
        $scope.isLoading = true;
        if ($scope.customerUpdate.avatarUpdate) {
            dataTour.append('avatarUpdate', $scope.customerUpdate.avatarUpdate, $scope.customerUpdate.avatarUpdate.name);
        } else {
            var emptyImageBlob = new Blob([''], { type: "image/png" });
            dataTour.append('avatarUpdate', emptyImageBlob, 'empty-image.png');
        }
        if ($scope.hasImage) {
            dataTour.append("usersDto", new Blob([JSON.stringify($scope.customerUpdate)], {type: "application/json"}));
            updateTour(customerId, dataTour);
        } else {
            urlToFile($scope.customerUpdate.avatar, fileName, mimeType).then(file => {
                dataTour.append("usersDto", new Blob([JSON.stringify($scope.customerUpdate)], {type: "application/json"}));
                updateTour(customerId, dataTour);
            }, errorCallback);
        }

    };


    function updateTour(customerId, dataTour) {
        CustomerInfoServiceCT.updateTour(customerId, dataTour).then(function successCallback() {
            $scope.isLoading = true;
            toastAlert('success', 'Cập nhật thành công !');
            $scope.getCustomer();
            $scope.customerUpdate = null;
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }
})