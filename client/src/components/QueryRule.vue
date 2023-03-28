<script setup>
import { ref, watch } from "vue";
import QueryRuleText from "../components/QueryRuleText.vue";
import QueryRuleNumber from "../components/QueryRuleNumber.vue";
import QueryRuleDate from "../components/QueryRuleDate.vue";

const ruleCombineOperatorOptions = ["AND", "OR"];
let selectedCombineRuleOperator = ref("AND");
let selectedColumn = ref(null);
const componentKey = ref(0);

const emit = defineEmits(['rule-updated'])

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
    ruleId: {
        type: String,
        default: "",
    }
})

let ruleData = {
    ruleId: props.ruleId
};
let componentType = null;

watch(selectedColumn, async () => {
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
})

function onRuleOperatorUpdated() {
    ruleData.combineOperator = selectedCombineRuleOperator.value;
    emit("rule-updated", ruleData);
}

function onSelectedColumnUpdated() {
    ruleData.field = selectedColumn.value.name;
    componentKey.value += 1; //TODO: This is a hack to "delete the data when changing colum selection, "defineExpose" didn't work
    emit("rule-updated", ruleData);
}

function onRuleUpdated(updatedRule) {
    ruleData = {
        ...ruleData,
        ...updatedRule
    };
    emit("rule-updated", ruleData);
}

</script>


<template>
    <div class="rule-row">
        <q-select v-if="index > 0" outlined v-model="selectedCombineRuleOperator" :options="ruleCombineOperatorOptions"
            label="Operator" class="rule-operator" @update:model-value="onRuleOperatorUpdated" />
        <label v-else class="first-rule-label"><strong>ARE: </strong></label>
        <q-select outlined v-model="selectedColumn" :options="columnList" option-label="name" label="Column Name"
            class="rule-column-name q-ml-md" @update:model-value="onSelectedColumnUpdated" />
        <component :key="componentKey" :is="componentType" :selected-table="selectedTable" :selected-column="selectedColumn"
            @rule-updated="onRuleUpdated"></component>
    </div>
</template>

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