<template>
    <q-page padding>
        <div class="q-mb-md">
            <div class="pin-to-right q-mb-md">
                <q-btn outlined color="red" label="Logout" class="" @click="onLogoutClicked" />
            </div>
            <q-select outlined v-model="selectedQuery" :options="queries" option-label="name" label="Queries:"
                class="q-mb-md" :disable="queries.length === 0" @update:model-value="onSelectedQueryUpdated" />
            <div class="flex">
                <q-btn outline color="primary" label="Load Query" class="q-ml-md" @click="onLoadQueryClicked" />
                <q-btn outline color="primary" label="Delete Query" class="q-ml-md" @click="onDeleteQueryClicked" />
                <q-btn outline color="primary" label="Create Query" class="q-ml-md" @click="onCreateQueryClicked" />
            </div>
            <q-dialog v-model="isShowDeleteModal">
                <q-card>
                    <q-card-section>
                        <q-card-section class="row items-center">
                            <q-icon name="warning" color="warning" size="4rem" />
                            <span class="q-ml-sm">Are you sure you want to delete ?</span>
                        </q-card-section>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn label="No" color="red" @click="isShowDeleteModal = false" />
                        <q-btn label="Yes" color="green" @click="onYesClicked" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <q-separator />
        <div v-if="isShowQuerySection">
            <q-input outlined v-model="queryName" type="text" label="Query Name:" class="q-mb-md" />
            <q-select outlined v-model="selectedTableName" :options="tableNames" label="Table Names:" class="q-mb-md" />
            <QueryGroup v-if="selectedTableName" :key="componentKey" :depth="depth" :selected-table="selectedTableName"
                :column-list="columnsList" @updated="onUpdated" :data="groupData" />
            <q-separator />
            <div class="pin-to-right q-mt-md">
                <q-btn color="orange" label="Execute Query" class="q-ml-md" @click="onExecuteQueryClicked" />
                <q-btn color="green" label="Save Query" @click="onSaveQueryClicked" />
            </div>
            <div>
                <div v-if="queryExecutionResultJson">
                    <span><strong>Found {{ queryExecutionResultsNumber }} Results:</strong></span>
                    <q-input class="query-results" v-model="queryExecutionResultJson" type="textarea" />
                    <div class="pin-to-right q-mt-md">
                        <q-btn outline color="secondary" label="Export to Json" @click="exportWasClicked" />
                    </div>
                </div>
            </div>
        </div>

    </q-page>
</template>


<script setup>
import { ref, onMounted, watch, toRaw } from "vue";
import QueryService from "../services/QueryService"
import QueryGroup from "../components/QueryGroup.vue"
import deepCopy from "../utilities.js"
import { useRouter } from 'vue-router';
import toastr from 'toastr';
import 'toastr/toastr.scss';
import { createErrorMessage } from '../utilities';

const router = useRouter();

let groupData = ref(null);
let tableNames = ref([]);
let columnsList = ref([]);
let selectedTableName = ref(null);
let queryExecutionResultJson = ref([]);
let queryExecutionResultsNumber = ref(0);

const depth = 1;
const componentKey = ref(0);

let queries = ref([]);
let queryName = ref("");
let selectedQuery = ref("");
let isShowQuerySection = ref(false);
let isShowDeleteModal = ref(false);

let query = {
    data: null,
    tableName: "",
};

onMounted(async () => {
    try {
        const tablesResponse = await QueryService.getAllTablesNames();
        tableNames.value = tablesResponse.data;
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Error getting tables list");
    }
    try {
        const queriesResponse = await QueryService.getQueries();
        queries.value = queriesResponse.data;
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Error getting queries list");
    }

});


watch(selectedTableName, async () => {
    componentKey.value += 1
    if (selectedTableName.value) {
        try {
            const response = await QueryService.getColumnNames(selectedTableName.value);
            columnsList.value = response.data.map(item => ({ name: item.column_name, dataType: mapDataType(item.data_type) }));
            query.tableName = selectedTableName.value;
        } catch (err) {
            const message = createErrorMessage(err);
            toastr.error(message, "Error getting columns list");
        }
    }
})

