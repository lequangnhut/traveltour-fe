function toastAlert(type, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: type, title: message
    })
}

function centerAlert(text, message, type) {
    Swal.fire(
        text,
        message,
        type
    )
}

function confirmAlert(text, callback) {
    Swal.fire({
        title: "Xác nhận !",
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý !",
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}
