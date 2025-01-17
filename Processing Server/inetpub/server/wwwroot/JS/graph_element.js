

function createGraphElement(el, info) {
    let newEl = document.createElement("div");
    newEl.classList.add("graph_element");


}

// 데이터 형식 겍체
const GraphDataFormat = function(value, date, stringValue) {
    this.value = value;
    this.date = date;
    this.stringValue = stringValue;
}

// 속성 값에 따라 그래프 데이터 겍체를 넘겨주기 위해 선언된 Map 겍체이다.
let GraphDataList = new Map();
let GraphStartTimeList = new Map(); 

// ...

let Graph = {
    valueRange : 4,
    descriptionRange : 6
}

let isGraphMouseMoveStatus = false;
let infoList = [];
let ratio = window.devicePixelRatio;
let graphTopMargin = 1;
let graphValueLineWidthList = [];
let graphValueLineHeightList = [];
let isGraphMouseDownStatus = false;
let intoIndex = -1;
let isRiseGraphValue = false;
let isRiseGraphPartValue = false;

// 옵션
var graphInfoLineColor = (getBodyDisplayColor() == "dark") ? "#353535" : "#eeeeee";
let graphMoveAtLineColor = (getBodyDisplayColor() == "dark") ? "#aaaaaa" : "#505050";
var graphLineDeclineColor = (getBodyDisplayColor() == "dark") ? "#8ab4f8" : "#3182f6";
let graphLineIncreaseColor = (getBodyDisplayColor() == "dark") ? "#e3525e" : "#e42939";
let graphLineColorDeclineTransparency = (getBodyDisplayColor() == "dark") ? "#8ab4f820" : "#3182f620";
let graphLineColorIncreaseTransparency = (getBodyDisplayColor() == "dark") ? "#e3525e20" : "#e4293920";

function checkOptionGraphElement() {
    graphInfoLineColor = (getBodyDisplayColor() == "dark") ? "#353535" : "#eeeeee";
    graphMoveAtLineColor = (getBodyDisplayColor() == "dark") ? "#aaaaaa" : "#505050";
    graphLineDeclineColor = (getBodyDisplayColor() == "dark") ? "#8ab4f8" : "#3182f6";
    graphLineIncreaseColor = (getBodyDisplayColor() == "dark") ? "#e3525e" : "#e42939";
    graphLineColorDeclineTransparency = (getBodyDisplayColor() == "dark") ? "#8ab4f820" : "#3182f620";
    graphLineColorIncreaseTransparency = (getBodyDisplayColor() == "dark") ? "#e3525e20" : "#e4293920";

    let mediaMatches1100 = window.matchMedia("screen and (max-width: 1200px)").matches;
    let mediaMatches900 = window.matchMedia("screen and (max-width: 900px)").matches;
    let mediaMatches700 = window.matchMedia("screen and (max-width: 700px)").matches;
    if (mediaMatches700 == true || getCurrentMenuName() == "workspace_dashboard") {
        Graph.descriptionRange = 3;
    } else if (mediaMatches900 == true) {
        Graph.descriptionRange = 4;
    } else if (mediaMatches1100 == true) {
        Graph.descriptionRange = 5;
    } else {
        Graph.descriptionRange = 6;
    }
}
window.addEventListener("resize", checkOptionGraphElement);

