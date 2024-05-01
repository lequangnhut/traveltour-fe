travel_app.controller('ServiceListControllerAD',
    function ($scope, $routeParams, $location, $timeout, $rootScope,
              TourDetailsServiceAD, Base64ObjectService, LocalStorageService) {
        $scope.tourDetailIdEncode = $routeParams.tourDetailId;
        let tourDetail = Base64ObjectService.decodeObject($scope.tourDetailIdEncode);

        TourDetailsServiceAD.findTourDetailById(tourDetail).then(function (response) {
            if (response.status === 200) {
                $rootScope.tourDetail = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        })

        $scope.showSelectionPopupHotel = function () {
            Swal.fire({
                title: 'Vui lòng chọn thao tác bạn muốn thực hiện',
                text: 'Hãy chọn một trong hai tùy chọn sau:',
                imageUrl: '/assets/admin/assets/upload/hotel.png',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
                showCancelButton: true,
                confirmButtonText: 'Đặt phòng khách sạn',
                cancelButtonText: 'Hủy bỏ',
                showDenyButton: true,
                denyButtonText: 'Xem danh sách',
                focusDeny: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                denyButtonColor: '#ffc107',
                customClass: {
                    image: 'rounded-image'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $timeout(function () {
                        $scope.redirectWithMultipleId('/admin/detail-tour-list/:tourDetailId/service-list/hotel-list', [$scope.tourDetailIdEncode])
                    }, 50)
                } else if (result.isDenied) {
                    $timeout(function () {
                        $scope.redirectWithMultipleId('/admin/detail-tour-list/:tourDetailId/service-list/accommodation-information-list', [$scope.tourDetailIdEncode])
                    }, 50)
                }
            });
        }

        $scope.showSelectionPopupTransport = function () {
            Swal.fire({
                title: 'Vui lòng chọn thao tác bạn muốn thực hiện',
                text: 'Hãy chọn một trong hai tùy chọn sau:',
                imageUrl: '/assets/admin/assets/upload/vehicle.png',
                imageWidth: 400, // Chiều rộng của hình ảnh (tùy chọn)
                imageHeight: 200, // Chiều cao của hình ảnh (tùy chọn)
                imageAlt: 'Custom image', // Text mô tả hình ảnh (tùy chọn)
                showCancelButton: true,
                confirmButtonText: 'Tạo yêu cầu',
                cancelButtonText: 'Hủy bỏ',
                showDenyButton: true,
                denyButtonText: 'Xem danh sách',
                focusDeny: true,
                confirmButtonColor: '#3085d6', // Màu của nút xác nhận
                cancelButtonColor: '#d33', // Màu của nút huỷ bỏ
                denyButtonColor: '#ffc107', // Màu của nút từ chối
                customClass: {
                    image: 'rounded-image'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $timeout(function () {
                        $location.path('/admin/request-booking-car/create-request-booking');
                        LocalStorageService.encryptLocalData($scope.tourDetailIdEncode, 'tourDetailIdRequestCar', 'tourDetailEncode');
                        $scope.setActiveNavItem('request-car');
                    }, 50)
                } else if (result.isDenied) {
                    $timeout(function () {
                        $scope.redirectWithMultipleId('/admin/detail-tour-list/:tourDetailId/service-list/transportation-information-list', [$scope.tourDetailIdEncode])
                    }, 50)
                }
            });
        }

        $scope.showSelectionPopupVisitLocation = function () {
            Swal.fire({
                title: 'Vui lòng chọn thao tác bạn muốn thực hiện',
                text: 'Hãy chọn một trong hai tùy chọn sau:',
                imageUrl: '/assets/admin/assets/upload/sightseeing.png',
                imageWidth: 400, // Chiều rộng của hình ảnh (tùy chọn)
                imageHeight: 200, // Chiều cao của hình ảnh (tùy chọn)
                imageAlt: 'Custom image', // Text mô tả hình ảnh (tùy chọn)
                showCancelButton: true,
                confirmButtonText: 'Đặt điểm tham quan',
                cancelButtonText: 'Hủy bỏ',
                showDenyButton: true,
                denyButtonText: 'Xem danh sách',
                focusDeny: true,
                confirmButtonColor: '#3085d6', // Màu của nút xác nhận
                cancelButtonColor: '#d33', // Màu của nút huỷ bỏ
                denyButtonColor: '#ffc107', // Màu của nút từ chối
                customClass: {
                    image: 'rounded-image'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $timeout(function () {
                        $scope.redirectWithMultipleId('/admin/detail-tour-list/:tourDetailId/service-list/visit-location-list', [$scope.tourDetailIdEncode]);
                    }, 50)
                } else if (result.isDenied) {
                    $timeout(function () {
                        $scope.redirectWithMultipleId('/admin/detail-tour-list/:tourDetailId/service-list/visit-information-list', [$scope.tourDetailIdEncode])
                    }, 50)
                }
            });
        }
    });
