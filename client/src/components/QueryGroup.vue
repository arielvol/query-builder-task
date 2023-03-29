<script setup>
import { ref, onMounted } from "vue";
import QueryRule from "./QueryRule.vue";
import QueryGroup from "./QueryGroup.vue";
import { v4 as uuid } from "uuid";

let items = ref([]);

let groupData = {
    combineOperator: "AND",
    type: "GROUP",
    items: [],
};

const emit = defineEmits(['updated', 'query-updated', 'removed']);

const props = defineProps({
    depth: {
        type: Number,
        default: () => 0
    },
    selectedTable: {
        type: String,
        default: ""
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
    },
});

onMounted(() => {
    if (props.id) {
        groupData.id = props.id;
    } else {
        groupData.id = uuid().toString();
    }

    //we are necessarily in "load mode"
    if (props.data) {
        groupData = {...props.data};
        items.value = props.data.items;
        //TODO: fix later - This is a hack to differentiate between "load mode" and "creation mode".
        // items.value.forEach(item => {
        //     item.data = item;
        // });
    }


})

function getComponentType(type) {
    let componentType = null;
    switch (type) {
        case "RULE":
            componentType = QueryRule;
            break;
        case "GROUP":
            componentType = QueryGroup;
    };
    return componentType;
}


function onAddRuleClick() {
    const newId = uuid().toString();
    const newRule = {
        combineOperator: "AND",
        id: newId,
        type: "RULE",
    };
    items.value.push(newRule);
    groupData.items.push(newRule);
    emit("updated", groupData);
}

function onAddGroupClick() {
    const newId = uuid().toString();
    const newGroup = {
        combineOperator: "AND",
        id: newId,
        type: "GROUP",
        items: [],
    };
    items.value.push(newGroup);
    groupData.items.push(newGroup);
    emit("updated", groupData);
}

function onUpdated(data) {

    if (data.type === "RULE") {
        let foundItem = groupData.items.find(item => item.id === data.id);
        Object.assign(foundItem, data);
    } else {
        groupData.items = groupData.items.filter(item => item.id !== data.id);
        groupData.items.push(data);
    }

    emit("updated", groupData);
}

function onRemoved(data) {
    items.value = items.value.filter(item => item.id !== data.id);
    groupData.items = groupData.items.filter(item => item.id !== data.id);

    emit("updated", groupData);
}

function onRemoveClicked() {
    emit("removed", groupData);
}

</script>

<template>
    <q-card bordered>
        <q-card-section>
            <div v-if="depth > 1" class="remove-group">
                <q-btn flat round><q-icon name="clear" color="grey" @click="onRemoveClicked" /></q-btn>
            </div>
            <div class="q-pa-md q-gutter-sm">
                <q-btn outline color="primary" label="Add Rule" icon="add" @click="onAddRuleClick" />
                <q-btn v-if="depth < 3" outline color="primary" label="Add Group" icon="add" @click="onAddGroupClick" />
            </div>
            <div>
                <component v-for="(item, index) in items" :index="index" :key="item.id" :is="getComponentType(item.type)"
                    :data="item" :column-list="columnList" :selected-table="selectedTable" :id="item.id" @updated="onUpdated"
                    @removed="onRemoved" :depth="depth + 1" class="q-mt-md q-mb-md" />
            </div>
        </q-card-section>
    </q-card>
</template>

<style scoped>
.remove-group {
    display: flex;
    direction: rtl;
    height: 1px;
}
</style>