travel_app.controller('HotelServiceControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, HotelServiceServiceAD,
              TourDetailsServiceAD, ToursServiceAD, TourTripsServiceAD, HotelTypeServiceServiceAD,
              RoomTypeServiceServiceAD) {
        $scope.isLoading = true;

        const tourDetailId = $routeParams.tourDetailId;
        const hotelId = $routeParams.hotelId;
        $scope.tourDetailId = tourDetailId;

        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);


        $scope.hotelService = {
            id: null,
            hotelName: null,
            phone: null,
            province: null,
            district: null,
            ward: null,
            address: null,
            averagePrice: null,
        };

        $scope.searchHotels = {
            location: null,
            departureDate: localDateTime(now),
            arrivalDate: localDateTime(tomorrow),
            numAdults: 1,
            numChildren: null,
            numRooms: 1,
        };

        $scope.tourInfo = {
            tourName: null,
            departureDate: null,
            arrivalDate: null,
            fromLocation: null,
            toLocation: null,
            numberOfGuests: null
        };

        let searchTimeout;

        $scope.hotelServiceList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.setPage = (page) => {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getHotelServiceList();
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
            $scope.getHotelServiceList();
        };

        $scope.getDisplayRange = () => Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);

        $scope.findHotelData = () => {
            return HotelServiceServiceAD.getAllOrSearchHotels(
                $scope.currentPage,
                $scope.pageSize,
                $scope.sortBy,
                $scope.sortDir,
                $scope.searchTerm,
                $scope.searchHotels.location,
                $scope.searchHotels.departureDate,
                $scope.searchHotels.arrivalDate,
                $scope.searchHotels.numAdults,
                $scope.searchHotels.numChildren,
                $scope.searchHotels.numRooms
            );
        };
        $scope.findHotelAllData = () => {
            return HotelServiceServiceAD.getAllOrSearchHotels(
                $scope.currentPage,
                $scope.pageSize,
                $scope.sortBy,
                $scope.sortDir,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
        };

        $scope.hotelServiceData = (response) => {
            $timeout(() => {
                $scope.hotelServiceList = response.data.data !== null ? response.data.data.content : [];
                $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
                $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
            }, 0);
        };


        $scope.getHotelServiceList = async () => {
            try {
                const [hotelResponse,
                    provincesResponse,
                    tourDetailResponse]
                    = await Promise.all([
                    $scope.findHotelData(),
                    $http.get('/lib/address/data.json'),
                    TourDetailsServiceAD.findTourDetailById(tourDetailId)]);

                if (!hotelResponse.data.data || hotelResponse.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return;
                }

                $scope.hotelServiceData(hotelResponse)

                $scope.provinces = provincesResponse.data;

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

                let tourTripsList = tourTripsResponse.data.data;

                tourTripsList.forEach(function (tourTrips) {
                    tourTrips.activityInDay = $sce.trustAsHtml(tourTrips.activityInDay);
                });

                $scope.tourTripsList = tourTripsList;

                /*==================================*/
                if (hotelId !== undefined && hotelId !== null && hotelId !== "") {
                    //fill list table room type by hotel id
                    const RoomTypeByHotelByIdResponse = await RoomTypeServiceServiceAD.getAllOrSearchRoomTypeByHotelId($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, hotelId, $scope.searchTerm)
                    $scope.RoomTypeByHotelByIdList = RoomTypeByHotelByIdResponse.data.data;

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
                }
            } catch (error) {
                errorCallback()
            } finally {
                $scope.$apply(() => {
                    $scope.isLoading = false;
                });
            }
        }

        const getValidNumber = (value) => {
            const parsedValue = parseFloat(value);
            return (parsedValue !== null && !isNaN(parsedValue)) ? parsedValue : Number.MIN_SAFE_INTEGER;
        };

        const getColumnValue = (item, field) => {
            if (field === 'location') {
                return item.province + item.district + item.ward;
            } else if (field === 'averageRoomPrice') {
                return getValidNumber(item.averageRoomPrice);
            }
        };

        $scope.customSort = function (field, dir) {
            const sortDirection = dir === 'asc' ? 1 : -1;

            $scope.hotelServiceList.sort((a, b) => {
                const aValue = getColumnValue(a, field);
                const bValue = getColumnValue(b, field);

                return (aValue > bValue ? 1 : (aValue < bValue ? -1 : 0)) * sortDirection;
            });

            $scope.sortDir = dir;
        };


        $scope.sortData = (column) => {
            if (column === 'location' || column === 'averageRoomPrice') {
                $scope.sortBy = column;
                $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
                $scope.customSort(column, $scope.sortDir);
            } else {
                $scope.sortBy = column;
                $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
                $scope.getHotelServiceList();
            }
        };

        $scope.getSortIcon = (column) => {
            if ($scope.sortBy === column) {
                return $sce.trustAsHtml($scope.sortDir === 'asc' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l-128 128z"/></svg>');
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
        };

        $scope.searchHotelServiceByKey = async () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(async () => {
                try {
                    const response = await $scope.findHotelData();

                    if (!response || !response.data || !response.data.data || !response.data.data.content) {
                        toastAlert('warning', 'Không tìm thấy !');
                    }

                    $scope.hotelServiceData(response)

                    await $timeout(() => {
                    }, 0);
                } catch (error) {
                    errorCallback()
                }
            }, 500);
        };

        $scope.searchHotel = async () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            try {
                const response = await $scope.findHotelData();

                if (!response || !response.data || !response.data.data || !response.data.data.content) {
                    toastAlert('warning', 'Không tìm thấy !');
                }

                $scope.hotelServiceData(response)

                await $timeout(() => {
                }, 0);
            } catch (error) {
                errorCallback()
            }
        };

        const checkBookingDates = (departureDate, arrivalDate) => {
            const departure = new Date(departureDate);
            const arrival = new Date(arrivalDate);

            const timeDiff = arrival.getTime() - departure.getTime();
            const hourDiff = timeDiff / (1000 * 3600);

            return hourDiff < 1;
        };


        $scope.navigateToRoomTypeList = (tourDetailId, hotelServiceId, hotelName, address) => {
            function checkAndFocusInput(condition, inputId, message) {
                if (condition) {
                    $timeout(() => {
                        document.getElementById(inputId).focus();
                    }, 0);
                    toastAlert('warning', message);
                    return true;
                }
                return false;
            }

            if (checkAndFocusInput(!$scope.searchHotels.departureDate && !$scope.searchHotels.arrivalDate, 'departureDateInput', 'Vui lòng chọn ngày đi và ngày về !') ||
                checkAndFocusInput(!$scope.searchHotels.departureDate, 'departureDateInput', 'Vui lòng chọn ngày đi !') ||
                checkAndFocusInput(!$scope.searchHotels.arrivalDate, 'arrivalDateInput', 'Vui lòng chọn ngày về !') ||
                checkAndFocusInput(checkBookingDates($scope.searchHotels.departureDate, $scope.searchHotels.arrivalDate), 'arrivalDateInput', 'Ngày đi phải trước ngày về! !') ||
                checkAndFocusInput(!$scope.searchHotels.numAdults && $scope.searchHotels.numAdults <= 0, 'numAdultsInput', 'Vui lòng nhập số lượng người lớn và phải lớn hơn 0 !') ||
                checkAndFocusInput($scope.searchHotels.numChildren < 0, 'numChildrenInput', 'Số lượng trẻ em không thể là số âm!') ||
                checkAndFocusInput(!$scope.searchHotels.numRooms && $scope.searchHotels.numRooms <= 0, 'numRoomsInput', 'Vui lòng nhập số lượng phòng và phải lớn hơn 0 !')) {
                return;
            }

            let departureDate = new Date($scope.searchHotels.departureDate);
            let arrivalDate = new Date($scope.searchHotels.arrivalDate);
            const infoHotel = {
                hotelName: hotelName,
                departureDate: departureDate,
                arrivalDate: arrivalDate,
                capacityAdult: $scope.searchHotels.numAdults,
                capacityKid: $scope.searchHotels.numChildren || 0,
                address: address
            };

            sessionStorage.setItem('infoHotel', JSON.stringify(infoHotel));
            $location.path(`/admin/detail-tour-list/${tourDetailId}/service-list/hotel-list/${hotelServiceId}/room-type-list`);
        };


        $scope.refreshSearch = () => {
            $scope.searchTerm = ''
            $scope.searchHotels = {}
        }

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        function localDateTime(input) {
            if (!input) {
                return '';
            }
            const year = input.getFullYear();
            const month = input.getMonth() + 1;
            const day = input.getDate();
            const hour = input.getHours();
            const minute = input.getMinutes();

            return new Date(year, month - 1, day, hour, minute);
        }

        $scope.getHotelServiceList()
        $scope.searchHotel()

    });
