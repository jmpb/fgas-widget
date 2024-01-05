
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

function getFGASRecord(module_api_name, url_query, compare_property, store_key) {
    return new Promise((resolve, reject) => {
        // fetch the FGAS data for the salesorder from the custom module
        var options = {
            url: 'https://inventory.zoho.eu/api/v1/' + module_api_name + '/',
            method: "GET",
            url_query: [
            {
                key: 'organization_id',
                value: '20067754174'
            }
            ],
            connection_link_name: 'inv_conn'
        };

        options.url_query.push(url_query);

        ZFAPPS.request(options).then(function (response) {
            let responseJSON = JSON.parse(response.data.body);
            let so_number = Alpine.store('salesorder_number');
            let fgas_record_name = so_number.replace("SO", "FGAS");
            for (let index = 0; index < responseJSON.module_records.length; index++) {
                const element = responseJSON.module_records[index];
                if (element.compare_property == fgas_record_name) {
                    Alpine.store(store_key, element);
                    resolve();
                }
            };
        }).catch(function (err) {
            reject(err);
        });
    })
}