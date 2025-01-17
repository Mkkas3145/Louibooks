

function setMenuButton(property, data) {
    resetMenuButton();
    checkMenuButton(property, data);
}
function resetMenuButton() {
    let sidebar = document.getElementsByClassName("big_sidebar_item");

    for (let i = 0; i < sidebar.length; i++) {
        if (sidebar[i].classList.contains("big_sidebar_item_selected")) {
            sidebar[i].classList.remove("big_sidebar_item_selected");

            let el_line = sidebar[i].getElementsByClassName("big_sidebar_item_line")[0];
            el_line.style.animation = "hideBigSidebarItemLine 0.2s forwards";
            setTimeout(() => {
                el_line.style.animation = "unset";
            }, 200);
        }
    }

    sidebar = document.getElementsByClassName("small_sidebar_item");
    for (let i = 0; i < sidebar.length; i++) {
        if (sidebar[i].classList.contains("small_sidebar_item_selected")) {
            sidebar[i].classList.remove("small_sidebar_item_selected");

            let el_line = sidebar[i].getElementsByClassName("small_sidebar_item_left_line")[0];
            el_line.style.animation = "hideSmallSidebarItemLine 0.2s forwards";
            setTimeout(() => {
                el_line.style.animation = "unset";
            }, 200);
        }
    }

    sidebar = document.getElementsByClassName("footer_item");

    for (let i = 0; i < sidebar.length; i++) {
        if (sidebar[i].classList.contains("footer_item_selected")) {
            sidebar[i].classList.remove("footer_item_selected");

            let el_line = sidebar[i].getElementsByClassName("footer_item_line")[0];
            el_line.style.animation = "hideFooterItemLine 0.2s forwards";
            setTimeout(() => {
                el_line.style.animation = "unset";
            }, 200);
        }
    }
}
let previousCheckMenuProperty = null;
let previousCheckMenuData = null;
function checkMenuButton(property, data) {
    let menuName = property["name"];
    let el = document.getElementsByName("big_sidebar_item_" + menuName);

    for (let i = 0; i < el.length; i++) {
        let elData = el[i].getAttribute("data");
        if ((elData == null || elData == data) && el[i].classList.contains("big_sidebar_item_selected") == false) {
            let el_line = el[i].getElementsByClassName("big_sidebar_item_line")[0];
            el[i].classList.add("big_sidebar_item_selected");
            el_line.style.animation = "showBigSidebarItemLine 0.2s forwards";
            setTimeout(() => {
                el_line.style.animation = "unset";
            }, 200);
        }
    }

    el = document.getElementById("small_sidebar_item_" + menuName);
    if (el != null && el.classList.contains("small_sidebar_item_selected") == false) {
        el_line = el.getElementsByClassName("small_sidebar_item_left_line")[0];

        el.classList.add("small_sidebar_item_selected");
        el_line.style.animation = "showSmallSidebarItemLine 0.2s forwards";
        setTimeout(() => {
            el_line.style.animation = "unset";
        }, 200);
    }

    //
    el = document.getElementById("footer_item_" + menuName);
    if (el != null && el.classList.contains("footer_item_selected") == false) {
        el_line = el.getElementsByClassName("footer_item_line")[0];

        el.classList.add("footer_item_selected");
        el_line.style.animation = "showFooterItemLine 0.2s forwards";
        setTimeout(() => {
            el_line.style.animation = "unset";
        }, 200);
    }

    previousCheckMenuProperty = property;
    previousCheckMenuData = data;
}







function registerCheckMenuButton() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;
        
        if (previousCheckMenuProperty != null || previousCheckMenuData != null) {
            checkMenuButton(previousCheckMenuProperty, previousCheckMenuData);
        }
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerCheckMenuButton();