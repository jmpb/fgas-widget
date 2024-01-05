
function resizeModal() {
    return new Promise((resolve, reject) => {
        ZFAPPS.invoke('RESIZE', { width: '1000px', height: '800px' }
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
        }).catch(function (err) {
            reject(err);
        });
    })
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