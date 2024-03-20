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

        return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    };
});

travel_app.filter('formatHoursLeft', function() {
    return function(timestamp) {
        if (!timestamp) return '';

        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Tháng trong JavaScript được đánh số từ 0 đến 11, nên cần cộng thêm 1
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        var formattedYear = year;
        var formattedMonth = (month < 10 ? '0' : '') + month;
        var formattedDay = (day < 10 ? '0' : '') + day;
        var formattedHours = (hours < 10 ? '0' : '') + hours;
        var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;

        return formattedHours + ':' + formattedMinutes + ' ' + formattedDay + '/' + formattedMonth + '/' + formattedYear;
    };
});

travel_app.filter('formatHoursRight', function() {
    return function(timestamp) {
        if (!timestamp) return '';

        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Tháng trong JavaScript được đánh số từ 0 đến 11, nên cần cộng thêm 1
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        var formattedYear = year;
        var formattedMonth = (month < 10 ? '0' : '') + month;
        var formattedDay = (day < 10 ? '0' : '') + day;
        var formattedHours = (hours < 10 ? '0' : '') + hours;
        var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;

        return formattedDay + '/' + formattedMonth + '/' + formattedYear + ' ' + formattedHours + ':' + formattedMinutes;
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

travel_app.filter('statusOnlineUser', function () {
    return function (input) {
        if (input) {
            var seconds = Math.floor((new Date() - new Date(input)) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return "Truy cập " + interval + " năm trước";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return "Truy cập " + interval + " tháng trước";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return "Truy cập " + interval + " ngày trước";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return "Truy cập " + interval + " giờ trước";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return "Truy cập " + interval + " phút trước";
            }
            return "Truy cập " + Math.floor(seconds) + " giây trước";
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
        const departure = new Date(departureDate);
        const arrival = new Date(arrivalDate);

        const timeDifference = arrival.getTime() - departure.getTime();

        const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        const nights = days - 1;

        if (days === 1) {
            return days + " ngày";
        } else {
            return days + " ngày " + nights + " đêm";
        }
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

travel_app.filter('averageTime', function () {
    return function (departureTime, arrivalTime) {
        // Tính số mili giây giữa hai thời điểm
        let difference = Math.abs(arrivalTime - departureTime);

        // Chuyển đổi thành giờ và phút
        let hours = Math.floor(difference / 3600000); // 1 giờ = 3600000 mili giây
        let minutes = Math.floor((difference % 3600000) / 60000); // 1 phút = 60000 mili giây

        // Tạo chuỗi kết quả
        let result = '';

        if (hours > 0) {
            result += hours + 'h';
        }

        result += minutes + 'p';

        return result;
    };
});