function initGraphElement() {
    let graphElementList = document.getElementsByClassName("graph");
    let graphCanvasList = document.getElementsByClassName("graph-canvas");
    let graphBottomList = document.getElementsByClassName("graph-bottom");
    let graphInfoList = document.getElementsByClassName("graph-info");

    for(let i = 0; i < graphCanvasList.length; i++) {
        let graphElement = graphElementList[i];
        let graphCanvas = graphCanvasList[i];
        let graphBottom = graphBottomList[i];
        let graphInfo = graphInfoList[i];

        // 데이터 부분
        let dataType = graphElement.getAttribute("data-type");

        graphCanvas.addEventListener("mousemove", (e) => {
            let graphData = GraphDataList.get(dataType);
            let startDate = GraphStartTimeList.get(dataType);
            isGraphMouseMoveStatus = true;

            drawGraph(graphData, graphCanvas, i, e.clientX, e.clientY, true, startDate);
        });
        //터치
        let isBodyScroll = true;
        let isIgnoreTouchMove = false;
        let isTouchLeftAndRight = false;
        let startTouchX = null;
        let startTouchY = null;
        let touchMoveX = null;
        let touchMoveY = null;
        graphCanvas.addEventListener("touchstart", (e) => {
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
        });
        graphCanvas.addEventListener("touchmove", (e) => {
            if (isIgnoreTouchMove == false) {
                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                touchMoveX = x;
                touchMoveY = y;
                let distanceX = startTouchX - x;
                let distanceY = startTouchY - y;
                (distanceX < 0) ? distanceX *= -1 : null;
                (distanceY < 0) ? distanceY *= -1 : null;
    
                //터치 동작 좌우 스크롤이 아니면
                if ((distanceY > distanceX) == false || isTouchLeftAndRight == true) {
                    setBodyScroll(false); //스크롤 금지
                    isBodyScroll = false;
                    isTouchLeftAndRight = true;
    
                    isGraphMouseMoveStatus = true;
                    let graphData = GraphDataList.get(dataType);
                    let startDate = GraphStartTimeList.get(dataType);
                    drawGraph(graphData, graphCanvas, i, e.touches[0].clientX, e.touches[0].clientY, true, startDate);
                } else {
                    isIgnoreTouchMove = true;
                }
            }
        });

        graphCanvas.addEventListener("mouseleave", () => {
            let graphData = GraphDataList.get(dataType);

            isGraphMouseMoveStatus = false;
            isGraphMouseDownStatus = false;

            drawGraph(graphData, graphCanvas, i);
            
            // ...

            const graphValueView = document.getElementsByClassName('graph-value-view')[i];

            graphValueView.style.animation = 'fadeOut 0.25s';

            setTimeout(() => {
                graphValueView.style.visibility = 'hidden';
            }, 240);
        });

        graphCanvas.addEventListener("mousedown", (e) => {
            let graphData = GraphDataList.get(dataType);
            let startDate = GraphStartTimeList.get(dataType);
            isGraphMouseDownStatus = true;

            drawGraph(graphData, graphCanvas, i, e.clientX, e.clientY, i, true, startDate);
        });
        
        graphCanvas.addEventListener("mouseup", (e) => {
            if (touchMoveX == null && touchMoveY == null) {
                let graphData = GraphDataList.get(dataType);
                let startDate = GraphStartTimeList.get(dataType);

                isGraphMouseDownStatus = false;
                drawGraph(graphData, graphCanvas, i, e.clientX, e.clientY, true, startDate);
            }
        });
        graphCanvas.addEventListener("touchend", (e) => {
            if (isTouchLeftAndRight == true) {
                let graphData = GraphDataList.get(dataType);
                let startDate = GraphStartTimeList.get(dataType);

                isIgnoreTouchMove = false;
                isTouchLeftAndRight = false;
                isGraphMouseDownStatus = false;
                drawGraph(graphData, graphCanvas, i, touchMoveX, touchMoveY, true, startDate);
                touchMoveX = null;
                touchMoveY = null;
                startTouchX = null;
                startTouchY = null;
    
                if (isBodyScroll == false) {
                    setBodyScroll(true); //스크롤 허용
                }
            }
        });

        let graphData = GraphDataList.get(dataType);
        let startDate = GraphStartTimeList.get(dataType);
        initGraph(graphData, graphCanvas, graphBottom, graphInfo, i, startDate);
    }
};

addEventListener("resize", () => {
    setStateGraph();
});

