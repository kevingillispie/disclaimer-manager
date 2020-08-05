var selectedDisclaimerList = {};
const _ajaxAction = {
    'c': 'createDisclaimer',
    'r': 'getDisclaimers',
    'u': 'updateDisclaimer',
    'd': 'deleteDisclaimer'
}

function createListElement(selectedDisclaimerList, key) {
    let listItem = document.createElement("LI");
    listItem.setAttribute("class", "selected-list-item");
    listItem.setAttribute("title", "Click to remove");
    listItem.setAttribute("data-record-id", key);
    listItem.innerText = selectedDisclaimerList[key];
    listItem.addEventListener("click", function(event) {
        this.remove();
        delete selectedDisclaimerList[event.target.dataset.recordId];
    });
    return listItem;
}

function addButtonListener(addBtn) {
    if (addBtn.parentElement.parentElement.children[1].value.length <= 0) {
        alert("The disclaimer textbox is empty.");
    } else if (document.getElementById("selected-text").children.length < 5) {
        selectedDisclaimerList[addBtn.parentElement.parentElement.dataset.recordId] = addBtn.parentElement.parentElement.children[1].value;
    } else {
        alert("WARNING:\r\n5-disclaimer maximum.");
        return;
    }
    let key = addBtn.parentElement.parentElement.dataset.recordId;

    if (document.getElementById("selected-text").children.length > 0) {
        let items = document.getElementById("selected-text").children;
        for (let i = 0; i < items.length; i++) {
            if (items[i].dataset.recordId == key) {
                alert("This disclaimer is \n already selected.");
                return;
            }
        }
        document.getElementById("selected-text").insertAdjacentElement("beforeend", createListElement(selectedDisclaimerList, key));
    } else {
        document.getElementById("selected-text").insertAdjacentElement("beforeend", createListElement(selectedDisclaimerList, key));
    }
}

function deleteButtonListener(disclaimerData) {
    let confirmDelete = document.getElementById("delete-disclaimer-modal");
    confirmDelete.classList.toggle("show");
    document.getElementsByClassName("delete-yes")[0].setAttribute("data-record-id", disclaimerData.dataset.recordId);
}

function addUpdateButtonListeners() {
    let selectBtns = document.getElementsByClassName("update-btn");
    selectBtns[selectBtns.length - 1].addEventListener('click', function() {
        let recordId = this.parentElement.parentElement.dataset.recordId;
        let disclaimer = this.parentElement.parentElement.children[1].value;
        updateDisclaimer(recordId, disclaimer);
    });
}

function addAddButtonListeners() {
    let addBtns = document.getElementsByClassName("add-btn");
    addBtns[addBtns.length - 1].addEventListener('click', function() {
        addButtonListener(this);
    });
}

function addDeleteButtonListiners() {
    let deleteBtns = document.getElementsByClassName("delete-disclaimer");
    deleteBtns[deleteBtns.length - 1].addEventListener('click', function() {
        deleteButtonListener(this);
    });
}

function createNewDisclaimerContainer(recordId) {
    let numOfDisclaimers = (document.querySelectorAll("h3 > span")) ? document.querySelectorAll("h3 > span").length : 0;
    let num = numOfDisclaimers + 1;
    return `
    <div class="disclaimer" data-record-id="` + recordId + `">
        <h3>Disclaimer <sup>#</sup><span>` + num + `</span></h3>
        <textarea placeholder="Add disclaimer text here..."></textarea>
        <div class="disclaimer-btn-container">
            <button class="update-btn">Save / Update</button>
            <p class="delete-disclaimer" data-record-id="` + recordId + `">DELETE</p>
            <button class="add-btn">Add <svg width="20" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zM140 300h116v70.9c0 10.7 13 16.1 20.5 8.5l114.3-114.9c4.7-4.7 4.7-12.2 0-16.9l-114.3-115c-7.6-7.6-20.5-2.2-20.5 8.5V212H140c-6.6 0-12 5.4-12 12v64c0 6.6 5.4 12 12 12z" class=""></path></svg></button>
        </div>
        <hr />
    </div>`;
}

