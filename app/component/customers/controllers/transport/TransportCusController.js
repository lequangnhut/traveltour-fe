travel_app.controller('TransportCusController',
    function ($scope, $filter, $location, MapBoxService, TransportCusService, LocalStorageService,
              TransportationBrandServiceAD, TransportationTypeServiceAD, Base64ObjectService) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

        $scope.currentPage = 0;
        $scope.pageSize = 10;

        $scope.transportationSearch = {}

        $scope.showMoreTransportationBrand = false;
        $scope.limitTransportationBrand = 5;

        $scope.showMoreTransportationType = false;
        $scope.limitTransportationType = 5;

        $scope.limitTransportType = 5;

        $scope.markerAllTransport = [];
        $scope.markerTransport = [];

        $scope.ratings = [{id: 1, label: 'Trên 1 sao'}, {id: 2, label: 'Trên 2 sao'}, {id: 3, label: 'Trên 3 sao'}, {
            id: 4, label: 'Trên 4 sao'
        }, {id: 5, label: 'Trên 5 sao'}];

        $scope.filters = {
            searchTerm: null,
            fromLocation: null,
            toLocation: null,
            checkInDateFiller: new Date(),
            price: 15000000,
            mediaTypeList: [],
            listOfVehicleManufacturers: [],
        };

        const dataList = (response) => {
            $scope.transportBrand = response !== null ? response.content : [];
            $scope.totalPages = response !== null ? Math.ceil(response.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response !== null ? response.totalElements : 0;
        };

        const fetchData = (serviceFunc, successCallback) => {
            return serviceFunc().then((response) => {
                if (response.status === 200) {
                    successCallback(response.data.data);
                } else {
                    $location.path('/admin/page-not-found');
                }
            });
        }

        $scope.init = function () {
            $scope.isLoading = true;

            Promise.all([fetchData(TransportCusService.findAllTransportBrandCus.bind(null, $scope.currentPage, $scope.pageSize), (repo) => {
                dataList(repo);
            }), fetchData(TransportationBrandServiceAD.getAllTransportationBrands, (repo) => {
                $scope.transportationBrandList = repo;
            }), fetchData(TransportationTypeServiceAD.getAllTransportationTypes, (repo) => {
                $scope.transportationTypeList = repo;
            }), fetchData(TransportCusService.getAllTransportCusDataList, (repo) => {
                if (repo === null) return;
                $scope.transportationDataList = repo.uniqueDataList;
                $scope.filteredDataList = $scope.transportationDataList.slice(0, 5);
                $scope.$watch('filters.searchTerm', function (newVal) {
                    if (newVal && newVal.trim() !== '') {
                        $scope.filteredDataList = $filter('filter')($scope.transportationDataList, newVal).slice(0, 5);
                    } else {
                        $scope.filteredDataList = $scope.transportationDataList.slice(0, 5);
                    }
                });
                $scope.fromLocationList = repo.fromLocationList;
                $scope.toLocationList = repo.toLocationList;
            })
            ]).finally(function () {
                $scope.$apply(function () {
                    $scope.isLoading = false;
                });
            });

            /**
             * Phương thức mở model
             */
            $scope.openModalAllTransport = function () {
                let modelMap = $('#modalMapAllTransport').modal('show');

                TransportCusService.findAllTransportBrandCus($scope.currentPage, $scope.pageSize).then(function (response) {
                    if (response.status === 200) {
                        modelMap.on('shown.bs.modal', function () {
                            let transportBrand = response.data.data.content;
                            $scope.initMapAllTransport();
                            $scope.addMarkerAllTransport(transportBrand);
                        });
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
            }

            $scope.openModalTransport = function (transportBrandId) {
                let modelMap = $('#modalMapTransport').modal('show');

                TransportCusService.findAllTransportBrandByIdCus(transportBrandId).then(function (response) {
                    if (response.status === 200) {
                        modelMap.on('shown.bs.modal', function () {
                            let transportBrand = response.data.data;
                            $scope.initMapTransport();
                            $scope.addMarkerTransport(transportBrand);
                        });
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });

                modelMap.on('shown.bs.modal', function () {
                    $scope.initMapTransport();
                });
            }

            /**
             * Khởi tạo map
             */
            $scope.initMapAllTransport = function () {
                $scope.mapAllTransport = new mapboxgl.Map({
                    container: 'mapAllTransport',
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231],
                    zoom: 9
                });
            }

            $scope.initMapTransport = function () {
                $scope.mapTransport = new mapboxgl.Map({
                    container: 'mapTransport',
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231],
                    zoom: 9
                });
            }

            /**
             * Phương thức thêm marker lên bản đồ
             * @param transportBrand
             */
            $scope.addMarkerAllTransport = function (transportBrand) {
                $scope.removeMarkerAllTransport();

                var bounds = new mapboxgl.LngLatBounds();

                for (const brand of transportBrand) {
                    let address = brand.transportationBrandAddress;

                    let iconUrl = '/assets/customers/images/icon/maker.png';
                    let el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundImage = `url(${iconUrl})`;
                    el.style.width = '40px';
                    el.style.height = '40px';
                    el.style.backgroundSize = '100%';

                    let popupContent = createPopupContent(brand);

                    MapBoxService.geocodeAddress(address, function (error, addressCoordinates) {
                        if (!error) {
                            let popup = new mapboxgl.Popup({
                                offset: 15,
                                closeButton: true,
                                closeOnClick: false,
                                closeOnClickOutside: true,
                                maxWidth: '800px',
                                minWidth: '600px'
                            }).setHTML(popupContent);

                            var marker = new mapboxgl.Marker(el)
                                .setLngLat(addressCoordinates)
                                .setPopup(popup)
                                .addTo($scope.mapAllTransport);

                            let closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
                            if (closeButton) {
                                closeButton.style.fontSize = '30px';
                                closeButton.style.width = '40px';
                                closeButton.style.height = '40px';
                                closeButton.style.lineHeight = '40px';
                            }

                            $scope.markerAllTransport.push(marker);

                            bounds.extend(addressCoordinates);
                            $scope.mapAllTransport.fitBounds(bounds, {padding: 20});
                        } else {
                            console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                        }
                    });
                }
            };

            $scope.addMarkerTransport = function (transportBrand) {
                var bounds = new mapboxgl.LngLatBounds();
                let address = transportBrand.transportationBrandAddress;

                let iconUrl = '/assets/customers/images/icon/maker.png';
                let el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = `url(${iconUrl})`;
                el.style.width = '40px';
                el.style.height = '40px';
                el.style.backgroundSize = '100%';

                let popupContent = createPopupContent(transportBrand);

                let popup = new mapboxgl.Popup({
                    offset: 15,
                    closeButton: true,
                    closeOnClick: false,
                    closeOnClickOutside: true,
                    maxWidth: '800px',
                    minWidth: '600px'
                }).setHTML(popupContent);

                MapBoxService.geocodeAddress(address, function (error, toCoordinates) {
                    if (!error) {
                        $scope.removeMarkerTransport();

                        let marker = new mapboxgl.Marker(el)
                            .setLngLat(toCoordinates)
                            .setPopup(popup)
                            .addTo($scope.mapTransport);

                        let closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
                        if (closeButton) {
                            closeButton.style.fontSize = '30px';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.lineHeight = '40px';
                        }

                        $scope.markerTransport.push(marker);

                        bounds.extend(toCoordinates);
                        $scope.mapTransport.fitBounds(bounds, {padding: 20});
                    } else {
                        console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                    }
                });
            };

            /**
             * Phương thức xóa marker trên bản đồ
             */
            $scope.removeMarkerAllTransport = function () {
                if ($scope.markerAllTransport.length > 0) {
                    $scope.markerAllTransport.forEach(function (marker) {
                        marker.remove();
                    });
                    $scope.markerAllTransport = [];
                }
            };

            $scope.removeMarkerTransport = function () {
                if ($scope.markerTransport.length > 0) {
                    $scope.markerTransport.forEach(function (marker) {
                        marker.remove();
                    });
                    $scope.markerTransport = [];
                }
            };
        }

        //show tiện ích
        $scope.showMoreItemsTransportationBrand = () => {
            $scope.limitTransportationBrand = $scope.transportationBrandList.length;
            $scope.showMoreTransportationBrand = true;
        };

        $scope.showLessItemsTransportationBrand = () => {
            $scope.limitTransportationBrand = 5;
            $scope.showMoreTransportationBrand = false;
        };

        $scope.showMoreItemsTransportationType = () => {
            $scope.limitTransportationType = $scope.transportationTypeList.length;
            $scope.showMoreTransportationType = true;
        };

        $scope.showLessItemsTransportationType = () => {
            $scope.limitTransportationType = 5;
            $scope.showMoreTransportationType = false;
        };

        //thêm danh sách lọc
        $scope.ChooseFromAVarietyOfVehicles = (id) => {
            let index = $scope.filters.mediaTypeList.indexOf(id);
            if (index === -1) {
                $scope.filters.mediaTypeList.push(id);
            } else {
                $scope.filters.mediaTypeList.splice(index, 1);
            }
        };

        $scope.ChooseFromManyCarBrands = (id) => {
            let index = $scope.filters.listOfVehicleManufacturers.indexOf(id);
            if (index === -1) {
                $scope.filters.listOfVehicleManufacturers.push(id);
            } else {
                $scope.filters.listOfVehicleManufacturers.splice(index, 1);
            }
        };

        $scope.filterAllTransportCus = () => {
            $scope.isLoading = true;

            LocalStorageService.encryptLocalData($scope.filters, 'filtersTransportation', 'encryptFiltersTransportation');

            fetchData(TransportCusService.findAllTransportCustomerByFilters.bind(null, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.filters), (response) => {
                dataList(response);
                if (response === null) {
                    toastAlert('warning', 'Không tìm thấy dữ liệu !');
                }
            }).finally(function () {
                $scope.isLoading = false;
            })

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

        $scope.init();

        function createPopupContent(brand) {
            let transportBrandId = Base64ObjectService.encodeObject(brand.id);
            return `
                        <div class="m-1 row">
                            <div class="img-holder col-xl-3 col-lg-4 p-0">
                                <img src="${brand.transportationBrandImg}" style="height: 120px" class="rounded-3"
                                     onerror="this.src='/assets/admin/assets/img/bg/default-image-hotel.png'"/>
                            </div>
                            <div class="col-xl-9 col-lg-8">
                                <div class="meta row">
                                    <div class="col-lg-8 container-transport">
                                        <div>
                                        <span>
                                            <i class="fa-solid fa-bus"></i>
                                            <a class="fw-medium">
                                                ${brand.agenciesByAgenciesId.nameAgency}
                                            </a>
                                        </span>
                                            <h3 class="fw-medium">
                                                <a href="#">${brand.transportationBrandName}</a>
                                            </h3>
                                            <div class="d-flex align-items-center mb-3"
                                                 style="border-bottom: 1px solid rgba(29, 35, 31, 0.1);">
                                                <div class="location text-orange" style="font-size: 14px">
                                                    <p>
                                                        <i class="fa-solid fa-earth-americas"></i>
                                                        Website: ${brand.agenciesByAgenciesId.urlWebsite}
                                                    </p>
                                                    <p>
                                                        <i class="fa-solid fa-phone"></i>
                                                        Số điện thoại: ${brand.agenciesByAgenciesId.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="roomTypeByHotel mb-3"
                                             style="padding-left: 10px ;border-left: 1px solid rgba(29, 35, 31, 0.1)">
                                            <div style="font-size: 14px; line-height: 20px">
                                                <p class="mb-3">
                                                    <span class="fas fa-map-marker-alt text-green"></span>
                                                    ${brand.transportationBrandAddress}
                                                </p>
                                                <div class="text-green">
                                                    <i class="fa-solid fa-check"></i> Xe có WIFI miễn phí
                                                </div>
                                                <div class="text-green">
                                                    <i class="fa-solid fa-check"></i> Không cần thanh toán trước
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
                                                    <a href="/drive-move/drive-transport-detail/${transportBrandId}" class="mt-3">
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
                        </div>
        `;
        }

        $(document).on('click', '.redirectTransportDetail', function () {
            $('#modalMapTransport').modal('hide');
            $('#modalMapAllTransport').modal('hide');
        });
    });