travel_app.controller('AgencyControllerDeniedAD', function ($scope, $location, $sce, $rootScope, $routeParams, $timeout, AgencyServiceAD,AgenciesServiceAG) {

    $scope.hasImage = false;
    $scope.count = 0;
    // Biến để lưu danh sách tỉnh thành
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];
    // Biến để lưu danh sách doanh nghiệp
    $scope.typeList = [];
    // Trang hiện tại
    $scope.currentPage = 0;
    // Số lượng tours trên mỗi trang
    $scope.pageSize = 5;
    // Đối tượng duyệt dữ liệu cho các form mới cho form tour
    // $scope.formType = {
    //     bedTypeName : null
    // };
    $scope.agent = {
        agencyname: null,
        mentor: null,
        taxid: null,
        phoneNumber: null,
        website: null,
        province: null,
        districts: null,
        ward: null,
        address: null,
        business_license: null,
        agencystatus: null
    }

    let searchTimeout;
    let typeId = $routeParams.id;

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

    $scope.getDisplayRangeDenied = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElementsDenied);
    };

    //show list
    $scope.getTypeList = function () {
        $scope.isLoading = true;
        AgencyServiceAD.findAllTypeDenied($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function (response) {
                if (response.data.status === "404") {
                    $scope.typeList.length = 0;
                    $scope.totalElementsDenied = 0;
                } else {
                    $scope.typeList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElementsDenied = response.data.data.totalElements;
                }
            }, errorCallback).finally(function () {$scope.isLoading = false;
        });

        if (typeId !== undefined && typeId !== null && typeId !== "") {
            AgencyServiceAD.findAgencieById(typeId)
                .then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.agent = response.data.data;
                        $rootScope.namenow = $scope.agent.bedTypeName;
                    }
                }, errorCallback).finally(function (){
                $scope.isLoading = false;
            });
        }
    };

    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTypeList();
    };

    $scope.searchTypes = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        searchTimeout = $timeout(function () {
            AgencyServiceAD.findAllTypeDenied($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    if (response.data.status === "404"){
                        $scope.typeList.length = 0;
                        $scope.totalElementsDenied = 0;
                    }else{
                        $scope.typeList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElementsDenied = response.data.data.totalElements;
                    }
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.getTypeList();

    $scope.openModalDenied = function (typeId) {
        if (!$scope.agent) {
            return;
        }
        fillModalWithData(typeId);
        $('#scrollingLong3').modal('show');
    };

    function fillModalWithData(typeId) {
        if (typeId !== undefined && typeId !== null && typeId !== "") {
            AgencyServiceAD.findAgencieById(typeId)
                .then(function successCallback(res) {
                    $scope.agent = res.data.data;
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }
        ;
    }

});