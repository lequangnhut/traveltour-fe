travel_app.controller('TransportDetailsImageControllerAD', function ($scope, $routeParams, $location, $timeout, TransportServiceAG) {

    let transportDetailId = $routeParams.id;

    $scope.canUpdate = false;
    $scope.isInputImageDisabled = false;
    $scope.isInputImageEnabled = false;
    $scope.deletedImages = [];

    $scope.transportationImages = {
        id: null,
        transportationId: null,
        imagePath: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    /**
     * Upload hình ảnh và lưu vào biến transportTypeImg
     * @param file
     */
    $scope.uploadTransportDetailImg = function (file) {
        if (file && !file.$error) {
            $scope.transportationImages.imagePath = file;
            $scope.canUpdate = true;
            $scope.isInputImageEnabled = true;
        }
    };

    $scope.init = function () {
        if (transportDetailId !== undefined && transportDetailId !== null && transportDetailId !== "") {
            TransportServiceAG.findByTransportId(transportDetailId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.transportationImages = response.data.data.transportGetDataDto.transportationImagesById;
                    $scope.transportBrand = response.data.data.transportGetDataDto.transportationBrandsByTransportationBrandId;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);
        }
    }

    $scope.deleteTransportDetailImage = function (imageId) {
        let index = -1;

        for (let i = 0; i < $scope.transportationImages.length; i++) {
            if ($scope.transportationImages[i].id === imageId) {
                index = i;
                console.log(index)
                break;
            }
        }
        if (index > -1) {
            $scope.deletedImages.push(imageId);
            $scope.transportationImages.splice(index, 1);
            $scope.checkCountImage = $scope.transportationImages.length;
            $scope.canUpdate = true;
            $scope.isInputImageDisabled = true;
        }
    };

    /**
     * Thêm mới hình ảnh
     */
    $scope.createTransportImageDetail = function () {
        $scope.isLoading = true;
        let transportImage = $scope.transportationImages.imagePath
        const formData = new FormData();

        angular.forEach(transportImage, function (file) {
            formData.append('transportImage', file);
        });

        TransportServiceAG.createTransportImage(transportDetailId, formData).then(function successCallback() {
            toastAlert('success', 'Thêm ảnh thành công !');
            $location.path('/business/transport/transport-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    /**
     * update hình ảnh tour chi tiết
     */
    function confirmUpdate() {
        $scope.isLoading = true;
        let transportationImageDto = $scope.transportationImages;

        TransportServiceAG.updateTransportImage(transportationImageDto).then(function successCallback() {
            toastAlert('success', 'Cập nhật ảnh thành công !');
            $location.path('/business/transport/transport-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.updateTransportDetailsImage = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    $scope.init();
});