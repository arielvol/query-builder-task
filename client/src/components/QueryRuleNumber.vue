<script setup>

import { ref, onMounted } from "vue";

let selectedNumberOperator = ref("");
let selectedNumberValue = ref("");

const props = defineProps({
    data: {
        type: Object,
        default: null,
    }
})

onMounted(() => {
    if (props.data && props.data.isQueryLoad) {
        selectedNumberOperator.value = props.data.operator;
        selectedNumberValue.value = props.data.value;
    }
});

let ruleNumberData = {
    ruleType: "NUMBER",
};

const emit = defineEmits(['rule-updated'])

const numberOperatorOptions = {
    eq: {
        label: "=",
        value: "eq"
    },
    neq: {
        label: "<>",
        value: "neq"
    },
    lt: {
        label: "<",
        value: "lt"
    },
    lte: {
        label: "<=",
        value: "lte"
    },
    gt: {
        label: ">",
        value: "gt"
    },
    gte: {
        label: ">=",
        value: "gte"
    },
}

const numberOptions = Object.values(numberOperatorOptions);


function onNumberOperatorChanged() {
    ruleNumberData.operator = selectedNumberOperator.value.value;
    selectedNumberValue.value = null;
    emit("rule-updated", ruleNumberData);
}

function onInputUpdated() {
    ruleNumberData.value = selectedNumberValue.value;
    emit("rule-updated", ruleNumberData);
}
</script>

<template>
    <div class="column-values">
        <q-select outlined v-model="selectedNumberOperator" :options="numberOptions" label="Operator"
            class="number-operator q-ml-md" @update:model-value="onNumberOperatorChanged" />
        <q-input v-model="selectedNumberValue" type="number" label="Value" class="q-ml-md"
            @update:model-value="onInputUpdated" />
    </div>
</template>

<style scoped>
.number-operator {
    width: 130px;
}

.column-values {
    display: flex;
    flex-direction: row;
}

.column-data {
    width: 1000px;
}
</style>