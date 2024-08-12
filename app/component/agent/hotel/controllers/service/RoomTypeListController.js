travel_app.controller('RoomTypeListController', function ($scope, $timeout, $http, FormatDateService, Upload, RoomTypeService, LocalStorageService, BedTypeService) {
    var hotelId = LocalStorageService.get("brandId")

    $scope.roomTypes = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        amountRoom: null,
        price: null,
        isActive: null,
        isDeleted: null,
        roomTypeAvatar: null,
        roomTypeDescription: null,
        roomImagesById: [],
        roomUtilities: [],
        roomBedsById: {},
    }

    $scope.roomTypesDetails = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        amountRoom: null,
        price: null,
        isActive: null,
        isDeleted: null,
        roomTypeAvatar: null,
        roomTypeDescription: null,
        roomImagesById: [],
        roomUtilities: [],
        roomBedsById: []
    };

    $scope.bedTypes = [];
    $scope.selectedItems = [];
    $scope.selectAllChecked = false;
    $scope.roomTypes.isSelected = false;
    $scope.roomTypesIdModel = null;
    $scope.fileInputValue = '';
    let searchTimeout;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    function errorCallback(error) {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Phương thức sắp xếp các trường dữ liệu
     * @param column
     */
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getRoomTypeList();
    };

    /**
     * Phương thức kiểm rta giá có đúng định dạng số không
     */
    $scope.checkPriceFormat = function () {
        // Kiểm tra xem giá có đúng định dạng số không
        if (!/^[0-9]*$/.test($scope.tourDetail.unitPrice)) {
            $scope.invalidPriceFormat = true;
        } else {
            $scope.invalidPriceFormat = false;
        }
    };

    /**
     * Phương thức xử lí phân trang khi chuyển trang
     * @param page
     */
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getRoomTypeList();
        }
    };
    $scope.setPage()
    /**
     * Phương thức xử lí phân trang
     * @returns {*[]}
     */
    $scope.getPaginationRange = function () {
        var range = [];
        var start, end;

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

        for (var i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };
    $scope.getPaginationRange()

    /**
     * Phương thức lấy danh sách loại phòng
     */
    $scope.getRoomTypeList = async function () {
        RoomTypeService.findAllRoomTypeDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, "", hotelId, false)
            .then(function (response) {
                $scope.isLoading = true;
                if (response.data.data === null || response.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return
                }
                $scope.roomTypes = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử
                console.log("phòng:", $scope.roomTypes)
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.getRoomTypeList()

    /**
     * Phương thức tìm kiếm dữ liệu
     */
    $scope.searchRoomTypeDetail = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);

        searchTimeout = $timeout(function () {
            RoomTypeService.findAllRoomTypeDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm, hotelId, false)
                .then(function (response) {
                    $scope.roomTypes = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.searchRoomTypeDetail();

    /**
     * Phương thức hiển thị số lượng tối đa của dữ liệu
     */
    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.getRoomTypeList();
    };

    /**
     * phương thức lấy số lượng dữ liệu trả về
     * @returns {number}
     */
    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    /**
     * Phương thức mở modal
     * @param roomTypeId
     */
    $scope.openModal = function (roomTypeId) {
        RoomTypeService.getRoomTypeById(roomTypeId).then(function (response) {
            $scope.isLoading = true;
            if (response.data.status === "200") {
                $scope.roomTypesDetails = response.data.data
                $scope.roomTypesIdModel = $scope.roomTypesDetails.id;
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        $('#detailsRoomHotelModal').modal('show');
    };

    /**
     * Phương thức đóng modal
     */
    $scope.closeModal = function () {
        $('#detailsRoomHotelModal').modal('hide');
    };

    /**
     * Phương thức xử lí khi chọn chekcbox trên header table
     */
    $scope.selectAll = function () {
        if (!$scope.selectAllChecked) {
            angular.forEach($scope.roomTypes, function (roomType) {
                if (!roomType.isSelected) {
                    roomType.isSelected = true;
                    $scope.selectedItems.push(roomType);
                }
            });
        } else {
            angular.forEach($scope.roomTypes, function (roomType) {
                roomType.isSelected = false;
                var idx = $scope.selectedItems.indexOf(roomType);
                if (idx > -1) {
                    $scope.selectedItems.splice(idx, 1);
                }
            });
        }

        $scope.selectAllChecked = !$scope.selectAllChecked;
        $scope.showDeleteButton = $scope.selectedItems.length > 0;
    };

    /**
     * Phương thức xử lí khi lựa chọn checkbox
     * @param roomType
     */
    $scope.toggleSelection = function (roomType) {
        roomType.isSelected = !roomType.isSelected;
        var idx = $scope.selectedItems.indexOf(roomType);

        if (roomType.isSelected && idx === -1) {
            $scope.selectedItems.push(roomType);
        } else if (!roomType.isSelected && idx > -1) {
            $scope.selectedItems.splice(idx, 1);
        }

        var allSelected = $scope.roomTypes.every(function (item) {
            return item.isSelected;
        });

        $scope.selectAllChecked = allSelected;
        $scope.showDeleteButton = $scope.selectedItems.length > 0;
    };

    /**
     * Phương thức format giá tiền trên giao diện
     * @param amount
     * @returns {string}
     */
    $scope.formatCurrency = function (amount) {
        var formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        return formatter.format(amount);
    };

    /**
     * Phương thức mở loại giường
     */
    $scope.openImageModal = function () {
        $('#imageModal').modal('show'); // Hiển thị modal khi click vào nút
    };

    /**
     * Phương thức lấy toàn bộ loại giường
     */
    $scope.init = function () {
        BedTypeService.getAllBedTypes().then(function (response) {
            $scope.bedTypes = response.data.data;
        }, errorCallback);
    }

    $scope.init();

    /**
     * Phương thức thay đổi mã loại giường thanh tên loại giường
     * @param bedTypeId
     * @returns {null|string}
     */
    $scope.getBedTypeName = function (bedTypeId) {
        var bedType = $scope.bedTypes.find(function (bedType) {
            return bedType.id === bedTypeId;
        });

        return bedType ? bedType.bedTypeName : '';
    }

    $scope.selectedFile = null;
    $scope.openFileInput = function () {
        document.getElementById('fileInput').click();
    };

    /**
     * Phương thức chọn file
     * @param $files
     */
    $scope.onFileSelect = function ($files) {
        var file = $files;
        $scope.uploadFile(file);
    };

    /**
     * Phương thức upload file
     * @param file
     */
    $scope.uploadFile = function (file) {
        $scope.isLoading = true;
        if (file) {
            RoomTypeService.updateAvatarRoomType($scope.roomTypesIdModel, file)
                .then(function (response) {
                    if (response.data.status === "200") {
                        $scope.roomTypesDetails = response.data.data;
                        toastAlert('success', response.data.message);
                        $scope.playSuccessSound()
                    } else {
                        toastAlert('error', response.data.message);
                        $scope.playErrorSound()
                    }
                }).finally(function () {
                $scope.isLoading = false;
                $scope.fileInputValue = '';
            });
        }
    };

    /**
     * Phương thức xóa những phòng đã chọn
     * @returns {Promise<void>}
     */
    $scope.deleteSelectedItems = async function () {
        var selectedIds = $scope.selectedItems.map(function (item) {
            return item.id;
        });

        Swal.fire({
            title: 'Bạn chắc chắn muốn xóa phòng này chứ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => { // Thêm async ở đây
            if (result.isConfirmed) {
                if (selectedIds != null) {
                    try {
                        var response = await RoomTypeService.deleteAllRoomTypeById(selectedIds);
                        $scope.isLoading = true;
                        if (response.status === 200) {
                            toastAlert("success", response.data.message);
                            $scope.playSuccessSound();
                            $timeout(function () {
                                RoomTypeService.findAllRoomTypeDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm, hotelId, false)
                                    .then(function (response) {
                                        $scope.roomTypes = response.data.data.content;
                                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                                        $scope.totalElements = response.data.data.totalElements;
                                    }, errorCallback);
                            }, 200);
                        } else {
                            toastAlert("error", response.data.message);
                            $scope.playErrorSound();
                        }
                    } catch (error) {
                        toastAlert("error", error);
                    } finally {
                        $scope.isLoading = false;
                    }
                } else {
                    toastAlert("error", "Bạn chưa chọn đối tượng nào để xóa");
                }
            }
        });
    };
})