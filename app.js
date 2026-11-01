```javascript
/* =========================================================
   HYPERLOCAL IMT
   GitHub Pages Frontend
   Created by Nilkantha
========================================================= */

"use strict";

/* =========================================================
   DEMO USERS
   Replace later with secure backend/API
========================================================= */

const USERS = [
    {
        casperId: "ca.3967546",
        password: "123456",
        name: "Sachin Mishra",
        role: "User",
        status: "Active"
    },
    {
        casperId: "ca.4143820",
        password: "123456",
        name: "Sona Marndi",
        role: "User",
        status: "Active"
    }
];

const ADMIN = {
    username: "Nilkantha",
    password: "288067"
};


/* =========================================================
   DEMO PRODUCT MASTER
========================================================= */

const PRODUCT_MASTER = [
    {
        wid: "XIT5CSQ",
        fsn: "XIT5CSQ",
        productName: "Demo Grocery Product",
        location: "SAR-G2-LSM-P01-13-D1",
        dimCategory: "Grocery",
        cmsVertical: "Hyperlocal",
        systemQty: 42
    },
    {
        wid: "XIT5CSQ",
        fsn: "XIT5CSQ",
        productName: "Demo Grocery Product",
        location: "PLT-G2-P01-A16-09-A3",
        dimCategory: "Grocery",
        cmsVertical: "Hyperlocal",
        systemQty: 40
    },
    {
        wid: "RYMF8F2S7GSYMHY",
        fsn: "RYMF8F2S7GSYMHY",
        productName: "Demo Product",
        location: "PLT-G2-P01-A16-09-A3",
        dimCategory: "Grocery",
        cmsVertical: "Hyperlocal",
        systemQty: 40
    }
];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentUser = null;
let currentProduct = null;
let selectedLocation = null;
let selectedIssue = null;

let records = [];

let onlineUsers = [];


/* =========================================================
   DEVICE DETECTION
========================================================= */

function detectDevice() {

    const ua = navigator.userAgent.toLowerCase();

    const mobile =
        /android|iphone|ipad|ipod|mobile|tablet/.test(ua) ||
        window.innerWidth <= 700;

    const device = mobile ? "Mobile / HHD" : "Desktop";

    document.body.classList.remove(
        "mobile-mode",
        "desktop-mode"
    );

    document.body.classList.add(
        mobile ? "mobile-mode" : "desktop-mode"
    );

    const badge = document.getElementById("deviceBadge");

    if (badge) {
        badge.textContent = device;
    }

    return device;
}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    detectDevice();

    window.addEventListener("resize", detectDevice);

    hideLoading();

    initializeApp();

});


function initializeApp() {

    showPage("loginPage");

    setupLoginTabs();

    setupPasswordToggles();

    setupIssueButtons();

    setupFormEvents();

}


/* =========================================================
   LOADING
========================================================= */

function hideLoading() {

    const loading = document.getElementById("loadingScreen");

    if (loading) {
        setTimeout(function () {
            loading.classList.add("hidden");
        }, 500);
    }
}


/* =========================================================
   LOGIN TABS
========================================================= */

function setupLoginTabs() {

    const userTab = document.getElementById("userLoginTab");
    const adminTab = document.getElementById("adminLoginTab");

    const userForm = document.getElementById("userLoginForm");
    const adminForm = document.getElementById("adminLoginForm");

    if (!userTab || !adminTab) return;

    userTab.addEventListener("click", function () {

        userTab.classList.add("active");
        adminTab.classList.remove("active");

        userForm.classList.remove("hidden");
        adminForm.classList.add("hidden");

    });

    adminTab.addEventListener("click", function () {

        adminTab.classList.add("active");
        userTab.classList.remove("active");

        adminForm.classList.add("hidden");
        userForm.classList.remove("hidden");

    });

}


/* =========================================================
   PASSWORD SHOW/HIDE
========================================================= */

function setupPasswordToggles() {

    document.querySelectorAll(".password-eye").forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.dataset.target;

            const input = document.getElementById(targetId);

            if (!input) return;

            if (input.type === "password") {

                input.type = "text";
                button.textContent = "🙈";

            } else {

                input.type = "password";
                button.textContent = "👁";

            }

        });

    });

}


/* =========================================================
   USER LOGIN
========================================================= */

function userLogin() {

    const casperId =
        getValue("casperId").trim();

    const password =
        getValue("userPassword");

    if (!casperId || !password) {

        showToast(
            "Please enter Casper ID and Password",
            "error"
        );

        return;
    }

    const user = USERS.find(function (u) {

        return (
            u.casperId.toLowerCase() === casperId.toLowerCase() &&
            u.password === password &&
            u.status === "Active"
        );

    });

    if (!user) {

        showToast(
            "Invalid Casper ID or Password",
            "error"
        );

        return;
    }

    currentUser = {
        casperId: user.casperId,
        name: user.name,
        role: user.role,
        deviceType: detectDevice(),
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(
        "imt_current_user",
        JSON.stringify(currentUser)
    );

    showUserPage();

    showToast(
        "Login successful",
        "success"
    );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function adminLogin() {

    const username =
        getValue("adminUsername").trim();

    const password =
        getValue("adminPassword");

    if (
        username === ADMIN.username &&
        password === ADMIN.password
    ) {

        currentUser = {
            casperId: "ADMIN",
            name: "Nilkantha",
            role: "Admin",
            deviceType: detectDevice(),
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(
            "imt_current_user",
            JSON.stringify(currentUser)
        );

        showAdminPage();

        showToast(
            "Admin login successful",
            "success"
        );

    } else {

        showToast(
            "Invalid Admin login",
            "error"
        );

    }

}


/* =========================================================
   SHOW USER PAGE
========================================================= */

function showUserPage() {

    showPage("userPage");

    setText(
        "welcomeName",
        currentUser.name
    );

    setText(
        "welcomeCasper",
        currentUser.casperId
    );

    setText(
        "headerUserBadge",
        currentUser.casperId
    );

    clearIssueForm();

}


/* =========================================================
   SHOW ADMIN PAGE
========================================================= */

function showAdminPage() {

    showPage("adminPage");

    setText(
        "headerUserBadge",
        "Admin: Nilkantha"
    );

    loadAdminDashboard();

}


/* =========================================================
   PAGE SWITCH
========================================================= */

function showPage(id) {

    document.querySelectorAll(".page").forEach(function (page) {

        page.classList.add("hidden");

    });

    const page = document.getElementById(id);

    if (page) {
        page.classList.remove("hidden");
    }

}


/* =========================================================
   SEARCH PRODUCT
========================================================= */

function searchProduct() {

    const value =
        getValue("productSearch")
            .trim()
            .toUpperCase();

    if (!value) {

        showToast(
            "Enter WID or FSN",
            "error"
        );

        return;
    }

    const matches =
        PRODUCT_MASTER.filter(function (item) {

            return (
                item.wid.toUpperCase() === value ||
                item.fsn.toUpperCase() === value
            );

        });

    if (matches.length === 0) {

        currentProduct = null;
        selectedLocation = null;

        clearProductDetails();

        showToast(
            "Product not found",
            "error"
        );

        return;
    }

    currentProduct = matches;

    showLocations(matches);

    showToast(
        matches.length + " location(s) found",
        "success"
    );

}


/* =========================================================
   SHOW LOCATIONS
========================================================= */

function showLocations(products) {

    const container =
        document.getElementById("locationList");

    if (!container) return;

    container.innerHTML = "";

    products.forEach(function (product, index) {

        const div =
            document.createElement("div");

        div.className = "location-item";

        div.innerHTML = `
            <div class="location-name">
                ${escapeHtml(product.location)}
            </div>

            <div class="location-qty">
                System Qty: ${product.systemQty}
            </div>
        `;

        div.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".location-item")
                    .forEach(function (item) {
                        item.classList.remove("active");
                    });

                div.classList.add("active");

                selectLocation(product);

            }
        );

        container.appendChild(div);

        if (index === 0) {

            setTimeout(function () {
                div.click();
            }, 50);

        }

    });

}


/* =========================================================
   SELECT LOCATION
========================================================= */

function selectLocation(product) {

    selectedLocation = product;

    setText(
        "detailWid",
        product.wid
    );

    setText(
        "detailFsn",
        product.fsn
    );

    setText(
        "detailProductName",
        product.productName
    );

    setText(
        "detailLocation",
        product.location
    );

    setText(
        "detailDimCategory",
        product.dimCategory
    );

    setText(
        "detailCmsVertical",
        product.cmsVertical
    );

    setText(
        "detailSystemQty",
        product.systemQty
    );

    calculateValue();

}


/* =========================================================
   QUANTITY / VALUE
========================================================= */

function calculateValue() {

    const qty =
        Number(getValue("issueQuantity")) || 0;

    const mrp =
        Number(getValue("issueMrp")) || 0;

    const value = qty * mrp;

    setText(
        "totalValue",
        "₹ " + value.toFixed(2)
    );

}


/* =========================================================
   ISSUE BUTTONS
========================================================= */

function setupIssueButtons() {

    document
        .querySelectorAll(".issue-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(".issue-btn")
                        .forEach(function (btn) {
                            btn.classList.remove("active");
                        });

                    button.classList.add("active");

                    selectedIssue =
                        button.dataset.issue ||
                        button.textContent.trim();

                    const otherBox =
                        document.getElementById(
                            "otherIssueBox"
                        );

                    if (selectedIssue === "Other") {

                        if (otherBox) {
                            otherBox.classList.remove(
                                "hidden"
                            );
                        }

                    } else {

                        if (otherBox) {
                            otherBox.classList.add(
                                "hidden"
                            );
                        }

                    }

                }
            );

        });

}


/* =========================================================
   FORM EVENTS
========================================================= */

function setupFormEvents() {

    const qty =
        document.getElementById("issueQuantity");

    const mrp =
        document.getElementById("issueMrp");

    if (qty) {
        qty.addEventListener(
            "input",
            calculateValue
        );
    }

    if (mrp) {
        mrp.addEventListener(
            "input",
            calculateValue
        );
    }

}


/* =========================================================
   SUBMIT ISSUE
========================================================= */

function submitIssue() {

    if (!currentUser) {

        showToast(
            "Please login again",
            "error"
        );

        return;
    }

    if (!selectedLocation) {

        showToast(
            "Please search and select a location",
            "error"
        );

        return;
    }

    const quantity =
        Number(getValue("issueQuantity"));

    const mrp =
        Number(getValue("issueMrp"));

    if (!quantity || quantity <= 0) {

        showToast(
            "Enter valid quantity",
            "error"
        );

        return;
    }

    if (!mrp || mrp <= 0) {

        showToast(
            "Enter valid MRP",
            "error"
        );

        return;
    }

    if (!selectedIssue) {

        showToast(
            "Please select Issue Type",
            "error"
        );

        return;
    }

    let issue = selectedIssue;

    if (selectedIssue === "Other") {

        const other =
            getValue("otherIssue").trim();

        if (!other) {

            showToast(
                "Enter Other issue",
                "error"
            );

            return;
        }

        issue = other;

    }

    const confirmed =
        document.getElementById(
            "confirmCheck"
        );

    if (confirmed && !confirmed.checked) {

        showToast(
            "Please confirm the stock issue",
            "error"
        );

        return;
    }

    const record = {

        timestamp:
            new Date().toLocaleString("en-IN"),

        wid:
            selectedLocation.wid,

        fsn:
            selectedLocation.fsn,

        productName:
            selectedLocation.productName,

        location:
            selectedLocation.location,

        dimCategory:
            selectedLocation.dimCategory,

        cmsVertical:
            selectedLocation.cmsVertical,

        quantity:
            quantity,

        mrp:
            mrp,

        value:
            quantity * mrp,

        issue:
            issue,

        casperId:
            currentUser.casperId,

        employeeName:
            currentUser.name,

        role:
            currentUser.role,

        deviceType:
            currentUser.deviceType,

        remarks:
            getValue("remarks").trim()

    };


    records.push(record);

    saveRecordsLocally();

    showToast(
        "Issue submitted successfully",
        "success"
    );

    clearIssueForm();

}


/* =========================================================
   SAVE LOCAL RECORDS
========================================================= */

function saveRecordsLocally() {

    localStorage.setItem(
        "imt_issue_records",
        JSON.stringify(records)
    );

}


/* =========================================================
   LOAD LOCAL RECORDS
========================================================= */

function loadLocalRecords() {

    try {

        const data =
            localStorage.getItem(
                "imt_issue_records"
            );

        if (data) {

            records =
                JSON.parse(data);

        }

    } catch (error) {

        records = [];

    }

}


/* =========================================================
   CLEAR ISSUE FORM
========================================================= */

function clearIssueForm() {

    selectedIssue = null;
    selectedLocation = null;
    currentProduct = null;

    setValue(
        "productSearch",
        ""
    );

    setValue(
        "issueQuantity",
        ""
    );

    setValue(
        "issueMrp",
        ""
    );

    setValue(
        "otherIssue",
        ""
    );

    setValue(
        "remarks",
        ""
    );

    const confirm =
        document.getElementById(
            "confirmCheck"
        );

    if (confirm) {
        confirm.checked = false;
    }

    document
        .querySelectorAll(".issue-btn")
        .forEach(function (btn) {

            btn.classList.remove("active");

        });

    const otherBox =
        document.getElementById(
            "otherIssueBox"
        );

    if (otherBox) {
        otherBox.classList.add("hidden");
    }

    const locationList =
        document.getElementById(
            "locationList"
        );

    if (locationList) {
        locationList.innerHTML = "";
    }

    clearProductDetails();

    calculateValue();

}


/* =========================================================
   CLEAR PRODUCT DETAILS
========================================================= */

function clearProductDetails() {

    const ids = [

        "detailWid",
        "detailFsn",
        "detailProductName",
        "detailLocation",
        "detailDimCategory",
        "detailCmsVertical",
        "detailSystemQty"

    ];

    ids.forEach(function (id) {

        setText(id, "-");

    });

    setText(
        "totalValue",
        "₹ 0.00"
    );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function loadAdminDashboard() {

    loadLocalRecords();

    updateAdminStats();

    updateIssueSummary();

    updateRecordsTable();

    updateOnlineUsers();

}


/* =========================================================
   ADMIN STATS
========================================================= */

function updateAdminStats() {

    const totalRecords =
        records.length;

    const totalQty =
        records.reduce(
            function (sum, item) {
                return sum +
                    Number(item.quantity || 0);
            },
            0
        );

    const totalValue =
        records.reduce(
            function (sum, item) {
                return sum +
                    Number(item.value || 0);
            },
            0
        );

    const today =
        new Date().toLocaleDateString(
            "en-IN"
        );

    const todayRecords =
        records.filter(function (item) {

            return String(item.timestamp)
                .includes(today);

        }).length;


    setText(
        "adminTotalRecords",
        totalRecords
    );

    setText(
        "adminTotalQty",
        totalQty
    );

    setText(
        "adminTotalValue",
        "₹ " + totalValue.toFixed(2)
    );

    setText(
        "adminTodayRecords",
        todayRecords
    );

}


/* =========================================================
   ISSUE SUMMARY
========================================================= */

function updateIssueSummary() {

    const container =
        document.getElementById(
            "issueSummary"
        );

    if (!container) return;

    const summary = {};

    records.forEach(function (item) {

        const issue =
            item.issue || "Unknown";

        summary[issue] =
            (summary[issue] || 0) + 1;

    });

    container.innerHTML = "";

    Object.keys(summary)
        .sort()
        .forEach(function (issue) {

            const div =
                document.createElement("div");

            div.className =
                "summary-item";

            div.innerHTML = `
                <strong>${summary[issue]}</strong>
                <span>${escapeHtml(issue)}</span>
            `;

            container.appendChild(div);

        });

    if (Object.keys(summary).length === 0) {

        container.innerHTML =
            `<div class="summary-item">
                <span>No records yet</span>
             </div>`;

    }

}


/* =========================================================
   ADMIN RECORD TABLE
========================================================= */

function updateRecordsTable(searchText = "") {

    const tbody =
        document.getElementById(
            "recordsTableBody"
        );

    if (!tbody) return;

    const search =
        searchText
            .trim()
            .toLowerCase();

    const filtered =
        records.filter(function (item) {

            if (!search) return true;

            return (

                String(item.wid)
                    .toLowerCase()
                    .includes(search) ||

                String(item.fsn)
                    .toLowerCase()
                    .includes(search) ||

                String(item.location)
                    .toLowerCase()
                    .includes(search) ||

                String(item.casperId)
                    .toLowerCase()
                    .includes(search) ||

                String(item.employeeName)
                    .toLowerCase()
                    .includes(search) ||

                String(item.issue)
                    .toLowerCase()
                    .includes(search)

            );

        });


    tbody.innerHTML = "";

    filtered
        .slice()
        .reverse()
        .forEach(function (item) {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>
                    ${escapeHtml(item.timestamp)}
                </td>

                <td>
                    ${escapeHtml(item.wid)}
                </td>

                <td>
                    ${escapeHtml(item.productName)}
                </td>

                <td>
                    ${escapeHtml(item.location)}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ₹ ${Number(item.mrp).toFixed(2)}
                </td>

                <td>
                    ₹ ${Number(item.value).toFixed(2)}
                </td>

                <td>
                    ${escapeHtml(item.issue)}
                </td>

                <td>
                    ${escapeHtml(item.casperId)}
                </td>

                <td>
                    ${escapeHtml(item.employeeName)}
                </td>

                <td>
                    ${escapeHtml(item.deviceType)}
                </td>

                <td>
                    ${escapeHtml(item.remarks || "")}
                </td>

            `;

            tbody.appendChild(tr);

        });

}