function setStateGraph() {
    ratio = window.devicePixelRatio;

    let graphElementList = document.getElementsByClassName("graph");
    let graphCanvasList = document.getElementsByClassName("graph-canvas");
    let graphBottomList = document.getElementsByClassName("graph-bottom");

    if(graphElementList == undefined) {
        return;
    }

    for(let i = 0; i < graphCanvasList.length; i++) {
        let graphElement = graphElementList[i];
        let graphCanvas = graphCanvasList[i];
        let graphBottom = graphBottomList[i];

        //
        graphBottom.textContent = "";

        // 데이터 부분
        let dataType = graphElement.getAttribute("data-type");
        let graphData = GraphDataList.get(dataType);
        let startDate = graphData.startDate;

        if (graphData == null) {
            continue;
        }

        drawGraph(graphData, graphCanvas, i, 0, 0, false, startDate);
        setGraphBottom(graphBottom, graphData);
    }
}

// ...

function initGraph(graphData, graphCanvas, graphBottom, graphInfo, index, startDate) {
    drawGraph(graphData, graphCanvas, index, 0, 0, false, startDate);
    setGraphBottom(graphBottom, graphData);
    setGraphInfo(graphData, graphInfo);
}

function drawGraph(graphData, graphCanvas, index, x = 0, y = 0, isValueViewVisible = false, startDate) {
    if (graphData == null) {
        return;
    }
    const startValue = graphData[0].value;
    const lastValue = graphData[graphData.length - 1].value;

    if(startValue > lastValue) { // 그래프 상승폭
        isRiseGraphValue = false;
    } else { // 그래프 하락폭
        isRiseGraphValue = true;
    }

    const width = graphCanvas.offsetWidth;
    const height = graphCanvas.offsetHeight;
    const graphX = graphCanvas.getBoundingClientRect().left;
    const graphY = graphCanvas.getBoundingClientRect().top;

    graphCanvas.width = width * ratio;
    graphCanvas.height = height * ratio;
    
    const currentCanvas = graphCanvas.getContext("2d");

    currentCanvas.beginPath();
    currentCanvas.fillStyle = graphInfoLineColor;

    let percent = 0;

    for(let i = 0; i < Graph.valueRange; i++) {
        const drawY = height * percent;
        const thickness = 2 * ratio;

        currentCanvas.fillRect(
            0,
            drawY * ratio,
            width * ratio,
            thickness,
        );

        percent += 1 / (Graph.valueRange - 1);
    }

    drawGraphValueLines(graphCanvas, graphData);
    onGraphMouseMove(graphData, graphCanvas, x, y, isValueViewVisible, index, startDate);
}

