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

async function getFGASRecord() {
    return new Promise((resolve, reject) => {
        
        let so_number = Alpine.store('salesorder_number');
        let fgas_record_name = so_number.replace("SO", "FGAS");

        // fetch the FGAS data for the salesorder from the custom module
        var options = {
            url: 'https://www.zohoapis.eu/inventory/v1/cm_fgas_record/',
            method: "GET",
            url_query: [
            {
                key: 'organization_id',
                value: '<org-id>'
            },
            {
                key:"cf_linked_sales_order",
                value: fgas_record_name
            }
            ],
            connection_link_name: 'inv_conn'
        };

        ZFAPPS.request(options).then(function (response) {
            let responseJSON = JSON.parse(response.data.body);
            console.log(responseJSON);
            if (responseJSON.module_records) {
                for (let index = 0; index < responseJSON.module_records.length; index++) {
                    const element = responseJSON.module_records[index];
                    if (element.record_name == fgas_record_name) {
                        console.log("found fgas record: ");
                        console.log(element);
                        Alpine.store("fgasrecord", element);
                        resolve(element);
                    }
                };
            }
            resolve(undefined);
        }).catch(function (err) {
            reject(err);
        });
    });
}

async function sendInventoryUpdateWebhook(data) {
    return new Promise((resolve, reject) => {
        // Collect the records from the widget and send them to an Inventory
        //      webhook which will update/create/delete them as appropriate.

        console.log("Sending data to update webhook...");
        console.log(data);

        var options = {
            url: '<webhook-url>',
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
            url: '<webhook-url>',
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

        console.log("Fetching related records for" + store_key);
        let fgas_record_id = Alpine.store('fgasrecord_id');

        // fetch the FGAS related data for the salesorder from the custom module
        var options = {
            url: 'https://www.zohoapis.eu/inventory/v1/' + module_api_name +'/',
            method: "GET",
            url_query: [
            {
                key: 'organization_id',
                value: '<org-id>'
            },
            {
                key:"cf_fgas_record",
                value: fgas_record_id
            }
            ],
            connection_link_name: 'inv_conn'
        };

        console.log("fgas record name is: ");
        console.log(fgas_record_id);

        ZFAPPS.request(options).then(function (response) {
            let responseJSON = JSON.parse(response.data.body);
            console.log(responseJSON);
            Alpine.store(store_key, responseJSON.module_records);
            resolve(responseJSON.module_records);
        }).catch(function (err) {
            reject(err);
        });
    })
}
