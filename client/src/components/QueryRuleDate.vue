<script setup>

import { ref } from "vue";
import { date } from 'quasar'

let selectedDateOperator = ref("");
let selectedDateValue = ref("");

let ruleDateData = {
    ruleType: "DATE",
};

const emit = defineEmits(['rule-updated'])

const dateOperatorOptions = {
    eq: {
        label: "EQUALS",
        value: "eq"
    },
    before: {
        label: "BEFORE",
        value: "before"
    },
    after: {
        label: "AFTER",
        value: "after"
    },
}

const dateOptions = Object.values(dateOperatorOptions);


function onDateOperatorChanged() {
    ruleDateData.operator = selectedDateOperator.value.value;
    selectedDateValue.value = "";
    emit("rule-updated", ruleDateData);
}

function onInputUpdated() {
    ruleDateData.value = date.formatDate(selectedDateValue.value, 'YYYY-MM-DD');
    emit("rule-updated", ruleDateData);
}

function limitDateOptions(d) {
  return d <= date.formatDate(Date.now(), 'YYYY-MM-DD')
}
</script>

<template>
    <div class="column-values">
        <q-select outlined v-model="selectedDateOperator" :options="dateOptions" label="Operator"
            class="date-operator q-ml-md" @update:model-value="onDateOperatorChanged" />
        <q-input outlined v-model="selectedDateValue" mask="date" :rules="['date']" @update:model-value="onInputUpdated"
            class="q-ml-md">
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="selectedDateValue" @update:model-value="onInputUpdated">
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
        <!-- <q-input v-model="selectedNumberValue" type="number" label="Value" class="q-ml-md"
                @update:model-value="onInputUpdated" /> -->
    </div>
</template>

<style scoped>
.date-operator {
    width: 130px;
}

.column-values {
    display: flex;
    flex-direction: row;
}
</style>