/* =========================================================
   RECORD SEARCH
========================================================= */

function searchRecords() {

    const input =
        document.getElementById(
            "recordsSearch"
        );

    updateRecordsTable(
        input ? input.value : ""
    );

}


/* =========================================================
   ONLINE USERS
========================================================= */

function updateOnlineUsers() {

    /*
       Demo version:
       The current user is shown as online.
       Later this will be connected to backend.
    */

    const container =
        document.getElementById(
            "onlineUsers"
        );

    if (!container) return;

    container.innerHTML = "";

    if (
        currentUser &&
        currentUser.role !== "Admin"
    ) {

        const div =
            document.createElement("div");

        div.className =
            "online-user";

        div.innerHTML = `

            <div class="online-user-top">

                <div>
                    <div class="online-user-name">
                        ${escapeHtml(
                            currentUser.name
                        )}
                    </div>

                    <div class="online-detail">
                        Casper ID:
                        ${escapeHtml(
                            currentUser.casperId
                        )}
                    </div>
                </div>

                <div class="online-status">
                    ● ONLINE
                </div>

            </div>

            <div class="online-detail">
                Role: ${escapeHtml(
                    currentUser.role
                )}
            </div>

            <div class="online-detail">
                Device: ${escapeHtml(
                    currentUser.deviceType
                )}
            </div>

            <div class="online-detail">
                Login:
                ${new Date(
                    currentUser.loginTime
                ).toLocaleString("en-IN")}
            </div>

        `;

        container.appendChild(div);

    } else {

        container.innerHTML = `
            <div class="online-user">
                <div class="online-status">
                    No employee currently shown online
                </div>
            </div>
        `;

    }

}