function onGraphMouseMove(graphData, graphCanvas, x, y, isValueViewVisible, index, startDate) {
    const width = graphCanvas.offsetWidth;
    const height = graphCanvas.offsetHeight;
    const graphX = graphCanvas.getBoundingClientRect().left;
    const graphY = graphCanvas.getBoundingClientRect().top;

    const currentCanvas = graphCanvas.getContext("2d");

    const thickness = 1 * ratio;
    //const interval = 2 * ratio;

    currentCanvas.beginPath();
    currentCanvas.moveTo((x - graphX) * ratio, 0);
    currentCanvas.lineTo((x - graphX) * ratio, height * ratio);
    currentCanvas.lineWidth = thickness;
    currentCanvas.setLineDash([0]);
    currentCanvas.strokeStyle = graphMoveAtLineColor;
    currentCanvas.lineJoin = 'round';
    currentCanvas.stroke();

    // ...
    
    let percent = (x - graphX) / width;
    let selectedIndex = Math.ceil((graphData.length - 1) * percent);
    let selectedX = selectedIndex / (graphData.length - 1);

    let nextSelectedIndex = selectedIndex;
    let selectedY = graphValueLineHeightList[selectedIndex - 1];
    let nextSelectedY = graphValueLineHeightList[nextSelectedIndex];

    let nextSelectedPercent = selectedY - nextSelectedY;
    let valueLineWidth = width * (1 / (graphData.length - 1));

    let nextPercent = 1 - Math.abs((x - graphX) - (valueLineWidth * selectedIndex)) / valueLineWidth

    let list = [];
        
    for(let j = 0; j < graphData.length; j++) {
        list.push(graphData[j].value);
    }

    let maxValue = Math.max(...list) * graphTopMargin;

    currentCanvas.beginPath();
    if(isRiseGraphPartValue) {
        currentCanvas.fillStyle = graphLineIncreaseColor;
    } else {
        currentCanvas.fillStyle = graphLineDeclineColor;
    }
    currentCanvas.setLineDash([0]);

    let currentY = selectedY - (nextSelectedPercent * nextPercent);

    currentCanvas.arc(
        (x - graphX) * ratio,
        currentY,
        6 * ratio,
        0,
        Math.PI * 2
    ); // x, y, 크기

    currentCanvas.fill();

    // ...

    let roundSelectedIndex = Math.round((graphData.length - 1) * percent);

    currentCanvas.beginPath();
    if(isRiseGraphPartValue) {
        currentCanvas.fillStyle = graphLineColorIncreaseTransparency;
    } else {
        currentCanvas.fillStyle = graphLineColorDeclineTransparency;
    }
    currentCanvas.arc(
        graphValueLineWidthList[roundSelectedIndex],
        graphValueLineHeightList[roundSelectedIndex],
        12 * ratio,
        0,
        Math.PI * 2
    ); // x, y, 크기

    currentCanvas.fill();

    // ...

    const graphValueView = document.getElementsByClassName('graph-value-view')[index];
    const graphValue = document.getElementsByClassName('graph-value')[index];
    const graphAdditional = document.getElementsByClassName('graph-additional')[index];
    const graphDescription = document.getElementsByClassName('graph-description')[index];

    const graphValueDifferentialView = document.getElementsByClassName('graph-value-differential-view')[index];
    const graphValueDifferentialIncrease = document.getElementsByClassName('graph-differential-increase')[index];
    const graphDifferentialDescription = document.getElementsByClassName('graph-differential-description')[index];

    if(isGraphMouseDownStatus) {
        if(intoIndex == -1) {
            intoIndex = roundSelectedIndex;

            graphValueView.style.visibility = 'hidden';
        } else {
            let intoWidth = graphValueLineWidthList[intoIndex];

            currentCanvas.beginPath();
            currentCanvas.moveTo(intoWidth, 0);
            currentCanvas.lineTo(intoWidth, height * ratio);
            currentCanvas.lineWidth = thickness;
            currentCanvas.setLineDash([0]);
            currentCanvas.strokeStyle = graphMoveAtLineColor;
            currentCanvas.lineJoin = 'round';
            currentCanvas.stroke();

            drawGraphValueLinesPart(graphData, graphCanvas, intoWidth, x, roundSelectedIndex, currentY);

            // ...

            currentCanvas.beginPath();
            if(isRiseGraphPartValue) {
                currentCanvas.fillStyle = graphLineIncreaseColor;
            } else {
                currentCanvas.fillStyle = graphLineDeclineColor;
            }
            currentCanvas.setLineDash([0]);

            currentCanvas.arc(
                graphValueLineWidthList[intoIndex],
                graphValueLineHeightList[intoIndex],
                6 * ratio,
                0,
                Math.PI * 2
            ); // x, y, 크기

            currentCanvas.fill();

            // ...

            if(graphValueDifferentialView.visibility != 'visible') {
                graphValueDifferentialView.style.visibility = 'visible';
            }

            const currentX = x - graphX;
            const intoValueLineWidth = graphValueLineWidthList[intoIndex] / ratio;

            let averageWidth = intoValueLineWidth - (intoValueLineWidth - currentX) / 2;

            graphValueDifferentialView.style.left = (averageWidth - (graphValueDifferentialView.clientWidth / 2) + "px");

            currentY = (selectedY - (nextSelectedPercent * nextPercent)) / ratio;

            const graphValueDifferentialViewMargin = 30;
            let currentGraphDifferentialValueViewY = (currentY - (graphValueDifferentialView.clientHeight)) - graphValueDifferentialViewMargin;

            // ...

            let intoValue = graphData[intoIndex].value;
            let roundSelectedValue = graphData[roundSelectedIndex].value;

            //let intoDescription = graphData[intoIndex].date;
            //let roundSelectedDescription = graphData[roundSelectedIndex].date;

            //
            let date = new Date(graphData[intoIndex].date + " UTC");
            const intoDescription = date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ".";
            date = new Date(graphData[roundSelectedIndex].date + " UTC");
            const roundSelectedDescription = date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ".";

            let selectedValue = graphData[roundSelectedIndex].value;
            let percnetValue;

            percnetValue = Math.round(
                ((selectedValue - intoValue) / intoValue * 100) * 10
            ) / 10 + '%';

            if(intoValueLineWidth < currentX) { // is dragging right
                isRiseGraphPartValue = intoValue < roundSelectedValue;

                if(isRiseGraphPartValue) {
                    percnetValue = Math.round(
                        ((selectedValue - intoValue) / intoValue * 100) * 10
                    ) / 10 + '%';
                } else {
                    percnetValue = '-' + Math.round(
                        ((intoValue - selectedValue) / selectedValue * 100) * 10
                    ) / 10 + '%';
                }
            } else { // is dragging left
                isRiseGraphPartValue = intoValue > roundSelectedValue;

                if(isRiseGraphPartValue) {
                    percnetValue = Math.round(
                        ((intoValue - selectedValue) / selectedValue * 100) * 10
                    ) / 10 + '%';
                } else {
                    percnetValue = '-' + Math.round(
                        ((selectedValue - intoValue) / intoValue * 100) * 10
                    ) / 10 + '%';
                }

                let temp = intoValue;
                intoValue = roundSelectedValue;
                roundSelectedValue = temp;
            }

            if(intoValue == 0 || selectedValue == 0) {
                percnetValue = '100%';
            }

            if(percnetValue == '-Infinity%') {
                percnetValue = '-100%';
            }

            if(isRiseGraphPartValue) {
                currentCanvas.fillStyle = graphLineColorDeclineTransparency;

                graphValueDifferentialIncrease.innerText =
                    '+' + (roundSelectedValue - intoValue) + ' (' + percnetValue + ') ' + '증가';
            } else {
                currentCanvas.fillStyle = graphLineColorIncreaseTransparency;

                graphValueDifferentialIncrease.innerText =
                    (roundSelectedValue - intoValue) + ' (' + percnetValue + ') ' + '감소';
            }

            graphValueDifferentialIncrease.style.color = (isRiseGraphPartValue) ? graphLineIncreaseColor : graphLineDeclineColor;

            graphDifferentialDescription.innerText = '(' + intoDescription + ' ~ ' + roundSelectedDescription + ')';

            if(currentGraphDifferentialValueViewY < 0) { // is top
                currentGraphDifferentialValueViewY =
                    (currentGraphDifferentialValueViewY + (graphValueDifferentialView.clientHeight + graphValueDifferentialViewMargin)) + graphValueDifferentialViewMargin;

                graphValueDifferentialView.style.top = (currentGraphDifferentialValueViewY + "px");
            } else { // is bottom
                graphValueDifferentialView.style.top = (currentGraphDifferentialValueViewY + "px");
            }
        }
    } else {
        intoIndex = -1;

        isRiseGraphPartValue = isRiseGraphValue;

        if(isValueViewVisible == false) return;

        currentY = (selectedY - (nextSelectedPercent * nextPercent)) / ratio;

        const currentX = x - graphX;

        if(graphValueView.visibility != 'visible') {
            graphValueView.style.visibility = 'visible';
            graphValueDifferentialView.style.visibility = 'hidden';

            graphValueView.style.animation = 'fadeIn 0.25s';
        }

        if(currentX < graphValueView.clientWidth / 2) {
            graphValueView.style.left = "0px";
        } else if(currentX + (graphValueView.clientWidth / 2) > width) {
            graphValueView.style.left = (width - graphValueView.clientWidth) + "px";
        } else {
            graphValueView.style.left = (currentX - (graphValueView.clientWidth / 2)) + "px";
        }

        const graphValueViewMargin = 30;
        let currentGraphValueViewY = (currentY - graphValueView.clientHeight) - graphValueViewMargin;

        let timePast = getTimePast(new Date(graphData[roundSelectedIndex].date));

        if(roundSelectedIndex > -1) {
            let selectedValue = graphData[roundSelectedIndex].value;
            graphValue.innerText = graphData[roundSelectedIndex].stringValue;
            graphAdditional.innerText = "(" + timePast + ")";

            let date = new Date(graphData[roundSelectedIndex].date + " UTC");
            graphDescription.innerText = date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ".";

            if(currentGraphValueViewY < 0) { // is top
                currentGraphValueViewY =
                    (currentGraphValueViewY + (graphValueView.clientHeight + graphValueViewMargin)) + graphValueViewMargin;

                graphValueView.style.top = (currentGraphValueViewY + "px");
            } else { // is bottom
                graphValueView.style.top = (currentGraphValueViewY + "px");
            }
        }
    }
}

