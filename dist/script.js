import React, { StrictMode, Suspense, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { faker } from "https://esm.sh/@faker-js/faker";
import useWebAnimations from "https://esm.sh/@wellyshen/use-web-animations";
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement("main", null,
        React.createElement(IconSprites, null),
        React.createElement(Suspense, { fallback: React.createElement("div", null, "Loading\u2026") },
            React.createElement(SaaSWidget, { userData: fakeUserData(), userTarget: 150, dailyPurchaseTarget: 5000, monthlyPurchaseTarget: 100000 })))));
function fakeUserData() {
    const data = [];
    const emojiList = {
        male: ["👱🏻‍♂️", "👨🏻", "👨🏻‍🦳", "🧔🏽‍♂️", "👨🏾", "👨🏿‍🦱", "👨🏿‍🦲"],
        female: ["👱🏻‍♀️", "👩🏻", "👩🏻‍🦳", "👩🏽", "👩🏽‍🦱", "👧🏿", "👩🏿"]
    };
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let months = 6;
    while (months--) {
        const startBound = new Date(year, month - months, 1);
        const endBound = Math.min(new Date(year, month - (months - 1), 0).getTime(), now.getTime());
        let userCount = faker.number.int({ min: 80, max: 150 });
        while (userCount--) {
            const sex = faker.person.sex();
            const emojisBySex = emojiList[sex];
            // user
            const user = {
                registered: faker.date.between({ from: startBound, to: endBound }),
                name: `${faker.person.firstName(sex)} ${faker.person.lastName()}`,
                emoji: emojisBySex[faker.number.int({ max: emojisBySex.length - 1 })],
                color: `hsl(${faker.number.int({ min: 0, max: 359 })},90%,70%)`,
                purchases: []
            };
            // user’s purchases
            let purchaseCount = faker.number.int({ min: 1, max: 10 });
            while (purchaseCount--) {
                user.purchases.push({
                    date: user.registered,
                    type: faker.datatype.boolean() ? "digital" : "physical",
                    value: faker.number.int({ min: 1, max: 150, multipleOf: 5 }) - 0.01
                });
            }
            data.push(user);
        }
    }
    return data;
}
function BarGraph({ dataSet, isCurrency = false }) {
    return (React.createElement("div", { className: "bar-graph" }, dataSet.map((set, i) => (React.createElement(BarGraphBar, { key: i, value: set.value, maxValue: set.maxValue, label: set.label, isCurrency: isCurrency })))));
}
function BarGraphBar({ value, maxValue, label = "", isCurrency = false }) {
    const valueDisplayed = isCurrency
        ? new Intl.NumberFormat(LOCALE, {
            style: "currency",
            currency: CURRENCY
        }).format(value)
        : `${value}`;
    const lineLength = 60;
    const dashArray = `${lineLength} ${lineLength + 1}`;
    const offset = (1 - Math.min(value / maxValue, 1)) * -lineLength;
    const { ref } = useWebAnimations({
        keyframes: {
            strokeDashoffset: [-lineLength, offset]
        },
        animationOptions: {
            duration: 500,
            easing: "cubic-bezier(0.65,0,0.35,1)",
            fill: "forwards"
        }
    });
    return (React.createElement("div", { className: "bar-graph__bar" },
        React.createElement("svg", { className: "bar-graph__svg", viewBox: "0 0 5 65", width: "5px", height: "65px", role: "img" },
            React.createElement("title", null, valueDisplayed),
            React.createElement("defs", null,
                React.createElement("linearGradient", { id: "bar-grad", x1: "0", y1: "0", x2: "0", y2: "1" },
                    React.createElement("stop", { offset: "0", stopColor: "hsl(253,90%,80%)" }),
                    React.createElement("stop", { offset: "1", stopColor: "hsl(253,90%,60%)" }))),
            React.createElement("g", { strokeLinecap: "round", strokeWidth: "5" },
                React.createElement("line", { className: "bar-graph__track", x1: "2.5", y1: "2.5", x2: "2.5", y2: "62.5" }),
                React.createElement("line", { stroke: "url(#bar-grad)", x1: "2.5", y1: "2.5", x2: "2.51", y2: "62.5", strokeDasharray: dashArray, strokeDashoffset: offset, ref: ref }))),
        React.createElement("span", { className: "bar-graph__label" }, label)));
}
function Icon({ icon }) {
    return (React.createElement("svg", { className: "icon", width: "16px", height: "16px", "aria-hidden": "true" },
        React.createElement("use", { href: `#${icon}` })));
}
function IconSprites() {
    return (React.createElement("svg", { width: "0", height: "0", "aria-hidden": "true" },
        React.createElement("symbol", { id: "line-graph", viewBox: "0 0 24 24" },
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeWidth: "2" },
                React.createElement("rect", { stroke: "hsla(0,0%,50%,0.5)", rx: "4", ry: "4", x: "2", y: "2", width: "20", height: "20" }),
                React.createElement("polyline", { points: "6 15,11 11,13 13,18 9" }))),
        React.createElement("symbol", { id: "arrow-right", viewBox: "0 0 24 24" },
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeWidth: "2" },
                React.createElement("polyline", { points: "12 2,22 12,12 22" }),
                React.createElement("polyline", { points: "2 12,22 12" }))),
        React.createElement("symbol", { id: "arrow-left", viewBox: "0 0 24 24" },
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeWidth: "2" },
                React.createElement("polyline", { points: "12 2,2 12,12 22" }),
                React.createElement("polyline", { points: "2 12,22 12" }))),
        React.createElement("symbol", { id: "arrow-up-circle", viewBox: "0 0 24 24" },
            React.createElement("circle", { fill: "currentcolor", r: "12", cx: "12", cy: "12", opacity: "0.2" }),
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" },
                React.createElement("polyline", { points: "6 12,12 6,18 12" }),
                React.createElement("polyline", { points: "12 6,12 18" }))),
        React.createElement("symbol", { id: "arrow-down-circle", viewBox: "0 0 24 24" },
            React.createElement("circle", { fill: "currentcolor", r: "12", cx: "12", cy: "12", opacity: "0.2" }),
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" },
                React.createElement("polyline", { points: "6 12,12 18,18 12" }),
                React.createElement("polyline", { points: "12 6,12 18" }))),
        React.createElement("symbol", { id: "user", viewBox: "0 0 16 16" },
            React.createElement("g", { fill: "currentcolor" },
                React.createElement("path", { d: "M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" }),
                React.createElement("path", { d: "M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" })))));
}
function LineGraph({ dataSet, maxValue, labels = [], isCurrency = false }) {
    const isRTL = document.dir === "rtl";
    const width = 200;
    const height = 65;
    // data set values and labels are separate arrays in case there should be more points than labels
    const labelCount = labels.length || 1;
    const under2Labels = labelCount < 2;
    const xStart = under2Labels ? 2 : width / (labelCount * 2);
    const xEnd = width - xStart;
    const xDistance = width - (under2Labels ? 4 : width / labelCount);
    const yStart = 2;
    const yEnd = 63;
    const yDistance = yEnd - yStart;
    const points = [];
    // add the points
    dataSet.forEach((value, i) => {
        const x = Math.round(xStart + xDistance * (i / Math.max(dataSet.length - 1, 1)));
        const y = Math.round(yStart + yDistance * (1 - value / maxValue));
        points.push([x, y]);
    });
    // convert the point array to a string to use for the polylines
    const pointsToString = points.map((point) => point.join(" ")).join(",");
    const bottomCorners = [
        [Math.round(xEnd), height],
        [Math.round(xStart), height]
    ];
    const fillPoints = [...points, ...bottomCorners];
    const fillPointsToString = fillPoints
        .map((point) => point.join(" "))
        .join(",");
    const lineLength = totalDistance(points);
    const offset = 0;
    const { ref } = useWebAnimations({
        keyframes: {
            strokeDashoffset: [lineLength, offset]
        },
        animationOptions: {
            duration: 500,
            easing: "linear",
            fill: "forwards"
        }
    });
    /**
     * Get the combined distance of an array of coordinate pairs.
     * @param points Array of coordinate pairs
     */
    function totalDistance(points) {
        let total = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i + 1];
            total += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
        return +total.toFixed(2);
    }
    return (React.createElement("div", { className: "line-graph" },
        React.createElement("svg", { className: "line-graph__svg", viewBox: `0 0 ${width} ${height}`, width: `${width}px`, height: `${height}px`, role: "img", "aria-label": `Line graph displaying data from ${labels[0]} to ${labels[labels.length - 1]}` },
            React.createElement("defs", null,
                React.createElement("clipPath", { id: "line-clip" },
                    React.createElement("rect", { className: "line-graph__glow", x: "0", y: "0", width: width, height: height })),
                React.createElement("linearGradient", { id: "line-grad1", x1: "0", y1: "0", x2: "0", y2: "1" },
                    React.createElement("stop", { offset: "0", stopColor: "hsla(253,90%,80%,0.5)" }),
                    React.createElement("stop", { offset: "0.75", stopColor: "hsla(253,90%,80%,0)" })),
                React.createElement("linearGradient", { id: "line-grad2", x1: "1", y1: "0", x2: "0", y2: "0" },
                    React.createElement("stop", { offset: "0", stopColor: "hsl(253,90%,80%)" }),
                    React.createElement("stop", { offset: "1", stopColor: "hsl(253,90%,60%)" }))),
            React.createElement("polyline", { clipPath: "url(#line-clip)", fill: "url(#line-grad1)", points: fillPointsToString }),
            React.createElement("polyline", { fill: "none", stroke: "url(#line-grad2)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", strokeDasharray: `${lineLength} ${lineLength}`, strokeDashoffset: offset, points: pointsToString, ref: ref })),
        React.createElement("div", { className: "line-graph__points" }, points.map((point, i) => {
            const [x, y] = point;
            const horz = `${(x / width) * 100}%`;
            const pointStyle = {
                top: `${(y / height) * 100}%`,
                right: "auto",
                left: horz
            };
            if (isRTL) {
                pointStyle.right = horz;
                pointStyle.left = "auto";
            }
            const value = dataSet[i];
            const valueDisplayed = isCurrency
                ? new Intl.NumberFormat(LOCALE, {
                    style: "currency",
                    currency: CURRENCY
                }).format(value)
                : value.toLocaleString(LOCALE);
            return (React.createElement("button", { type: "button", key: i, className: "line-graph__point", title: valueDisplayed, style: pointStyle }));
        })),
        labels.map((label, i) => (React.createElement("span", { key: i, className: "line-graph__label" }, label)))));
}
function SaaSLargeStat({ label, amount, change, amountIsLess = false, isCurrency = false }) {
    const amountDisplayed = isCurrency
        ? new Intl.NumberFormat(LOCALE, {
            style: "currency",
            currency: CURRENCY
        }).format(amount)
        : amount.toLocaleString(LOCALE);
    const changeDisplayed = change.toLocaleString(LOCALE, {
        style: "percent",
        maximumFractionDigits: 2
    });
    return (React.createElement("div", { className: "saas__stat" },
        React.createElement("div", { className: "saas__label" }, label),
        React.createElement("div", { className: "saas__value saas__value--lg" }, amountDisplayed),
        React.createElement("div", { className: `saas__stat-change${amountIsLess ? " change-negative" : " change-positive"}` },
            React.createElement(Icon, { icon: `arrow-${amountIsLess ? "down" : "up"}-circle` }),
            changeDisplayed)));
}
function SaaSNewUsers({ groups, userTarget }) {
    const [groupA, groupB = []] = groups;
    let userChange = Math.abs(groupA.length - groupB.length) / groupB.length;
    // deal with infinity or 100% on 0
    if (groupA.length === 0)
        userChange = 0;
    else if (groupB.length === 0)
        userChange = 1;
    const userChangeIsLess = groupA.length < groupB.length;
    const newest5Users = groupA.slice(0, 5);
    const topUser = groupA.sort((a, b) => {
        return b.purchases.length - a.purchases.length;
    })[0];
    const untilTarget = 1 - groupA.length / userTarget;
    const untilTargetDisplayed = untilTarget.toLocaleString(LOCALE, {
        style: "percent",
        maximumFractionDigits: 2
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "saas__block" },
            React.createElement(SaaSTopUser, { user: topUser }),
            React.createElement("hr", { className: "saas__sep" }),
            React.createElement(SaaSLargeStat, { label: "Total New Users", amount: groupA.length, change: userChange, amountIsLess: userChangeIsLess }),
            React.createElement(SaaSUserList, { users: newest5Users })),
        untilTarget > 0 ? (React.createElement("p", { className: "saas__tip" },
            React.createElement("strong", null,
                "Increase ",
                untilTargetDisplayed),
            " more email marketing to reach your user acquisition target to reach your monthly target.")) : (React.createElement("p", { className: "saas__tip" }, "You reached your user acquisition target to reach your monthly target!"))));
}
function SaaSProductCount({ digital, digitalIsLess, physical, physicalIsLess }) {
    const digitalDisplayed = new Intl.NumberFormat(LOCALE).format(digital);
    const physicalDisplayed = new Intl.NumberFormat(LOCALE).format(physical);
    return (React.createElement("div", { className: "saas__columns" },
        React.createElement("div", { className: "saas__column" },
            React.createElement("div", { className: "saas__label" }, "Digital Products"),
            React.createElement("div", { className: "saas__value" },
                React.createElement("span", { className: `${digitalIsLess ? "change-negative" : "change-positive"}` },
                    React.createElement(Icon, { icon: `arrow-${digitalIsLess ? "down" : "up"}-circle` })),
                digitalDisplayed)),
        React.createElement("div", { className: "saas__column" },
            React.createElement("div", { className: "saas__label" }, "Physical Products"),
            React.createElement("div", { className: "saas__value" },
                React.createElement("span", { className: `${physicalIsLess ? "change-negative" : "change-positive"}` },
                    React.createElement(Icon, { icon: `arrow-${physicalIsLess ? "down" : "up"}-circle` })),
                physicalDisplayed))));
}
function SaaSSalesDaily({ groups, purchaseTarget }) {
    // groups for last two days
    const [groupA, groupB = []] = groups;
    const sales = Utils.salesComparison(groupA, groupB, purchaseTarget);
    const { groupAPurchases, salesChange, salesChangeIsLess, digitalA, digitalIsLess, physicalA, physicalIsLess, untilPurchaseTarget, untilPurchaseTargetDisplayed } = sales;
    const dataSet = [];
    let lastNDays = 0;
    // build the data set
    for (const group of groups) {
        const day = new Date();
        day.setDate(day.getDate() - lastNDays);
        ++lastNDays;
        dataSet.unshift({
            label: new Intl.DateTimeFormat(LOCALE, { weekday: "short" }).format(day),
            value: Utils.totalSales(group),
            maxValue: purchaseTarget
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "saas__block" },
            React.createElement(SaaSProductCount, { digital: digitalA, digitalIsLess: digitalIsLess, physical: physicalA, physicalIsLess: physicalIsLess })),
        React.createElement("div", { className: "saas__block" },
            React.createElement(SaaSLargeStat, { label: "Daily Sales", amount: groupAPurchases, change: salesChange, amountIsLess: salesChangeIsLess, isCurrency: true }),
            React.createElement(BarGraph, { dataSet: dataSet, isCurrency: true })),
        untilPurchaseTarget > 0 ? (React.createElement("p", { className: "saas__tip" },
            React.createElement("strong", null, untilPurchaseTargetDisplayed),
            " until your daily purchase target.")) : (React.createElement("p", { className: "saas__tip" }, "You reached your daily purchase target!"))));
}
function SaaSSalesOnline({ groups, purchaseTarget, lastNMonths = 6 }) {
    // groups for the last two months
    const [groupA, groupB = []] = groups;
    const sales = Utils.salesComparison(groupA, groupB, purchaseTarget);
    const { groupAPurchases, salesChange, salesChangeIsLess, digitalA, digitalIsLess, physicalA, physicalIsLess, untilPurchaseTargetDisplayed } = sales;
    const dataSet = [];
    const months = [];
    // build the data set
    for (const group of groups) {
        dataSet.unshift(Utils.totalSales(group));
    }
    // use labels for the last n months
    for (let m = 0; m < lastNMonths; ++m) {
        const date = new Date();
        date.setMonth(date.getMonth() - m);
        const month = new Intl.DateTimeFormat(LOCALE, { month: "short" }).format(date);
        months.unshift(month);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "saas__block" },
            React.createElement(SaaSProductCount, { digital: digitalA, digitalIsLess: digitalIsLess, physical: physicalA, physicalIsLess: physicalIsLess })),
        React.createElement("div", { className: "saas__block" },
            React.createElement(SaaSLargeStat, { label: "Total Online Sales", amount: groupAPurchases, change: salesChange, amountIsLess: salesChangeIsLess, isCurrency: true }),
            React.createElement(LineGraph, { dataSet: dataSet, maxValue: purchaseTarget, labels: months, isCurrency: true })),
        React.createElement("p", { className: "saas__tip" },
            React.createElement("strong", null, untilPurchaseTargetDisplayed),
            " until your target this month")));
}
function SaaSTopUser({ user }) {
    if (!user) {
        // no top user
        return (React.createElement("div", { className: "saas__user-empty" },
            React.createElement(Icon, { icon: "user" }),
            React.createElement("p", null,
                React.createElement("small", null, "No top user yet"))));
    }
    // continue with top user
    const { color, emoji, name, purchases } = user;
    const style = { backgroundColor: color };
    return (React.createElement("div", { className: "saas__columns" },
        React.createElement("div", { className: "saas__user-avatar saas__user-avatar--lg", style: style }, emoji),
        React.createElement("div", { className: "saas__user-info" },
            React.createElement("div", { className: "saas__label" }, "Top User"),
            React.createElement("div", { className: "saas__value saas__value--truncated" }, name),
            React.createElement("div", { className: "saas__label" }, "Daily Purchase"),
            React.createElement("div", { className: "saas__value" },
                purchases.length,
                " items"))));
}
function SaaSUserList({ users }) {
    const isRTL = document.dir === "rtl";
    return (React.createElement("div", { className: "saas__user-avatar-row" },
        React.createElement("div", { className: "saas__user-avatar-list" }, users.map((user, i) => {
            const userColor = { backgroundColor: user.color };
            return (React.createElement("div", { key: i, className: "saas__user-avatar", title: user.name, style: userColor }, user.emoji));
        })),
        React.createElement("button", { className: "saas__button", type: "button", disabled: !users.length },
            "View All ",
            React.createElement(Icon, { icon: `arrow-${isRTL ? "left" : "right"}` }))));
}
function SaaSWidget({ userData, userTarget, dailyPurchaseTarget, monthlyPurchaseTarget }) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastMonth = new Date();
    lastMonth.setMonth(yesterday.getMonth() - 1);
    const usersLastMonth = Utils.registeredUsersForMonth(userData, lastMonth);
    const usersToday = Utils.registeredUsersForMonth(userData, today);
    const productsYesterday = Utils.purchasesForDate(userData, yesterday);
    const productsToday = Utils.purchasesForDate(userData, today);
    const productsThisMonth = Utils.purchasesForMonth(userData, today);
    // add product purchases for the past work
    const groupsPastWeek = [productsToday, productsYesterday];
    for (let d = 2; d < 7; ++d) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        const productsForDay = Utils.purchasesForDate(userData, date);
        groupsPastWeek.push(productsForDay);
    }
    // add those for the past 6 months
    const groupsPast6Months = [productsThisMonth];
    const lastNMonths = 6;
    for (let m = 1; m < lastNMonths; ++m) {
        const date = new Date();
        date.setMonth(date.getMonth() - m);
        const products = Utils.purchasesForMonth(userData, date);
        groupsPast6Months.push(products);
    }
    const [tab, setTab] = useState("users");
    const tabs = [
        {
            name: "users",
            friendlyName: "New Users"
        },
        {
            name: "salesOnline",
            friendlyName: "Online Sales"
        },
        {
            name: "salesDaily",
            friendlyName: "Daily Sales"
        }
    ];
    const tabMap = {
        users: (React.createElement(SaaSNewUsers, { groups: [usersToday, usersLastMonth], userTarget: userTarget })),
        salesOnline: (React.createElement(SaaSSalesOnline, { groups: groupsPast6Months, purchaseTarget: monthlyPurchaseTarget, lastNMonths: lastNMonths })),
        salesDaily: (React.createElement(SaaSSalesDaily, { groups: groupsPastWeek, purchaseTarget: dailyPurchaseTarget }))
    };
    return (React.createElement("div", { className: "saas" },
        React.createElement("h1", { className: "saas__title" },
            React.createElement(Icon, { icon: "line-graph" }),
            " Performance"),
        React.createElement(SegmentedControl, { segments: tabs, changeEvent: (name) => setTab(name) }),
        tabMap[tab]));
}
function SegmentedControl({ segments, changeEvent, defaultIndex = 0 }) {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
    const dir = document.dir === "rtl" ? -1 : 1;
    const gap = 0.25;
    const style = {
        transform: `translateX(calc(${100 * selectedIndex * dir}% + ${gap * 2 * selectedIndex * dir}em))`,
        width: `calc(${100 / segments.length}% - ${gap * 2}em)`
    };
    /**
     * Set the selected segment, then run the callback with the segment name.
     * @param name Name of segment
     * @param index Index of segment
     */
    function onIndexChange(name, index) {
        setSelectedIndex(index);
        changeEvent(name);
    }
    return (React.createElement("div", { className: "segmented", role: "tablist" },
        segments.map((option, i) => (React.createElement("button", { key: i, className: "segmented__button", type: "button", role: "tab", "aria-selected": selectedIndex === i, onClick: () => onIndexChange(option.name, i) }, option.friendlyName))),
        React.createElement("div", { className: "segmented__bg", style: style })));
}
const LOCALE = "en-US";
const CURRENCY = "USD";
class Utils {
    /**
     * Get sales data that compares two different groups of purchases.
     * @param groupA First group of purchases
     * @param groupB Second group of purchases
     * @param purchaseTarget Purchase target
     */
    static salesComparison(groupA, groupB, purchaseTarget) {
        const groupAPurchases = this.totalSales(groupA);
        const groupBPurchases = this.totalSales(groupB);
        let salesChange = Math.abs(groupAPurchases - groupBPurchases) / groupBPurchases;
        // deal with infinity or 100% on 0
        if (groupAPurchases === 0)
            salesChange = 0;
        else if (groupBPurchases === 0)
            salesChange = 1;
        const salesChangeIsLess = groupAPurchases < groupBPurchases;
        const digitalA = this.totalProductsByType(groupA, "digital");
        const digitalB = this.totalProductsByType(groupB, "digital");
        const digitalIsLess = digitalA < digitalB;
        const physicalA = this.totalProductsByType(groupA, "physical");
        const physicalB = this.totalProductsByType(groupB, "physical");
        const physicalIsLess = physicalA < physicalB;
        const untilPurchaseTarget = 1 - Math.min(groupAPurchases / purchaseTarget, 1);
        const untilPurchaseTargetDisplayed = untilPurchaseTarget.toLocaleString(LOCALE, {
            style: "percent",
            maximumFractionDigits: 2
        });
        return {
            groupAPurchases,
            groupBPurchases,
            salesChange,
            salesChangeIsLess,
            digitalA,
            digitalB,
            digitalIsLess,
            physicalA,
            physicalB,
            physicalIsLess,
            untilPurchaseTarget,
            untilPurchaseTargetDisplayed
        };
    }
    /**
     * Get all users who registered during a specific month.
     * @param date Target date
     */
    static registeredUsersForMonth(userData, date) {
        return userData.filter((user) => {
            const userDate = user.registered;
            return (userDate.getFullYear() === date.getFullYear() &&
                userDate.getMonth() === date.getMonth());
        });
    }
    /**
     * Get all purchases of the month based on a specific date.
     * @param date Target date
     */
    static purchasesForDate(userData, date) {
        const arr = userData
            .map((user) => {
            return user.purchases.filter((purchase) => {
                const purchaseDate = purchase.date;
                return (purchaseDate.getFullYear() === date.getFullYear() &&
                    purchaseDate.getMonth() === date.getMonth() &&
                    purchaseDate.getDate() === date.getDate());
            });
        })
            .filter((arr) => arr.length);
        if (arr.length)
            return arr.reduce((a, b) => a.concat(b));
        return [];
    }
    /**
     * Get all purchases on a specific month.
     * @param date Target date
     */
    static purchasesForMonth(userData, date) {
        const arr = userData
            .map((user) => {
            return user.purchases.filter((purchase) => {
                const purchaseDate = purchase.date;
                return (purchaseDate.getFullYear() === date.getFullYear() &&
                    purchaseDate.getMonth() === date.getMonth());
            });
        })
            .filter((arr) => arr.length);
        if (arr.length)
            return arr.reduce((a, b) => a.concat(b));
        return [];
    }
    /**
     * Get the total number of products by type.
     * @param purchases Purchase array
     * @param type Purchase type
     */
    static totalProductsByType(purchases, type) {
        return purchases.filter((p) => p.type === type).length;
    }
    /**
     * Get the total profit of purchases.
     * @param purchases Purchase array
     */
    static totalSales(purchases) {
        const arr = purchases.map((p) => p.value);
        if (arr.length)
            return +arr.reduce((a, b) => a + b).toFixed(2);
        return 0;
    }
}