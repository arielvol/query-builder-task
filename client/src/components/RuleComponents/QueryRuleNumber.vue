<template>
    <div class="column-values">
        <q-select outlined v-model="selectedNumberOperator" :options="numberOptions" label="Operator"
            class="number-operator q-ml-md" @update:model-value="onNumberOperatorChanged" />
        <q-input v-model="selectedNumberValue" type="number" label="Value" class="q-ml-md"
            @update:model-value="onInputUpdated" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {numberOperatorOptions} from "../../common/constants"

let selectedNumberOperator = ref("");
let selectedNumberValue = ref("");

const props = defineProps({
    data: {
        type: Object,
        default: null,
    }
})

onMounted(() => {
    if (props.data) {
        if (props.data.operator) {
            selectedNumberOperator.value = props.data.operator;
        }
        if (props.data.value) {
            selectedNumberValue.value = props.data.value;
        }
    }
});

let ruleNumberData = {
    ruleType: "NUMBER",
};

const emit = defineEmits(['rule-updated'])


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