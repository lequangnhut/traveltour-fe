travel_app.service('HotelServiceAG', function ($http) {
    let API_HOTELS = BASE_API + 'agent/hotels/';

    this.findAllByAgencyId = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'find-all-by-agency-id/' + agencyId
        })
    }

    this.findByAgencyId = function (agencyId) {
        return $http({
            method: 'GET',
            url: API_HOTELS + 'find-by-agency-id/' + agencyId
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

    /**
     * Thêm thông tin khách sạn mới
     * @param dataHotels dữ liệu thông tin khách sạn
     * @param apiUrl
     * @returns {*}
     */
    this.registerHotels = function (dataHotels, apiUrl) {
        return $http({
            method: 'POST',
            url: API_HOTELS + apiUrl + '-hotels',
            headers: {'Content-Type': undefined},
            data: dataHotels
        });
    };

    /**
     * Thêm khách sạn mới
     * @param dataHotel dữ liệu thông tin khách sạn
     * @returns {*}
     */
    this.createHotel = function (dataHotel, selectHotelUtilities) {
        var formData = new FormData();

        formData.append('companyDataDto', new Blob([JSON.stringify(dataHotel)], {type: "application/json"}));
        formData.append('selectHotelUtilities', new Blob([JSON.stringify(selectHotelUtilities)], {type: "application/json"}));

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

    this.getHotelByIdHotels = function (id)   {
        return $http({
            method: "GET",
            url: API_HOTELS + "findByHotelId/" + id,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        })
    }
})