function drawGraphValueLinesPart(graphData, graphCanvas, intoWidth, x, roundSelectedIndex, currentY) {
    const width = graphCanvas.offsetWidth;
    const height = graphCanvas.offsetHeight;
    const graphX = graphCanvas.getBoundingClientRect().left;
    const graphY = graphCanvas.getBoundingClientRect().top;

    let intoValue = graphData[intoIndex].value;
    let roundSelectedValue = graphData[roundSelectedIndex].value;

    // ...

    const currentCanvas = graphCanvas.getContext("2d");

    const thickness = 3 * ratio;

    currentCanvas.beginPath();
    currentCanvas.moveTo(intoWidth, graphValueLineHeightList[intoIndex]);
    currentCanvas.lineWidth = thickness;
    currentCanvas.setLineDash([0]);
    currentCanvas.strokeStyle = (isRiseGraphPartValue) ? graphLineIncreaseColor : graphLineDeclineColor;
    currentCanvas.lineJoin = 'round';

    if(intoIndex < roundSelectedIndex) { // is dragging right
        for(let i = intoIndex; i < roundSelectedIndex + 1; i++) {
            currentCanvas.lineTo(
                graphValueLineWidthList[i],
                graphValueLineHeightList[i]
            );

            if(i == roundSelectedIndex) {
                currentCanvas.lineTo(
                    (x - graphX) * ratio,
                    currentY
                );
            }
        }
    } else if(intoIndex > roundSelectedIndex) { // is dragging left
        for(let i = intoIndex; i > roundSelectedIndex; i--) {
            currentCanvas.lineTo(
                graphValueLineWidthList[i - 1],
                graphValueLineHeightList[i - 1]
            );

            if((i - 1) == roundSelectedIndex) {
                currentCanvas.lineTo(
                    (x - graphX) * ratio,
                    currentY
                );
            }
        }
    } else {
        currentCanvas.lineTo(
            (x - graphX) * ratio,
            currentY
        );
    }

    currentCanvas.stroke();

    currentCanvas.strokeStyle = 'rgba(0, 0, 0, 0)';

    currentCanvas.lineTo(
        (x - graphX) * ratio,
        (height + graphY) * ratio
    );

    currentCanvas.lineTo(
        graphValueLineWidthList[intoIndex],
        (height + graphY) * ratio
    );

    currentCanvas.stroke();

    if(isRiseGraphPartValue) {
        currentCanvas.fillStyle = graphLineColorIncreaseTransparency;
    } else {
        currentCanvas.fillStyle = graphLineColorDeclineTransparency;
    }

    currentCanvas.fill();
}

