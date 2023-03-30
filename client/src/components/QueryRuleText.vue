<script setup>

import { ref, computed, watch, onMounted } from "vue";
import QueryService from "../services/QueryService"

let selectedTextOperator = ref("");
let selectedColumnText = ref("");
let selectedColumnValues = ref(null);
let columnData = ref(null);

let ruleTextData = {
    ruleType: "TEXT",
};

const emit = defineEmits(['rule-updated'])

const props = defineProps({
    selectedTable: {
        type: String,
        default: "",
    },
    selectedColumn: {
        type: Object,
        default: () => { },
    },
    data: {
        type: Object,
        default: null,
    }
})

onMounted(() => {
    if (props.data) {
        if (props.data.operator) {
            selectedTextOperator.value = props.data.operator;
        }
        if (props.data.value && isInput.value) {
            selectedColumnText.value = props.data.value
        } else {
            selectedColumnValues.value = props.data.value;
        }
    }
});






const textOperatorOptions = {
    eq: {
        label: "EQUALS",
        value: "eq"
    },
    neq: {
        label: "NOT EQUALS",
        value: "neq"
    },
    contains: {
        label: "CONTAINS",
        value: "contains"
    },
    notcontains: {
        label: "NOT CONTAINS",
        value: "notcontains"
    },
    startswith: {
        label: "START WITH",
        value: "startswith"
    },
    endswith: {
        label: "ENDS WITH",
        value: "endswith"
    },
    in: {
        label: "IN",
        value: "in"
    },
    notin: {
        label: "NOT IN",
        value: "notin"
    },
}

const isMultipleSelect = computed(() => {
    return [textOperatorOptions.in.label, textOperatorOptions.notin.label].includes(selectedTextOperator.value.label);
})

const isInput = computed(() => {
    return [
        textOperatorOptions.contains.label,
        textOperatorOptions.notcontains.label,
        textOperatorOptions.startswith.label,
        textOperatorOptions.endswith.label,
    ].includes(selectedTextOperator.value.label);
})

const textOptions = Object.values(textOperatorOptions);

watch(selectedTextOperator, async () => {
    if (!isInput.value) {
        const response = await QueryService.getColumnData(props.selectedTable, props.selectedColumn.name);
        columnData.value = response.data;
    }
})

function onTexOperatorChanged() {
    ruleTextData.operator = selectedTextOperator.value.value;
    selectedColumnText.value = null;
    selectedColumnValues.value = null;
    emit("rule-updated", ruleTextData);
}

function onInputUpdated() {
    if (selectedColumnText.value) {
        ruleTextData.value = selectedColumnText.value;
    } else {
        ruleTextData.value = "";
    }
    emit("rule-updated", ruleTextData);
}

function onSelectedValuesUpdated() {
    if (selectedColumnValues.value) {
        ruleTextData.value = selectedColumnValues.value;
    } else {
        ruleTextData.value = "";
    }
    emit("rule-updated", ruleTextData);
}
</script>

<template>
    <div class="column-values">
        <q-select outlined v-model="selectedTextOperator" :options="textOptions" label="Operator"
            class="text-operator q-ml-md" @update:model-value="onTexOperatorChanged" />
        <div v-if="selectedTextOperator" class="column-data">
            <q-input v-if="isInput" v-model="selectedColumnText" type="text" label="Query" class="q-ml-md"
                @update:model-value="onInputUpdated" />
            <q-select v-else outlined v-model="selectedColumnValues" :options="columnData" label="Values"
                :multiple="isMultipleSelect" use-chips class="q-ml-md" @update:model-value="onSelectedValuesUpdated" />
        </div>
    </div>
</template>

<style scoped>
.text-operator {
    width: 115px;
}

.column-values {
    display: flex;
    flex-direction: row;
}

.column-data {
    width: 1000px;
}
</style>