function addNewDisclaimerListener() {
    document.getElementById('new-disclaimer-btn').addEventListener("click", function() {
        document.getElementById('new-disclaimer-btn').insertAdjacentHTML("beforebegin", createNewDisclaimerContainer(document.getElementById("new-disclaimer-btn").parentElement.children.length));
        addUpdateButtonListeners();
        addAddButtonListeners();
        addDeleteButtonListiners();
        createDisclaimerRecord();
    });
}

function loadDisclaimer(recordId) {
    document.getElementById('new-disclaimer-btn').insertAdjacentHTML("beforebegin", createNewDisclaimerContainer(recordId));
    addUpdateButtonListeners();
    addAddButtonListeners();
    addDeleteButtonListiners();
}

function generateEmbedCode() {
    let selectedDisclaimers = [];
    if (document.getElementById('selected-text').children[0]) {
        let listItems = Array.from(document.getElementById('selected-text').children);
        listItems.forEach(element => {
            selectedDisclaimers.push(element.dataset.recordId);
        });
        document.getElementById("code-container").value = `<div id="disclaimer-container"><iframe width="100%" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" src="/disclaimer-fallback.php?disclaimers=` + selectedDisclaimers + `"></iframe></div><script defer>var selectedRequest=new XMLHttpRequest,selectedFormData=new FormData;function replaceIncomingHTMLEntities(e){let t=e[1].length,s=JSON.parse(e[1]),n=[];for(;t--;)n[t]=String.fromCharCode(parseInt(s[t]));return e[0]+" "+n.join("")}selectedFormData.append("request_type","POST"),selectedFormData.append("header_type","json"),selectedFormData.append("selectedDisclaimers",JSON.stringify([` + selectedDisclaimers + `])),selectedRequest.onreadystatechange=function(){if(4==selectedRequest.readyState&&200==selectedRequest.status){let e=JSON.parse(selectedRequest.responseText);console.log(e);let t=document.getElementById("disclaimer-container");t.children[0].remove();e.forEach(e=>{console.log(e);let s=document.createElement("P");s.setAttribute("class","current-disclaimer"),s.innerText=replaceIncomingHTMLEntities(e),t.insertAdjacentElement("beforeend",s)})}},selectedRequest.open("POST","https://likdashstage.wpengine.com/disclaimer-manager/disclaimer-retriever.php",!0),selectedRequest.send(selectedFormData);</script>`;
        document.getElementById('generated-code-modal').classList.toggle("show");
    } else {
        alert("Please select a disclaimer.");
    }
}

////////////////////////////////
///////////////////////////////

function ajaxRequest(action, {...data}) {
    var _request = new XMLHttpRequest();
    var _formData = new FormData();
    _formData.append(`request_type`, `POST`);
    _formData.append(`header_type`, `json`);
    _formData.append(`request`, action);
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let element = data[key];
            _formData.append(key, element);
        }
    }
    return {_request, _formData};
}

function createDisclaimerRecord() {
    var clientName = document.getElementsByTagName('H2')[0].innerText;
    let ajaxData = ajaxRequest(_ajaxAction.c, {'client': clientName});

    ajaxData._request.onreadystatechange = function() {
        if (ajaxData._request.readyState == 4 && ajaxData._request.status == 200) {
            let results = ajaxData._request.responseText;
            if (results == '1') {
                alert("Record created!\r\nPlease update disclaimer's text.");
                location.reload();
            } else {
                console.log(results);
                alert("Tell Dizzy:\r\n\n" + results);
            }
        }
    }

    ajaxData._request.open("POST", `/disclaimer-editor.php?uncache=` + Math.floor(Math.random() * 999999999), true);
    ajaxData._request.send(ajaxData._formData);
}

