travel_app.controller('BasicTourControllerAD', function ($scope, $sce, $location, $routeParams, $timeout, ToursServiceAD, ToursTypeServiceAD) {
    $scope.isLoading = true;
    $scope.hasImage = false;

    $scope.currentPage = 0;
    $scope.pageSize = 5;


    // Đối tượng tourBasic mới cho form tour
    $scope.tourBasic = {
        tourName: null, tourTypeId: null, dateCreated: null, isActive: null, tourImg: null, tourDescription: ''
    };

    let searchTimeout;

    $scope.tourTypeNames = {};

    let tourId = $routeParams.id;

    // Khai báo biến để lưu danh sách tourType
    $scope.tourTypeList = [];

    const errorCallback = () => {
        $location.path('/admin/internal-server-error')
    }

    /**
     * Tải lên hình ảnh tour và lưu vào biến tourBasic.tourImg
     * @param file
     */
    $scope.uploadTourImage = (file) => {
        if (file && !file.$error) {
            let reader = new FileReader();

            reader.onload = (e) => {
                $scope.tourBasic.tourImg = e.target.result;
                $scope.tourImgNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }
    };

    $scope.getCurrentImageSource = () => {
        if ($scope.tourBasic.tourImg && typeof $scope.tourBasic.tourImg === 'string' && $scope.tourBasic.tourImg.startsWith('http')) {
            $scope.tourImgNoCloud = $scope.tourBasic.tourImg;
            return $scope.tourBasic.tourImg;
        } else if ($scope.tourBasic.tourImg && typeof $scope.tourBasic.tourImg === 'string') {
            return $scope.tourBasic.tourImg;
        }
    };

    $scope.loadTourTypeName = (tourId) => {
        if (!$scope.tourTypeNames[tourId]) {
            ToursTypeServiceAD.findTourTypeById(tourId)
                .then((response) => {
                    $scope.tourTypeNames[tourId] = response.data.tourTypeName;
                }, errorCallback);
        }
    };


    $scope.setPage = (page) => {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getTourBasicList();
        }
    };

    $scope.getPaginationRange = () => {
        let range = [];
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

    $scope.pageSizeChanged = () => {
        $scope.currentPage = 0;
        $scope.getTourBasicList();
    };

    $scope.getDisplayRange = () => {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    const tourBasicData = (response) => {
        $scope.tourBasicList = response.data !== null ? response.data.content : [];
        $scope.totalPages = response.data !== null ? Math.ceil(response.data.totalElements / $scope.pageSize) : 0;
        $scope.totalElements = response.data !== null ? response.data.totalElements : 0;

        $scope.tourBasicList.forEach(tour => {
            $scope.loadTourTypeName(tour.tourTypeId);
        });
    };

    $scope.getTourBasicList = () => {
        ToursServiceAD.findAllTours($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then((response) => {
                tourBasicData(response);
            }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });

        if (tourId !== undefined && tourId !== null && tourId !== "") {
            ToursServiceAD.findTourById(tourId).then((response) => {
                if (response.status === 200) {
                    $scope.tourBasic = response.data;
                }
            }, errorCallback);
        }
    };


    $scope.sortData = (column) => {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortBy === column && $scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getTourBasicList();
    };

    $scope.getSortIcon = (column) => {
        if ($scope.sortBy === column) {
            if ($scope.sortDir === 'asc') {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
            } else {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
            }
        }
        return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
    };


    $scope.searchTours = () => {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        $scope.setPage(0);

        searchTimeout = $timeout(() => {
            ToursServiceAD.findAllTours($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then((response) => {
                    tourBasicData(response);
                }, errorCallback);
        }, 500);
    };

    $scope.getTourBasicList();

    /*==============================================================================*/
    //form create

    $scope.loadSelectTourType = () => {
        ToursTypeServiceAD.getAllTourTypes()
            .then((response) => {
                $scope.tourTypeList = response.data;
            }, errorCallback);
    };

    // Gọi hàm để tải danh sách tourType khi controller được khởi tạo
    $scope.loadSelectTourType();

    $scope.createTourSubmit = () => {
        $scope.isLoading = true;
        const dataTrans = new FormData();

        dataTrans.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
        dataTrans.append("tourImg", $scope.tourImgNoCloud);

        ToursServiceAD.createTour(dataTrans).then(() => {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/basic-tour-list');
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    };

    //form update
    $scope.updateTourSubmit = () => {
        const confirmUpdate = () => {
            const dataTour = new FormData();
            $scope.isLoading = true;

            if ($scope.hasImage) {
                dataTour.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
                dataTour.append("tourImg", $scope.tourImgNoCloud);
                updateTour(tourId, dataTour);
            } else {
                dataTour.append("toursDto", new Blob([JSON.stringify($scope.tourBasic)], {type: "application/json"}));
                dataTour.append("tourImg", null);
                updateTour(tourId, dataTour);
            }
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật tour không ?', confirmUpdate);
    };

    const updateTour = (tourId, dataTour) => {
        ToursServiceAD.updateTour(tourId, dataTour).then(() => {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/basic-tour-list');
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    }

    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteTour = (userId, tourName) => {
        const confirmDeleteTour = () => {
            ToursServiceAD.deactivateTour(userId).then(() => {
                toastAlert('success', 'Xóa thành công !');
                $scope.getTourBasicList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa tour ' + tourName + ' không ?', confirmDeleteTour);
    }

    $scope.openImageModalTour = (imageUrl) => {
        document.getElementById('modalImage').src = imageUrl;
        $('#imageModal').modal('show');
    };
});