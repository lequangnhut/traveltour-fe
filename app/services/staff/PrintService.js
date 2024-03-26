travel_app.service('PrintService', ['$window', '$filter', '$timeout', function ($window, $filter, $timeout) {
    this.print = (invoices) => {
        let windowFeatures = 'left=300,right=200,top=100,toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,width=900,height=600';
        let printWindow = $window.open('', '', windowFeatures);

        let formattedDate = $filter('vietnameseDate')(invoices.dateCreated);
        let formattedTotal = $filter('vnCurrency')(invoices.bookingToursByBookingTourId.orderTotal);
        let calculateDaysAndNights = $filter('calculateDaysAndNights')(invoices.tourDetailsByTourDetailId.departureDate, invoices.tourDetailsByTourDetailId.arrivalDate);

        printWindow.document.open();
        printWindow.document.write(`<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css?family=OpenSans:400,600,700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
            <style>
              .invoice-bg {
                background: #fff;
              }
              .faded-logo {
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.3;
                max-width: 50%;
              }
              .text-travel-tour {
                position: fixed;
                width: 100%;
                top: 30%;
                bottom: 50%;
                opacity: 0.1;
                font-size: 18.5vw;
                transform: rotate(-20deg);
                font-weight: 700;
              }
            
            </style>
            </head>
            <body class="invoice-bg font-sans antialiased">
            <div class="max-w-2xl mx-auto py-10 px-6">
            <div class="text-travel-tour">
            TravelTour
            </div>
             <img src="/assets/admin/assets/img/logos/logo.png" alt="Faded Company Logo" class="faded-logo">
              <!-- Header -->
              <header class="flex justify-between items-center pb-8">
                <div>
                  <h1 class="text-1xl font-bold">HÓA ĐƠN</h1>
                  <p class="font-bold">SỐ: ${invoices.bookingTourId}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">NGÀY PHÁT HÀNH:</p>
                  <p class="font-bold">${formattedDate}</p>
                </div>
              </header>

              <!-- Address -->
              <div class="flex mb-10">
                  <div class="grow h-14">
                    <p class="font-bold mb-2">Thông tin cá nhân</p>
                    <p><span class="font-medium">Họ và tên: </span>${invoices.bookingToursByBookingTourId.customerName}</p>
                    <p><span class="font-medium">Số điện thoại: </span>${invoices.bookingToursByBookingTourId.customerPhone}</p>
                        <p><span class="font-medium">Email: </span>${invoices.bookingToursByBookingTourId.customerEmail}</p>
                  </div>
                  <div class="grow-0 h-14"></div>
                  <div class="grow h-14 text-right">
                    <p class="font-bold mb-2">Thông tin vé</p>
                    <p><span class="font-medium">Đi từ: </span>${invoices.tourDetailsByTourDetailId.fromLocation} - ${invoices.tourDetailsByTourDetailId.toLocation}</p>
                    <p><span class="font-medium">Ngày đi dự kiến: </span>${$filter('vietnameseDate')(invoices.tourDetailsByTourDetailId.departureDate)}</p>
                    <p><span class="font-medium">Thời gian: </span>${calculateDaysAndNights}</p>
                  </div>
               </div>
               <div class="py-5"> </div>
              <!-- Invoice Details -->
              <div class="bg-white shadow-lg rounded-md overflow-hidden mb-3">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-100">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TÊN TOUR
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SL
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ĐƠN GiÁ
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TỔNG
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <!-- Items -->
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoices.tourDetailsByTourDetailId.toursByTourId.tourName}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedTotal}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedTotal}</td>
                    </tr>

                    <tr>
                      <td colspan="4" class="text-right px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TỔNG CỘNG</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${formattedTotal}</td>
                    </tr>
                  </tbody>
                </table>

              </div>
              <p style="font-size:small; font-style: italic; margin: 0 0 8px 0;" align="right">
                 Thuế VAT đã bao gồm trong đơn giá
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="custom-table">
                 <tr>
                    <td style="font-size:small; font-weight: bolder;text-align: center; width:45%">
                       Người mua
                    </td>
                    <td style="font-size:small; font-weight: bolder;text-align: center;width:10%"></td>
                    <td style="font-size:small; font-weight: bolder;text-align: center;width:45%">
                        Người bán
                    </td>
                 </tr>
                 <tr>
                     <td style="font-size:small;text-align: center; width:45%"></td>
                      <td style="font-size:small;text-align: center;width:10%"></td>
                      <td style="font-size:small;text-align: center;width:45%">
                      <div class="text-center d-flex juss">
                         <img src="https://i.imgur.com/V3ceaiz.png" width="40%" alt="stamp" class="stamp m-auto"><br>
                      </div>
                       </td>
                 </tr>
                    <tr style="text-align: center;">
                    <td style="font-size:small;text-align: center; width:45%">${invoices.bookingToursByBookingTourId.customerName}
                    </td>
                    <td style="font-size:small;text-align: center;width:10%"></td>
                    <td style="font-size:small;text-align: center;width:45%">Công ty TNHH TravelTour
                    </td>
                    </tr>
                    </table>
                    <p class="separator" style="; border-bottom:2px solid #706f6f; font-size:0;
                    margin: 10px 0 10px 0; line-height: 0;">&nbsp;</p>
                    <p class="mt-2 mb-3" style="font-style: italic; font-size: 12px; margin: 0"><span
                    class="text-danger mt-3" style="font-weight: bolder"> (*):</span> Mời bạn quét mã QR
                    để nhận thêm thông tin đơn hàng!</p>
                    <p style="margin:0;padding:0;line-height:1.6; text-align: center; font-size: 14px;">
                    Tin nhắn này được gửi từ <a>Travel Tour</a>.
                    </p>
                    <p style="margin:0;padding:2px 0 2px 0; text-align: center; line-height:1.6;font-size: 14px;">
                    Nếu có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi.
                    </p>

              <!-- Note and Footer -->
              <footer class="mt-10">
              <div class="flex flex-row">
                  <div class="basis-1/2">
                  <div class="text-sm">
                  <p class="font-medium">DỊCH VỤ DU LỊCHTRAVEL TOUR</p>
                  <p> Mã số thuế:0111258963</p>
                  <p> Điện thoại:0978.963.369</p>
                  <p> Số tài khoản: 0691000358964136 (VietinBank)</p>
                  <p> Địa chỉ: 17 Lê Lai, phường 4, quận 10, TP.HCM</p>
                </div>
                   </div>
                  <div class="basis-1/4"></div>
                  <div class="basis-1/4">
                     <qr id="codeQr" class="text-center mt-2" text="${invoices.bookingTourId}" size="190" correction-level="'M'" input-mode="'ALPHA_NUM'"></qr>
                  </div>
                </div>

                <div class="text-center mt-6">
                  <p class="font-bold text-lg">CẢM ƠN BẠN ĐÃ CHỌN TRAVEL TOUR!</p>
                </div>
              </footer>
            </div>
            </body>
            </html>`);

        printWindow.document.close();

        printWindow.onload = function () {
            setTimeout(function () {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
    };
}]);