function drawGraphValueLines(graphCanvas, graphData) {
    const width = graphCanvas.offsetWidth;
    const height = graphCanvas.offsetHeight;
    const graphX = graphCanvas.getBoundingClientRect().left;
    const graphY = graphCanvas.getBoundingClientRect().top;

    const currentCanvas = graphCanvas.getContext("2d");

    const thickness = 3 * ratio;

    currentCanvas.beginPath();
    currentCanvas.lineWidth = thickness;
    currentCanvas.setLineDash([0]);
    if(isRiseGraphValue) {
        currentCanvas.strokeStyle = graphLineIncreaseColor;
    } else {
        currentCanvas.strokeStyle = graphLineDeclineColor;
    }
    currentCanvas.lineJoin = 'round';

    let percnet = 0.0;

    graphValueLineWidthList = [];
    graphValueLineHeightList = [];

    for(let i = 0; i < graphData.length; i++) {
        let list = [];
        
        for(let j = 0; j < graphData.length; j++) {
            list.push(graphData[j].value);
        }

        let maxValue = Math.max(...list) * graphTopMargin;
        let rangeValue = getRangeValue(maxValue);
        
        const valuePercent = list[i] / rangeValue;

        currentCanvas.lineTo(
            ((width * percnet)) * ratio,
            (height - (height * valuePercent)) * ratio
        );

        graphValueLineWidthList.push(
            ((width * percnet)) * ratio
        );

        graphValueLineHeightList.push(
            (height - (height * valuePercent)) * ratio
        );

        percnet = (i + 1) / (graphData.length - 1);
    }

    /*
    const gradient = currentCanvas.createLinearGradient(0, 0, 0, 350);

    gradient.addColorStop(0, 'rgba(0, 100, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(0, 100, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(0, 100, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');

    currentCanvas.fillStyle = gradient;
    */

    //currentCanvas.fillStyle = 'rgba(0, 100, 255, 0.1)';
    //currentCanvas.fill();
    
    currentCanvas.stroke();
}

