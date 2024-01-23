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
})