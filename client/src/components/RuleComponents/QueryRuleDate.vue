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
    </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { date } from 'quasar'
import { dateOperatorOptions } from "../../common/constants"

let selectedDateOperator = ref("");
let selectedDateValue = ref("");

const emit = defineEmits(['rule-updated'])

const props = defineProps({
    data: {
        type: Object,
        default: null,
    }
})

onMounted(() => {
    if (props.data) {
        if (props.data.operator) {
            selectedDateOperator.value = props.data.operator;
        }
        if (props.data.value) {
            selectedDateValue.value = props.data.value;
        }
    }
});


let ruleDateData = {
    ruleType: "DATE",
};

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

</script>

<style scoped>
.date-operator {
    width: 130px;
}

.column-values {
    display: flex;
    flex-direction: row;
}
</style>