travel_app.service('TransportCusService', function ($http) {
    let API_TRANSPORT = BASE_API + 'customer/transport/'

    this.findAllTransportBrandCus = function (page, size) {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-all-transport-brand',
            params: {
                page: page || 0,
                size: size || 10,
            }
        });
    };

    this.findAllTransportSeatByScheduleIdCus = function (scheduleId) {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-all-transport-seats-by-schedule-id/' + scheduleId,
        });
    };


    this.findAllTransportCustomerByFilters = (page, size, sortBy, sortDir, filters) => {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-all-transport-brand-by-filters',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                price: filters.price || null,
                listOfVehicleManufacturers: filters.listOfVehicleManufacturers || null,
                mediaTypeList: filters.mediaTypeList || null,
                searchTerm: filters.searchTerm || null,
                fromLocation: filters.fromLocation || null,
                toLocation: filters.toLocation || null,
                checkInDateFiller: filters.checkInDateFiller || null,
            }
        });
    };

    this.getAllTransportCusDataList = () => {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'get-transport-customer-data-list',
        });
    };

    this.findAllTransportScheduleCus = function (page, size, brandId) {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-all-transport-schedule/' + brandId,
            params: {
                page: page || 0,
                size: size || 10,
            }
        });
    };

    this.findAllTransportBrandByIdCus = function (brandId) {
        return $http({
            method: 'GET',
            url: API_TRANSPORT + 'find-transport-brand-by-id/' + brandId
        });
    };
})