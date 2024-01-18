travel_app.controller('ChartControllerAD', function ($scope, $rootScope, $timeout) {

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
    const echartTabs = document.querySelectorAll("[data-tab-has-echarts]");
    echartTabs && echartTabs.forEach((e => {
        e.addEventListener("shown.bs.tab", (e => {
            const t = e.target, {hash: o} = t, n = o || t.dataset.bsTarget,
                r = document.getElementById(n.substring(1))?.querySelector("[data-echart-tab]");
            r && window.echarts.init(r).resize();
        }));
    }));

    const emailCampaignReportsChartInit = () => {
        const {getColor: t, getData: a, toggleColor: e} = window.phoenix.utils,
            r = document.querySelector(".echart-email-campaign-report"), o = (t, a = "MMM DD") => {
                const e = t[1],
                    r = `<div class='ms-1'>\n          <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${e.borderColor ? e.borderColor : e.color}"></span>\n            ${e.axisValue} : ${"object" == typeof e.value ? e.value[1] : e.value}\n          </h6>\n        </div>`;
                return `<div>\n              <p class='mb-2 text-600'>\n                ${e.seriesName}\n              </p>\n              ${r}\n            </div>`
            }, i = [0, 1466, 966, 0], l = [{value: 2832, itemStyle: {color: t("primary-300")}}, 1366, 500, 966];
        if (r) {
            const s = a(r, "echarts"), n = echarts.init(r);
            echartSetOption(n, s, (() => ({
                color: [t("primary"), t("gray-300")],
                tooltip: {
                    trigger: "axis",
                    padding: [7, 10],
                    backgroundColor: t("gray-100"),
                    borderColor: t("gray-300"),
                    textStyle: {color: t("dark")},
                    borderWidth: 1,
                    transitionDuration: 0,
                    axisPointer: {type: "none"},
                    formatter: o
                },
                xAxis: {
                    type: "category",
                    data: ["Total Emails", "Sent", "Bounce", "Delivered"],
                    splitLine: {show: !1},
                    axisLabel: {
                        color: t("gray-900"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 400,
                        fontSize: 12.8,
                        margin: 24,
                        rotate: 30
                    },
                    axisLine: {show: !0, lineStyle: {color: t("gray-300")}},
                    axisTick: !1
                },
                yAxis: {
                    type: "value",
                    splitLine: {lineStyle: {color: t("gray-200")}},
                    axisLabel: {
                        color: t("gray-900"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 700,
                        fontSize: 12.8,
                        margin: 24
                    },
                    interval: 500
                },
                series: [{
                    name: "Placeholder",
                    type: "bar",
                    barWidth: "64px",
                    stack: "Total",
                    backgroundColor: t("white"),
                    label: {show: !1},
                    itemStyle: {borderColor: "transparent", color: "transparent"},
                    emphasis: {itemStyle: {borderColor: "transparent", color: "transparent"}},
                    data: i
                }, {
                    name: "Email Campaign",
                    type: "bar",
                    stack: "Total",
                    itemStyle: {color: t("primary-200")},
                    data: l,
                    label: {
                        show: !0,
                        position: "inside",
                        color: e(t("gray-1100"), t("gray-200")),
                        fontWeight: "normal",
                        fontSize: "12.8px",
                        formatter: t => `${t.value.toLocaleString()}`
                    }
                }],
                grid: {right: "0", left: 6, bottom: 10, top: "5%", containLabel: !0},
                animation: !1
            })), {
                xs: {
                    series: [{barWidth: "48px"}],
                    xAxis: {axisLabel: {show: !0, formatter: t => `${t.slice(0, 5)}...`}}
                },
                sm: {
                    series: [{barWidth: "64px"}],
                    xAxis: {axisLabel: {show: !0, formatter: t => `${t.slice(0, 11)}`, rotate: 0}}
                },
                md: {series: [{barWidth: "56px"}], xAxis: {axisLabel: {show: !1}}},
                lg: {series: [{barWidth: "64px"}], xAxis: {axisLabel: {show: !0, formatter: t => `${t.slice(0, 11)}`}}}
            });
        }
    };

    const socialMarketingRadarChartInit = () => {
        const {getColor: a, getData: e, rgbaColor: r, toggleColor: t} = window.phoenix.utils,
            o = document.querySelector(".echart-social-marketing-radar");
        if (o) {
            const i = e(o, "echarts"), n = echarts.init(o);
            echartSetOption(n, i, (() => ({
                color: [a("primary-300"), a("warning-300")],
                tooltip: {
                    trigger: "item",
                    padding: [7, 10],
                    backgroundColor: a("gray-100"),
                    borderColor: a("gray-300"),
                    textStyle: {color: a("gray-900"), fontSize: 12.8, fontFamily: "Nunito Sans"},
                    borderWidth: 1,
                    transitionDuration: 0
                },
                radar: {
                    splitNumber: 5,
                    axisNameGap: 10,
                    radius: "87%",
                    splitLine: {lineStyle: {color: a("gray-200")}},
                    splitArea: {
                        show: !0,
                        areaStyle: {
                            shadowBlur: .5,
                            color: [t(a("gray-100"), a("gray-100")), t(a("gray-soft"), a("gray-200"))]
                        }
                    },
                    axisLine: {show: !0, lineStyle: {color: a("gray-200")}},
                    name: {textStyle: {color: a("gray-700"), fontWeight: 800, fontSize: 10.2}},
                    indicator: [{name: "SAT", max: 5e3}, {name: "FRI", max: 5e3}, {name: "THU", max: 5e3}, {
                        name: "WED",
                        max: 5e3
                    }, {name: "TUE", max: 5e3}, {name: "MON", max: 5e3}, {name: "SUN", max: 5e3}]
                },
                series: [{
                    name: "Budget vs spending",
                    type: "radar",
                    symbol: "emptyCircle",
                    symbolSize: 6,
                    data: [{
                        value: [2100, 2300, 1600, 3700, 3e3, 2500, 2500],
                        name: "Offline Marketing",
                        itemStyle: {color: a("primary-300")},
                        areaStyle: {color: r(a("primary-300"), .3)}
                    }, {
                        value: [3e3, 1600, 3700, 500, 3700, 3e3, 3200],
                        name: "Online Marketing",
                        areaStyle: {color: r(a("warning-300"), .3)},
                        itemStyle: {color: a("warning-300")}
                    }]
                }],
                grid: {top: 10, left: 0}
            })), {md: {radar: {radius: "74%"}}, xl: {radar: {radius: "85%"}}});
        }
    };

    const salesTrendsChartInit = () => {
        const {getColor: e, getData: t, getPastDates: o, rgbaColor: a, toggleColor: r} = window.phoenix.utils,
            i = document.querySelector(".echart-sales-trends"), n = (e, t = "MMM DD") => {
                let o = "";
                return e.forEach((e => {
                    o += `<div class='ms-1'>\n          <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${e.color}"></span>\n            ${e.seriesName} : ${"object" == typeof e.value ? e.value[1] : e.value}\n          </h6>\n        </div>`;
                })), `<div>\n              <p class='mb-2 text-600'>\n                ${window.dayjs(e[0].axisValue).isValid() ? window.dayjs(e[0].axisValue).format("DD MMM, YYYY") : e[0].axisValue}\n              </p>\n              ${o}\n            </div>`
            }, l = o(7), s = [2e3, 5700, 3700, 5500, 8e3, 4e3, 5500], c = [10500, 9e3, 7e3, 9e3, 10400, 7500, 9300];
        if (i) {
            const o = t(i, "echarts"), d = window.echarts.init(i);
            echartSetOption(d, o, (() => ({
                color: [e("primary-200"), e("information-300")],
                tooltip: {
                    trigger: "axis",
                    padding: [7, 10],
                    backgroundColor: e("gray-100"),
                    borderColor: e("gray-300"),
                    textStyle: {color: e("dark")},
                    borderWidth: 1,
                    transitionDuration: 0,
                    axisPointer: {type: "none"},
                    formatter: n
                },
                xAxis: {
                    type: "category",
                    data: l,
                    axisLabel: {
                        color: e("gray-900"),
                        formatter: e => window.dayjs(e).format("ddd"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 400,
                        fontSize: 12.8,
                        margin: 16
                    },
                    axisLine: {lineStyle: {color: e("gray-200")}},
                    axisTick: !1
                },
                yAxis: {
                    type: "value",
                    splitLine: {lineStyle: {color: e("gray-200")}},
                    axisLabel: {
                        color: e("gray-900"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 700,
                        fontSize: 12.8,
                        margin: 24,
                        formatter: e => e / 1e3 + "k"
                    }
                },
                series: [{
                    name: "Revenue",
                    type: "bar",
                    barWidth: "16px",
                    label: {show: !1},
                    itemStyle: {color: r(e("primary-200"), e("primary")), borderRadius: [4, 4, 0, 0]},
                    data: c
                }, {
                    name: "Profit",
                    type: "line",
                    symbol: "circle",
                    symbolSize: 11,
                    itemStyle: {color: e("information-300"), borderColor: r(e("white"), e("dark")), borderWidth: 2},
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{offset: 0, color: a(e("information-300"), .2)}, {
                                offset: 1,
                                color: a(e("information-300"), .2)
                            }]
                        }
                    },
                    data: s
                }],
                grid: {right: "0", left: "0", bottom: 0, top: 10, containLabel: !0},
                animation: !1
            })));
        }
    };

    const callCampaignChartInit = () => {
        const {getColor: a, getData: o, getPastDates: t, rgbaColor: e} = window.phoenix.utils,
            i = document.querySelector(".echart-call-campaign"), r = (a, o = "MMM DD") => {
                let t = "";
                return a.forEach((a => {
                    t += `<div class='ms-1'>\n          <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${a.color}"></span>\n            ${a.seriesName} : ${"object" == typeof a.value ? a.value[1] : a.value}\n          </h6>\n        </div>`;
                })), `<div>\n              <p class='mb-2 text-600'>\n                ${window.dayjs(a[0].axisValue).isValid() ? window.dayjs(a[0].axisValue).format("DD MMM, YYYY") : a[0].axisValue}\n              </p>\n              ${t}\n            </div>`
            }, l = t(7), n = [8e3, 7700, 5900, 10100, 5100, 6e3, 4300];
        if (i) {
            const t = o(i, "echarts"), s = window.echarts.init(i);
            echartSetOption(s, t, (() => ({
                color: [a("primary-200"), a("information-300")],
                tooltip: {
                    trigger: "axis",
                    padding: [7, 10],
                    backgroundColor: a("gray-100"),
                    borderColor: a("gray-300"),
                    textStyle: {color: a("dark")},
                    borderWidth: 1,
                    transitionDuration: 0,
                    axisPointer: {type: "none"},
                    formatter: r
                },
                xAxis: [{
                    type: "category",
                    data: l,
                    boundaryGap: !1,
                    splitLine: {show: !0, lineStyle: {color: a("gray-200")}},
                    axisLabel: {
                        color: a("gray-900"),
                        showMaxLabel: !1,
                        showMinLabel: !0,
                        align: "left",
                        formatter: a => window.dayjs(a).format("ddd"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 400,
                        fontSize: 12.8,
                        margin: 16
                    },
                    axisLine: {lineStyle: {color: a("gray-200")}},
                    axisTick: !1
                }, {
                    type: "category",
                    data: l,
                    boundaryGap: !1,
                    splitLine: {show: !0, lineStyle: {color: a("gray-200")}},
                    axisLabel: {
                        color: a("gray-900"),
                        interval: 130,
                        showMaxLabel: !0,
                        showMinLabel: !1,
                        align: "right",
                        formatter: a => window.dayjs(a).format("ddd"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 400,
                        fontSize: 12.8,
                        margin: 16
                    },
                    position: "bottom",
                    axisLine: {lineStyle: {color: a("gray-200")}},
                    axisTick: !1
                }],
                yAxis: {
                    type: "value",
                    axisLine: {lineStyle: {color: a("gray-200")}},
                    splitLine: {lineStyle: {color: a("gray-200")}},
                    axisLabel: {
                        color: a("gray-900"),
                        fontFamily: "Nunito Sans",
                        fontWeight: 700,
                        fontSize: 12.8,
                        margin: 16,
                        formatter: a => a / 1e3 + "k"
                    }
                },
                series: [{
                    name: "Campaign",
                    type: "line",
                    smooth: .4,
                    symbolSize: 11,
                    itemStyle: {color: a("primary")},
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{offset: 0, color: e(a("primary-300"), .2)}, {
                                offset: 1,
                                color: e(a("primary-300"), .2)
                            }]
                        }
                    },
                    data: n
                }],
                grid: {right: "8", left: 6, bottom: "-10", top: 10, containLabel: !0},
                animation: !1
            })), {
                xs: {xAxis: [{}, {axisLabel: {showMaxLabel: !1}}]},
                sm: {xAxis: [{}, {axisLabel: {showMaxLabel: !0}}]}
            });
        }
    };

    const camelize = e => {
        const t = e.replace(/[-_\s.]+(.)?/g, ((e, t) => t ? t.toUpperCase() : ""));
        return `${t.substr(0, 1).toLowerCase()}${t.substr(1)}`
    };
    const getData = (e, t) => {
        try {
            return JSON.parse(e.dataset[camelize(t)])
        } catch (o) {
            return e.dataset[camelize(t)]
        }
    };

    const renderCalendar = (e, t) => {
        const {merge: r} = window._, a = r({
            initialView: "dayGridMonth",
            editable: !0,
            direction: document.querySelector("html").getAttribute("dir"),
            headerToolbar: {left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay"},
            buttonText: {month: "Month", week: "Week", day: "Day"}
        }, t), n = new window.FullCalendar.Calendar(e, a);
        return n.render(), document.querySelector(".navbar-vertical-toggle")?.addEventListener("navbar.vertical.toggle", (() => n.updateSize())), n
    };
    const fullCalendarInit = () => {
        const {getData: e} = window.phoenix.utils;
        document.querySelectorAll("[data-calendar]").forEach((t => {
            const r = e(t, "calendar");
            renderCalendar(t, r);
        }));
    };
    const fullCalendar = {renderCalendar: renderCalendar, fullCalendarInit: fullCalendarInit};

    const {dayjs: dayjs} = window, currentDay = dayjs && dayjs().format("DD"),
        currentMonth = dayjs && dayjs().format("MM"), prevMonth = dayjs && dayjs().subtract(1, "month").format("MM"),
        nextMonth = dayjs && dayjs().add(1, "month").format("MM"), currentYear = dayjs && dayjs().format("YYYY"),
        events = [{
            title: "Boot Camp",
            start: `${currentYear}-${currentMonth}-01 10:00:00`,
            end: `${currentYear}-${currentMonth}-03 16:00:00`,
            description: "Boston Harbor Now in partnership with the Friends of Christopher Columbus Park, the Wharf District Council and the City of Boston is proud to announce the New Year's Eve Midnight Harbor Fireworks! This beloved nearly 40-year old tradition is made possible by the generous support of local waterfront organizations and businesses and the support of the City of Boston and the Office of Mayor Marty Walsh.",
            className: "text-success",
            location: "Boston Harborwalk, Christopher Columbus Park, <br /> Boston, MA 02109, United States",
            organizer: "Boston Harbor Now"
        }, {
            title: "Crain's New York Business ",
            start: `${currentYear}-${currentMonth}-11`,
            description: "Crain's 2020 Hall of Fame. Sponsored Content By Crain's Content Studio. Crain's Content Studio Presents: New Jersey: Perfect for Business. Crain's Business Forum: Letitia James, New York State Attorney General. Crain's NYC Summit: Examining racial disparities during the pandemic",
            className: "text-primary"
        }, {
            title: "Conference",
            start: `${currentYear}-${currentMonth}-${currentDay}`,
            description: "The Milken Institute Global Conference gathered the best minds in the world to tackle some of its most stubborn challenges. It was a unique experience in which individuals with the power to enact change connected with experts who are reinventing health, technology, philanthropy, industry, and media.",
            className: "text-success",
            schedules: [{
                title: "Reporting",
                start: `${currentYear}-${currentMonth}-${currentDay} 11:00:00`,
                description: "Time to start the conference and will briefly describe all information about the event.  ",
                className: "text-success "
            }, {
                title: "Lunch",
                start: `${currentYear}-${currentMonth}-${currentDay} 14:00:00`,
                description: "Lunch facility for all the attendance in the conference.",
                className: "text-information"
            }, {
                title: "Contest",
                start: `${currentYear}-${currentMonth}-${currentDay} 16:00:00`,
                description: "The starting of the programming contest",
                className: "text-success"
            }, {
                title: "Dinner",
                start: `${currentYear}-${currentMonth}-${currentDay} 22:00:00`,
                description: "Dinner facility for all the attendance in the conference",
                className: "text-success"
            }]
        }, {
            title: `ICT Expo ${currentYear} - Product Release`,
            start: `${currentYear}-${currentMonth}-16 10:00:00`,
            description: `ICT Expo ${currentYear} is the largest private-sector exposition aimed at showcasing IT and ITES products and services in Switzerland.`,
            end: `${currentYear}-${currentMonth}-18 16:00:00`,
            className: "text-warning",
            allDay: !0
        }, {
            title: "Meeting",
            start: `${currentYear}-${currentMonth}-07 10:00:00`,
            description: "Discuss about the upcoming projects in current year and assign all tasks to the individuals",
            className: "text-information"
        }, {
            title: "Contest",
            start: `${currentYear}-${currentMonth}-14 10:00:00`,
            className: "text-information",
            description: "PeaceX is an international peace and amity organisation that aims at casting a pall at the striking issues surmounting the development of peoples and is committed to impacting the lives of young people all over the world."
        }, {
            title: "Event With Url",
            start: `${currentYear}-${currentMonth}-23`,
            description: "Sample example of a event with url. Click the event, will redirect to the given link.",
            className: "text-success",
            url: "http://google.com"
        }, {
            title: "Competition",
            start: `${currentYear}-${currentMonth}-26`,
            description: "The Future of Zambia – Top 30 Under 30 is an annual award, ranking scheme, and recognition platform for young Zambian achievers under the age of 30, who are building brands, creating jobs, changing the game, and transforming the country.",
            className: "text-danger"
        }, {
            title: "Birthday Party",
            start: `${currentYear}-${nextMonth}-05`,
            description: "Will celebrate birthday party with my friends and family",
            className: "text-primary"
        }, {
            title: "Click for Google",
            url: "http://google.com/",
            start: `${currentYear}-${prevMonth}-10`,
            description: "Applications are open for the New Media Writing Prize 2020. The New Media Writing Prize (NMWP) showcases exciting and inventive stories and poetry that integrate a variety of formats, platforms, and digital media.",
            className: "text-primary"
        }];

    const getTemplate = n => `\n<div class="modal-header ps-card border-bottom">\n  <div>\n    <h4 class="modal-title text-1000 mb-0">${n.title}</h4>\n    ${n.extendedProps.organizer ? `<p class="mb-0 fs--1 mt-1">\n        by <a href="#!">${n.extendedProps.organizer}</a>\n      </p>` : ""}\n  </div>\n  <button type="button" class="btn p-1 fw-bolder" data-bs-dismiss="modal" aria-label="Close">\n    <span class='fas fa-times fs-0'></span>\n  </button>\n\n</div>\n\n<div class="modal-body px-card pb-card pt-1 fs--1">\n  ${n.extendedProps.description ? `\n      <div class="mt-3 border-bottom pb-3">\n        <h5 class='mb-0 text-800'>Description</h5>\n        <p class="mb-0 mt-2">\n          ${n.extendedProps.description.split(" ").slice(0, 30).join(" ")}\n        </p>\n      </div>\n    ` : ""} \n  <div class="mt-4 ${n.extendedProps.location ? "border-bottom pb-3" : ""}">\n    <h5 class='mb-0 text-800'>Date and Time</h5>\n    <p class="mb-1 mt-2">\n    ${window.dayjs && window.dayjs(n.start).format("dddd, MMMM D, YYYY, h:mm A")} \n    ${n.end ? `– ${window.dayjs && window.dayjs(n.end).subtract(1, "day").format("dddd, MMMM D, YYYY, h:mm A")}` : ""}\n  </p>\n\n  </div>\n  ${n.extendedProps.location ? `\n        <div class="mt-4 ">\n          <h5 class='mb-0 text-800'>Location</h5>\n          <p class="mb-0 mt-2">${n.extendedProps.location}</p>\n        </div>\n      ` : ""}\n  ${n.schedules ? `\n      <div class="mt-3">\n        <h5 class='mb-0 text-800'>Schedule</h5>\n        <ul class="list-unstyled timeline mt-2 mb-0">\n          ${n.schedules.map((n => `<li>${n.title}</li>`)).join("")}\n        </ul>\n      </div>\n      ` : ""}\n  </div>\n</div>\n\n<div class="modal-footer d-flex justify-content-end px-card pt-0 border-top-0">\n  <a href="#!" class="btn btn-phoenix-secondary btn-sm">\n    <span class="fas fa-pencil-alt fs--2 mr-2"></span> Edit\n  </a>\n  <button class="btn btn-phoenix-danger btn-sm" data-calendar-event-remove >\n    <span class="fa-solid fa-trash fs--1 mr-2" data-fa-transform="shrink-2"></span> Delete\n  </button>\n  <a href='#!' class="btn btn-primary btn-sm">\n    See more details\n    <span class="fas fa-angle-right fs--2 ml-1"></span>\n  </a>\n</div>\n`;

    const appCalendarInit = () => {
        const e = "#addEventForm", t = "#addEventModal", a = "#appCalendar", r = ".calendar-title", n = ".calendar-day",
            o = ".calendar-date", d = "[data-fc-view]", l = "data-event", c = "#eventDetailsModal",
            i = "#eventDetailsModal .modal-content", u = '#addEventModal [name="startDate"]', s = '[name="title"]',
            m = "shown.bs.modal", v = "submit", g = "event", y = "fc-view",
            p = events.reduce(((e, t) => t.schedules ? e.concat(t.schedules.concat(t)) : e.concat(t)), []);
        (() => {
            const e = new Date, t = e.toLocaleString("en-US", {month: "short"}), a = e.getDate(), r = e.getDay(),
                d = `${a}  ${t},  ${e.getFullYear()}`;
            document.querySelector(n) && (document.querySelector(n).textContent = (e => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e])(r)), document.querySelector(o) && (document.querySelector(o).textContent = d);
        })();
        const h = e => {
                const {currentViewType: t} = e;
                if ("timeGridWeek" === t) {
                    const t = e.dateProfile.currentRange.start, a = t.toLocaleString("en-US", {month: "short"}),
                        n = t.getDate(), o = e.dateProfile.currentRange.end,
                        d = o.toLocaleString("en-US", {month: "short"}), l = o.getDate();
                    document.querySelector(r).textContent = `${a} ${n} - ${d} ${l}`;
                } else document.querySelector(r).textContent = e.viewTitle;
            }, w = document.querySelector(a), f = document.querySelector(e), D = document.querySelector(t),
            S = document.querySelector(c);
        if (w) {
            const e = fullCalendar.renderCalendar(w, {
                headerToolbar: !1,
                dayMaxEvents: 3,
                height: 800,
                stickyHeaderDates: !1,
                views: {week: {eventLimit: 3}},
                eventTimeFormat: {hour: "numeric", minute: "2-digit", omitZeroMinute: !0, meridiem: !0},
                events: p,
                eventClick: e => {
                    if (e.event.url) window.open(e.event.url, "_blank"), e.jsEvent.preventDefault(); else {
                        const t = getTemplate(e.event);
                        document.querySelector(i).innerHTML = t;
                        new window.bootstrap.Modal(S).show();
                    }
                },
                dateClick(e) {
                    new window.bootstrap.Modal(D).show();
                    document.querySelector(u)._flatpickr.setDate([e.dateStr]);
                }
            });
            h(e.currentData), document.addEventListener("click", (t => {
                if (t.target.hasAttribute(l) || t.target.parentNode.hasAttribute(l)) {
                    const a = t.target.hasAttribute(l) ? t.target : t.target.parentNode;
                    switch (getData(a, g)) {
                        case"prev":
                            e.prev(), h(e.currentData);
                            break;
                        case"next":
                            e.next(), h(e.currentData);
                            break;
                        default:
                            e.today(), h(e.currentData);
                    }
                }
                if (t.target.hasAttribute("data-fc-view")) {
                    const a = t.target;
                    e.changeView(getData(a, y)), h(e.currentData), document.querySelectorAll(d).forEach((e => {
                        e === t.target ? e.classList.add("active-view") : e.classList.remove("active-view");
                    }));
                }
            })), f && f.addEventListener(v, (t => {
                t.preventDefault();
                const {title: a, startDate: r, endDate: n, label: o, description: d, allDay: l} = t.target;
                e.addEvent({
                    title: a.value,
                    start: r.value,
                    end: n.value ? n.value : null,
                    allDay: l.checked,
                    className: `text-${o.value}`,
                    description: d.value
                }), t.target.reset(), window.bootstrap.Modal.getInstance(D).hide();
            })), D && D.addEventListener(m, (({currentTarget: e}) => {
                e.querySelector(s)?.focus();
            }));
        }
    };

    const {docReady: docReady} = window.phoenix.utils;
    docReady(emailCampaignReportsChartInit), docReady(socialMarketingRadarChartInit), docReady(salesTrendsChartInit), docReady(callCampaignChartInit), docReady(appCalendarInit);

    // Gọi hàm khởi tạo biểu đồ khi trang được load
    $rootScope.$on('$routeChangeSuccess', function () {
        $timeout(function () {
            emailCampaignReportsChartInit();
            socialMarketingRadarChartInit();
            salesTrendsChartInit();
            callCampaignChartInit();
            appCalendarInit();
        });
    });
});