function replaceIncomingHTMLEntities(disclaimer) {
    let l = disclaimer.length;
    let parsed = JSON.parse(disclaimer);
    let d = [];
    while (l--) {
        d[l] = String.fromCharCode(parseInt(parsed[l]));
    }
    return d.join("");
}

function replaceOutgoingHTMLEntities(disclaimer) {
    while (disclaimer[0] == "*" || disclaimer[0] == "†" || disclaimer[0] == "‡") {
        disclaimer = disclaimer.substr(1);
    }
    let l = disclaimer.length;
    let d = [];
    while (l--) {
        d[l] = disclaimer.charCodeAt(l);
    }
    return JSON.stringify(d);
}

function getDisclaimers() {
    var urlQueryString = location.search;
    var utmParameters = new URLSearchParams(urlQueryString);
    var clientName = utmParameters.get("clientName");
    let ajaxData = ajaxRequest(_ajaxAction.r, {'client': clientName.substr(0, 4)});

    ajaxData._request.onreadystatechange = function() {
        if (ajaxData._request.readyState == 4 && ajaxData._request.status == 200) {
            let results = JSON.parse(ajaxData._request.responseText);
            results.forEach(disclaimer => {
                loadDisclaimer(disclaimer['record_id']);
                document.querySelector("[data-record-id=\"" + disclaimer['record_id'] + "\"]").children[1].value = replaceIncomingHTMLEntities(disclaimer["disclaimer"]);
            });
            addNewDisclaimerListener();
        }
    }

    ajaxData._request.open("POST", `/disclaimer-editor.php?uncache=` + Math.floor(Math.random() * 999999999), true);
    ajaxData._request.send(ajaxData._formData);
}

function updateDisclaimer(record_id, disclaimer) {
    var escapedDisclaimer = replaceOutgoingHTMLEntities(disclaimer);
    let ajaxData = ajaxRequest(_ajaxAction.u, {'record_id': record_id, 'disclaimer': escapedDisclaimer});

    ajaxData._request.onreadystatechange = function() {
        if (ajaxData._request.readyState == 4 && ajaxData._request.status == 200) {
            let results = ajaxData._request.responseText;
            if (results == '1') {
                alert("Disclaimer updated.");
                location.reload();
            } else {
                console.log(results);
                alert("Tell Dizzy:\r\n\n" + results);
            }
        }
    }

    ajaxData._request.open("POST", `/disclaimer-editor.php?uncache=` + Math.floor(Math.random() * 999999999), true);
    ajaxData._request.send(ajaxData._formData);
}

function deleteDisclaimer(record_id) {
    let ajaxData = ajaxRequest(_ajaxAction.d, {'record_id': record_id});

    ajaxData._request.onreadystatechange = function() {
        if (ajaxData._request.readyState == 4 && ajaxData._request.status == 200) {
            let results = ajaxData._request.responseText;
            if (results == '1') {
                alert("Disclaimer deleted.");
                location.reload();
            } else {
                console.log(results);
                alert("Tell Dizzy:\r\n\n" + results);
            }
        }
    }

    ajaxData._request.open("POST", `/disclaimer-editor.php?uncache=` + Math.floor(Math.random() * 999999999), true);
    ajaxData._request.send(ajaxData._formData);
}

window.onload = function() {
    getDisclaimers();
    const client = new URLSearchParams(location.search);
    document.querySelector('h2 > a').innerText = client.get("clientName");
    document.querySelector(".disclaimer-container.selected > button").addEventListener("click", generateEmbedCode);
    let deleteYes = document.getElementsByClassName("delete-yes");
    let deleteNo = document.getElementsByClassName("delete-no");
    deleteYes[deleteYes.length - 1].addEventListener("click", function() {
        deleteDisclaimer(this.dataset.recordId);
    });
    deleteNo[deleteNo.length - 1].addEventListener("click", function() {
        deleteButtonListener(this);
    });
    document.getElementById("code-closer-btn").addEventListener("click", function() {
        document.getElementById("generated-code-modal").classList.toggle("show");
    });
}
