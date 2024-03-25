travel_app.controller("HotelPostController", function ($scope, $sce, $location, $window, $routeParams, $timeout, $rootScope, $http, PostServiceAD) {
    $scope.isLoading = true;

    let searchTimeout;
    $scope.mess = '';

    $scope.hotelPostList = [];
    $scope.utilitiesList = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.currentTab = 'pending';
    $scope.isAccepted = true;

    $scope.passDate = false;


    /** Hàm trả trang lỗi*/
    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }


    //===============================================================================================================
    //phân trang
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getHotelPostList();
        }
    };

    $scope.getPaginationRange = function () {
        let range = [];
        let start, end;

        if ($scope.totalPages <= 3) {
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

        for (let i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.getHotelPostList();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getHotelPostList();
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

    $scope.getHotelPostList = function () {
        PostServiceAD.findAllHotel($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.isAccepted)
            .then(function (response) {
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.hotelPostList.length = 0;
                    $scope.totalElements = 0;
                    $scope.showNull = $scope.orderStatus;
                    return;
                }
                $scope.hotelPostList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getHotelPostList();

    $scope.getChangeStatus = function(){
        $scope.getHotelPostList();
    }

    $scope.searchName = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);

        searchTimeout = $timeout(function () {
            PostServiceAD.findAllHotel($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.isAccepted, $scope.searchTerm)
                .then(function (response) {
                    if (response.data.data === null || response.data.data.content.length === 0) {
                        $scope.hotelPostList.length = 0;
                        $scope.totalElements = 0;
                        $scope.showNull = $scope.orderStatus;
                        return;
                    }
                    $scope.hotelPostList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;

                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }, 500);
    };

    $scope.openModal = function (data) {
        $scope.hotelPost = data;
        $scope.utilitiesList = data.placeUtilities;
        $('#hotelModal').modal('show');
    }

    $scope.closeModal = function () {
        $('#hotelModal').modal('hide');
    };

    $scope.deniedFormHotel = function (data) {
        function confirmDeny() {
            PostServiceAD.deniedHotel(data.id)
                .then(function (res) {
                    toastAlert('success', 'Đã từ chối quyền hoạt động!');
                    $scope.getHotelPostList();
                    $('#hotelModal').modal('hide');
                })
                .catch(errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
        }
        confirmAlertPost('Bạn không phê duyệt dịch vụ này?', confirmDeny);
    };

    $scope.acceptFormHotel = function (data) {
        function confirmAccept() {
            PostServiceAD.acceptHotel(data.id)
                .then(function (res) {
                    toastAlert('success', 'Đã cấp quyền hoạt động!');
                    $scope.getHotelPostList();
                    $('#hotelModal').modal('hide');
                })
                .catch(errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }
        confirmAlertPost('Bạn muốn phê duyệt dịch vụ này?', confirmAccept);
    };


})