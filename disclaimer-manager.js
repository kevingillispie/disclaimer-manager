function getClients() {
    var getRequest = new XMLHttpRequest();
    var getFormData = new FormData();
    getFormData.append(`request`, `getClients`);
    getFormData.append(`request_type`, `POST`);
    getFormData.append(`header_type`, `json`);

    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            let results = JSON.parse(getRequest.responseText);
            console.log(results);
        }
    }

    getRequest.open("POST", `/disclaimer-manager/disclaimer-manager.php`, true);
    getRequest.send(getFormData);
}
getClients();