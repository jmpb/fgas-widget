function resizeModal(height) {
    return new Promise((resolve, reject) => {
        ZFAPPS.invoke('RESIZE', { width: '600px', height: height }
        ).then(
            () => { console.log('Resized Modal Successfully') }
        ).then(
            () => { resolve() }
        ).catch(
            (err) => { reject(err) }
        );
    });
}

function getSONumber() {
    return new Promise((resolve, reject) => {
        //Get salesorder data
        ZFAPPS.get('salesorder.salesorder_number').then(function (res) {
            Alpine.store('salesorder_number', res["salesorder.salesorder_number"]);
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getSOId() {
    return new Promise((resolve, reject) => {
        //Get salesorder data
        ZFAPPS.get('salesorder.salesorder_id').then(function (res) {
            Alpine.store('salesorder_id', res["salesorder.salesorder_id"]);
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getFGASRecord() {
    return new Promise((resolve, reject) => {
        
        let so_number = Alpine.store('salesorder_number');
        let fgas_record_name = so_number.replace("SO", "FGAS");

        // fetch the FGAS data for the salesorder from the custom module
        var options = {
            url: 'https://inventory.zoho.eu/api/v1/cm_fgas_record/',
            method: "GET",
            url_query: [
            {
                key: 'organization_id',
                value: '20067754174'
            },
            {
                key:"cf_record_id",
                value: fgas_record_name
            }
            ],
            connection_link_name: 'inv_conn'
        };

        ZFAPPS.request(options).then(function (response) {
            let responseJSON = JSON.parse(response.data.body);
            for (let index = 0; index < responseJSON.module_records.length; index++) {
                const element = responseJSON.module_records[index];
                if (element.record_name == fgas_record_name) {
                    Alpine.store("fgasrecord", element);
                    resolve(element);
                }
            };
            resolve("No records");
        }).catch(function (err) {
            reject(err);
        });
    })
}

async function sendInventoryUpdateWebhook(data) {
    return new Promise((resolve, reject) => {
        // Collect the records from the widget and send them to an Inventory
        //      webhook which will update/create/delete them as appropriate.

        console.log("Sending data to update webhook...");
        console.log(data);

        var options = {
            url: 'https://www.zohoapis.eu/inventory/v1/settings/incomingwebhooks/iw_updatefgasrecords/execute?auth_type=apikey&encapiKey=yA6KbHsI6g3%2ByjlVREdr0MOLpo0xqK8%2F3Hiw5i63KMQue9m1i6E70BI9Jdu4czrZ34GFs65SONoYJNzt74lbesE0NYNSepTGTuv4P2uV48xh5qDzO7pIjJiqArAQEqJOeRIiDi0yR%2FQ%3D',
            method: "POST",
            body: {
                mode: 'raw',
                raw: data
            },
            connection_link_name: 'inv_conn'
        };

        ZFAPPS.request(options).then(function (response) {
            console.log(response);
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}

async function sendInventoryCreateWebhook() {
    return new Promise((resolve, reject) => {
        // Create the records initially by sending a webhook to Inventory
        //      the webhook will run Deluge code to create the FGAS records
        //      for the SO.
        var options = {
            url: 'https://www.zohoapis.eu/inventory/v1/settings/incomingwebhooks/iw_createfgasrecords/execute?auth_type=apikey&encapiKey=yA6KbHsI6g3%2ByjlVREdr0MOLpo0xqK8%2F3Hiw5i63KMQue9m1i6E70BI9Jdu4czrZ34GFs65SONoYJNzt74lbesE0NYNSepTGTuv4P2uV48xh%2FobsBIlIjJiqArAQEqJOeRIjAyQwRvA%3D',
            method: "GET",
            url_query: [
            {
                key:"salesorder_id",
                value: Alpine.store('salesorder_id')
            }
            ],
            connection_link_name: 'inv_conn'
        };

        ZFAPPS.request(options).then(function (response) {
            console.log(response);
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}

function getFGASRelatedRecord(module_api_name, store_key) {
    return new Promise((resolve, reject) => {

        let so_number = Alpine.store('salesorder_number');
        let fgas_record_name = so_number.replace("SO", "FGAS");

        // fetch the FGAS related data for the salesorder from the custom module
        var options = {
            url: 'https://inventory.zoho.eu/api/v1/' + module_api_name +'/',
            method: "GET",
            url_query: [
            {
                key: 'organization_id',
                value: '20067754174'
            },
            {
                key:"cf_fgas_record",
                value: fgas_record_name
            }
            ],
            connection_link_name: 'inv_conn'
        };

        ZFAPPS.request(options).then(function (response) {
            let responseJSON = JSON.parse(response.data.body);
            Alpine.store(store_key, responseJSON.module_records);
            resolve(responseJSON.module_records);
        }).catch(function (err) {
            reject(err);
        });
    })
}