<template>
    <div class="row mb-4 flex-gap-10">
        <div v-if="buttons.new">
            <el-button :color="buttonColor" :dark="isDark" plain type="primary" :icon="Add" size="mini"
                v-hasPermi="['system:user:add']" @click="handleAdd">NEW</el-button>
        </div>
        <div v-if="buttons.edit">
            <el-button :dark="isDark" :class="{ 'disabled-button': selectedRows.length !== 1 }" plain type="primary"
                :icon="Edit" size="mini" @click="handleUpdate(selectedRows)" v-hasPermi="['system:user:edit']">
                Edit
            </el-button>
        </div>
        <div v-if="buttons.expand">
            <el-button type="info" :icon="el - icon - sort" size="mini" @click="toggleExpandAll">Expand/collaps</el-button>
        </div>
        <div v-if="buttons.delete">
            <el-button size="mini" :class="{ 'disabled-button': selectedRows.length === 0 }" @click="handleDelete"
                v-hasPermi="['system:post:remove']" :color="deleteButtonColor" :dark="isDark" plain>Delete</el-button>
        </div>
        <div v-if="buttons.filter">
        <el-button @click="$emit('toggleFilter')" style="float: right;">{{ filterButtonLabel }}</el-button>
    </div>
    </div>
</template>
  
<script>
export default {
    props: {
        isDark: Boolean,
        buttonColor: String,
        deleteButtonColor: String,
        selectedRows: Array,
        buttons: Object,
        handleAdd: Function,
        handleUpdate: Function,
        toggleExpandAll: Function,
        handleDelete: Function,
        showSearch: Boolean,
    },
    data() {
        return {
            // showSearch: false,
        };
    },
    methods: {
        toggleSearch() {
            console.log("Helloe")
            this.$emit('update:showSearch', !this.showSearch);
        }

    },
    computed: {
        filterButtonLabel() {
            return this.showSearch ? 'Hide Filter' : 'Show Filter';
        }
    }
}
</script>
  
<style>
.disabled-button {
    pointer-events: none;
    /* Add other styles to make the button appear disabled */
}

.flex-gap-10 {
    display: flex;
    gap: 10px;
}

.float-right {
    float: right;
}
</style>