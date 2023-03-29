<script setup>
import { ref, onMounted, watch } from "vue";
import QueryService from "../services/QueryService"
import QueryGroup from "../components/QueryGroup.vue"


let tableNames = ref([]);
let queries = ref([]);
let columnsList = ref([]);
let selectedTableName = ref(null);
let queryName = ref("");
let jsonData = ref([]);
const depth = 1;
const componentKey = ref(0);


let query = {
    data: null,
    tableName: "",
};

onMounted(async () => {
    const tablesItems = await QueryService.getAllTablesNames();
    tableNames.value = tablesItems.data;
    const queriesItems = await QueryService.getAllQueries();
    queries.value = queriesItems.data;
    queryName.value = `Query ${queries.value.length + 1}`
});


watch(selectedTableName, async () => {
    componentKey.value += 1
    if (tableNames.value) {
        const response = await QueryService.getColumnNamesByTableName(selectedTableName.value);
        columnsList.value = response.data.map(item => ({ name: item.column_name, dataType: mapDataType(item.data_type) }));
        console.log(columnsList);
        query.tableName = selectedTableName.value;
    }
})

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
    jsonData.value = JSON.stringify(response.data[0]);
}

function onUpdated(data) {
    query.data = data;
}


</script>

<template>
    <q-page padding>
        <q-input outlined v-model="queryName" type="text" label="Query Name:" class="q-mb-md" />
        <q-select outlined v-model="selectedTableName" :options="tableNames" label="Table Names:" class="q-mb-md" />
        <QueryGroup v-if="selectedTableName"  :key="componentKey" :depth="depth" :selected-table="selectedTableName" :column-list="columnsList" @updated="onUpdated"/>
        <q-separator />
        <div class="footer-section">
            <q-btn color="primary" label="Execute Query" class="q-mt-md" @click="onExecuteQueryClicked" />
            <q-btn outline color="primary" label="Save Query" class="q-mt-md" />
        </div>
        <div>
            <h4>Query Result:</h4>
            <q-input autogrow v-model="jsonData" type="textarea" />
        </div>
    </q-page>
</template>

<style scoped>
.rule {
    margin-bottom: 5px;
    ;
}

.footer-section {
    display: flex;
    direction: rtl;
}
</style>