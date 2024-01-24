travel_app.controller('TransTypeControllerAD', function ($scope, $location, $rootScope, $routeParams, $timeout, TransportTypeServiceAD) {

    $scope.hasImage = false;
    // Biến để lưu danh sách tours
    $scope.typeList = [];
    // Trang hiện tại
    $scope.currentPage = 0;
    // Số lượng tours trên mỗi trang
    $scope.pageSize = 5;
    // Đối tượng duyệt dữ liệu cho các form mới cho form tour
    $scope.formType = {
        transportationTypeName : null
    };

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

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    //show list
    $scope.getTypeList = function () {
        $scope.isLoading = true;
        TransportTypeServiceAD.findAllType($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function (response) {
                $scope.typeList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

            }, errorCallback).finally(function () {$scope.isLoading = false;
        });

        if (typeId !== undefined && typeId !== null && typeId !== "") {
            TransportTypeServiceAD.findById(typeId)
                .then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.formType = response.data.data;
                        $rootScope.namenow = $scope.formType.transportationTypeName;
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
            TransportTypeServiceAD.findAllType($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    if (response.data.status === "404"){
                        $scope.typeList.length = 0;
                    }else{
                        $scope.typeList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.totalElements;
                    }
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.getTypeList();

    //================================================================

    //Check name cho thêm mới
    $scope.checkDuplicateTypeName = function () {
        TransportTypeServiceAD.checkExistTypeName($scope.formType.transportationTypeName)
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
        if($scope.formType.transportationTypeName == $rootScope.namenow){
            $scope.nameError = false;
            return;
        }
        TransportTypeServiceAD.checkExistTypeName($scope.formType.transportationTypeName)
            .then(function successCallback(response) {
                if (response.data.data.status === 200){
                    $scope.nameError = response.data.data.exists;
                }else{
                    $scope.nameError = response.data.data.exists;
                }
            });
    };

    //Thêm loại
    $scope.createType = function () {
        $scope.isLoading = true;
        let dataType = $scope.formType
        TransportTypeServiceAD.createThisType(dataType).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/type/transportation-type-list');
        }, errorCallback).finally(function (){
            $scope.isLoading = false;
        });
    }

    // Cập nhật loại
    function confirmUpdateType() {
        $scope.isLoading = true;
        TransportTypeServiceAD.updateThisType($scope.formType).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/type/transportation-type-list');
            $scope.getTypeList();
        }, errorCallback).finally(function (){
            $scope.isLoading = false;
        });
    }
    $scope.updateType = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdateType);
    }

    // Xóa loại
    $scope.deleteType = function (typeId) {
        $scope.isLoading = true;
        function confirmDeleteType() {
            TransportTypeServiceAD.checkTypeIsWorking(typeId).then(
                function successCallback(response) {
                    if (response.data.status.toString() === "200"){
                        toastAlert('error', "Thể loại đang được sử dụng !");
                    }else{
                        TransportTypeServiceAD.deleteThisType(typeId)
                            .then(function (deleteResponse) {
                                toastAlert('success', 'Xóa thành công !');
                                $location.path('/admin/type/transportation-type-list');
                                //$scope.getTypeList(); - Lý do cmt là để dô nó lỗi
                                if($scope.typeList.length < 2){
                                    $scope.setPage($scope.currentPage-1);
                                }else{
                                    $scope.setPage($scope.currentPage);
                                }
                            })
                            .catch(function (deleteError) {
                                toastAlert('error', 'Lỗi khi xóa !');
                            });
                    }},errorCallback).finally(function (){
                $scope.isLoading = false;
            });
        }confirmAlert('Bạn có chắc chắn muốn xóa không ?', confirmDeleteType);
    };

});