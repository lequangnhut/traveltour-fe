travel_app.controller('TransportUtilityControllerAD',
    function ($scope, $location, $timeout, $routeParams, $rootScope, $sce, TransportUtilityServiceAD) {
        let searchTimeout;

        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.transportUtility = {
            icon: null,
            title: null,
            description: null
        }

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.init = function () {
            $scope.transportUtilitiesId = $routeParams.transportUtilitiesId;
            $scope.isLoading = true;

            // TransportUtilityServiceAD.findAllTransUtility($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function (response) {
            //     if (response.status === 200) {
            //         $scope.transportUtilityData = response.data.data.content;
            //         $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
            //         $scope.totalElements = response.data.data.totalElements;
            //     } else {
            //         $location.path('/admin/page-not-found');
            //     }
            // }).finally(function () {
            //     $scope.isLoading = false;
            // })
            TransportUtilityServiceAD.findAllTransUtility($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then(function (response) {
                    if (response.data.status === "404") {
                        $scope.transportUtilityData.length = 0;
                        $scope.totalElements = 0;
                    } else {
                        $scope.transportUtilityData = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements;
                    }
                }, errorCallback).finally(function () {$scope.isLoading = false;
            });

            /**
             * Tìm kiếm
             */
            $scope.searchTransUtility = function () {
                if (searchTimeout) $timeout.cancel(searchTimeout);
                $scope.isLoading = true;

                searchTimeout = $timeout(function () {
                    TransportUtilityServiceAD.findAllTransUtility($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm).then(function (response) {
                        if (response.data.status === "404"){
                            $scope.transportUtilityData.length = 0;
                            $scope.totalElements = 0;
                        }else{
                            $scope.transportUtilityData = response.data.data.content;
                            $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                            $scope.totalElements = response.data.data.totalElements;
                        }
                    }).finally(function () {
                        $scope.isLoading = false;
                    });
                }, 500);
            };

            /**
             * Upload hình ảnh và lưu vào biến icon
             * @param file
             */
            $scope.uploadIconUtility = function (file) {
                if (file && !file.$error) {
                    $scope.transportUtility.icon = file;
                }
            };

            if ($scope.transportUtilitiesId !== undefined && $scope.transportUtilitiesId !== null) {
                TransportUtilityServiceAD.findTransUtilityById($scope.transportUtilitiesId).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.transportUtility = response.data.data;
                        $rootScope.namenow = $scope.transportUtility.title;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
            }
        }

        /**
         * Phân trang
         */
        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.init();
            }
        };

        $scope.getPaginationRange = function () {
            const range = [];
            let start, end;

            if ($scope.totalPages <= 3) {
                start = 0;
                end = $scope.totalPages;
            } else {
                start = Math.max(0, $scope.currentPage - 1);
                end = Math.min(start + 3, $scope.totalPages);

                if (end === $scope.totalPages) {
                    start = $scope.totalPages - 3;
                }
            }

            for (let i = start; i < end; i++) {
                range.push(i);
            }

            return range;
        };

        $scope.pageSizeChanged = function () {
            $scope.currentPage = 0;
            $scope.init();
        };

        $scope.getDisplayRange = function () {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        /**
         * Sắp xếp
         */
        $scope.sortData = function (column) {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.init();
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

        /**
         * CRUD
         */
        $scope.createTransportUtility = function () {
            $scope.isLoading = true;

            const utilityData = new FormData();
            utilityData.append('transportUtilitiesDto', new Blob([JSON.stringify($scope.transportUtility)], {type: 'application/json'}));
            utilityData.append('icon', $scope.transportUtility.icon);

            TransportUtilityServiceAD.createTransUtility(utilityData).then(function (response) {
                if (response.status === 200) {
                    toastAlert('success', 'Thêm mới thành công !');
                    $location.path('/admin/type/transport-utilities-list');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            })
        }

        $scope.updateTransportUtility = function () {
            const utilityData = new FormData();
            utilityData.append('transportUtilitiesDto', new Blob([JSON.stringify($scope.transportUtility)], {type: 'application/json'}));
            utilityData.append('icon', $scope.transportUtility.icon);

            function confirmUpdate() {
                $scope.isLoading = true;

                TransportUtilityServiceAD.updateTransUtility(utilityData).then(function (response) {
                    if (response.status === 200) {
                        toastAlert('success', 'Cập nhật thành công !');
                        $location.path('/admin/type/transport-utilities-list');
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                    console.log(response)
                }).finally(function () {
                    $scope.isLoading = false;
                })
            }

            confirmAlert('Bạn có chắc chắn muốn cập nhật tiện ích xe không ?', confirmUpdate);
        }

        // $scope.deleteTransportUtility = function (utilityId) {
        //     function confirmDelete() {
        //
        //         TransportUtilityServiceAD.deleteTransUtility(utilityId).then(function (response) {
        //             if (response.status === 200) {
        //                 toastAlert('success', 'Xóa tiện ích thành công !');
        //                 $location.path('/admin/type/transport-utilities-list');
        //                 $scope.init();
        //             } else {
        //                 $location.path('/admin/page-not-found');
        //             }
        //         });
        //     }
        //
        //     confirmAlert('Bạn có chắc chắn muốn xóa tiện ích xe không ?', confirmDelete);
        // }

        $scope.deleteTransportUtility = function (utilityId) {
            $scope.isLoading = true;
            function confirmDelete() {
                TransportUtilityServiceAD.checkTypeIsWorking(utilityId).then(
                    function successCallback(response) {
                        if (response.data.status.toString() === "200"){
                            toastAlert('error', "Thể loại đang được sử dụng !");
                        }else{
                            TransportUtilityServiceAD.deleteTransUtility(utilityId).then(function (response) {
                                if (response.status === 200) {
                                    toastAlert('success', 'Xóa tiện ích thành công !');
                                    $location.path('/admin/type/transport-utilities-list');
                                    $scope.init();
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            })
                            .catch(function (deleteError) {
                                toastAlert('error', 'Lỗi khi xóa !');
                            });
                        }},errorCallback).finally(function (){
                    $scope.isLoading = false;
                });
            }confirmAlert('Bạn có chắc chắn muốn xóa tiện ích xe không ?', confirmDelete);
        };

        $scope.init();

        //Check name cho thêm mới
        $scope.checkDuplicateTypeName = function () {
            TransportUtilityServiceAD.checkExistTypeName($scope.transportUtility.title)
                .then(function successCallback(response) {
                    if (response.status === 200){
                        $scope.nameError = response.data.data.exists;
                    }else{
                        $scope.nameError = response.data.data.exists;
                    }

                });
        };

        //Check name cho cập nhật
        $scope.checkDuplicateTypeNameUpdate = function () {
            if($scope.transportUtility.title == $rootScope.namenow){
                $scope.nameError = false;
                return;
            }
            TransportUtilityServiceAD.checkExistTypeName($scope.transportUtility.title)
                .then(function successCallback(response) {
                    if (response.data.data.status === 200){
                        $scope.nameError = response.data.data.exists;
                    }else{
                        $scope.nameError = response.data.data.exists;
                    }
                });
        };
    });