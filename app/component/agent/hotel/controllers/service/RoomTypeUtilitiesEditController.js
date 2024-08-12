travel_app.controller('RoomTypeUtilitiesEditController', function ($scope, $location, $timeout, $routeParams, $http, RoomTypeService, LocalStorageService, RoomUtilitiesService) {
    var hotelId = LocalStorageService.get("brandId")
    $scope.id = $routeParams.id;

    $scope.roomTypes = {
        roomUtilities: [
            {
                id: null,
                roomUtilitiesName: null,
            }
        ],
    }

    $scope.roomTypeUtilities = {
        id: null,
        roomTypeId: null,
        utilityId: null,
        isDeleted: null
    }

    $scope.roomTypeUtilitiesDetails = {
        id: null,
        roomTypeId: null,
        utilityId: null,
        isDeleted: null
    }

    $scope.selectedCheckboxes = [];
    $scope.roomTypeUtilitiesList = [];
    $scope.selectedItems = [];
    $scope.selectAllChecked = false;
    $scope.roomTypeUtilities.isSelected = false;
    $scope.roomTypeUtilitiesIdModel = null;

    let searchTimeout;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Phương thức lấy danh sách dịch vự phòng khách sạn
     * @param column
     */
    RoomTypeService.getRoomTypeById($scope.id).then(function (response) {
        $scope.isLoading = true;

        if (response.data.status === "200") {
            $scope.roomTypes.roomUtilities = response.data.data.roomUtilities
        } else if (response.data.status === "404") {
            $scope.errorBedTypeList = response.data.message
        }
    }, errorCallback).finally(function () {
        $scope.isLoading = false;
    })


    /**
     * Danh sách các tiện ích phòng khách sạn
     */
    RoomUtilitiesService.getAllRoomUtilities().then(function (response) {
        $scope.isLoading = true;
        try {
            if (response.status === 404) {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại";
            } else if (response.status === 200) {
                $scope.checkboxes = response.data.data.map(function (item) {
                    var checked = $scope.roomTypes.roomUtilities.some(function (utility) {
                        return utility.id === item.id;
                    });
                    return {id: item.id, label: item.roomUtilitiesName, checked: checked};
                });
                $scope.checkboxes.forEach(function(checkbox) {
                    if(checkbox.checked === true){
                        $scope.selectedCheckboxes.push(checkbox);
                    }
                });
            } else {
                $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại";
            }
        } catch (e) {
            $scope.showErrorListPlaceMessage = "Không tìm thấy dữ liệu vui lòng thử lại";
        } finally {
            $scope.isLoading = false;
        }
    }, errorCallback);


    /**
     * Phương thức kiểm tra số lượng checkbox
     */
    $scope.isAnyCheckboxChecked = function() {
        if (!$scope.checkboxes || $scope.checkboxes.length === 0) {
            return false;
        }

        return $scope.checkboxes.some(function(checkbox) {
            return checkbox.checked;
        });
    };


    $scope.handleCheckboxChange = function(checkbox) {
        if (checkbox.checked) {
            if (!$scope.selectedCheckboxes.includes(checkbox)) {
                $scope.selectedCheckboxes.push(checkbox);
            }
        } else {
            var index = $scope.selectedCheckboxes.indexOf(checkbox);
            if (index !== -1) {
                $scope.selectedCheckboxes.splice(index, 1);
            }
        }

        console.log("Các checkbox được chọn:", $scope.selectedCheckboxes);
    };

    $scope.updateRoomUtilities = function () {
        var successSound = new Audio('assets/admin/assets/sound/success.mp3');
        var errorSound = new Audio('assets/admin/assets/sound/error.mp3');
        var roomUtilities = $scope.selectedCheckboxes.map(function(checkbox) {
            return checkbox.id;
        });
        $scope.isLoading = true;
        RoomUtilitiesService.updateRoomUtilities($scope.id, roomUtilities).then(function (response) {
            if (response.data.status === "200") {
                $location.path('/business/hotel/room-type-list');
                toastAlert('success', "Cập nhật dịch vụ phòng thành công !");
                successSound.play();
            } else {
                toastAlert('error', "Cập nhật dịch vụ phòng thất bại !");
                errorSound.play();
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };
})