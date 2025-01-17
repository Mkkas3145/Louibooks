

var ignorePullToRefresh = false;

function touchStartPullToRefresh(event) {
    let menuNumber = getCurrentMenuNumber();
    if (impossiblePullToRefreshArray[menuNumber] != null && impossiblePullToRefreshArray[menuNumber] > 0) {
        return;
    }
    if (ignorePullToRefresh == false) {
        //스크롤이 0인 상태이면
        if (document.documentElement.scrollTop == 0 || event.type == "mousedown") {
            let pullToRefresh = document.getElementsByClassName("pull_to_refresh")[0];
            let pullToRefreshBox = pullToRefresh.getElementsByClassName("pull_to_refresh_box")[0];
            let pullToRefreshIcon = pullToRefresh.getElementsByClassName("pull_to_refresh_box_icon")[0];
            let pullToRefreshLoading = pullToRefresh.getElementsByClassName("pull_to_refresh_box_loading")[0];
            let contentsWrap = document.getElementsByClassName("contents")[0];
            let rect = contentsWrap.getBoundingClientRect();

            let header = document.getElementsByTagName("header")[0];
            let headerRect = header.getBoundingClientRect();

            pullToRefresh.style.width = rect.width + "px";
            pullToRefresh.style.left = rect.left + "px";
            pullToRefresh.style.top = headerRect.bottom + "px";
            pullToRefresh.style.height = "calc(calc(var(--vh, 1vh) * 100) - " + rect.top + "px)";

            //고정 앨리먼트가 있는지
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let contentsChild = contents.children;
            for (let i = 0; i < contentsChild.length; i++) {
                let style = getComputedStyle(contentsChild[i]);
                if (style.position == "sticky") {
                    let childRect = contentsChild[i].getBoundingClientRect();

                    pullToRefresh.style.top = childRect.bottom + "px";
                    pullToRefresh.style.height = "calc(calc(var(--vh, 1vh) * 100) - " + childRect.bottom + "px)";
                }
            }

            let startX = null;
            let startY = null;
            if (event.type == "touchstart") {
                startX = event.touches[0].pageX;
                startY = event.touches[0].pageY;
            } else if (event.type == "mousedown") {
                startX = event.pageX;
                startY = event.pageY;
            }

            let isBodyScroll = true;
            let firstY = null;
            let difference = null;
            let maxDifference = 150;
            function move(event) {
                let x = null;
                let y = null;
                if (event.type == "touchmove") {
                    x = event.touches[0].pageX;
                    y = event.touches[0].pageY;
                } else if (event.type == "mousemove") {
                    x = event.pageX;
                    y = event.pageY;
                }

                //터치 동작 위 아래 스크롤이 아니면
                if (firstY == null) {
                    let distanceX = startX - x;
                    let distanceY = startY - y;
                    (distanceX < 0) ? distanceX *= -1 : null;

                    //밑으로 슬라이드한거면 취소
                    if (distanceY > 0) {
                        end();
                        return;
                    }

                    (distanceY < 0) ? distanceY *= -1 : null;
                    if (distanceX > distanceY) {
                        end();
                        return;
                    } else {
                        setBodyScroll(false); //스크롤 금지
                        isBodyScroll = false;
                    }
                }
                (firstY == null) ? firstY = y : null;

                difference = (y - firstY);
                difference /= 2;
                (difference > maxDifference) ? difference = maxDifference : null;

                let percent = difference / 100;
                (percent > 1) ? percent = 1 : null;

                function curveAnimation(value, max) {
                    value /= max;
                    value--;
                    return (value * value * value + 1) * max;
                }
                difference = curveAnimation(difference, maxDifference);

                //아이콘
                let iconPercent = difference / (maxDifference / 1.5);
                (iconPercent > 1) ? iconPercent = 1 : null;

                pullToRefreshIcon.style.opacity = iconPercent;
                function drowIcon(percent) {
                    (percent > 1) ? percent = 1 : null;
                    let originalPercent = percent;
                    percent *= 0.825;
            
                    let canvas = pullToRefreshIcon.getElementsByTagName("canvas")[0];
                    let size = (canvas.clientWidth * window.devicePixelRatio);
                    size *= 2; //두배 정도의 픽셀로 렌더링
                    canvas.width = size;
                    canvas.height = size;
                    let ctx = canvas.getContext("2d");
                    
                    let centerX = (canvas.width / 2);
                    let centerY = (canvas.height / 2);
                    let radius = (size / 3);
                    let startAngle = (Math.PI * 1.5);
                    let endAngle = startAngle + (Math.PI * 2 * percent);
                    
                    let styles = getComputedStyle(canvas);
                    let color = styles.getPropertyValue('fill');

                    //선
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    let lineWidth = (size / 10);
                    ctx.lineWidth = lineWidth;
                    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                    ctx.stroke();
            
                    //삼각형
                    let triangleMaxSize = 3;
                    let triangleSize = (lineWidth / 2) * (1 + (originalPercent * triangleMaxSize));
                    let triangleX = centerX + (radius * Math.cos(endAngle));
                    let triangleY = centerY + (radius * Math.sin(endAngle));
                    let angle = endAngle + Math.PI;
                    ctx.translate(triangleX, triangleY);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.moveTo(triangleSize * -1, 0);
                    ctx.lineTo(0, triangleSize * -1);
                    ctx.lineTo(triangleSize, 0);
                    ctx.closePath();
                    ctx.fill();
                }
                drowIcon(iconPercent);

                //위치 및 회전
                let rotate = (difference / maxDifference) * 0.5;
                if (iconPercent == 1) {
                    rotate = (0.333333 + ((difference * 1.5) / maxDifference));
                }
                pullToRefreshBox.style.transform = "translateY(" + difference + "px) rotate(" + rotate + "turn)";
            }
            function end(event) {
                //조건 충족
                if (difference >= (maxDifference / 1.5)) {
                    pullToRefreshBox.style.transform = "translateY(" + difference + "px) rotate(0turn)";
                    function callback() {
                        pullToRefreshBox.style.transition = "all 0.1s";
                        pullToRefreshBox.style.transform = "translateY(70px)";
                    }
                    window.requestAnimationFrame(callback);

                    pullToRefreshIcon.style.display = "none";
                    pullToRefreshLoading.style.display = "block";

                    //현재 메뉴 새로고침
                    refreshCurrentMenu();

                    //마우스의 경우
                    if (event.type == "mouseup") {
                        //이벤트 등록
                        function onContextMenuPullToRefresh(event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        window.addEventListener("contextmenu", onContextMenuPullToRefresh);
                        //이벤트 삭제
                        function callback() {
                            window.removeEventListener("contextmenu", onContextMenuPullToRefresh);
                        }
                        window.requestAnimationFrame(callback);
                    }
                } else {
                    hidePullToRefresh(0);
                }

                //터치
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", end);
                window.removeEventListener("touchcancel", end);
                //마우스
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", end);

                //스크롤 허용
                if (isBodyScroll == false) {
                    setBodyScroll(true);
                }

                //스크롤
                for (let i = 0; i < overflowElement.length; i++) {
                    overflowElement[i].removeEventListener("scroll", end);
                }
            }

            //터치
            window.addEventListener("touchmove", move);
            window.addEventListener("touchend", end);
            window.addEventListener("touchcancel", end);
            //마우스
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", end);
            //스크롤
            function getBodyOverflowElement() {
                let menuNumber = getCurrentMenuNumber();
                let contents = document.getElementById("contents_" + menuNumber);
                let elementsWithOverflow = Array.from(contents.querySelectorAll('*')).filter(el => {
                    let computedStyle = window.getComputedStyle(el);
                    let overflow = computedStyle.overflow;
                    return overflow.indexOf('auto') != -1 || overflow.indexOf('scroll') != -1 || overflow.indexOf('overlay') != -1;
                });
                let elementsWithScroll = elementsWithOverflow.filter(el => {
                    return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
                });
                return elementsWithScroll;
            }
            let overflowElement = new Array();
            if (isTouchDevice() == true) {
                overflowElement = getBodyOverflowElement();
                for (let i = 0; i < overflowElement.length; i++) {
                    overflowElement[i].addEventListener("scroll", end);
                }
            }
        }
    }
}







/*
    type:
        0 = 사용자가 취소함
        1 = 메뉴가 새로고침됨
*/
function hidePullToRefresh(type) {
    let pullToRefresh = document.getElementsByClassName("pull_to_refresh")[0];
    let pullToRefreshBox = pullToRefresh.getElementsByClassName("pull_to_refresh_box")[0];
    let pullToRefreshIcon = pullToRefresh.getElementsByClassName("pull_to_refresh_box_icon")[0];
    let pullToRefreshLoading = pullToRefresh.getElementsByClassName("pull_to_refresh_box_loading")[0];

    if (type == 0) {
        pullToRefreshBox.style.transition = "all 0.2s";
        pullToRefreshBox.style.transform = null;
        setTimeout(() => {
            pullToRefreshBox.style.transition = null;
        }, 200);
    } else if (type == 1) {
        pullToRefreshBox.style.transition = "all 0.2s";
        pullToRefreshBox.style.transform += "scale(0)";
        pullToRefreshBox.style.opacity = 0;
        setTimeout(() => {
            pullToRefreshBox.style.transform = null;
            pullToRefreshBox.style.transition = null;
            pullToRefreshBox.style.opacity = null;
        }, 200);
    }

    setTimeout(() => {
        pullToRefreshIcon.style.display = null;
        pullToRefreshLoading.style.display = null;
    }, 200);
}









var impossiblePullToRefreshArray = new Array();
function impossiblePullToRefresh(menuNumber) {
    (impossiblePullToRefreshArray[menuNumber] == null) ? impossiblePullToRefreshArray[menuNumber] = 0 : null;
    impossiblePullToRefreshArray[menuNumber] ++;
}
function possiblePullToRefresh(menuNumber) {
    (impossiblePullToRefreshArray[menuNumber] == null) ? impossiblePullToRefreshArray[menuNumber] = 0 : null;
    impossiblePullToRefreshArray[menuNumber] --;
    (impossiblePullToRefreshArray[menuNumber] <= 0) ? impossiblePullToRefreshArray[menuNumber] = null : null;
}