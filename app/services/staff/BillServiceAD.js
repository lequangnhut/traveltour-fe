travel_app.service('BillTourServiceAD', function ($http, $q,) {
    let API = BASE_API + 'staff/invoices/';

    this.getAll = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-all-invoices',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'dateCreated',
                sortDir: sortDir || 'DESC',
                searchTerm: searchTerm || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findByInvoiceId = function (invoiceId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API + 'find-by-invoice-id',
            params: {
                invoiceId: invoiceId
            }
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
