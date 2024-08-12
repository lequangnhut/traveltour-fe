travel_app.controller('StatisticalHotelControllerAG', function ($scope, $filter, StatisticalHotelServiceAG, RevenueServiceAD, LocalStorageService) {
    $scope.yearForTheChartHorizontalColumn = new Date().getFullYear();
    $scope.yearForPieChart = new Date().getFullYear();
    $scope.yearForTheChartColumn = new Date().getFullYear();
    $scope.currentYearData = new Array(12).fill(0);
    $scope.previousYearData = new Array(12).fill(0);

    const hotelId = LocalStorageService.get('brandId');

    StatisticalHotelServiceAG.getAllOrderYear().then((repo) => {
        $scope.selectYearOrderHotelList = repo.data.data;
    }).catch((err) => {
        console.error(err);
    })

    async function fetchStatisticalRoomTypeHotelData(year, hotelId) {
        try {
            const response = await StatisticalHotelServiceAG.statisticalRoomTypeHotel(year, hotelId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchPercentageData(year, hotelId) {
        try {
            const response = await StatisticalHotelServiceAG.statisticalBookingHotel(year, hotelId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchRevenueData(year, hotelId) {
        try {
            const response = await StatisticalHotelServiceAG.getHotelRevenueStatistics(year, hotelId);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const initCharts = async () => {
        try {
            const [statisticalRoomTypeHotelData, percentageData, revenueData] = await Promise.all([
                fetchStatisticalRoomTypeHotelData($scope.yearForTheChartHorizontalColumn, hotelId),
                fetchPercentageData($scope.yearForPieChart, hotelId),
                fetchRevenueData($scope.yearForTheChartColumn, hotelId)
            ]);

            $scope.currentYearData = revenueData.revenue;
            $scope.previousYearData = revenueData.lastYearRevenue;

            if (statisticalRoomTypeHotelData && statisticalRoomTypeHotelData.length > 0) {
                console.log(statisticalRoomTypeHotelData);
                horizontalBarChartInit(statisticalRoomTypeHotelData);
            }

            if ($scope.currentYearData.length > 0 && $scope.previousYearData.length > 0) {
                projectionVsActualChartInit($scope.currentYearData, $scope.previousYearData);
            }
            pieChartInit(percentageData);
        } catch (error) {
            console.error(error);
        }
    };

    const updateHorizontalColumnChart = async () => {
        try {
            const revenueData = await fetchStatisticalRoomTypeHotelData($scope.yearForTheChartHorizontalColumn, hotelId);

            if (revenueData.length > 0) {
                horizontalBarChartInit(revenueData);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const updateColumnChart = async () => {
        try {
            const revenueData = await fetchRevenueData($scope.yearForTheChartColumn, hotelId);
            $scope.currentYearData = revenueData.revenue;
            $scope.previousYearData = revenueData.lastYearRevenue;

            if ($scope.currentYearData.length > 0 && $scope.previousYearData.length > 0) {
                projectionVsActualChartInit($scope.currentYearData, $scope.previousYearData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updatedPieChart = async () => {
        try {
            const percentageData = await fetchPercentageData($scope.yearForPieChart, hotelId);
            pieChartInit(percentageData);
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

    function formatNumberWithK(value) {
        const thousands = value / 1000;
        const formatted = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
        }).format(thousands);
        return `${formatted} k`;
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

    const projectionVsActualChartInit = async (currentYearData, previousYearData) => {
        const {getColor, getData} = window.phoenix.utils;
        const $projectionVsActualChartEl = document.querySelector('.echart-projection-actual');

        if ($projectionVsActualChartEl) {
            const userOptions = getData($projectionVsActualChartEl, 'echarts');
            const chart = window.echarts.init($projectionVsActualChartEl);

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
                            return formatNumberWithK(value);
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
                    top: '15%',
                    containLabel: true
                },
                animation: false
            });

            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    const pieChartInit = (percentageData) => {
        const {getColor, getData, rgbaColor} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-pie-chart-example');

        if (!percentageData || percentageData.length <= 0) {
            percentageData = new Array(6).fill(0);
        }

        if ($chartEl) {
            const userOptions = getData($chartEl, 'echarts');
            const chart = window.echarts.init($chartEl);
            const getDefaultOptions = () => ({
                legend: {
                    left: 12,
                    textStyle: {
                        color: getColor('gray-600')
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: window.innerWidth < 530 ? '45%' : '60%',
                        label: {
                            color: getColor('gray-700'),
                            formatter: '{b}: {c}%'
                        },
                        center: ['50%', '55%'],
                        data: [
                            {
                                value: percentageData[0],
                                name: 'Chưa thanh toán',
                                itemStyle: {
                                    color: '#FFD700'
                                }
                            },
                            {
                                value: percentageData[1],
                                name: 'Chờ xác nhận',
                                itemStyle: {
                                    color: '#6495ED'
                                }
                            },
                            {
                                value: percentageData[2],
                                name: 'Đã xác nhận',
                                itemStyle: {
                                    color: '#00FF00'
                                }
                            },
                            {
                                value: percentageData[3],
                                name: 'Hoàn thành',
                                itemStyle: {
                                    color: '#008000'
                                }
                            },
                            {
                                value: percentageData[4],
                                name: 'Khách hủy',
                                itemStyle: {
                                    color: '#FF0000'
                                }
                            },
                            {
                                value: percentageData[5],
                                name: 'Tôi hủy',
                                itemStyle: {
                                    color: '#800080'
                                }
                            },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 20,
                                shadowOffsetX: 0,
                                shadowColor: rgbaColor(getColor('gray-600'), 0.5)
                            }
                        },
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    padding: [10, 15],
                    backgroundColor: '#f8f9fa',
                    borderColor: '#ced4da',
                    borderWidth: 1,
                    textStyle: {
                        color: '#343a40',
                        fontSize: 14,
                        fontWeight: 'bold'
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
                    series: [
                        {
                            radius: '45%'
                        }
                    ]
                },
                sm: {
                    series: [
                        {
                            radius: '60%'
                        }
                    ]
                }
            };

            echartSetOption(chart, userOptions, getDefaultOptions, responsiveOptions);
        }
    };

    const horizontalBarChartInit = (statisticalRoomTypeHotelData) => {
        const {getColor, getData} = window.phoenix.utils;
        const $chartEl = document.querySelector('.echart-horizontal-bar-chart');
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const countRoomTypeData = statisticalRoomTypeHotelData.map(item => item.countRoomType);
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
                        const roomType = statisticalRoomTypeHotelData[dataIndex];

                        let tooltipContent = `<div style="max-width: 200px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="margin-bottom: 5px; font-weight: bold;">Tháng ${roomType.month}</div>
                            <div style="display:flex; align-items:center; margin-bottom: 5px;">
                                <div style="width:10px; height:10px; border-radius:50%; background-color: #17a2b8; margin-right:8px;"></div>
                                <div style="font-weight: bold;">Số lượng đặt: &nbsp;</div>
                                <div> ${count} đơn</div>
                            </div>`;

                        if (count !== 0 && roomType) {
                            tooltipContent += `<div style="margin-bottom: 5px;">
                                <div style="display:flex; align-items:center;">
                                    <div style="width:10px; height:10px; border-radius:50%; background-color: #17a2b8; margin-right:8px;"></div>
                                    <div style="font-weight: bold;">ID phòng: &nbsp;</div>
                                    <div>${roomType.id}</div>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <div style="width:10px; height:10px; border-radius:50%; background-color: #17a2b8; margin-right:8px;"></div>
                                    <div style="font-weight: bold;">Tên phòng: &nbsp;</div>
                                    <div>${roomType.roomTypeName}</div>
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
                grid: {right: '3%', left: '10%', bottom: '10%', top: '0%'}
            });
            echartSetOption(chart, userOptions, getDefaultOptions);
        }
    };

    $scope.$watch('yearForTheChartHorizontalColumn', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updateHorizontalColumnChart();
        }
    });

    $scope.$watch('yearForTheChartColumn', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updateColumnChart();
        }
    });

    $scope.$watch('yearForPieChart', async (newValue, oldValue) => {
        if (newValue !== oldValue) {
            updatedPieChart();
        }
    });

    const {docReady: docReady} = window.phoenix.utils;
    docReady(() => {
        initCharts();
    });

});