

let isForcedHideCaretBar = false;

function registerCaretBar() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;

        if (showCaretBar == true) {
            checkCaretBar();
            isForcedHideCaretBar = true;
        } else if (showCaretBar == false && isForcedHideCaretBar == true) {
            hideCaretBar();
            isForcedHideCaretBar = false;
            
            caretBarFocusElement = null;
            previousCaretBarLeft = 0;
            previousCaretBarTop = 0;
        }

        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerCaretBar();

var caretBarScrollTimer = null;
window.addEventListener('scroll', function() {
    if(caretBarScrollTimer !== null) {
        clearTimeout(caretBarScrollTimer);        
    }

    let caret_bar = document.getElementsByClassName("caret_bar")[0];
    caret_bar.style.transition = "all 0s";
    checkCaretBar();

    caretBarScrollTimer = setTimeout(function() {
        let caret_bar = document.getElementsByClassName("caret_bar")[0];
        caret_bar.style.transition = null;
    }, 200);
}, { passive: true });

var showCaretBar = false;
var caretBarFocusElement = null;
var previousShowCaretBar = false;
var previousCaretBarLeft = 0;
var previousCaretBarTop = 0;
var caretBarBlinkDelay = false;
var caretBarBlinkDelayTimeout = null;

function checkCaretBar() {
    let caret_bar = document.getElementsByClassName("caret_bar")[0];

    let selection = window.getSelection();
    if (selection != null && selection.rangeCount != 0) {
        let range = selection.getRangeAt(0);
        let rect = range.getClientRects()[0];

        if (range.startOffset != range.endOffset) {
            hideCaretBar();
            previousShowCaretBar = false;
        }

        if (rect == null) {
            if (caretBarFocusElement != null) {
                rect = caretBarFocusElement.getClientRects()[0];

                let style = getComputedStyle(caretBarFocusElement);
                let fontSize = parseInt(style.fontSize.replaceAll("px", ""));
                let paddingTop = parseInt(style.paddingTop.replaceAll("px", ""));
                let paddingLeft = parseInt(style.paddingLeft.replaceAll("px", ""));
                let top = (paddingTop + rect.top);
                let height = fontSize + 1;
                let left = rect.left + paddingLeft;

                rect = {
                    top: top,
                    left: left,
                    height: height,
                };
            } else {
                hideCaretBar();
                showCaretBar = false;
                return;
            }
        }
        if ((previousCaretBarLeft != rect.left || previousCaretBarTop != rect.top) || previousShowCaretBar == false) {
            caret_bar.style.animation = "unset";
            caretBarBlinkDelay = true;
            if (caretBarBlinkDelayTimeout != null) {
                clearTimeout(caretBarBlinkDelayTimeout);
            }
            caretBarBlinkDelayTimeout = setTimeout(() => {
                caretBarBlinkDelay = false;
            }, 1000);
        } else {
            if (caretBarBlinkDelay == false) {
                caret_bar.style.animation = "showCaretBar 1s infinite";
            }
            caret_bar.style.left = rect.left + "px";
            caret_bar.style.top = (rect.top - 2) + "px";
            caret_bar.style.height = (rect.height + 4) + "px";
            setTimeout(() => {
                caret_bar.style.transition = "all 0.1s";
                caret_bar.style.display = "block";
            }, 1);
        }

        previousCaretBarLeft = rect.left;
        previousCaretBarTop = rect.top;
    } else {
        hideCaretBar();
        showCaretBar = false;
        caretBarFocusElement = null;
    }

    previousShowCaretBar = showCaretBar;
}

function hideCaretBar() {
    let caret_bar = document.getElementsByClassName("caret_bar")[0];

    if (caret_bar != null) {
        caret_bar.style.animation = "hideCaretBar 0s forwards";
        caret_bar.style.transition = "all 0s";
        caret_bar.style.display = "none";
    }
}







function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange()
        range.selectNode(node);
        range.setStart(node, 0);
    }

    if (chars.count === 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars.count >0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars.count -= node.textContent.length;
            } else {
                 range.setEnd(node, chars.count);
                 chars.count = 0;
            }
        } else {
            for (var lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                   break;
                }
            }
        }
   } 

   return range;
};

function setCurrentCursorPosition(el, chars) {
    if (chars >= 0) {
        var selection = window.getSelection();

        range = createRange(el, { count: chars });

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
};