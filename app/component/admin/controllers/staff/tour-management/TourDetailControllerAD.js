travel_app.controller('TourDetailControllerAD',
    function ($scope, $sce, $q, $location, $routeParams, $timeout, $http, MapBoxService, TourDetailsServiceAD,
              ToursServiceAD, AccountServiceAD, Base64ObjectService, LocalStorageService) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

        $scope.isLoading = true;
        $scope.showFormTourAgent = false;

        $scope.currentTab = LocalStorageService.get('currentTabTourDetail') || 'waiting';

        $scope.tourDetail = {
            tourDetailId: null,
            guideId: null,
            departureDate: null,
            arrivalDate: null,
            numberOfGuests: null,
            minimumNumberOfGuests: null,
            unitPrice: null,
            tourDetailNotes: null,
            tourDetailStatus: null,
            dateCreated: null,
            tourDetailDescription: null,
            fromLocation: null,
            toLocation: null,
            tourDetailImage: null
        };

        let searchTimeout;

        $scope.tourDetailList = []; // Biến để lưu danh sách tours
        $scope.currentPage = 0; // Trang hiện tại
        $scope.pageSize = 5; // Số lượng tours trên mỗi trang

        let tourDetailId = Base64ObjectService.decodeObject($routeParams.id);

        $scope.dataProvince = [];
        $scope.provinceBreak = [];
        $scope.tourTypeList = [];

        $scope.toLocationArray = [];
        $scope.searchLocation = null;

        $scope.invalidPriceFormat = false;

        $scope.provinceDestination = [{type: 'select', hasData: false}];

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        $scope.setTouched = () => {
            $scope.activityInDayTouched = true;
        };

        $scope.isActive = () => {
            return $scope.activityInDayTouched &&
                ($scope.tourDetail.tourDetailDescription === null ||
                    $scope.tourDetail.tourDetailDescription === undefined ||
                    $scope.tourDetail.tourDetailDescription === '');
        };

        $scope.changeTab = (tab, status, sortDate) => {
            $scope.currentTab = tab;
            $scope.tourDetailStatus = status;
            $scope.sortDate = sortDate;
            $scope.currentPage = 0;
            $scope.pageSize = 5;
            $scope.init();
            LocalStorageService.set('currentTabTourDetail', tab);
        };

        if ($scope.currentTab === 'waiting') {
            $scope.changeTab('waiting', 1, 'dateCreated')
        } else if ($scope.currentTab === 'active') {
            $scope.changeTab('active', 2, 'departureDate')
        } else if ($scope.currentTab === 'success') {
            $scope.changeTab('success', 3, 'arrivalDate')
        } else if ($scope.currentTab === 'cancelled') {
            $scope.changeTab('cancelled', 4, 'dateDeleted')
        }

        $scope.init = function () {
            $scope.isLoading = true;

            /**
             * Tìm tất cả tour theo trạng thái tourDetailStatus
             */
            TourDetailsServiceAD.findAllTourDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.sortDate, $scope.tourDetailStatus)
                .then((response) => {
                    tourDetailData(response);
                }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });

            const tourDetailData = (response) => {
                $scope.tourDetailList = response.data.data !== null ? response.data.data.content : [];
                $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
                $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
            };

            /**
             * Tìm kiếm
             */
            $scope.searchTourDetail = () => {
                if (searchTimeout) $timeout.cancel(searchTimeout);
                $scope.setPage(0);

                searchTimeout = $timeout(() => {
                    TourDetailsServiceAD.findAllTourDetails($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.sortDate, $scope.tourDetailStatus, $scope.searchTerm)
                        .then((response) => {
                            tourDetailData(response);
                        }, errorCallback);
                }, 500); // 500ms debounce
            };

            /**
             * Tìm dữ liệu fill vào form để cập nhật
             */
            if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
                TourDetailsServiceAD.findTourDetailById(tourDetailId).then(response => {
                    if (response.status === 200) {
                        $timeout(() => {
                            $scope.tourDetail = response.data.data;
                            $scope.tourDetail.departureDate = new Date(response.data.data.departureDate);
                            $scope.tourDetail.arrivalDate = new Date(response.data.data.arrivalDate);
                        }, 0);
                    }
                }, errorCallback);
            }

            $scope.openModalCanceledTour = function () {
                $scope.tourDetail.tourDetailNotes = null;
                $('#modal-tour-detail').modal('hide');
                $('#cancelled_tour_noted').modal('show');
            }

            $scope.hideModalCanceledTour = function () {
                $('#modal-tour-detail').modal('show');
                $('#cancelled_tour_noted').modal('hide');
            }

            /**
             * Phương thức mở modal xem chi tiết tour detail
             */
            $scope.openModal = (tourDetailId) => {
                $('#modal-tour-detail').modal('show');
                $scope.provinceDestination = [{type: 'select', hasData: false}];
                $scope.provinceBreak = [];

                if (!tourDetailId) return;

                TourDetailsServiceAD.findTourDestinationByTourDetailById(tourDetailId).then(response => {
                    if (response.status === 200) {
                        $timeout(() => {
                            $scope.tourDestination = response.data.data;

                            if ($scope.tourDestination != null) {
                                $scope.tourDestination.forEach((destination) => {
                                    let existingCity = $scope.provinces.find((city) => {
                                        return city.Name === destination.province;
                                    });

                                    $scope.provinceBreak.push({id: existingCity.Id, Name: existingCity.Name});
                                });
                            } else {
                                $scope.provinceBreak.push({Name: "Chưa có điểm dừng chân"});
                            }
                        }, 0);
                    }
                }, errorCallback);

                TourDetailsServiceAD.findTourDetailById(tourDetailId)
                    .then(response => {
                        if (response.status === 200) {
                            $timeout(() => {
                                $scope.tourDetail = response.data.data;
                                $scope.tourDetailImage = response.data.data.tourDetailImagesById;
                                $scope.tourDetail.departureDate = new Date(response.data.data.departureDate);
                                $scope.tourDetail.arrivalDate = new Date(response.data.data.arrivalDate);

                                let fromLocation = $scope.tourDetail.fromLocation;
                                let toLocation = $scope.tourDetail.toLocation;

                                MapBoxService.geocodeAddressGetKilometer(fromLocation)
                                    .then((fromCoords) => {
                                        return MapBoxService.geocodeAddressGetKilometer(toLocation).then((toCoords) => {
                                            const distance = $scope.calculateDistance(fromCoords, toCoords);
                                            document.getElementById("expectedKm").innerText = distance + ' Km (Kilometer)';
                                        });
                                    })
                                    .catch((error) => {
                                        console.error("Lỗi khi tính toán khoảng cách:", error);
                                    });

                                if ($scope.tourDetail.tourDetailStatus === 1) {
                                    $scope.getProvinceBelow10KmAlongRoute(fromLocation, toLocation);
                                }
                            }, 0);
                        }
                    })
                    .catch(errorCallback);
            }

            const getProvincesFromAPI = () => {
                return $http.get('/lib/address/data.json')
                    .then((response) => {
                        return response.data;
                    })
                    .catch((error) => {
                        console.error("Lỗi khi lấy danh sách tỉnh thành từ API:", error);
                        return [];
                    });
            }

            $scope.getProvinceBelow10KmAlongRoute = (fromLocation, toLocation) => {
                $scope.isLoading = true;

                let provincesWithin10Km = [];
                let uniqueProvinces = [];
                let idCounter = 1;

                MapBoxService.geocodeAddressGetKilometer(fromLocation)
                    .then((fromCoords) => {
                        MapBoxService.geocodeAddressGetKilometer(toLocation)
                            .then((toCoords) => {
                                MapBoxService.getRoutePoints(fromCoords, toCoords)
                                    .then((routePoints) => {
                                        routePoints.forEach((point) => {
                                            getProvincesWithin10Km(point)
                                                .then((provinces) => {
                                                    provincesWithin10Km = provincesWithin10Km.concat(provinces);

                                                    provinces.forEach((province) => {
                                                        if (!uniqueProvinces.includes(province)) {
                                                            uniqueProvinces.push(province);
                                                        }
                                                    });

                                                    provinces.forEach((province) => {
                                                        if (!uniqueProvinces.find((item) => {
                                                            return item.Name === province
                                                        })) {
                                                            uniqueProvinces.push({id: idCounter++, Name: province});
                                                        }
                                                    });

                                                    $scope.filteredProvinces = uniqueProvinces.filter((item) => {
                                                        return typeof item === 'object' && item.hasOwnProperty('id') && item.hasOwnProperty('Name') &&
                                                            item.Name !== fromLocation && item.Name !== toLocation;
                                                    });
                                                })
                                                .catch((error) => {
                                                    console.error("Lỗi khi kiểm tra tỉnh thành:", error);
                                                });
                                        });

                                        provincesWithin10Km = provincesWithin10Km.filter((province, index, self) => {
                                            return index === self.findIndex((p) => {
                                                return p.id === province.id;
                                            });
                                        });
                                    })
                                    .catch((error) => {
                                        console.error("Lỗi khi lấy điểm trên lộ trình:", error);
                                    });
                            })
                            .catch((error) => {
                                console.error("Lỗi khi lấy tọa độ điểm đến:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Lỗi khi lấy tọa độ điểm đi:", error);
                    });
            }

            const getProvincesWithin10Km = (point) => {
                return $q((resolve, reject) => {
                    if (!point || typeof point.lat === 'undefined' || typeof point.lng === 'undefined') {
                        reject(new Error("Điểm không hợp lệ"));
                        return;
                    }

                    getProvincesFromAPI()
                        .then((provinces) => {
                            let promises = provinces.map((province) => {
                                return MapBoxService.geocodeAddressGetKilometer(province.Name)
                                    .then((fromCoords) => {
                                        const distanceToProvince = $scope.calculateDistance(point, fromCoords);
                                        if (distanceToProvince <= 10) {
                                            return province.Name;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Lỗi tên tỉnh thành:", error);
                                        return null;
                                    });
                            });

                            $q.all(promises)
                                .then((provinceNames) => {
                                    provinceNames = provinceNames.filter((name) => {
                                        return name !== null;
                                    });
                                    resolve(provinceNames);
                                })
                                .catch((error) => {
                                    reject(error);
                                })
                                .then(() => {
                                    $scope.isLoading = false;
                                });
                        })
                        .catch((error) => {
                            reject(error);
                            $scope.isLoading = false;
                        });
                });
            }

            $scope.calculateDistance = (coords1, coords2) => {
                const R = 6371;
                const lat1 = coords1.lat * Math.PI / 180;
                const lat2 = coords2.lat * Math.PI / 180;
                const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
                const dLng = (coords2.lng - coords1.lng) * Math.PI / 180;

                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const distance = R * c;
                return Math.round(distance);
            }

            /**
             * Thêm địa chỉ tham quan vào trong lịch trình của tour
             * @param index
             */
            $scope.plusIconSVG = $sce.trustAsHtml('<svg class="svg-inline--fa fa-plus" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"></path></svg>');
            $scope.minusIconSVG = $sce.trustAsHtml('<svg class="svg-inline--fa fa-minus" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"></path></svg>');

            $scope.addOrRemoveSelectItem = (index) => {
                let selectedCount = $scope.provinceDestination.filter((item) => {
                    return item.hasData;
                }).length;

                if (selectedCount >= 3) {
                    return;
                }

                $scope.provinceDestination[index].hasData = !$scope.provinceDestination[index].hasData;
                if ($scope.provinceDestination[index].hasData) {
                    $scope.provinceDestination.splice(index + 1, 0, {type: 'select', hasData: false});
                } else {
                    $scope.provinceDestination.splice(index, 1);
                }
            };

            $scope.getProvinceDestination = () => {
                let selectedValues = [];

                $scope.provinceDestination.forEach((item) => {
                    if (item.type === 'select' && item.value) {
                        selectedValues.push(item.value);
                    }
                });

                $scope.dataProvince = selectedValues;
            };

            /**
             * Upload hình ảnh và lưu vào biến transportTypeImg
             * @param file
             */
            $scope.uploadTourDetailImg = (file) => {
                if (file && !file.$error) {
                    $scope.tourDetail.tourDetailImage = file;
                }
            };

            /**
             * Hàm kiểm tra sự trùng lặp giữa điểm đi và điểm đến
             * @returns {boolean}
             */
            const hasDuplicateSelection = () => {
                return $scope.tourDetail.fromLocation === $scope.tourDetail.toLocation;
            }

            /**
             * Hàm kiểm tra sự trùng lặp giữa điểm đi và điểm đến
             */
            $scope.updateToLocation = () => {
                if (hasDuplicateSelection()) {
                    $scope.tourDetail.toLocation = null;
                    $scope.toLocationError = true;
                } else {
                    $scope.toLocationError = false;
                }

                $scope.filteredProvinces = $scope.provinces.filter((city) => {
                    return city.Name !== $scope.tourDetail.fromLocation;
                });
            };

            /**
             * Hàm kiểm tra ngày đi ngày về có hợp lệ không
             * @returns {boolean}
             */
            $scope.isStartDateValid = () => {
                if ($scope.tourDetail.departureDate && $scope.tourDetail.arrivalDate) {
                    return new Date($scope.tourDetail.departureDate) <= new Date($scope.tourDetail.arrivalDate);
                }
                return true; // Mặc định là hợp lệ nếu một trong hai ngày không được chọn
            };

            $scope.isEndDateValid = () => {
                if ($scope.tourDetail.arrivalDate && $scope.tourDetail.departureDate) {
                    return new Date($scope.tourDetail.arrivalDate) >= new Date($scope.tourDetail.departureDate);
                }
                return true; // Mặc định là hợp lệ nếu một trong hai ngày không được chọn
            };


            $scope.isNumberOfGuestsValid = () => {
                return $scope.tourDetail.numberOfGuests >= 16 && $scope.tourDetail.numberOfGuests <= 50; // Số lượng khách phải lớn hơn 0
            };

            $scope.MinimumNumberOfGuestsValid = () => {
                return $scope.tourDetail.minimumNumberOfGuests >= 1 && $scope.tourDetail.minimumNumberOfGuests <= 16;
            };

            const isPriceValid = (price) => {
                return price > 0;
            }

            $scope.isPriceValid = () => {
                return isPriceValid($scope.tourDetail.unitPrice);
            }

            $scope.onPriceKeyPress = (event) => {
                let inputValue = event.key;

                if (/^[0-9]+$/.test(inputValue)) {
                    return true;
                } else {
                    event.preventDefault();
                    return false;
                }
            };

            $scope.checkPriceFormat = () => {
                // Kiểm tra xem giá có đúng định dạng số không
                $scope.invalidPriceFormat = !/^[0-9]*$/.test($scope.tourDetail.unitPrice);
            };


            /**
             * Phân trang
             * @param page
             */
            $scope.setPage = (page) => {
                if (page >= 0 && page < $scope.totalPages) {
                    $scope.currentPage = page;
                    $scope.init();
                }
            };

            $scope.getPaginationRange = () => {
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

                for (let i = start; i < end; i++) {
                    range.push(i);
                }

                return range;
            };

            $scope.pageSizeChanged = () => {
                $scope.currentPage = 0; // Đặt lại về trang đầu tiên
                $scope.init(); // Tải lại dữ liệu với kích thước trang mới
            };

            $scope.getDisplayRange = () => {
                return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
            };

            $scope.getDisplayIndex = function (index) {
                return index + 1 + $scope.currentPage * $scope.pageSize;
            };

            /**
             * Sắp xếp
             */
            $scope.sortData = (column) => {
                $scope.sortBy = column;
                $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
                $scope.init();
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

            /**
             * Phương thức hiển thị modal map
             */
            $scope.showModalMap = () => {
                $scope.searchLocation = "";
                let modelMap = $('#modalMapTourDetail');
                modelMap.modal('show');

                modelMap.on('shown.bs.modal', () => {
                    $scope.initMap();
                });
            };
        }

        $scope.init();

        /**
         * Load dữ liệu lên form input
         */
        $scope.loadTourDetailForm = () => {
            ToursServiceAD.findAllToursSelect().then((response) => {
                $scope.tourBasicList = response.data.data;
            }, errorCallback);

            AccountServiceAD.findUsersByRolesIsGuild().then((response) => {
                $scope.UsersByRolesIsGuildSelect = response.data.data;
            }, errorCallback);

            $http.get('/lib/address/data.json').then((response) => {
                $scope.provinces = response.data;
            }, errorCallback);

            $scope.onProvinceChange = (locationType) => {
                let selectedProvince = $scope.provinces.find(p => p.Id === $scope.tourDetail[locationType]);
                if (selectedProvince) {
                    $scope.tourDetail[locationType] = selectedProvince.Name;
                }
            };
        };

        $scope.loadTourDetailForm()

        /**
         * Load loại tour lên select
         */
        $scope.loadSelectTourType = () => {
            ToursTypeServiceAD.getAllTourTypes()
                .then((response) => {
                    $scope.tourTypeList = response.data;
                }, errorCallback);
        };

        /**
         * API tạo tour detail
         */
        $scope.createTourDetailSubmit = () => {
            $scope.isLoading = true;
            let tourDetail = $scope.tourDetail;
            let tourDetailImage = $scope.tourDetail.tourDetailImage;

            const dataTourDetail = new FormData();

            dataTourDetail.append("tourDetailsDto", new Blob([JSON.stringify(tourDetail)], {type: "application/json"}));
            angular.forEach(tourDetailImage, (file) => {
                dataTourDetail.append('tourDetailImage', file);
            });

            TourDetailsServiceAD.createTourDetail(dataTourDetail).then(() => {
                toastAlert('success', 'Thêm mới thành công !');
                $location.path('/admin/detail-tour-list');
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };

        /**
         * API thêm điểm tham quan
         */
        $scope.createTourDestinationSubmit = () => {
            $scope.isLoading = true;
            let tourDetailId = $scope.tourDetail.id
            let dataProvince = $scope.dataProvince;

            TourDetailsServiceAD.createTourDestination(dataProvince, tourDetailId).then(() => {
                centerAlert('Thành công !', 'Cập nhật lịch trình tham quan thành công !', 'success');
                $('#modal-tour-detail').modal('hide');
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        /**
         * API update
         */
        const confirmUpdate = () => {
            const dataTourDetail = new FormData();
            $scope.isLoading = true;

            dataTourDetail.append("tourDetailsDto", new Blob([JSON.stringify($scope.tourDetail)], {type: "application/json"}));

            TourDetailsServiceAD.updateTourDetail(tourDetailId, dataTourDetail).then(() => {
                toastAlert('success', 'Cập nhật thành công !');
                $location.path('/admin/detail-tour-list');
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        $scope.updateTourDetail = () => {
            confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
        }

        /**
         * Gọi api delete tour
         */
        $scope.deleteTourDetail = (tourDetail) => {
            const confirmDeleteTour = () => {
                TourDetailsServiceAD.deactivateTourDetail(tourDetail.id, $scope.tourDetail.tourDetailNotes).then(() => {
                    toastAlert('success', 'Khóa hoạt động thành công!');
                    $scope.changeTab('cancelled', 4, 'dateDeleted')
                    $('#cancelled_tour_noted').modal('hide');
                    $('#modal-tour-detail').modal('hide');
                    $scope.init();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn ngưng hoạt động tour ' + tourDetail.toursByTourId.tourName + ' không ?', confirmDeleteTour);
        }

        /**
         * Phương thức khởi tạo map
         */
        $scope.initMap = () => {
            $scope.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [106.6297, 10.8231],
                zoom: 9
            });

            $scope.map.on('load', () => {
                $scope.map.on('click', (e) => {
                    $scope.longitude = e.lngLat.lng;
                    $scope.latitude = e.lngLat.lat;

                    if ($scope.currentMarker) {
                        $scope.currentMarker.remove();
                    }

                    $scope.toLocationArray = [$scope.longitude, $scope.latitude];

                    $scope.showLocationOnInput($scope.toLocationArray);

                    $scope.currentMarker = new mapboxgl.Marker()
                        .setLngLat([$scope.longitude, $scope.latitude])
                        .addTo($scope.map);
                });
            });
        }

        $scope.searchLocationOnMap = () => {
            let searchQuery = encodeURIComponent($scope.searchLocation);

            if (searchQuery) {
                let apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapboxgl.accessToken}&country=VN&type=region&autocomplete=true`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.features.length > 0) {
                            $scope.suggestedLocations = data.features.map(feature => feature.place_name);
                            $scope.showSuggestions = true;
                        } else {
                            $scope.showSuggestions = false;
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi tìm kiếm địa điểm:', error);
                        $scope.showSuggestions = false;
                    });
            } else {
                $scope.showSuggestions = false;
                $scope.initMap();
            }
        }

        $scope.selectLocation = (location) => {
            $scope.searchLocation = location;
            $scope.searchLocationOnMap();
            $scope.showSuggestions = false;
        }

        $scope.submitSearchOnMap = () => {
            $scope.showSuggestions = false;
            let searchQuery = $scope.searchLocation;

            if (searchQuery) {
                if (searchQuery.length > 50) {
                    searchQuery = searchQuery.substring(0, 50);
                }

                let relatedKeywords = searchQuery.split(' ').filter(keyword => keyword.length > 2);
                searchQuery = relatedKeywords.join(' ');

                MapBoxService.geocodeAddress(searchQuery, (error, coordinates) => {
                    if (error) {
                        console.error('Lỗi khi tìm kiếm địa điểm:', error);
                        return;
                    }

                    let bbox = [
                        [coordinates[0] - 0.01, coordinates[1] - 0.01],
                        [coordinates[0] + 0.01, coordinates[1] + 0.01]
                    ];

                    $scope.map ? $scope.map.fitBounds(bbox) : $scope.initMap();
                });
            } else {
                $scope.initMap();
            }
        }

        $scope.showLocationOnInput = (toLocation) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${toLocation[0]},${toLocation[1]}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                    $scope.$apply(() => {
                        let addressComponents = data.features[0].place_name.split(',');
                        for (let i = addressComponents.length - 1; i >= 0; i--) {
                            let lastPart = addressComponents[i].trim();
                            if (!isNaN(lastPart)) {
                                addressComponents.splice(i, 1);
                                break;
                            }
                        }
                        $scope.tourDetail.toLocation = addressComponents.join(',').trim();
                    });
                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin địa chỉ:', error);
                });
        }

        /**
         * click vào để show ra form thêm thông tin khách hàng
         */
        $scope.showFormTourDetailAgent = function () {
            $scope.showFormTourAgent = !$scope.showFormTourAgent;
        }

        /**
         * Phương thức thay đổi icon khi nhấn vào xem thêm bên tour detail agent
         */
        $scope.getChangeIconTourAgent = function () {
            if ($scope.showFormTourAgent) {
                if ($scope.showFormTourAgent === -1) {
                    return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"></path></svg>');
                } else {
                    return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-up" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"></path></svg>');
                }
            }
            return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"></path></svg>');
        };
    });
