<script setup>
import { ref, onMounted, watch } from "vue";
import QueryService from "../services/QueryService"
import QueryRule from "../components/QueryRule.vue"
import { v4 as uuid } from 'uuid'

let tableNames = ref([]);
let queries = ref([]);
let columnsObjList = [];
let selectedTableName = ref(null);
let queryName = ref("");
let rules = ref([]);
let jsonData = ref([]);

let query = {
    rules: [],
    groups: [],
};

onMounted(async () => {
    const tablesItems = await QueryService.getAllTablesNames();
    tableNames.value = tablesItems.data;
    const queriesItems = await QueryService.getAllQueries();
    queries.value = queriesItems.data;
    queryName.value = `Query ${queries.value.length + 1}`
});


watch(selectedTableName, async () => {
    resetAll();
    if (tableNames.value) {
        const response = await QueryService.getColumnNamesByTableName(selectedTableName.value);
        columnsObjList = response.data.map(item => ({ name: item.column_name, dataType: mapDataType(item.data_type) }));
        console.log(columnsObjList);
        query.tableName = selectedTableName.value;
    }
})

function resetAll() {
    columnsObjList = null;
    rules.value = [];
    query = {
        rules: [],
        groups: [],
    };
}

function onAddRuleClick() {
    const newId = uuid().toString();
    const newRule = {
        combineOperator: "AND",
        ruleId: newId
    }
    rules.value.push(newRule);
    query.rules.push(newRule);
}

function onAddGroupClick() {
    console.log("Group Created");
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

function onRuleUpdated(ruleData) {
    let foundRule = query.rules.find(rule => rule.ruleId === ruleData.ruleId);
    Object.assign(foundRule, ruleData);
}

async function onExecuteQueryClicked() {
    const response = await QueryService.executeQuery(query);
    jsonData.value = JSON.stringify(response.data[0]);
}

</script>

<template>
    <q-page padding>
        <q-input outlined v-model="queryName" type="text" label="Query Name:" class="q-mb-md" />
        <q-select outlined v-model="selectedTableName" :options="tableNames" label="Table Names:" class="q-mb-md" />
        <q-card class="my-card" v-if="selectedTableName">
            <q-card-section>
                <div class="q-pa-md q-gutter-sm">
                    <q-btn outline color="primary" label="Add Rule" icon="add" @click="onAddRuleClick" />
                    <q-btn outline color="primary" label="Add Group" icon="add" @click="onAddGroupClick" />
                </div>
                <div class="rules-and-groups">
                    <QueryRule v-for="(rule, index) in rules" :index="index" :column-list="columnsObjList"
                        :selected-table="selectedTableName" option-display="column_name" :key="rule.ruleId"
                        :rule-id="rule.ruleId" class="rule" @rule-updated="onRuleUpdated"></QueryRule>
                </div>
            </q-card-section>
        </q-card>
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