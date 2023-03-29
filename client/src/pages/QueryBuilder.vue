<script setup>
import { ref, onMounted, watch, toRaw } from "vue";
import QueryService from "../services/QueryService"
import QueryGroup from "../components/QueryGroup.vue"

let groupData = ref(null);
let tableNames = ref([]);
let columnsList = ref([]);
let selectedTableName = ref(null);
let queryExecutionResultJson = ref([]);
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
    const tablesResponse = await QueryService.getAllTablesNames();
    tableNames.value = tablesResponse.data;
    const queriesResponse = await QueryService.getQueries();
    queries.value = queriesResponse.data;
});


watch(selectedTableName, async () => {
    componentKey.value += 1
    if (tableNames.value) {
        const response = await QueryService.getColumnNames(selectedTableName.value);
        columnsList.value = response.data.map(item => ({ name: item.column_name, dataType: mapDataType(item.data_type) }));
        query.tableName = selectedTableName.value;
    }
})

watch(selectedQuery, () => {
    if (selectedQuery.value) {
        queryName.value = selectedQuery.value.queryName;
    }
});

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

async function onExecuteQueryClicked() {
    const response = await QueryService.executeQuery(query);
    queryExecutionResultJson.value = JSON.stringify(response.data[0]);
}

function onUpdated(groupData) {
    query.data = groupData;
}

function onLoadQueryClicked() {
    if (selectedQuery.value) {
        loadSelectedQuery();
    }
}

function onDeleteQueryClicked() {
    if (selectedQuery.value) {
        isShowDeleteModal.value = true;
    }
}

function onCreateQueryClicked() {
    selectedQuery.value = null;
    isShowQuerySection.value = true;
    queryName.value = `Query ${queries.value.length + 1}`
}

function loadSelectedQuery() {
    selectedTableName.value = selectedQuery.value.body.tableName;
    queryName.value = selectedQuery.value.name
    groupData.value = selectedQuery.value.body.data;
    query.data = {...toRaw(groupData.value)};
    isShowQuerySection.value = true;
}

function onSaveQueryClicked() {
    saveQuery();
}

async function saveQuery() {
    //Update
    if (selectedQuery.value) {
        const response = await QueryService.updateQuery(selectedQuery.value);
        const updatedQuery = response.data;
        const foundQuery = queries.value.find(query => query.id == updatedQuery.id);
        if (foundQuery) {
            foundQuery = updatedQuery;
        }
    } else { //New
        try {
            const newQuery = {
                name: queryName.value,
                body: query
            }
            const response = await QueryService.createQuery(newQuery);
            queries.value.push(response.data);
        } catch (error) {
            console.log(error);
        }
    }
}

async function onYesClicked() {
    try {
        isShowDeleteModal.value = false;
        await QueryService.deleteQuery(selectedQuery.value.id);
        queries.value = queries.value.filter(query => query.id !== selectedQuery.value.id);
        selectedQuery.value = null;
    } catch (error) {
        console.log(error);
    }
}
function onSelectedQueryUpdated() {
    isShowQuerySection.value = false;
    componentKey.value += 1
    selectedTableName.value = null;
}
</script>

<template>
    <q-page padding>
        <div class="q-mb-md">
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
            <div class="lower-section q-mt-md">
                <q-btn color="red" label="Execute Query" class="q-ml-md" @click="onExecuteQueryClicked" />
                <q-btn outline color="primary" label="Save Query" @click="onSaveQueryClicked" />
            </div>
            <div>
                <h4>Query Result:</h4>
                <q-input autogrow v-model="queryExecutionResultJson" type="textarea" />
            </div>

        </div>

    </q-page>
</template>

<style scoped>
.lower-section {
    display: flex;
    direction: rtl;
}
</style>