/* =========================================================
   ADMIN TABS
========================================================= */

function openAdminTab(tabName) {

    document
        .querySelectorAll(".admin-section")
        .forEach(function (section) {

            section.classList.add("hidden");

        });

    document
        .querySelectorAll(".admin-tab")
        .forEach(function (tab) {

            tab.classList.remove("active");

        });


    const section =
        document.getElementById(
            tabName
        );

    if (section) {
        section.classList.remove("hidden");
    }


    const tab =
        document.querySelector(
            `[data-admin-tab="${tabName}"]`
        );

    if (tab) {
        tab.classList.add("active");
    }


    if (tabName === "onlineSection") {

        updateOnlineUsers();

    }

    if (tabName === "recordsSection") {

        updateRecordsTable();

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    currentUser = null;

    localStorage.removeItem(
        "imt_current_user"
    );

    clearIssueForm();

    showPage("loginPage");

    setValue(
        "userPassword",
        ""
    );

    setValue(
        "adminPassword",
        ""
    );

    showToast(
        "Logged out successfully",
        "success"
    );

}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value = value;
    }

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message, type = "") {

    const old =
        document.querySelector(
            ".toast"
        );

    if (old) {
        old.remove();
    }

    const toast =
        document.createElement("div");

    toast.className =
        "toast " + type;

    toast.textContent =
        message;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.remove();

    }, 3000);

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   AUTO LOAD LOCAL DATA
========================================================= */

loadLocalRecords();


/* =========================================================
   AUTO RESTORE SESSION
========================================================= */

(function restoreSession() {

    try {

        const saved =
            localStorage.getItem(
                "imt_current_user"
            );

        if (!saved) return;

        const user =
            JSON.parse(saved);

        if (!user || !user.casperId) {
            return;
        }

        currentUser = user;

        if (user.role === "Admin") {

            showAdminPage();

        } else {

            showUserPage();

        }

    } catch (error) {

        localStorage.removeItem(
            "imt_current_user"
        );

    }

})();


/* =========================================================
   EXPOSE FUNCTIONS FOR HTML ONCLICK
========================================================= */

window.userLogin = userLogin;
window.adminLogin = adminLogin;
window.searchProduct = searchProduct;
window.submitIssue = submitIssue;
window.logout = logout;
window.calculateValue = calculateValue;
window.searchRecords = searchRecords;
window.openAdminTab = openAdminTab;
```
