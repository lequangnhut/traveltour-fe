travel_app.controller('RoomTypeControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, HotelServiceServiceAD,
              TourDetailsServiceAD, ToursServiceAD, TourTripsServiceAD, HotelTypeServiceServiceAD,
              RoomTypeServiceServiceAD, LocalStorageService, Base64ObjectService) {
        $scope.isLoading = true;

        $scope.tourDetailIdRouter = $routeParams.tourDetailId;
        const tourDetailId = Base64ObjectService.decodeObject($routeParams.tourDetailId);
        const hotelId = Base64ObjectService.decodeObject($routeParams.hotelId);

        $scope.tourDetailId = tourDetailId;
        $scope.hotelId = hotelId;

        let checkIn = LocalStorageService.decryptLocalData('infoHotel', 'encryptInfoHotel').departureDate;
        let checkOut = LocalStorageService.decryptLocalData('infoHotel', 'encryptInfoHotel').arrivalDate

        $scope.tourInfo = {
            tourName: null,
            departureDate: null,
            arrivalDate: null,
            fromLocation: null,
            toLocation: null,
            numberOfGuests: null
        };

        let searchTimeout;

        $scope.roomTypeList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.onQuantityChange = (rt) => {
            rt.quantity = parseInt(rt.quantity, 10) || 0;

            const availableRooms = parseInt(rt.availableRooms, 10) || 0;

            if (rt.quantity > availableRooms) {
                toastAlert('warning', 'Số lượng phòng đặt không được vượt quá số lượng phòng còn trống!');
                rt.quantity = availableRooms; // Đặt lại rt.quantity thành số lượng phòng có sẵn
            }
        };


        $scope.onQuantityBlur = (rt) => {
            if (rt.quantity === null || rt.quantity === '' || rt.quantity < 1) {
                rt.quantity = 1;
            }
        };


        $scope.setPage = (page) => {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getRoomTypeList();
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
            $timeout(() => {
                $scope.getRoomTypeList();
            }, 0);
        };

        $scope.getDisplayRange = () => Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);

        const roomTypeData = async (response) => {
            let roomTypeList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;

            const roomTypePromises = roomTypeList.map(async (rt) => {

                const bedTypes = await RoomTypeServiceServiceAD.findBedTypeNameByRoomTypeId(rt.id);

                const roomUtilitiesNames = rt.roomUtilities ? rt.roomUtilities.map(u => u.roomUtilitiesName).join(", ") : "không";
                const bedTypeNames = bedTypes.data.data ? await bedTypes.data.data.map(b => b).join(", ") : "không";

                return {
                    ...rt,
                    roomUtilitiesNames: roomUtilitiesNames == [] ? 'không' : roomUtilitiesNames,
                    bedTypeNames: bedTypeNames,
                    isChecked: false
                };

            });

            $scope.roomTypeList = await Promise.all(roomTypePromises);
            $scope.$apply()
        };


        $scope.getRoomTypeList = async () => {
            try {
                const [RoomTypeByHotelByIdResponse, tourDetailResponse] = await Promise.all([
                    RoomTypeServiceServiceAD.getAllOrSearchRoomTypeByHotelId($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, hotelId, checkIn, checkOut),
                    TourDetailsServiceAD.findTourDetailById(tourDetailId)
                ]);

                if (!RoomTypeByHotelByIdResponse.data.data || RoomTypeByHotelByIdResponse.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return;
                }

                roomTypeData(RoomTypeByHotelByIdResponse);

                //fill modal tour info and tour trips
                let tourDetail = tourDetailResponse.data.data;
                const tourResponse = await ToursServiceAD.findTourById(tourDetail.tourId);
                const tourTripsResponse = await TourTripsServiceAD.getTripsByTourId(tourDetail.id);

                $scope.tourInfo = {
                    tourName: tourResponse.data.tourName,
                    departureDate: new Date(tourDetail.departureDate),
                    arrivalDate: new Date(tourDetail.arrivalDate),
                    fromLocation: tourDetail.fromLocation,
                    toLocation: tourDetail.toLocation,
                    numberOfGuests: tourDetail.numberOfGuests
                };

                let tourTripsList = tourTripsResponse.data.data.tourTrips;

                tourTripsList.forEach((tourTrips) => {
                    tourTrips.activityInDay = $sce.trustAsHtml(tourTrips.activityInDay);
                });

                $scope.tourTripsList = tourTripsList;


                //fill modal hotelInfo
                const HotelByIdResponse = await HotelServiceServiceAD.findHotelById(hotelId)
                const hotel = HotelByIdResponse.data.data;

                const HotelTypeByIdResponse = await HotelTypeServiceServiceAD.findById(hotel.hotelTypeId)
                const hotelType = HotelTypeByIdResponse.data.data;

                const placeUtilitiesNames = hotel.placeUtilities.map(util => util.placeUtilitiesName).join(" - ");

                $scope.hotelInfo = {
                    hotelName: hotel.hotelName,
                    hotelTypeName: hotelType.hotelTypeName,
                    address: `${hotel.address} - ${hotel.ward} - ${hotel.district} - ${hotel.province}`,
                    utilities: placeUtilitiesNames,
                };

            } catch (error) {
                errorCallback()
            } finally {
                $scope.$apply(() => {
                    $scope.isLoading = false;
                });
            }
        }

        const getColumnValue = (item, field) => {
            switch (field) {
                case 'roomUtilitiesNames':
                    return item.roomUtilitiesNames.toLowerCase();
                case 'bedTypeNames':
                    return item.bedTypeNames.toLowerCase();
                case 'availableRooms':
                    return item.availableRooms; // Trả về giá trị của trường "availableRooms"
                default:
                    return item[field];
            }
        };

        $scope.customSort = (field, dir) => {
            const sortDirection = dir === 'asc' ? 1 : -1;

            $scope.roomTypeList.sort((a, b) => {
                const aValue = getColumnValue(a, field);
                const bValue = getColumnValue(b, field);

                // Áp dụng so sánh chuỗi cho roomUtilitiesNames và bedTypeNames
                if (field === 'roomUtilitiesNames' || field === 'bedTypeNames') {
                    return aValue.localeCompare(bValue) * sortDirection;
                } else {
                    // So sánh giá trị số hoặc các loại giá trị khác
                    if (aValue > bValue) return sortDirection;
                    if (aValue < bValue) return -sortDirection;
                    return 0;
                }
            });

            $scope.sortDir = dir;
        };

        $scope.sortData = (column) => {
            if (column === 'roomUtilitiesNames' || column === 'bedTypeNames' || column === 'availableRooms') {
                $scope.sortBy = column;
                $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
                $scope.customSort(column, $scope.sortDir);
            } else {
                $scope.sortBy = column;
                $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
                $scope.getRoomTypeList();
            }
        };

        $scope.getSortIcon = (column) => {
            if ($scope.sortBy === column) {
                return $sce.trustAsHtml($scope.sortDir === 'asc' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l-128 128z"/></svg>');
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
        };

        $scope.searchRoomType = async () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(async () => {
                try {
                    const response = await RoomTypeServiceServiceAD.getAllOrSearchRoomTypeByHotelId($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, hotelId, checkIn, checkOut, $scope.searchTerm);

                    if (!response || !response.data || !response.data.data || !response.data.data.content) {
                        $scope.getRoomTypeList();
                        toastAlert('warning', 'Không tìm thấy !');
                        return;
                    }

                    roomTypeData(response);
                } catch (error) {
                    errorCallback()
                }

            }, 500);
        };

        $scope.onCheckChanged = (room) => {
            if (room.isChecked) {
                room.quantity = 1;
            } else {
                delete room.quantity;
            }
        };


        $scope.confirmRoomSelection = () => {
            let selectedRooms = $scope.roomTypeList.filter((room) => {
                return room.isChecked; // Lọc ra những phòng đã được chọn
            }).map((room) => {
                return {
                    ...room,
                    quantity: room.quantity
                };
            });

            if (selectedRooms.length === 0) {
                toastAlert('warning', 'Vui lòng chọn ít nhất 1 phòng!')
                return;
            }

            LocalStorageService.encryptLocalData(selectedRooms, 'selectedRooms', 'encryptSelectedRooms');
            $location.path(`/admin/detail-tour-list/${$routeParams.tourDetailId}/service-list/hotel-list/${$routeParams.hotelId}/room-type-list/hotel-payment`);
        };

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        $scope.getRoomTypeList();

    });
