travel_app.controller('StatisticalTransportControllerAG', function ($scope,$filter, StatisticalTransportServiceAG, LocalStorageService) {
    $scope.yearForTheChartColumn = new Date().getFullYear();
    $scope.yearForTheChartHorizontalColumn = new Date().getFullYear();
    $scope.yearForPieChart = new Date().getFullYear();

    const transportId = LocalStorageService.get('brandId');

    StatisticalTransportServiceAG.findAllOrderTransportYear().then((repo) => {
        $scope.selectYearList = repo.data.data;
    }).catch((err) => {
        console.error(err);
    })

    async function fetchStatisticalBookingTransportData(year, transportId) {
        try {
            const response = await StatisticalTransportServiceAG.findStatisticalBookingTransport(year, transportId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchStatisticalTransportBrandData(year, transportId) {
        try {
            const response = await StatisticalTransportServiceAG.statisticalTransportBrand(year, transportId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchTransportRevenueStatisticsData(year, transportId) {
        try {
            const response = await StatisticalTransportServiceAG.findTransportRevenueStatistics(year, transportId);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const initCharts = async () => {
        try {
            const [statisticalBookingTransportData, statisticalTransportBrandData, transportRevenueStatisticsData] = await Promise.all([
                fetchStatisticalBookingTransportData($scope.yearForPieChart, transportId),
                fetchStatisticalTransportBrandData($scope.yearForTheChartHorizontalColumn, transportId),
                fetchTransportRevenueStatisticsData($scope.yearForTheChartColumn, transportId)
            ]);
            projectionVsActualChartInit(transportRevenueStatisticsData);
            horizontalBarChartInit(statisticalTransportBrandData);
            pieChartInit(statisticalBookingTransportData);
        } catch (error) {
            console.error(error);
        }
    };

    const updateColumnChart = async () => {
        try {
            const data = await fetchTransportRevenueStatisticsData($scope.yearForTheChartColumn, transportId);
            projectionVsActualChartInit(data);
        } catch (error) {
            console.error(error);
        }
    }

    const updatedHorizontalBarChart = async () => {
        try {
            const data = await fetchStatisticalTransportBrandData($scope.yearForTheChartHorizontalColumn, transportId);
            horizontalBarChartInit(data);
        } catch (error) {
            console.error(error);
        }
    }
    const updatedPieChart = async () => {
        try {
            const data = await fetchStatisticalBookingTransportData($scope.yearForPieChart, transportId);
            pieChartInit(data);
        } catch (error) {
            console.error(error);
        }
    }

    const {merge: merge} = window._;
    const echartSetOption = (e, t, o, n) => {
        const {breakpoints: r, resize: a} = window.phoenix.utils, s = t => {
            Object.keys(t).forEach((o => {
                window.innerWidth > r[o] && e.setOption(t[o]);
            }));
        }, i = document.body;
        e.setOption(merge(o(), t));
        const c = document.querySelector(".navbar-vertical-toggle");
        c && c.addEventListener("navbar.vertical.toggle", (() => {
            e.resize(), n && s(n);
        })), a((() => {
            e.resize(), n && s(n);
        })), n && s(n), i.addEventListener("clickControl", (({detail: {control: n}}) => {
            "phoenixTheme" === n && e.setOption(window._.merge(o(), t));
        }));
    };

    function formatNumberWithMillion(value) {
        const millions = value / 1000000; // Chia cho 1 triệu
        const formatted = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 1 // Số lượng số thập phân tối đa là 1
        }).format(millions);
        return `${formatted} Tr`; // Thêm đơn vị Triệu
    }

    const tooltipFormatter = (params) => {
        let tooltipItem = ``;
        params.forEach(el => {
            tooltipItem += `<div class='ms-1'>
       <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${
                el.borderColor ? el.borderColor : el.color
            }"></span>
          ${el.seriesName} : ${$filter('vnCurrency')(("object" == typeof el.value ? el.value[1] : el.value))}
        </h6>
      </div>`;
        });
        return `<div>
            <p class='mb-2 text-600'> Tháng
              ${parseInt(params[0].axisValue.replace("T", ""))}
            </p>
            ${tooltipItem}
          </div>`;
    };

    const projectionVsActualChartInit = async (response) => {
        const {getColor, getData} = window.phoenix.utils;
        const $projectionVsActualChartEl = document.querySelector('.echart-projection-actual');

        if ($projectionVsActualChartEl) {
            const userOptions = getData($projectionVsActualChartEl, 'echarts');
            const chart = window.echarts.init($projectionVsActualChartEl);

            let currentYearData = response.revenue === undefined ? new Array(12).fill(0) : response.revenue;
            let previousYearData = response.lastYearRevenue === undefined ? new Array(12).fill(0) : response.lastYearRevenue;

            const getDefaultOptions = () => ({
                color: [getColor('primary'), getColor('gray-300')],
                tooltip: {
                    trigger: 'axis',
                    padding: [7, 10],
                    backgroundColor: getColor('gray-100'),
                    borderColor: getColor('gray-300'),
                    textStyle: {color: getColor('dark')},
                    borderWidth: 1,
                    transitionDuration: 0,
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: params => tooltipFormatter(params)
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: getColor('gray-800'),
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 12.8
                    },
                    data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                    axisLine: {
                        lineStyle: {
                            color: getColor('gray-300')
                        }
                    },
                    axisTick: false
                },
                yAxis: {
                    axisPointer: {type: 'none'},
                    axisTick: 'none',
                    splitLine: {
                        interval: 5,
                        lineStyle: {
                            color: getColor('gray-200')
                        }
                    },
                    axisLine: {show: false},
                    axisLabel: {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 13.8,
                        color: getColor('gray-800'),
                        margin: 20,
                        verticalAlign: 'bottom',
                        formatter: function (value) {
                            return formatNumberWithMillion(value);
                        },
                    }
                },
                series: [
                    {
                        name: `${$scope.year - 1}`,
                        type: 'bar',
                        barWidth: '6px',
                        data: previousYearData,
                        barGap: '30%',
                        label: {show: false},
                        itemStyle: {
                            borderRadius: [2, 2, 0, 0],
                            color: getColor('info-200')
                        }
                    },
                    {
                        name: `${$scope.year}`,
                        type: 'bar',
                        data: currentYearData,
                        barWidth: '6px',
                        barGap: '30%',
                        label: {show: false},
                        z: 10,
                        itemStyle: {
                            borderRadius: [2, 2, 0, 0],
                            color: getColor('primary')
                        }
                    }
                ],
                grid: {
                    right: 0,
                    left: 3,
                    bottom: 0,
                    top: '7%',
                    containLabel: true
                },
                animation: false
            });

            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    const pieChartInit = (response) => {
        const {getColor, getData, rgbaColor} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-pie-chart-example');

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);

            let pendingPayment = 0;
            let completePayment = 0;
            let cancelTransaction = 0;

            if (response) {
                pendingPayment = response[0]
                completePayment = response[1]
                cancelTransaction = response[2]
            }


            const getDefaultOptions = () => ({
                legend: {
                    left: 12, textStyle: {
                        color: getColor('gray-600')
                    }
                }, series: [{
                    type: 'pie', radius: window.innerWidth < 530 ? '45%' : '60%', label: {
                        color: getColor('gray-700'), formatter: '{b}: {c}%'
                    }, center: ['50%', '55%'], data: [{
                        value: pendingPayment, name: 'Chờ thanh toán', itemStyle: {
                            color: getColor('warning')
                        }
                    }, {
                        value: completePayment, name: 'Đã thanh toán', itemStyle: {
                            color: getColor('success')
                        }
                    }, {
                        value: cancelTransaction, name: 'Hủy giao dịch', itemStyle: {
                            color: getColor('danger')
                        }
                    },], emphasis: {
                        itemStyle: {
                            shadowBlur: 20, shadowOffsetX: 0, shadowColor: rgbaColor(getColor('gray-600'), 0.5)
                        }
                    },
                }], tooltip: {
                    trigger: 'item',
                    padding: [10, 15],
                    backgroundColor: '#f8f9fa',
                    borderColor: '#ced4da',
                    borderWidth: 1,
                    textStyle: {
                        color: '#343a40', fontSize: 14, fontWeight: 'bold'
                    },
                    transitionDuration: 0.5,
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        return `<div style="display:flex; align-items:center;">
                                    <div style="width:15px; height:15px; border-radius:50%; background-color:${params.color}; margin-right:8px;"></div>
                                    <div>${params.name}: ${params.value}%</div>
                                </div>`;
                    }
                }

            });

            const responsiveOptions = {
                xs: {
                    series: [{
                        radius: '45%'
                    }]
                }, sm: {
                    series: [{
                        radius: '60%'
                    }]
                }
            };

            echartSetOption(chart, userOptions, getDefaultOptions, responsiveOptions);
        }
    };

    const horizontalBarChartInit = (statisticalTransportBrandData) => {
        const {getColor, getData} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-horizontal-bar-chart');
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const countRoomTypeData = statisticalTransportBrandData.map(item => item.maxAmount);
        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);
            const getDefaultOptions = () => ({
                tooltip: {
                    trigger: 'axis',
                    padding: [7, 10],
                    backgroundColor: getColor('gray-100'),
                    borderColor: getColor('gray-300'),
                    textStyle: {color: getColor('dark')},
                    borderWidth: 1,
                    formatter: function (params) {
                        const dataIndex = params[0].dataIndex;
                        const count = countRoomTypeData[dataIndex];
                        const transportBrand = statisticalTransportBrandData[dataIndex];

                        let tooltipContent = `<div style="max-width: 200px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="margin-bottom: 5px; font-weight: bold;">Tháng ${transportBrand.month}</div>
                            <div style="display:flex; align-items:center; margin-bottom: 5px;">
                                <div style="width:10px; height:10px; border-radius:50%; background-color: #17a2b8; margin-right:8px;"></div>
                                <div style="font-weight: bold;">Số lượng khách: &nbsp;</div>
                                <div> ${count} khách</div>
                            </div>`;

                        if (count !== 0 && transportBrand) {
                            tooltipContent += `<div style="margin-bottom: 5px;">
                                <div style="display:flex; align-items:center;">
                                    <div style="width:10px; height:10px; border-radius:50%; background-color: #17a2b8; margin-right:8px;"></div>
                                    <div style="font-weight: bold;">Điểm đi: &nbsp;</div>
                                    <div>${transportBrand.formLocation}</div>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <div style="width:10px; height:10px; border-radius:50%; background-color: #17a2b8; margin-right:8px;"></div>
                                    <div style="font-weight: bold;">Điểm đến: &nbsp;</div>
                                    <div>${transportBrand.toLocation}</div>
                                </div>
                            </div>`;
                        }
                        tooltipContent += `</div>`;
                        return tooltipContent;
                    },
                    transitionDuration: 0,
                    axisPointer: {
                        type: 'none'
                    }
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: false,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: getColor('gray-300')
                        }
                    },
                    axisTick: {show: true},
                    axisLabel: {
                        color: getColor('gray-500')
                    },
                    splitLine: {
                        show: false
                    },
                    min: 0
                },
                yAxis: {
                    type: 'category',
                    data: months,
                    boundaryGap: true,
                    axisLabel: {
                        formatter: value => value.substring(0, 3),
                        show: true,
                        color: getColor('gray-500'),
                        margin: 15
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: getColor('gray-200')
                        }
                    },
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: getColor('gray-300')
                        }
                    }
                },
                series: [
                    {
                        type: 'bar',
                        name: 'Total',
                        data: countRoomTypeData,
                        lineStyle: {color: getColor('primary')},
                        itemStyle: {
                            color: getColor('primary'),
                            barBorderRadius: [0, 3, 3, 0]
                        },
                        showSymbol: false,
                        symbol: 'circle',
                        smooth: false,
                        hoverAnimation: true
                    }
                ],
                grid: {right: '10%', left: '10%', bottom: '10%', top: '7%'}
            });
            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    $scope.$watch('yearForTheChartColumn', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updateColumnChart();
        }
    });

    $scope.$watch('yearForTheChartHorizontalColumn', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updatedHorizontalBarChart();
        }
    });

    $scope.$watch('yearForPieChart', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updatedPieChart();
        }
    });

    initCharts();

});