function setGraphBottom(graphBottom, graphData) {
    if (graphData == null) {
        return;
    }
    for(let i = 0; i < Graph.descriptionRange; i++) {
        let percent = i / (Graph.descriptionRange - 1);
        let selectedIndex = Math.round((graphData.length - 1) * percent);

        let bottom = document.createElement('div');
        let bottomInner = document.createElement('div');
        let p = document.createElement('p');
        let date = new Date(graphData[selectedIndex].date + " UTC");
        p.innerText = date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ".";

        bottom.textContent = "";
        bottom.appendChild(bottomInner);
        bottom.appendChild(p);

        graphBottom.appendChild(bottom);
    }
}

function setGraphInfo(graphData, graphInfo) {
    if (graphData == null) {
        return;
    }
    let list = [];
        
    for(let j = 0; j < graphData.length; j++) {
        list.push(graphData[j].value);
    }

    let maxValue = Math.max(...list) * graphTopMargin;
    let rangeValue = getRangeValue(maxValue);
    let value = rangeValue;

    let p = document.createElement('p');
    p.innerText = getNumberUnit(rangeValue);

    graphInfo.appendChild(p);

    for(let i = 0; i < Graph.valueRange - 1; i++) {
        let percent = (i + 1) / (Graph.valueRange - 1);

        let value = Math.round(rangeValue * (1 - percent));

        let p = document.createElement('p');
        p.innerText = getNumberUnit(value);

        graphInfo.appendChild(p);
    }
}

