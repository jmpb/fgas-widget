document.addEventListener('alpine:init', () => {	
    Alpine.data('FGASRecord', () => ({
        loading: true,
        record: {},

        getRecord() {
            console.log("Fetching record...");
            getFGASRecord().then((data) => {
                this.record = data;
                this.loading = false;
            });
        }

    }));

    Alpine.data('FGASItems', () => ({
        loading: true,
        records: [],
        activeIndex: 0,
        activeRecord: {},

        getItemRecords() {
            console.log("Fetching item records...");
            getFGASRelatedRecord("cm_fgas_item", "fgasitems").then((data) => {
                this.records = data;
                this.activeRecord = this.records[this.activeIndex];
                this.calcTotalGas();
                this.loading = false;
            });
        },

        nextItemRecord() {
            this.activeIndex < this.records.length ? this.activeIndex++ : this.activeIndex = 0;
            this.activeRecord = this.records[this.activeIndex];
            this.calcTotalGas();
        },

        prevItemRecord() {
            this.activeIndex > 0 ? this.activeIndex-- : this.activeIndex = this.records.length;
            this.activeRecord = this.records[this.activeIndex];
            this.calcTotalGas();
        },

        setActiveRecord(id) {
            this.activeIndex = id;
            this.activeRecord = this.records[this.activeIndex];
            this.calcTotalGas();
        },

        addItem() {
            let newItem = {
                cf_fgas_item_id: "New item",
                cf_sku: "",
                cf_charge_g: "",
                cf_gas_type: "",
                cf_quantity: "",
                cf_notes: "",
                is_new: true
            };
            this.records.push(newItem);
            this.activeIndex = this.records.length - 1;
            this.activeRecord = this.records[this.activeIndex];
            this.calcTotalGas();
        },

        deleteItem() {
            if (confirm("Really delete FGAS record for item: " + this.activeRecord.cf_fgas_item_id + "? This cannot be undone.")) {
                this.records.splice(this.activeIndex, 1);
                this.activeIndex = 0;
                this.activeRecord = this.records[this.activeIndex];
                this.calcTotalGas();
            }
        },

        calcTotalGas() {
            this.activeRecord.total_gas = this.activeRecord.cf_quantity * this.activeRecord.cf_charge_g;
        }
    }));

    Alpine.data('FGASInstallers', () => ({
        loading: true,
        records: [],
        activeIndex: 0,
        activeRecord: {},

        getInstallerRecords() {
            console.log("Fetching installer records...");
            getFGASRelatedRecord("cm_fgas_installer", "fgasinstallers").then((data) => {
                this.records = data;
                this.activeRecord = this.records[this.activeIndex];
                this.loading = false;
            });
        },

        nextItemRecord() {
            this.activeIndex < this.records.length ? this.activeIndex++ : this.activeIndex = 0;
            this.activeRecord = this.records[this.activeIndex];
        },

        prevItemRecord() {
            this.activeIndex > 0 ? this.activeIndex-- : this.activeIndex = this.records.length;
            this.activeRecord = this.records[this.activeIndex];
        },

        setActiveRecord(id) {
            this.activeIndex = id;
            this.activeRecord = this.records[this.activeIndex];
        },

        addInstaller() {
            let newItem = {
                cf_installer_id: "New Installer",
                cf_installer_name: "",
                cf_fgas_number: "",
                cf_notes: "",
                is_new: true
            };
            this.records.push(newItem);
            this.activeIndex = this.records.length - 1;
            this.activeRecord = this.records[this.activeIndex];
        },

        deleteInstaller() {
            if (confirm("Really delete FGAS record for installer: " + this.activeRecord.cf_installer_name + "? This cannot be undone.")) {
                this.records.splice(this.activeIndex, 1);
                this.activeIndex = 0;
                this.activeRecord = this.records[this.activeIndex];
            }
        },
    }));
});