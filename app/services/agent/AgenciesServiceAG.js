travel_app.service('AgenciesServiceAG', function ($http) {
    let API_AGENCIES = BASE_API + 'agent/agencies/';
    let API_HOTEL = BASE_API + 'agent/hotels';

    this.findByUserId = function (userId) {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'find-by-user-id/' + userId
        })
    }

    this.registerBusiness = function (dataAgencies) {
        return $http({
            method: 'PUT',
            url: API_AGENCIES + 'register-business',
            headers: {'Content-Type': undefined},
            data: dataAgencies,
            transformRequest: angular.identity
        })
    }

    /**
     * Lấy danh sách khách sạn
     */
    this.getListHotel = function (idAgency) {
        var formData = new FormData();
        formData.append('idAgency', idAgency);

        return $http({
            method: 'POST',
            url: API_HOTEL + '/list-hotels',
            data: formData,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        })
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
            url: API_HOTEL + '/information-hotel/create',
            headers: {'Content-Type': undefined},
            data: formData,
            transformRequest: angular.identity,
        });
    }

})