travel_app.controller('TourTypeControllerAD',
    function ($scope, $location, $sce, $rootScope, $routeParams, $timeout, TourTypeServiceAD, Base64ObjectService) {

        $scope.hasImage = false;

        // Biến để lưu danh sách tours
        $scope.typeList = [];

        // Trang hiện tại
        $scope.currentPage = 0;

        // Số lượng tours trên mỗi trang
        $scope.pageSize = 5;

        // Đối tượng duyệt dữ liệu cho các form mới cho form tour
        $scope.formType = {
            tourTypeName: null
        };

        let searchTimeout;
        let typeId = Base64ObjectService.decodeObject($routeParams.id);

        //================================================================
        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getTypeList();
            }
        };

        $scope.getPaginationRange = function () {
            var range = [];
            var start, end;
            if ($scope.totalPages <= 3) {
                // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
                start = 0;
                end = $scope.totalPages;
            } else {
                // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
                start = Math.max(0, $scope.currentPage - 1);
                end = Math.min(start + 3, $scope.totalPages);
                // Điều chỉnh để luôn hiển thị 5 trang
                if (end === $scope.totalPages) {
                    start = $scope.totalPages - 3;
                }
            }
            for (var i = start; i < end; i++) {
                range.push(i);
            }
            return range;
        };

        $scope.pageSizeChanged = function () {
            $scope.currentPage = 0; // Đặt lại về trang đầu tiên
            $scope.getTypeList(); // Tải lại dữ liệu với kích thước trang mới
        };

        $scope.getDisplayRange = function () {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        $scope.getDisplayIndex = function (index) {
            return index + 1 + $scope.currentPage * $scope.pageSize;
        };

        //show list
        $scope.getTypeList = function () {
            $scope.isLoading = true;
            TourTypeServiceAD.findAllType($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then(function (response) {
                    if (response.data.status === "404") {
                        $scope.typeList.length = 0;
                    } else {
                        $scope.typeList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements;
                    }
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });

            if (typeId !== undefined && typeId !== null && typeId !== "") {
                TourTypeServiceAD.findById(typeId)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            $scope.formType = response.data.data;
                            $rootScope.namenow = $scope.formType.tourTypeName;
                        }
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }
        };

        $scope.sortData = function (column) {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getTypeList();
        };

        $scope.getSortIcon = function (column) {
            if ($scope.sortBy === column) {
                if ($scope.sortDir === 'asc') {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
                } else {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
                }
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
        };

        $scope.searchTypes = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(function () {
                TourTypeServiceAD.findAllType($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        if (response.data.status === "404") {
                            $scope.typeList.length = 0;
                        } else {
                            $scope.typeList = response.data.data.content;
                            $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                            $scope.totalElements = response.data.data.totalElements;
                        }
                    }, errorCallback);
            }, 500); // 500ms debounce
        };

        $scope.getTypeList();

        //================================================================

        //Check name cho thêm mới
        $scope.checkDuplicateTypeName = function () {
            TourTypeServiceAD.checkExistTypeName($scope.formType.tourTypeName)
                .then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.nameError = response.data.data.exists;
                    } else {
                        $scope.nameError = response.data.data.exists;
                    }
                });
        };

        //Check name cho cập nhật
        $scope.checkDuplicateTypeNameUpdate = function () {
            if ($scope.formType.tourTypeName === $rootScope.namenow) {
                $scope.nameError = false;
                return;
            }
            TourTypeServiceAD.checkExistTypeName($scope.formType.tourTypeName)
                .then(function successCallback(response) {
                    if (response.data.data.status === 200) {
                        $scope.nameError = response.data.data.exists;
                    } else {
                        $scope.nameError = response.data.data.exists;
                    }
                });
        };

        //Thêm loại
        $scope.createType = function () {
            $scope.isLoading = true;
            let dataType = $scope.formType
            TourTypeServiceAD.createThisType(dataType).then(function successCallback() {
                toastAlert('success', 'Thêm mới thành công !');
                $location.path('/admin/type/tour-type-list');
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        // Cập nhật loại
        function confirmUpdateType() {
            $scope.isLoading = true;
            TourTypeServiceAD.updateThisType($scope.formType).then(function successCallback() {
                toastAlert('success', 'Cập nhật thành công !');
                $location.path('/admin/type/tour-type-list');
                $scope.getTypeList();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.updateType = function () {
            confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdateType);
        }

        // Xóa loại
        $scope.deleteType = function (typeId) {
            function confirmDeleteType() {
                $scope.isLoading = true;

                TourTypeServiceAD.checkTypeIsWorking(typeId).then(
                    function successCallback(response) {
                        if (response.data.status.toString() === "200") {
                            toastAlert('error', "Thể loại đang được sử dụng !");
                        } else {
                            TourTypeServiceAD.deleteThisType(typeId)
                                .then(function () {
                                    toastAlert('success', 'Xóa thành công !');
                                    $location.path('/admin/type/tour-type-list');
                                    //$scope.getTypeList(); - Lý do cmt là để dô nó lỗi
                                    if ($scope.typeList.length < 2) {
                                        $scope.setPage($scope.currentPage - 1);
                                    } else {
                                        $scope.setPage($scope.currentPage);
                                    }
                                })
                                .catch(function () {
                                    toastAlert('error', 'Lỗi khi xóa !');
                                });
                        }
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn muốn xóa không ?', confirmDeleteType);
        };
    });