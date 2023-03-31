<template>
    <div class="rule-row">
        <q-select v-if="index > 0" outlined v-model="selectedCombineRuleOperator" :options="ruleCombineOperatorOptions"
            label="Operator" class="rule-operator" @update:model-value="onRuleOperatorUpdated" />
        <label v-else class="first-rule-label"><strong>ARE: </strong></label>
        <q-select outlined v-model="selectedColumn" :options="columnList" option-label="name" label="Column Name"
            class="rule-column-name q-ml-md" @update:model-value="onSelectedColumnUpdated" />
        <component :data="data" :key="componentKey" :is="componentType" :selected-table="selectedTable" :selected-column="selectedColumn"
            @rule-updated="onRuleUpdated"></component>
        <q-btn flat><q-icon name="delete_outline" color="grey" @click="onRemoveClicked"/></q-btn>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, toRaw } from "vue";
import QueryRuleText from "../components/QueryRuleText.vue";
import QueryRuleNumber from "../components/QueryRuleNumber.vue";
import QueryRuleDate from "../components/QueryRuleDate.vue";
import deepCopy from "../utilities.js"

const ruleCombineOperatorOptions = ["AND", "OR"];
let selectedCombineRuleOperator = ref("AND");
let selectedColumn = ref(null);
const componentKey = ref(0);

const emit = defineEmits(['updated', 'removed']);

const props = defineProps({
    index: {
        type: Number,
        default: () => 0,
    },
    selectedTable: {
        type: String,
        default: "",
    },
    columnList: {
        type: Array,
        default: () => []
    },
    id: {
        type: String,
        default: "",
    },
    data: {
        type: Object,
        default: null,
    }
})

onMounted(() => {
    if (props.data) {
        selectedCombineRuleOperator.value = props.data.combineOperator;
        ////TODO: fix later - this is a hack (saving the datatype in the JSON) since for some reason I wasn't able to get the item from
        // the columnList list that is in the prop. The columnList is still not populated on the "onMounted" event (race condition ?).
        selectedColumn.value = {
            name: props.data.field,
            dataType: props.data.fieldDataType,
        };
        ruleData = deepCopy(toRaw(props.data))
    }
})

let ruleData = {
    id: props.id,
    type: "RULE",
};
let componentType = null;

watch(selectedColumn, async () => {
    if (selectedColumn.value.dataType){
        switch (selectedColumn.value.dataType) {
        case "STRING":
            componentType = QueryRuleText;
            break;
        case "NUMBER":
            componentType = QueryRuleNumber;
            break;
        case "DATE":
            componentType = QueryRuleDate;
            break;
        default:
            componentType = null;
            break;
    }
    }
})

function onRuleOperatorUpdated() {
    ruleData.combineOperator = selectedCombineRuleOperator.value;
    emit("updated", ruleData);
}

function onSelectedColumnUpdated() {
    ruleData.field = selectedColumn.value.name;
    ruleData.fieldDataType = selectedColumn.value.dataType
    componentKey.value += 1; //TODO: This is a hack to "delete the data when changing colum selection, "defineExpose" didn't work
    emit("updated", ruleData);
}

function onRuleUpdated(updatedRule) {
    ruleData = {
        ...ruleData,
        ...updatedRule
    };
    emit("updated", ruleData);
}

function onRemoveClicked() {
    emit("removed", ruleData);
}

</script>

<style scoped>
.rule-operator {
    width: 115px;
}

.rule-column-name {
    width: 200px;
}

.rule-row {
    display: flex;
    flex-direction: row;
}

.first-rule-label {
    margin-top: 20px;
}
</style>