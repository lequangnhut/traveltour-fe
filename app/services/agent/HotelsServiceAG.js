travel_app.service('HotelServiceAG', function ($http) {
    let API_HOTELS = BASE_API + 'agent/hotels/';

    this.findAllByAgencyId = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'find-all-by-agency-id/' + agencyId
        })
    }

    this.findAllByAgencyIdAndStatusDelete = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'findAllByAgencyIdAndStatusDelete/' + agencyId
        })
    }

    /**
     * Lấy danh sách khách sạn
     */
    this.getListHotel = function (listHotels) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'list-hotels',
            data: listHotels
        })
    };

    /**
     * Lấy danh sách loại khách sạn
     */
    this.getListHotelType = function () {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'list-hotels-type'
        })
    };

    /**
     * Lấy danh sách loại giờng
     */
    this.findListBedType = function () {
        return $http({
            method: "GET",
            url: API_HOTELS + "list-bed-type"
        });
    };

    /**
     * Lấy danh sách check box vị trí tiện ích khách sạn
     */
    this.getListPlaceUtilities = function () {
        return $http({
            method: "GET",
            url: API_HOTELS + "list-place-utilities"
        });
    };

    /**
     * Lấy danh sách check box vị trí tiện ích phòng
     */
    this.getListRoomUtilities = function () {
        return $http({
            method: "GET",
            url: API_HOTELS + "list-room-utilities"
        });
    };


    this.registerHotels = function (
        hotels, roomType,
        selectedPlaceUtilitiesHotel,
        selectedRoomTypeUtilities,
        checkinTime, checkoutTime, bedTypeId,
        avatarHotel, roomTypeAvatar, listRoomTypeImg) {
        var emptyImageBlob = new Blob([''], {type: "image/png"});

        hotels.province = hotels.provinceName;
        hotels.district = hotels.districtName;
        hotels.ward = hotels.wardName;

        var hotelsData = {
            hotelName: hotels.hotelName,
            urlWebsite: hotels.urlWebsite,
            phone: hotels.phone,
            amountRoom: hotels.amountRoom,
            floorNumber: hotels.floorNumber,
            province: hotels.province,
            district: hotels.district,
            ward: hotels.ward,
            address: hotels.address,
            isActive: hotels.isActive,
            longitude: hotels.longitude,
            latitude: hotels.latitude,
            agenciesId: hotels.agencyId,
            hotelTypeId: hotels.hotelType,
        }

        var roomTypesData = {
            roomTypeName: roomType.roomTypeName,
            capacityAdults: roomType.capacityAdults,
            capacityChildren: roomType.capacityChildren,
            amountRoom: roomType.amountRoom,
            price: roomType.price,
            breakfastIncluded: roomType.breakfastIncluded,
            freeCancellation: roomType.freeCancellation,
            roomTypeDescription: roomType.roomTypeDescription,
        }


        var formData = new FormData();

        // Ảnh khách sạn
        if (avatarHotel && avatarHotel.length > 0) {
            formData.append('avatarHotel', avatarHotel[0], avatarHotel[0].name);
        } else {
            formData.append('avatarHotel', emptyImageBlob, 'empty-image.png');
        }

        // Ảnh loại phòng
        if (roomTypeAvatar && roomTypeAvatar.length > 0) {
            formData.append('roomTypeAvatar', roomTypeAvatar[0], roomTypeAvatar[0].name);
        } else {
            formData.append('roomTypeAvatar', emptyImageBlob, 'empty-image.png');
        }

        // Danh sách các ảnh phòng
        if (listRoomTypeImg && listRoomTypeImg.length > 0) {
            for (var i = 0; i < listRoomTypeImg.length; i++) {
                formData.append('listRoomTypeImg', listRoomTypeImg[i], listRoomTypeImg[i].name);
            }
        } else {
            var emptyListImageBlob = new Blob([''], {type: "image/png"});
            formData.append('listRoomTypeImg', emptyListImageBlob, 'empty-image.png');
        }


        formData.append('hotels', new Blob([JSON.stringify(hotelsData)], {type: "application/json"}));
        formData.append('roomType', new Blob([JSON.stringify(roomTypesData)], {type: "application/json"}));
        formData.append('checkinTime', checkinTime);
        formData.append('checkoutTime', checkoutTime);
        formData.append('bedTypeId', bedTypeId);
        formData.append('placeUtilities', new Blob([JSON.stringify(selectedPlaceUtilitiesHotel)], {type: "application/json"}));
        formData.append('roomTypeUtilities', new Blob([JSON.stringify(selectedRoomTypeUtilities)], {type: "application/json"}));

        return $http({
            method: 'POST',
            url: API_HOTELS + 'register-hotels',
            headers: {'Content-Type': undefined},
            data: formData,
            transformRequest: angular.identity,
        });
    };

    /**
     * Thêm khách sạn mới
     * @param dataHotel dữ liệu thông tin khách sạn
     * @param selectHotelUtilities
     * @returns {*}
     */
    this.createHotel = function (dataHotel, selectHotelUtilities, longitude, latitude) {
        var formData = new FormData();

        formData.append('companyDataDto', new Blob([JSON.stringify(dataHotel)], {type: "application/json"}));
        formData.append('selectHotelUtilities', new Blob([JSON.stringify(selectHotelUtilities)], {type: "application/json"}));
        formData.append('longitude', new Blob([JSON.stringify(longitude)], {type: "application/json"}));
        formData.append('latitude', new Blob([JSON.stringify(latitude)], {type: "application/json"}));

        if (dataHotel.avatarHotel) {
            formData.append('avatarHotel', dataHotel.avatarHotel[0]);
        }

        return $http({
            method: 'POST',
            url: API_HOTELS + 'information-hotel/create',
            headers: {'Content-Type': undefined},
            data: formData,
            transformRequest: angular.identity,
        });
    }

    this.getHotelByIdHotels = function (id) {
        return $http({
            method: "GET",
            url: API_HOTELS + "findByHotelId/" + id,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        })
    }


    this.updateHotel = function (dataHotel, selectedUtilities, hotelAvatarUpdated, longitude, latitude) {
        var formData = new FormData();

        formData.append('dataHotel', new Blob([JSON.stringify(dataHotel)], {type: "application/json"}));
        formData.append('selectedUtilities', new Blob([JSON.stringify(selectedUtilities)], {type: "application/json"}));
        formData.append('longitude', longitude);
        formData.append('latitude', latitude);

        if (hotelAvatarUpdated && hotelAvatarUpdated.length > 0) {
            formData.append('hotelAvatarUpdated', hotelAvatarUpdated[0], hotelAvatarUpdated[0].name);
        } else {
            var emptyImageBlob = new Blob([''], {type: "image/png"});
            formData.append('hotelAvatarUpdated', emptyImageBlob, 'empty-image.png');
        }

        return $http({
            method: 'PUT',
            url: API_HOTELS + 'information-hotel/update',
            headers: {'Content-Type': undefined},
            data: formData,
        });
    }

    this.deleteHotel = function (id) {
        return $http({
            method: 'DELETE',
            url: API_HOTELS + 'deleteHotel/' + id
        })
    }
})