travel_app.controller('LocationCusController', function ($scope, $filter, $location, MapBoxService, LocationCusService) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.showMoreLocationType = false;
    $scope.limitLocationType = 3;

    $scope.markers = [];
    $scope.TickerTypeList = [];
    $scope.LocationTypeList = [];

    $scope.tickets = [
        {id: 1, label: 'Vé người lớn'},
        {id: 2, label: 'Vé trẻ em'},
        {id: 3, label: 'Miễn phí vé'}
    ]

    $scope.ratings = [
        {id: 1, label: 'Trên 1 sao'},
        {id: 2, label: 'Trên 2 sao'},
        {id: 3, label: 'Trên 3 sao'},
        {id: 4, label: 'Trên 4 sao'},
        {id: 5, label: 'Trên 5 sao'}
    ];

    $scope.filters = {
        searchTerm: null,
        price: 15000000,
        TickerTypeList: [],
        LocationTypeList: [],
    };

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.redirectVisitLocationDetail = function (visitLocationId) {
        $location.path('/tourism-location/tourism-location-detail/' + btoa(JSON.stringify(visitLocationId)));
    }

    $scope.init = function () {
        $scope.isLoading = true;

        LocationCusService.findAllLocationCus($scope.currentPage, $scope.pageSize).then(function (response) {
            if (response.status === 200) {
                $scope.visitLocation = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        LocationCusService.findAllLocationTypeCus().then(function (response) {
            if (response.status === 200) {
                $scope.visitLocationType = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

        LocationCusService.getDataList().then(function (response) {
            if (response.status === 200) {
                $scope.visitLocationDataList = response.data.data.uniqueDataList;
                $scope.filteredDataList = $scope.visitLocationDataList.slice(0, 5);

                $scope.$watch('filters.searchTerm', function (newVal) {
                    if (!newVal || !newVal.trim()) {
                        $scope.filteredDataList = $scope.visitLocationDataList.slice(0, 5);
                    } else {
                        $scope.filteredDataList = $filter('filter')($scope.visitLocationDataList, newVal.trim()).slice(0, 5);
                    }
                });
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

        /**
         * Phương thức mở model
         */
        $scope.openModelMapLocation = function () {
            let modelMap = $('#modalMapLocation').modal('show')

            LocationCusService.findAllLocationCus($scope.currentPage, $scope.pageSize).then(function (response) {
                if (response.status === 200) {
                    modelMap.on('shown.bs.modal', function () {
                        let visitLocation = response.data.data.content;
                        $scope.initMap();
                        $scope.addMarkerLocation(visitLocation);
                    });
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        /**
         * Khởi tạo map
         */
        $scope.initMap = function () {
            $scope.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [106.6297, 10.8231],
                zoom: 9
            });
        }

        /**
         * Phương thức thêm marker lên bản đồ
         * @param visitLocation
         */
        $scope.addMarkerLocation = function (visitLocation) {
            $scope.removeMarkerLocation()
            let bounds = new mapboxgl.LngLatBounds();

            for (const location of visitLocation) {
                let address = location.address + ', ' + location.ward + ', ' + location.district + ', ' + location.province;
                console.log(address)

                let iconUrl = '/assets/customers/images/icon/maker.png';
                let el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = `url(${iconUrl})`;
                el.style.width = '40px';
                el.style.height = '40px';
                el.style.backgroundSize = '100%';

                let popupContent = createPopupContent(location);

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
                            .addTo($scope.map);

                        let closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
                        if (closeButton) {
                            closeButton.style.fontSize = '30px';
                            closeButton.style.width = '40px';
                            closeButton.style.height = '40px';
                            closeButton.style.lineHeight = '40px';
                        }

                        $scope.markers.push(marker);

                        bounds.extend(addressCoordinates);
                        $scope.map.fitBounds(bounds, {padding: 20});
                    } else {
                        console.error("Lỗi khi lấy tọa độ của điểm đến:", error);
                    }
                });
            }
        };

        /**
         * Phương thức xóa marker trên bản đồ
         */
        $scope.removeMarkerLocation = function () {
            if ($scope.markers.length > 0) {
                $scope.markers.forEach(function (marker) {
                    marker.remove();
                });
                $scope.markers = [];
            }
        };
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

    $scope.showMoreTypesOfLocations = () => {
        $scope.limitLocationType = $scope.visitLocationType.length;
        $scope.showMoreLocationType = true;
    };

    $scope.showLessTypesOfLocations = () => {
        $scope.limitLocationType = 3;
        $scope.showMoreLocationType = false;
    };

    //thêm danh sách lọc
    $scope.chooseFromAVarietyOfTickets = (id) => {
        let index = $scope.filters.TickerTypeList.indexOf(id);
        if (index === -1) {
            $scope.filters.TickerTypeList.push(id);
        } else {
            $scope.filters.TickerTypeList.splice(index, 1);
        }
    };

    $scope.chooseFromAVarietyOfLocations = (id) => {
        let index = $scope.filters.LocationTypeList.indexOf(id);
        if (index === -1) {
            $scope.filters.LocationTypeList.push(id);
        } else {
            $scope.filters.LocationTypeList.splice(index, 1);
        }
    };

    $scope.filterAllVisitCus = () => {
        $scope.isLoading = true;
        LocationCusService.findAllVisitCustomerByFilters($scope.currentPage, $scope.pageSize, $scope.filters).then((response) => {
            $scope.visitLocation = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
        }).finally(function () {
            $scope.isLoading = false;
        })

    }

    $scope.init();

    function createPopupContent(location) {
        return `
                    <div class="single-blog-post-four" style="background: #F8F8F8">
                        <div class="post-thumbnail">
                            <img src="${location.visitLocationImage}" style="height: 300px" alt="Post Image">
                        </div>
                        <div class="entry-content">
                            <h6 class="post-meta">
                                <span>${location.agenciesByAgenciesId.nameAgency}</span>
                            </h6>
                            <h3 class="title">
                                <a id="redirectLocationDetail" href="/tourism-location/tourism-location-detail/${location.id}">
                                    ${location.visitLocationName}
                                </a>
                            </h3>
                            <a id="redirectLocationDetail" href="/tourism-location/tourism-location-detail/${location.id}"
                               class="main-btn filled-btn detail-link"
                            >
                                Xem chi tiết
                                <svg class="svg-inline--fa fa-paper-plane" aria-hidden="true" focusable="false"
                                         data-prefix="fas" data-icon="paper-plane" role="img"
                                         xmlns="http://www.w3.org/2000/svg" viewBox="-50 -23 680 520" data-fa-i2svg=""
                                         style="width: 25px;margin-top: 2px;margin-bottom: 2px;margin-right: 2px;">
                                        <path fill="currentColor"
                                              d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path>
                                    </svg>
                            </a>
                        </div>
                    </div>
        `;
    }

    $(document).on('click', '#redirectLocationDetail', function () {
        $('#modalMapLocation').modal('hide');
    });


});