travel_app.controller('BookingAddControllerAG', function($scope, $location ,HotelServiceCT, OrderHotelService, GenerateCodePayService, LocalStorageService ) {
    var hotelId = LocalStorageService.get("brandId")

    $scope.paymentHotelCustomer = {
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityAdult: null,
        capacityKid: null,
        checkIn: null,
        checkOut: null,
        orderTotal: null,
        paymentMethod: null,
        orderCode: null,
        dateCreated: null,
        orderStatus: null,
        orderNote: null,
    }

    $scope.roomTypes = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        bedTypeId: null,
        amountRoom: null,
        price: null,
        isActive: null,
        isDeleted: null,
        breakfastIncluded: false,
        freeCancellation: false,
        checkinTime: null,
        checkoutTime: null,
        roomTypeAvatar: null,
        roomTypeDescription: null,
        roomImagesById: [],
        roomUtilities: [],
        roomBedsById: {},
        listRoomTypeImg: [],
        amountRoomSelected: null,
        hotelsByHotelId: {
            id: null,
            hotelName: null,
            phoneNumber: null,
            website: null,
            province: null,
            district: null,
            ward: null,
            address: null,
            provinceName: null,
            districtName: null,
            wardName: null,
            floorNumber: null,
            avatarHotel: null,
            hotelType: null,
            agencyId: null,
            longitude: null,
            latitude: null,
            hotelTypesByHotelTypeId: {
                id: null, hotelTypeName: null, hotelsById: null,
            },

        },
        paymentHotelCustomer: {
            orderHotelId: null,
            roomTypeId: null,
            customerName: null,
            customerEmail: null,
            amount: null,
            unitPrice: null
        }
    }

    $scope.roomTypeSelected = []
    $scope.roomTypes.isSelected = false;
    if (!localStorage.getItem('filterHotelsAG')) {
        // Nếu không có dữ liệu filterHotels trong localStorage, hoặc nếu filterHotelsDate không tồn tại
        initializeDefaultValues();
    } else {
        var storedDate = localStorage.getItem('filterHotelsDateAG');
        var storedDateObj = new Date(storedDate);
        var currentDate = new Date();

        // So sánh ngày, tháng và năm của currentDate và storedDateObj
        if (currentDate.getFullYear() === storedDateObj.getFullYear() &&
            currentDate.getMonth() === storedDateObj.getMonth() &&
            currentDate.getDate() === storedDateObj.getDate()) {
            // Nếu currentDate trùng với storedDateObj, lấy dữ liệu từ localStorage
            $scope.filler = JSON.parse(localStorage.getItem('filterHotelsAG'));
        } else {
            // Nếu currentDate khác storedDateObj hoặc không tồn tại, khởi tạo giá trị mặc định mới
            initializeDefaultValues();
        }
    }

    function initializeDefaultValues() {
        var today = new Date();
        var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        $scope.filler = {
            priceFilter: 30000000,
            hotelTypeIdListFilter: [],
            placeUtilitiesIdListFilter: [],
            roomUtilitiesIdListFilter: [],
            breakfastIncludedFilter: null,
            freeCancellationFilter: null,
            roomBedsIdListFilter: [],
            amountRoomFilter: null,
            locationFilter: null,
            capacityAdultsFilter: 2,
            capacityChildrenFilter: 0,
            checkInDateFiller: today,
            checkOutDateFiller: tomorrow,
            hotelIdFilter: hotelId,
            page: 0,
            size: 10,
            sort: null
        };

        $scope.filler.checkOutDateFiller.setDate($scope.filler.checkOutDateFiller.getDate() + 1);

        // Lưu giá trị mới vào localStorage và cập nhật filterHotelsDate
        localStorage.setItem('filterHotelsAG', JSON.stringify($scope.filler));
        localStorage.setItem('filterHotelsDateAG', today.toISOString());
    }



    $scope.filler = JSON.parse(localStorage.getItem('filterHotelsAG'));
    $scope.filler.checkInDateFiller = new Date($scope.filler.checkInDateFiller);
    $scope.filler.checkOutDateFiller = new Date($scope.filler.checkOutDateFiller);

    $scope.updateFilter = function() {
        $scope.fillerUpdate = JSON.parse(localStorage.getItem('filterHotelsAG'));
        $scope.fillerUpdate.checkInDateFiller = $scope.filler.checkInDateFiller
        $scope.fillerUpdate.checkOutDateFiller = $scope.filler.checkOutDateFiller

        localStorage.setItem('filterHotelsAG', JSON.stringify($scope.fillerUpdate));
    }

    $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));

    /**
     * Phương thức lấy tất cả các loại giường
     */
    HotelServiceCT.findAllRoomBedType().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.bedTypes = response.data.data;
        } else {
            $location.path('/admin/internal-server-error');
        }
    })
    $scope.selectedRoomType = function (selectedRoomType, roomType) {
        var index = $scope.roomTypeSelected.findIndex(item => item.id === roomType.id);

        if (index === -1) {
            if (selectedRoomType !== null && selectedRoomType !== 0 && selectedRoomType !== undefined) {
                $scope.roomTypeSelected.push(roomType);
                roomType.amountRoomSelected = selectedRoomType;
            }
        } else {
            if (selectedRoomType === null || selectedRoomType === 0 || selectedRoomType === undefined) {
                $scope.roomTypeSelected.splice(index, 1);
            } else {
                $scope.roomTypeSelected[index].amountRoomSelected = selectedRoomType;
            }
        }
        console.log($scope.roomTypeSelected)
    };

    /**
     * Tạo số phòng từ 1 đến số phòng
     * @param amountRoom số lượng phòng
     * @returns {[]} số lượng phòng từ 1 đến số phòng
     */
    $scope.generateRoomNumbers = function (amountRoom) {
        $scope.numberOfRooms = [];
        for (var i = 1; i <= amountRoom; i++) {
            $scope.numberOfRooms.push(i);
        }
        return $scope.numberOfRooms;
    };

    /**
     * Phương thức lấy danh sách loại phòng
     */
    $scope.findAllRoomTypesByFillerClick = function () {
        $scope.isLoading = true;
        if (parseInt($scope.filler.capacityAdultsFilter) !== 2) {
            $scope.filler.sort = '05';
            console.log($scope.filler);
        }

        HotelServiceCT.findAllRoomTypesByFillter($scope.filler)
            .then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.roomTypes = response.data.data;
                    $scope.totalPages = Math.ceil(response.data.totalPages / $scope.filler.size);
                    $scope.countSize = response.data.totalPages;
                    $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));
                    $scope.updateFilter()
                } else {
                    $location.path('/admin/internal-server-error');
                }
            }).finally(function () {
            $scope.isLoading = false;
        });
    }
    $scope.findAllRoomTypesByFillerClick()

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

    $scope.submitPayment = function () {
        $scope.isLoading = true;
        $scope.orderRoomType = {
            id: GenerateCodePayService.generateCodePayment('VPO'),
            customerName: $scope.paymentHotelCustomer.customerName,
            customerCitizenCard: $scope.paymentHotelCustomer.customerCitizenCard,
            customerPhone: $scope.paymentHotelCustomer.customerPhone,
            customerEmail: $scope.paymentHotelCustomer.customerEmail,
            capacityAdult: $scope.filler.capacityAdultsFilter,
            capacityKid: $scope.filler.capacityChildrenFilter,
            checkIn: $scope.filler.checkInDateFiller,
            checkOut: $scope.filler.checkOutDateFiller,
            orderTotal: null,
            paymentMethod: "VPO",
            orderNote: $scope.paymentHotelCustomer.orderNote
        }

        $scope.orderDetailsHotel = $scope.roomTypeSelected.map(function (roomType) {
            var orderDetail = {
                roomTypeId: roomType.id,
                amount: roomType.amountRoomSelected
            };

            if (roomType.paymentHotelCustomer && roomType.paymentHotelCustomer.customerName != null) {
                orderDetail.customerName = roomType.paymentHotelCustomer.customerName;
            } else {
                orderDetail.customerName = null;
            }

            if (roomType.paymentHotelCustomer && roomType.paymentHotelCustomer.customerEmail != null) {
                orderDetail.customerEmail = roomType.paymentHotelCustomer.customerEmail;
            } else {
                orderDetail.customerEmail = null;
            }

            return orderDetail;
        });

        OrderHotelService.createOrderHotelAG($scope.orderRoomType, $scope.orderDetailsHotel).then(function successCallBack(response) {
            console.log(response)
            if (response.data.status === '200') {
                toastAlert('success', 'Đặt khách sạn thành công !');
                $location.path('/business/hotel/booking-list')
                $scope.playSuccessSound()
            } else if (response.data.status === '400') {
                Swal.fire({
                    icon: "error",
                    title: "Đặt phòng thất bại",
                    text: response.data.message,
                });
                $scope.playErrorSound()
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Đặt phòng thất bại",
                    text: 'Vui lòng thử lại sau ít phút',
                });
                $scope.playErrorSound()
            }
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

})