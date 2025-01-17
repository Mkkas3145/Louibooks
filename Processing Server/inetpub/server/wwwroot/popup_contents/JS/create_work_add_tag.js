



function createWorkAddTag(input) {
    let value = input.value.trim();
    value = value.replaceAll(",", "");
    let parent = input.parentElement;

    if (value != "") {
        createWorkAddTagValue(parent, value);
        input.value = "";
    }
}
function createWorkAddTagValue(el, title) {
    title = title.trim();

    let html = `
        ` + title + `
        <div class = "create_work_step2_tag_box_valuebox_delete md-ripples" onclick = "createWorkDeleteTagValue(this);" onmouseenter = "hoverInformation(this, getLanguage('delete'));">
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
        </div>
    `;

    let valuebox_wrap = el.getElementsByClassName("create_work_step2_tag_box_valuebox_wrap")[0];
    let value = valuebox_wrap.getElementsByClassName("create_work_step2_tag_box_valuebox");

    for (let i = 0; i < value.length; i++) {
        if (value[i].innerText.trim() == title) {
            value[i].remove();
        }
    }

    let newElement = document.createElement("div");
    newElement.innerHTML = html;
    newElement.classList.add("create_work_step2_tag_box_valuebox");
    valuebox_wrap.append(newElement);
}
function createWorkDeleteTagValue(el) {
    let parent = el.parentElement;
    parent.style.width = parent.clientWidth + "px";
    parent.style.height = parent.clientHeight + "px";
    setTimeout(() => {
        parent.style.width = "0px";
        parent.style.height = "0px";
        parent.style.paddingLeft = "0px";
        parent.style.margin = "0px";
        parent.style.fontSize = "0px";
    }, 1);

    setTimeout(() => {
        parent.remove();
    }, 200);
}

function getValueCreateWorkTag(el) {
    let value = el.getElementsByClassName("create_work_step2_tag_box_valuebox");
    let array = new Array();

    for (let i = 0; i < value.length; i++) {
        let createtextnode = value[i].getElementsByTagName("createtextnode");
        for (let j = 0; j < createtextnode.length; j++) {
            createtextnode[j].remove();
        }
        array[array.length] = value[i].innerText.trim();
    }

    return array;
}