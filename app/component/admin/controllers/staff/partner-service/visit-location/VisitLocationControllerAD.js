travel_app.controller('VisitLocationControllerAD',
    function ($scope, $sce, $routeParams, $location, $timeout, $http, VisitLocationServiceAD,
              TourDetailsServiceAD, LocalStorageService, Base64ObjectService) {
        $scope.isLoading = true;
        $scope.visitLocationList = [];

        $scope.tourDetailId = $routeParams.tourDetailId;
        const tourDetailId = Base64ObjectService.decodeObject($routeParams.tourDetailId);
        $scope.searchVisitLocation = {location: null};
        let searchTimeout;

        $scope.currentPage = 0;
        $scope.pageSize = 5;

        if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
            TourDetailsServiceAD.findTourDetailById(tourDetailId).then(response => {
                $scope.tourGuideId = response.data.data.guideId;
            })
        }

        $scope.toggleDetails = (visitLocation) => {
            visitLocation.showDetails = !visitLocation.showDetails;
        };

        $scope.getCurrentDate = () => {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
        };

        $scope.checkDate = () => {
            const currentDate = new Date();
            if ($scope.departureDate === undefined) {
                $scope.departureDate = currentDate;
                toastAlert('warning', 'Không được nhập ngày quá khứ!');
            }
        };

        $scope.setPage = (page) => {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getVisitLocationList();
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
            $scope.getVisitLocationList();
        };

        $scope.getDisplayRange = () => Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);


        const visitLocationData = (response) => {
            $scope.visitLocationList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
        };

        $scope.getVisitLocationList = async () => {
            try {
                const [visitLocationResponse,
                    provincesResponse]
                    = await Promise.all([
                    VisitLocationServiceAD.getAllOrSearchVisitLocation($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir),
                    $http.get('/lib/address/data.json')]);

                if (!visitLocationResponse.data.data || visitLocationResponse.data.data.content.length === 0) {
                    $scope.setPage(Math.max(0, $scope.currentPage - 1));
                    return;
                }

                visitLocationData(visitLocationResponse)

                $scope.provinces = provincesResponse.data;

            } catch (error) {
                console.error("Error:", error);
            } finally {
                $scope.$apply(() => {
                    $scope.isLoading = false;
                });
            }
        }

        $scope.sortData = (column) => {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortBy === column && $scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getVisitLocationList();
        };

        $scope.getSortIcon = (column) => {
            if ($scope.sortBy === column) {
                return $sce.trustAsHtml($scope.sortDir === 'asc' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l-128 128z"/></svg>');
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
        };

        $scope.searchVisitLocationByKey = () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(() => {
                $scope.currentPage = 0;
                VisitLocationServiceAD.getAllOrSearchVisitLocation($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(response => {
                        if (!response || !response.data || !response.data.data || !response.data.data.content) {
                            $scope.getVisitLocationList();
                            toastAlert('warning', 'Không tìm thấy !');
                            return;
                        }
                        visitLocationData(response);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }, 500);
        };


        $scope.searchVisitLocationByLocation = async () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);
            $scope.setPage(0);

            try {
                const response = await VisitLocationServiceAD.getAllOrSearchVisitLocation(
                    $scope.currentPage,
                    $scope.pageSize,
                    $scope.sortBy,
                    $scope.sortDir,
                    '',
                    $scope.searchVisitLocation.location
                );

                if (!response || !response.data || !response.data.data || !response.data.data.content) {
                    $scope.getVisitLocationList();
                    toastAlert('warning', 'Không tìm thấy !');
                    return;
                }

                await $timeout(() => {
                    visitLocationData(response)
                }, 0);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        /**
         * Mở image bự hơn trong modal
         */
        $scope.openImageModal = (imageUrl) => {
            document.getElementById('modalImage').src = imageUrl;
            $('#imageModal').modal('show');
        };

        /**
         *  mở thêm modal thêm vé
         */
        $scope.openModal = (visitLocation) => {
            $('#modal-tour-detail').modal('show');
            $scope.visitLocationModal = visitLocation;
            $scope.tickets = visitLocation.visitLocationTicketsById;
            $scope.departureDate = new Date();
            $scope.showBookButton = ($scope.tickets.length === 1 && $scope.tickets[0].ticketTypeName.toLowerCase() === 'miễn phí vé');
            $scope.hasFreeTicket = $scope.tickets.some(ticket => ticket.ticketTypeName.toLowerCase() === 'miễn phí vé');
        }

        /**
         * Modal xem chi tiết tour detail
         */
        $scope.checkTourDetailModal = function () {
            $('#tourInformationModal').modal('show');

            TourDetailsServiceAD.findTourDetailById(tourDetailId).then(function (response) {
                if (response.status === 200) {
                    $scope.tourDetailModal = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            })
        }

        let ConfirmTicketSelection = (visitLocationId) => {
            let childTicketCount = 0;
            let adultTicketCount = 0;

            let selectedTickets = $scope.visitLocationModal.visitLocationTicketsById.filter((ticket) => {
                return ticket.isChecked; // Lọc ra những phòng đã được chọn
            }).map((ticket) => {
                if (ticket.ticketTypeName === "Vé trẻ em") {
                    childTicketCount += ticket.quantity;
                } else {
                    adultTicketCount += ticket.quantity;
                }
                return {
                    ...ticket,
                    quantity: ticket.quantity
                };
            });

            let infoVisitLocation = {
                tourGuideId: $scope.tourGuideId,
                capacityAdult: adultTicketCount,
                capacityKid: childTicketCount,
                checkIn: $scope.departureDate,
                visitLocationImage: $scope.visitLocationModal.visitLocationImage,
                visitLocationName: $scope.visitLocationModal.visitLocationName
            }

            LocalStorageService.encryptLocalData(selectedTickets, 'selectedTickets', 'encryptSelectedTickets');
            LocalStorageService.encryptLocalData(infoVisitLocation, 'infoVisitLocation', 'encryptInfoVisitLocation');

            $timeout(() => {
                const visitLocationIdEncode = Base64ObjectService.encodeObject(visitLocationId);
                $location.path(`/admin/detail-tour-list/${$routeParams.tourDetailId}/service-list/visit-location-list/${visitLocationIdEncode}/visit-location-payment`);
            }, 0);
        };

        $scope.onCheckChanged = (ticket) => {
            if (ticket.isChecked) {
                ticket.quantity = 1;
            } else {
                delete ticket.quantity;
            }
        };

        $scope.bookTickets = (visitLocationId) => {
            let currentDateMinus1Minutes = new Date();
            currentDateMinus1Minutes.setMinutes(currentDateMinus1Minutes.getMinutes() - 1);

            let selectedTickets = $scope.visitLocationModal.visitLocationTicketsById.filter((ticket) => {
                return ticket.isChecked;
            });

            if (selectedTickets.length === 0) {
                toastAlert('warning', 'Vui lòng chọn ít nhất một loại vé !');
                return;
            } else if (!$scope.departureDate) {
                toastAlert('warning', 'Vui lòng chọn ngày đi !');
                return;
            } else if ($scope.departureDate < currentDateMinus1Minutes) {
                toastAlert('warning', 'Ngày đi không được nhỏ hơn ngày hiện tại!');
                return;
            }

            $('#modal-tour-detail').modal('hide');
            ConfirmTicketSelection(visitLocationId);
        };

        $scope.getVisitLocationList();
    });