function getRangeValue(maxValue) {
    if(maxValue == 0) {
        return 0;
    }
    if(maxValue < 10) {
        return 10;
    } else if(maxValue < 20) {
        return 20;
    } else if(maxValue < 30) {
        return 30;
    } else if(maxValue < 40) {
        return 40;
    } else if(maxValue < 50) {
        return 50;
    } else if(maxValue < 60) {
        return 60;
    } else if(maxValue < 70) {
        return 70;
    } else if(maxValue < 80) {
        return 80;
    } else if(maxValue < 90) {
        return 90;
    } else if(maxValue < 100) {
        return 100;
    } else if(maxValue < 250) {
        return 250;
    } else if(maxValue < 500) {
        return 500;
    } else if(maxValue < 750) {
        return 750;
    } else if(maxValue < 1000) {
        return 1000;
    } else if(maxValue < 1500) {
        return 1500;
    } else if(maxValue < 2000) {
        return 2000;
    } else if(maxValue < 2500) {
        return 2500;
    } else if(maxValue < 3000) {
        return 3000;
    } else if(maxValue < 3500) {
        return 3500;
    } else if(maxValue < 4000) {
        return 4000;
    } else if(maxValue < 4500) {
        return 4500;
    } else if(maxValue < 5000) {
        return 5000;
    } else if(maxValue < 5500) {
        return 5500;
    } else if(maxValue < 6000) {
        return 6000;
    } else if(maxValue < 6500) {
        return 6500;
    } else if(maxValue < 7000) {
        return 7000;
    } else if(maxValue < 7500) {
        return 7500;
    } else if(maxValue < 8000) {
        return 8000;
    } else if(maxValue < 8500) {
        return 8500;
    } else if(maxValue < 9000) {
        return 9000;
    } else if(maxValue < 9500) {
        return 9500;
    } else if(maxValue < 10000) {
        return 10000;
    } else if(maxValue < 20000) {
        return 20000;
    } else if(maxValue < 30000) {
        return 30000;
    } else if(maxValue < 40000) {
        return 40000;
    } else if(maxValue < 50000) {
        return 50000;
    } else if(maxValue < 60000) {
        return 60000;
    } else if(maxValue < 70000) {
        return 70000;
    } else if(maxValue < 70000) {
        return 70000;
    } else if(maxValue < 80000) {
        return 80000;
    } else if(maxValue < 90000) {
        return 90000;
    } else if(maxValue < 90000) {
        return 90000;
    } else if(maxValue < 100000) {
        return 100000;
    } else if(maxValue < 200000) {
        return 200000;
    } else if(maxValue < 300000) {
        return 300000;
    } else if(maxValue < 400000) {
        return 400000;
    } else if(maxValue < 500000) {
        return 500000;
    } else if(maxValue < 600000) {
        return 600000;
    } else if(maxValue < 700000) {
        return 700000;
    } else if(maxValue < 800000) {
        return 800000;
    } else if(maxValue < 900000) {
        return 900000;
    } else if(maxValue < 1000000) {
        return 1000000;
    } else if(maxValue < 2000000) {
        return 2000000;
    } else if(maxValue < 3000000) {
        return 3000000;
    } else if(maxValue < 4000000) {
        return 4000000;
    } else if(maxValue < 5000000) {
        return 5000000;
    } else if(maxValue < 6000000) {
        return 6000000;
    } else if(maxValue < 7000000) {
        return 7000000;
    } else if(maxValue < 8000000) {
        return 8000000;
    } else if(maxValue < 9000000) {
        return 9000000;
    } else if(maxValue < 10000000) {
        return 10000000;
    } else if(maxValue < 20000000) {
        return 20000000;
    } else if(maxValue < 30000000) {
        return 30000000;
    } else if(maxValue < 40000000) {
        return 40000000;
    } else if(maxValue < 50000000) {
        return 50000000;
    } else if(maxValue < 60000000) {
        return 60000000;
    } else if(maxValue < 70000000) {
        return 70000000;
    } else if(maxValue < 80000000) {
        return 80000000;
    } else if(maxValue < 90000000) {
        return 90000000;
    } else if(maxValue < 100000000) {
        return 100000000;
    } else if(maxValue < 200000000) {
        return 200000000;
    } else if(maxValue < 300000000) {
        return 300000000;
    } else if(maxValue < 400000000) {
        return 400000000;
    } else if(maxValue < 500000000) {
        return 500000000;
    } else if(maxValue < 600000000) {
        return 600000000;
    } else if(maxValue < 700000000) {
        return 700000000;
    } else if(maxValue < 800000000) {
        return 800000000;
    } else if(maxValue < 900000000) {
        return 900000000;
    } else if(maxValue < 1000000000) {
        return 1000000000;
    } else if(maxValue < 2000000000) {
        return 2000000000;
    } else if(maxValue < 3000000000) {
        return 3000000000;
    } else if(maxValue < 4000000000) {
        return 4000000000;
    } else if(maxValue < 5000000000) {
        return 5000000000;
    } else if(maxValue < 6000000000) {
        return 6000000000;
    } else if(maxValue < 7000000000) {
        return 7000000000;
    } else if(maxValue < 8000000000) {
        return 8000000000;
    } else if(maxValue < 9000000000) {
        return 9000000000;
    } else if(maxValue < 10000000000) {
        return 10000000000;
    }
}