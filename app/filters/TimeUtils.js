travel_app.filter('timestampToDateString', function () {
    return function (timestamp) {
        const date = new Date(timestamp * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        return day + '/' + month + '/' + year;
    };
});

travel_app.filter('calculatePreviousDate', function () {
    return function (timestamp, days) {
        if (!timestamp) {
            return null;
        }

        const date = new Date(timestamp * 1000);

        date.setDate(date.getDate() - days);

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return day + '/' + month + '/' + year;
    };
});

travel_app.filter('vietnameseDateTime', function () {
    return function (isoDateTime) {
        const date = new Date(isoDateTime);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };
});

travel_app.filter('formatDate', function () {
    return function (timestamp) {
        if (!timestamp) return '';

        let date = new Date(timestamp);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
    };
});

travel_app.filter('formatTime', function () {
    return function (timestamp) {
        if (!timestamp) return '';

        let date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };
});


travel_app.filter('formatDateTime', function () {
    return function (apiDateTime) {
        const momentObj = moment(apiDateTime, 'YYYYMMDDHHmmss');

        return momentObj.format('DD/MM/YYYY HH:mm:ss');
    };
});

travel_app.filter('timeAgo', function () {
    return function (input) {
        if (input) {
            var seconds = Math.floor((new Date() - new Date(input)) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " năm trước";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " tháng trước";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " ngày trước";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " giờ trước";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " phút trước";
            }
            return Math.floor(seconds) + " giây trước";
        }
        return '';
    };
});

travel_app.filter('convertTime', function () {
    return function (timeArray) {
        if (Array.isArray(timeArray) && timeArray.length === 2) {
            var hours = timeArray[0];
            var minutes = timeArray[1];

            var formattedHours = (hours < 10) ? '0' + hours : hours;
            var formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;

            return formattedHours + ':' + formattedMinutes;
        } else {
            return null;
        }
    };
});

travel_app.filter('calculateDaysAndNights', function () {
    return function (departureDate, arrivalDate) {
        // Chuyển đổi ngày đi và ngày về thành đối tượng Date
        var departure = new Date(departureDate);
        var arrival = new Date(arrivalDate);

        // Tính toán số milliseconds giữa hai ngày
        var timeDifference = arrival.getTime() - departure.getTime();

        // Tính toán số ngày và số đêm
        var days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        var nights = days - 1;

        return days + " ngày " + nights + " đêm";
    };
});

travel_app.filter('dateWithTimeFormat', function () {
    return function (dateString) {
        let date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        // Định dạng ngày giờ với AM/PM
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Giờ '0' sẽ được hiểu là '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;

        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
        let year = date.getFullYear();

        return day + '/' + month + '/' + year + ' ' + strTime;
    };
});

travel_app.filter('vietnameseDate', function () {
    return function (isoDateTime) {
        const date = new Date(isoDateTime);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };
});