travel_app.controller('TourCusController',
    function ($scope, $location, $filter, LocalStorageService, TourCusService, Base64ObjectService,
              HomeCusService, TourDetailCusService, MapBoxService, ToursServiceAD) {

        const vie = ['tour', 'du', 'lịch', '-', '–', 'bắt', 'đầu', 'bị', 'bởi', 'cả', 'các', 'cái', 'cần', 'càng', 'chỉ', 'chiếc', 'cho', 'chứ', 'chưa', 'chuyện', 'có', 'có thể', 'cứ', 'của', 'cùng', 'cũng', 'đã', 'đang', 'để', 'đến nỗi', 'đều', 'điều', 'do', 'đó', 'được', 'dưới', 'gì', 'khi', 'không', 'là', 'lại', 'lên', 'lúc', 'mà', 'mỗi', 'một cách', 'này', 'nên', 'nếu', 'ngay', 'nhiều', 'như', 'nhưng', 'những', 'nơi', 'nữa', 'phải', 'qua', 'ra', 'rằng', 'rất', 'rồi', 'sau', 'sẽ', 'so', 'sự', 'tại', 'theo', 'thì', 'trên', 'trước', 'từ', 'từng', 'và', 'vẫn', 'vào', 'vậy', 'vì', 'việc', 'với', 'vừa', 'vâng', 'à', 'ừ', 'từ'];

        const removeStopwords = (tokens, stopwords = vie) => {
            if (!Array.isArray(tokens) || !Array.isArray(stopwords)) {
                throw new Error('expected Arrays try: removeStopwords(Array[, Array])')
            }
            return tokens.filter(x => !stopwords.includes(x.toLowerCase()))
        };

        $scope.currentPage = 0;
        $scope.pageSize = 5

        $scope.showMoreTourType = false;
        $scope.limitTourType = 5;

        $scope.hasResults = true;
        $scope.proposedResults = false;

        $scope.markersTour = [];

        $scope.ratings = [{id: 1, label: 'Trên 1 sao'}, {id: 2, label: 'Trên 2 sao'}, {id: 3, label: 'Trên 3 sao'}, {
            id: 4,
            label: 'Trên 4 sao'
        }, {id: 5, label: 'Trên 5 sao'}];

        let filters = LocalStorageService.decryptLocalData('filtersTour', 'encryptFiltersTour');

        let defaultFilters = {
            price: 15000000,
            tourTypeList: [],
            departureArrives: null,
            departureFrom: null,
            numberOfPeople: 2,
            departure: new Date()
        };

        $scope.filters = filters ? {...defaultFilters, ...filters} : defaultFilters;

        if (typeof $scope.filters.departure === 'string') {
            $scope.filters.departure = new Date($scope.filters.departure);
        }

        $scope.showArrivesList = false;
        $scope.showFromList = false;

        $scope.enableIncomingList = function () {
            $scope.showArrivesList = true;
        };

        $scope.turnOnThePointList = function () {
            $scope.showFromList = true;
        };
        $scope.turnOffThePointList = function () {
            $scope.showFromList = false;
        };

        $scope.setSelectedTour = function (tour) {
            $scope.filters.departureArrives = tour.tourName;
            $scope.showArrivesList = false;
        };

        angular.element(document).on('click', function (event) {
            const target = angular.element(event.target);
            const isInput = target.is('input');
            const isListItem = target.parents('.list-group').length > 0;
            if (!isInput && !isListItem) {
                $scope.$apply(function () {
                    $scope.showArrivesList = false;
                    $scope.showFromList = false;
                });
            }
        });

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        $scope.validateDates = () => {
            $scope.currentDate = new Date();

            let currentDateNow = Math.floor(($scope.filters.checkInDateFiller - $scope.currentDate) / (1000 * 60 * 60 * 24))

            if (currentDateNow < -1) {
                $scope.errorCheckInDateFiller = "Ngày đi không thể nhỏ hơn ngày hiện tại";
            } else {
                $scope.errorCheckInDateFiller = "";
            }
        };

        $scope.getCurrentDate = () => {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
        };

        $scope.checkDate = () => {
            const currentDate = new Date();
            if ($scope.filters.departure === undefined) {
                $scope.filters.departure = currentDate;
                toastAlert('warning', 'Không được nhập ngày quá khứ!');
            }
        };

        $scope.onQuantityChange = (filters) => {
            filters.numberOfPeople = parseInt(filters.numberOfPeople, 10) || 0;
            if (filters.numberOfPeople > 999) {
                filters.numberOfPeople = 999;
            }
        };

        $scope.onQuantityBlur = (filters) => {
            if (filters.numberOfPeople === null || filters.numberOfPeople === '' || filters.numberOfPeople < 1) {
                filters.numberOfPeople = 1;
            }
        };

        const getAListOfPopularTours = (response) => {
            if (response.data.status === '204') {
                if ($scope.hasResults) {
                    centerAlert('Thông báo', 'Rất tiếc, Hiện tại không tìm thấy tour phù hợp với yêu cầu của quý khách. Dưới đây là đề xuất về các tour phổ biến nhất hiện tại của chúng tôi.', 'warning');
                }
                TourCusService.getAListOfPopularTours($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.filters)
                    .then((response) => {
                        $scope.tourDetail = response.data.data !== null ? response.data.data.content : [];
                        $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
                        $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
                $scope.hasResults = true;
                $scope.proposedResults = true;
            }
        }

        $scope.init = function () {
            $scope.isLoading = true;

            $scope.filterAllTour();

            TourCusService.findAllTourType().then(function (response) {
                if (response.status === 200) {
                    $scope.tourType = response.data.data;
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback);

            function removeDiacriticsAndNormalize(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }

            function searchWithDiacriticsInsensitive(input, target) {
                const inputWithoutDiacritics = removeDiacriticsAndNormalize(input.toLowerCase());
                const targetWithoutDiacritics = removeDiacriticsAndNormalize(target.toLowerCase());
                return targetWithoutDiacritics.includes(inputWithoutDiacritics);
            }

            HomeCusService.getAllDataList($scope.filters.departureArrives, $scope.filters.departureFrom).then((response) => {
                if (response.status === 200) {
                    const departureArrives = response.data.data.departureArrives;
                    const departureFrom = response.data.data.departureFrom;

                    const updateArrivesLists = (newVal) => {
                        let filteredArrives = [];

                        if (newVal && newVal.trim() !== '') {
                            filteredArrives = departureArrives.filter(function (arrive) {
                                return searchWithDiacriticsInsensitive(newVal, arrive.tourName);
                            });

                            if (filteredArrives.length < 10) {
                                const additionalFilteredArrives = departureArrives.filter(function (arrive) {
                                    return !filteredArrives.includes(arrive) && searchWithDiacriticsInsensitive(newVal, arrive.toLocation);
                                });
                                filteredArrives.push(...additionalFilteredArrives);
                            }
                        } else {
                            filteredArrives = angular.copy(departureArrives);
                        }
                        $scope.departureArrives = filteredArrives.slice(0, 10);
                    };

                    const updateFromLists = (newVal) => {
                        let filteredFrom = [];

                        if (newVal && newVal.trim() !== '') {
                            filteredFrom = departureFrom.filter(function (from) {
                                return searchWithDiacriticsInsensitive(newVal, from);
                            });
                        } else {
                            filteredFrom = angular.copy(departureFrom);
                        }
                        $scope.departureFrom = filteredFrom;
                    };


                    $scope.$watch('filters.departureArrives', updateArrivesLists);
                    $scope.$watch('filters.departureFrom', updateFromLists);

                    updateArrivesLists();
                    updateFromLists();

                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback);

            $scope.modelMap();
        }

        $scope.modelMap = function () {
            /**
             * Phương thức khởi tạo map
             */
            $scope.initMap = function () {
                mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

                $scope.map = new mapboxgl.Map({
                    container: 'map', style: 'mapbox://styles/mapbox/streets-v12', center: [106.6297, 10.8231], zoom: 9
                });
            }

            $scope.addMarkersTour = function (tourDetail) {
                let bounds = new mapboxgl.LngLatBounds();

                let iconUrl = '/assets/customers/images/icon/maker.png';
                let el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = `url(${iconUrl})`;
                el.style.width = '40px';
                el.style.height = '40px';
                el.style.backgroundSize = '100%';

                let popupContent = createPopupContent(tourDetail);

                let popup = new mapboxgl.Popup({
                    offset: 15,
                    closeButton: true,
                    closeOnClick: false,
                    closeOnClickOutside: true,
                    maxWidth: '800px',
                    minWidth: '600px'
                }).setHTML(popupContent);

                MapBoxService.geocodeAddress(tourDetail.toLocation, function (error, toCoordinates) {
                    if (!error) {
                        let marker = new mapboxgl.Marker(el)
                            .setLngLat(toCoordinates)
                            .setPopup(popup)
                            .addTo($scope.map);

                        let closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
                        if (closeButton) {
                            closeButton.style.fontSize = '30px';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.lineHeight = '40px';
                        }

                        $scope.removeMarkersTour();
                        $scope.markersTour.push(marker);

                        bounds.extend(toCoordinates);
                        $scope.map.fitBounds(bounds, {padding: 20});
                    } else {
                        console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                    }
                });
            };

            /**
             * Phương thức xóa marker trên bản đồ dựa vào id phòng khách sạn
             */
            $scope.removeMarkersTour = function () {
                if ($scope.markersTour.length > 0) {
                    $scope.markersTour.forEach(function (marker) {
                        marker.remove();
                    });

                    $scope.markersTour = [];
                }
            };

            /**
             * Phương thức hiển thị modal
             */
            $scope.showMapModalByTourId = function (tourDetailId) {
                let modelMap = $('#modelMap');
                modelMap.modal('show');

                TourDetailCusService.findByTourDetailId(tourDetailId).then(function (response) {
                    if (response.status === 200) {
                        modelMap.on('shown.bs.modal', function () {
                            let tourDetailById = response.data.data;
                            $scope.initMap();
                            $scope.addMarkersTour(tourDetailById)
                        });
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            };

            /**
             * Phương thức hiển ẩn modal
             */
            $scope.hideModel = function () {
                $scope.removeMarkersTour();
                $('#modelMap').modal('hide');
            }
        }

        /**
         * Hàm xử lý sự kiện khi nhấn nút hiển thị thêm loại tour
         */
        $scope.showMoreItemsTourType = function () {
            $scope.limitTourType = $scope.tourType.length;
            $scope.showMoreTourType = true;
        };

        /**
         * Hàm xử lý sự kiện khi nhấn nút ẩn bớt loại tour
         */
        $scope.showLessItemsTourType = function () {
            $scope.limitTourType = 5;
            $scope.showMoreTourType = false;
        };

        //thêm danh sách lọc
        $scope.ChooseFromAVarietyOfTours = (id) => {
            let index = $scope.filters.tourTypeList.indexOf(id);
            if (index === -1) {
                $scope.filters.tourTypeList.push(id);
            } else {
                $scope.filters.tourTypeList.splice(index, 1);
            }
        };

        $scope.filterAllTour = () => {
            $scope.isLoading = true;
            $scope.proposedResults = false;

            $scope.filters.cleanArrives = [];
            $scope.filters.cleanFrom = [];

            if ($scope.filters.departureArrives !== null) {
                $scope.filters.cleanArrives = removeStopwords($scope.filters.departureArrives.split(" "));
            }

            if ($scope.filters.departureFrom !== null) {
                $scope.filters.cleanFrom = removeStopwords($scope.filters.departureFrom.split(" "));
            }

            TourCusService.findAllTourDetailCustomerByFilters($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.filters)
                .then((response) => {
                    if (response.status === 200) {
                        $scope.tourDetail = response.data.data !== null ? response.data.data.content : [];
                        $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
                        $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;

                        getAListOfPopularTours(response);

                        angular.forEach($scope.tourDetail, function (detail) {
                            let departureDate = new Date(detail.departureDate);
                            let arrivalDate = new Date(detail.arrivalDate);

                            detail.numberOfDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));
                        });
                    } else {
                        $location.path('/admin/page-not-found')
                    }
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

//sắp xếp
        $scope.sortData = (column, sortDir) => {
            $scope.hasResults = false;
            if (!sortDir) {
                $scope.sortBy = "id";
                $scope.sortDir = "asc";
            } else {
                $scope.sortBy = column;
                $scope.sortDir = sortDir;
            }

            $scope.filterAllTour();
        };

        /**
         * Phân trang
         */
        $scope.setPage = function (page) {
            $scope.hasResults = false;
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

        $scope.init();

        function createPopupContent(tourDetail) {
            let tourDetailId = Base64ObjectService.encodeObject(tourDetail.id);
            let formattedDate = $filter('formatDate')(tourDetail.departureDate);
            return `    <div class="m-1 mb-30 row">
                        <div class="img-holder col-xl-3 col-lg-4 p-0">
                            <img src="${tourDetail.toursByTourId.tourImg}" class="rounded-3" style="height: 130px"
                                 onerror="this.src='/assets/admin/assets/img/bg/default-image-hotel.png'"/>
                        </div>
                        <div class=" col-xl-9 col-lg-8">
                            <div class="meta row">
                                <div class="col-lg-8">
                                    <div>
                                        <span>
                                            <i class="fa-solid fa-street-view"></i>
                                            <a class="fw-medium">
                                                ${tourDetail.tourTypes.tourTypeName}
                                            </a>
                                        </span>
                                        <h3 class="fw-medium">
                                            <a href="#">${tourDetail.toursByTourId.tourName}</a>
                                        </h3>
                                        <div class="d-flex align-items-center mb-3"
                                             style="border-bottom: 1px solid rgba(29, 35, 31, 0.1);">
                                            <div class="location text-orange" style="font-size: 14px">
                                                <p>
                                                    <span class="fas fa-map-marker-alt"></span>
                                                    ${tourDetail.fromLocation}
                                                    -
                                                    ${tourDetail.toLocation}
                                                </p>
                                                <p>
                                                    <i class="fa-solid fa-user-tie"></i>
                                                    Đã đặt: ${tourDetail.bookedSeat}/${tourDetail.numberOfGuests} chổ
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="roomTypeByHotel mb-3"
                                         style="padding-left: 10px ;border-left: 1px solid rgba(29, 35, 31, 0.1)">
                                        <div style="font-size: 14px; line-height: 20px">
                                            <p class="fs-7 mb-1">Điểm đi:
                                                <span class="fw-medium">${tourDetail.fromLocation}</span>
                                            </p>
                                            <p class="fs-7 mb-1">Điểm đến:
                                                <span class="fw-medium">${tourDetail.toLocation}</span>
                                            </p>
                                            <p class="fs-7 mb-1">Ngày đi:
                                                <span class="fw-medium">${formattedDate}</span>
                                            </p>
                                            <div class="text-green">
                                                <i class="fa-solid fa-check"></i> Xe có WIFI miễn phí
                                            </div>
                                            <div class="text-green">
                                                <i class="fa-solid fa-check"></i> Miễn phí nước suối
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="infoHotel h-100 w-100 position-relative row">
                                        <div class="rating col-xl-12 col-lg-12 col-sm-6 col-6">
                                            <div class="float-end" style="font-size: 14px; line-height: 20px">
                                                <div class="d-flex align-items-center">
                                                    <div class="rating-content float-end m-2">
                                                        <p>Rất tốt</p>
                                                        <p>133 Đánh giá</p>
                                                    </div>
                                                    <div class="rating-content float-end">
                                                        <div class="btn-green text-center"
                                                             style="width: 50px; height: 50px; line-height: 50px; border-radius: 8px">
                                                            <span class="fw-medium fs-5">4.9</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="price position-absolute bottom-0 end-0 mb-3 me-3 col-xl-12 col-lg-12 col-sm-6 col-6">
                                            <div class="box">
                                                <div class="fw-bold text-end" style="font-size: 20px">
                                                    ${$scope.formatPrice(tourDetail.unitPrice)} ₫
                                                </div>
                                                <a href="/tours/tour-detail/${tourDetailId}" class="mt-3">
                                                    <button class="btn btn-green w-100" data-bs-dismiss="modal">
                                                        Xem chi tiết
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }

        $scope.showCallTourModal = function () {
            ToursServiceAD.findAllToursSelect().then(function (response) {
                $scope.tourBasicList = response.data.data;
            }, errorCallback);
            $('#formTourModal').modal('show');
        };
        $scope.closeFormModal = function () {
            $('#formTourModal').modal('hide');
        };

        $scope.$on("$destroy", function () {
            LocalStorageService.remove('filtersTour');
        });
    });