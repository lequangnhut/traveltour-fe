travel_app.controller('TourDetailsImageControllerAD',
    function ($scope, $routeParams, $location, $timeout, TourDetailsServiceAD, Base64ObjectService) {

        let tourDetailId = Base64ObjectService.decodeObject($routeParams.id);

        $scope.canUpdate = false;
        $scope.isInputImageDisabled = false;
        $scope.isInputImageEnabled = false;
        $scope.deletedImages = [];

        $scope.tourDetailImage = {
            id: null,
            tourDetailId: null,
            tourDetailImg: null
        }

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        /**
         * Upload hình ảnh và lưu vào biến transportTypeImg
         * @param file
         */
        $scope.uploadTourDetailImg = function (file) {
            if (file && !file.$error) {
                $scope.tourDetailImage.tourDetailImg = file;
                $scope.canUpdate = true;
                $scope.isInputImageEnabled = true;
            }
        };

        $scope.init = function () {
            if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
                TourDetailsServiceAD.findTourDetailById(tourDetailId).then(response => {
                    if (response.status === 200) {
                        $timeout(function () {
                            $scope.tour = response.data.data.toursByTourId;
                            $scope.tourDetailImage = response.data.data.tourDetailImagesById;
                            $scope.checkCountImage = $scope.tourDetailImage.length;
                        }, 0);
                    }
                }, errorCallback);
            }
        }

        $scope.deleteTourDetailImage = function (imageId) {
            let index = -1;

            for (let i = 0; i < $scope.tourDetailImage.length; i++) {
                if ($scope.tourDetailImage[i].id === imageId) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                $scope.deletedImages.push(imageId);
                $scope.tourDetailImage.splice(index, 1);
                $scope.checkCountImage = $scope.tourDetailImage.length;
                $scope.canUpdate = true;
                $scope.isInputImageDisabled = true;
            }
        };

        /**
         * Thêm mới hình ảnh
         */
        $scope.createImageDetail = function () {
            $scope.isLoading = true;
            let tourDetailImage = $scope.tourDetailImage.tourDetailImg
            const formData = new FormData();

            angular.forEach(tourDetailImage, function (file) {
                formData.append('tourDetailImage', file);
            });

            TourDetailsServiceAD.createTourDetailImage(tourDetailId, formData).then(function successCallback() {
                toastAlert('success', 'Thêm ảnh thành công !');
                $location.path('/admin/detail-tour-list');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        /**
         * update hình ảnh tour chi tiết
         */
        function confirmUpdate() {
            $scope.isLoading = true;
            let tourDetailImagesDto = $scope.tourDetailImage;

            TourDetailsServiceAD.updateTourDetailImage(tourDetailImagesDto).then(function successCallback() {
                toastAlert('success', 'Cập nhật ảnh thành công !');
                $location.path('/admin/detail-tour-list');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.updateTourDetailsImage = function () {
            confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
        }

        $scope.init();
    });