watch(selectedQuery, () => {
    if (selectedQuery.value) {
        queryName.value = selectedQuery.value.queryName;
    }
});

async function onExecuteQueryClicked() {
    try {

        queryExecutionResultJson.value = null;
        queryExecutionResultsNumber.value = 0;

        const response = await QueryService.executeQuery(query);
        queryExecutionResultJson.value = JSON.stringify(response.data[0]);
        queryExecutionResultsNumber.value = response.data[1].rowCount;
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Error while running the query");
    }
}

function onUpdated(groupData) {
    query.data = groupData;
}

function onLoadQueryClicked() {
    if (selectedQuery.value) {
        clearQueryData();
        loadSelectedQuery();
    }
}

function onDeleteQueryClicked() {
    if (selectedQuery.value) {
        isShowDeleteModal.value = true;
    }
}

function onCreateQueryClicked() {
    clearQueryData();
    selectedQuery.value = null;
    isShowQuerySection.value = true;
    queryName.value = `Query ${queries.value.length + 1}`
}

function loadSelectedQuery() {
    selectedTableName.value = selectedQuery.value.body.tableName;
    queryName.value = selectedQuery.value.name
    groupData.value = selectedQuery.value.body.data;
    query.data = deepCopy(toRaw(groupData.value));
    isShowQuerySection.value = true;
}

function onSaveQueryClicked() {
    saveQuery();
    queryExecutionResultJson.value = null;
    queryExecutionResultsNumber.value = 0;
}


function mapDataType(dataType) {
    if (dataType.startsWith("character")) {
        return "STRING";
    } else if (dataType.startsWith("integer")) {
        return "NUMBER";
    } else if (dataType.startsWith("timestamp") || dataType.startsWith("date")) {
        return "DATE";
    }
    return "UNKNOWN";
}

async function saveQuery() {
    //Update
    if (selectedQuery.value) {
        updateSelectedQuery();
    } else { //New
        createNewQuery();
    }
}

async function updateSelectedQuery() {
    const updatedQueryObj = {
        name: queryName.value,
        body: query,
        id: selectedQuery.value.id,
    }
    try {
        const response = await QueryService.updateQuery(updatedQueryObj);
        const updatedQuery = response.data;
        let foundQuery = queries.value.find(query => query.id == updatedQuery.id);
        if (foundQuery) {
            foundQuery = { ...updatedQuery }
        }
    } catch (error) {
        const message = createErrorMessage(err);
        toastr.error(message, "Error while trying to save the updated query");
    }
}

async function createNewQuery() {
    const newQueryObj = {
        name: queryName.value,
        body: query,
    }
    try {

        const response = await QueryService.createQuery(newQueryObj);
        queries.value.push(response.data);
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Error while trying to save the new query");
    }
}

async function onYesClicked() {
    try {
        isShowDeleteModal.value = false;
        await QueryService.deleteQuery(selectedQuery.value.id);
        queries.value = queries.value.filter(query => query.id !== selectedQuery.value.id);
        selectedQuery.value = null;
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Error while trying to delete selected query");
    }
}

function onSelectedQueryUpdated() {
    clearQueryData();
}

function clearQueryData() {
    componentKey.value += 1
    selectedTableName.value = null;
    queryExecutionResultJson.value = null;
    query = {
        data: null,
        tableName: "",
    };
    isShowQuerySection.value = false;
}

function onLogoutClicked() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    router.push("/");
}

function exportWasClicked() {
    const data = JSON.stringify(queryExecutionResultJson.value, null, 2);
    const file = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    let filename;
    if (queryName.value) {
        filename = `${queryName.value} Results.json`;
    } else {
        filename = "query_results.json";
    }
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

</script>


<style scoped>
.pin-to-right {
    display: flex;
    direction: rtl;
}

.query-results {
    max-height: 1000px;
}
</style>