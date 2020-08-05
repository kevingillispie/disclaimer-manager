var sloganText = '';
var clientName = '';
var sectionIndex = 0;

function addNewClient(e) {
    var createRequest = new XMLHttpRequest();
    var createFormData = new FormData();
    createFormData.append(`request`, `createClient`);
    createFormData.append(`request_type`, `POST`);
    createFormData.append(`header_type`, `json`);

    let clientName = document.getElementById('new-client-name').value;
    let sloganText = document.getElementById('new-client-slogan').value;

    createFormData.append(`clientName`, clientName);
    createFormData.append(`sloganText`, sloganText);
    createRequest.onreadystatechange = function() {
        if (createRequest.readyState == 4 && createRequest.status == 200) {
            document.getElementById('new-client-name').value = "";
            document.getElementById('new-client-slogan').value = "";
            location.reload();
        }
    }

    createRequest.open("POST", `/disclaimer-manager.php`, true);
    createRequest.send(createFormData);
}

function addClientBtnListener() {
    let addClientModal = document.getElementById("add-client-modal");
    addClientModal.classList.toggle("show");
}

function createClientSection(imgSrc, client, slogan) {
    let section = document.createElement('SECTION');
    let img = document.createElement('IMG');
    let div = document.createElement('DIV');
    let h2 = document.createElement('H2');
    let a = document.createElement('A');
    let p = document.createElement('P');
    let clientTextNode = document.createTextNode(client);
    let sloganTextNode = document.createTextNode(slogan);

    img.setAttribute('src', imgSrc);
    section.appendChild(img);

    a.setAttribute('href', "/disclaimer-editor.html?clientName=" + client);
    a.appendChild(clientTextNode);

    p.appendChild(sloganTextNode);
    p.setAttribute('contenteditable', 'true');
    p.addEventListener('click', function(event) {
        clientName = this.parentElement.children[0].innerText;
        confirmChange(event);
    });
    p.addEventListener('keyup', function() {
        sloganText = this.innerText;
    });

    h2.appendChild(a);
    div.appendChild(h2);
    div.appendChild(p);

    section.appendChild(div);
    section.setAttribute("style", "--section-index:"+sectionIndex);
    sectionIndex++;

    document.getElementsByTagName('MAIN')[0].insertAdjacentElement("beforeend", section);
}

function getClients() {
    var getRequest = new XMLHttpRequest();
    var getFormData = new FormData();
    getFormData.append(`request`, `getClients`);
    getFormData.append(`request_type`, `POST`);
    getFormData.append(`header_type`, `json`);

    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            let results = JSON.parse(getRequest.responseText);
            results.forEach(client => {
                createClientSection(client.img, client.client, client.slogan);
            });
        }
    }

    getRequest.open("POST", `/disclaimer-manager.php`, true);
    getRequest.send(getFormData);
}
getClients();

function cancelChanges() {
    location.reload();
}

function confirmChange(event) {
    let popover = document.createElement('DIV');
    let message = document.createTextNode('Save changes?');
    let confirmBtn = document.createElement('BUTTON');
    let cancelBtn = document.createElement('BUTTON');

    confirmBtn.innerText = 'Save';
    confirmBtn.addEventListener('click', function() {
        updateSlogan(sloganText);
    });

    cancelBtn.innerText = 'Cancel';
    cancelBtn.addEventListener('click', cancelChanges);

    popover.setAttribute('class', 'popover');
    popover.appendChild(message);
    popover.appendChild(confirmBtn);
    popover.appendChild(cancelBtn);

    event.target.insertAdjacentElement('afterend', popover);
}

function updateSlogan(text) {
    var updateRequest = new XMLHttpRequest();
    var updateFormData = new FormData();
    updateFormData.append(`request`, `updateSlogan`);
    updateFormData.append(`request_type`, `POST`);
    updateFormData.append(`header_type`, `json`);
    updateFormData.append(`clientName`, clientName.substr(0, 4));
    updateFormData.append(`sloganText`, sloganText);

    updateRequest.onreadystatechange = function() {
        if (updateRequest.readyState == 4 && updateRequest.status == 200) {
            location.reload();
        }
    }

    updateRequest.open("POST", `/disclaimer-manager.php`, true);
    updateRequest.send(updateFormData);
}

(function() {
    document.getElementById('add-new').children[0].addEventListener('click', addClientBtnListener);
    document.getElementById('add-yes').addEventListener('click', function(event) {
        addNewClient(event);
    });
    document.getElementById('add-no').addEventListener('click', addClientBtnListener);
})();
