<template>
    <div class="row mb-4 flex-gap-10">
        <div v-if="buttons.new">
            <el-button :color="buttonColor" :dark="isDark" plain type="primary" :icon="Add" :size="size ||'small'"
                v-hasPermi="['system:user:add']" @click="handleAdd">NEW</el-button>
        </div>
        <div v-if="buttons.edit">
            <el-button :dark="isDark" :class="{ 'disabled-button': selectedRows.length !== 1 }" plain type="primary"
                :icon="Edit" :size="size || 'small'" @click="handleUpdate(selectedRows)" v-hasPermi="['system:user:edit']">
                Edit
            </el-button>
        </div>
        <div v-if="buttons.expand">
            <el-button type="info" :icon="el - icon - sort" :size="size || 'small'"
                @click="toggleExpandAll">Expand/collapse</el-button>
        </div>
        <div v-if="buttons.delete">
            <el-button :size="size || 'small'" :class="{ 'disabled-button': selectedRows.length === 0 }"
                @click="handleDelete" v-hasPermi="['system:post:remove']" :color="deleteButtonColor" :dark="isDark"
                plain>Delete</el-button>
        </div>
        <div v-if="buttons.filter">
            <el-button @click="$emit('toggleFilter')" style="float: right;">{{ filterButtonLabel }}</el-button>
        </div>
        <buttons :handleAdd="handleAdd" 
        :handleUpdate="handleUpdate" 
        :handleDelete=" handleDelete" 
        :buttonsConfig="buttonsConfig"
        :stylingClass="stylingTopButtons||'button-container'"
         ></buttons>
    </div>
</template>
  
<script>

import buttons from "/src/views/components/PopUpFields/buttons"
export default {
    components:{
        buttons
    },
    props: {
        buttonsConfig: {
            type: Array,
            default: () => ([]),
        },
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
  
<style >
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

.button-container {
    display: flex;
    justify-content: right;
    /*This will space the buttons evenly*/
    align-items: top;
    /* Aligns buttons at the top of the container */
    gap: 2px;
}
</style>









































<!-- 
<template>
    <div class="row mb-4 flex-gap-10">
        <div v-if="buttons.new">
            <el-button :color="buttonColor" :dark="isDark" plain type="primary" :icon="Add" :size="size ||'small'"
                v-hasPermi="['system:user:add']" @click="handleAdd">NEW</el-button>
        </div>
        <div v-if="buttons.edit">
            <el-button :dark="isDark" :class="{ 'disabled-button': selectedRows.length !== 1 }" plain type="primary"
                :icon="Edit" :size="size || 'small'" @click="handleUpdate(selectedRows)" v-hasPermi="['system:user:edit']">
                Edit
            </el-button>
        </div>
        <div v-if="buttons.expand">
            <el-button type="info" :icon="el - icon - sort" :size="size || 'small'"
                @click="toggleExpandAll">Expand/collapse</el-button>
        </div>
        <div v-if="buttons.delete">
            <el-button :size="size || 'small'" :class="{ 'disabled-button': selectedRows.length === 0 }"
                @click="handleDelete" v-hasPermi="['system:post:remove']" :color="deleteButtonColor" :dark="isDark"
                plain>Delete</el-button>
        </div>
        <div v-if="buttons.filter">
            <el-button @click="$emit('toggleFilter')" style="float: right;">{{ filterButtonLabel }}</el-button>
        </div>
        <div v-for="button in buttonsConfig" :key="index">
            <div class="button-container">
                <div v-if="button.newField">
                    <el-button :dark="button.isDark" :class="button.class" :plain="button.plain" :type="button.type"
                        :icon="button.icon||Edit" :color="button.color" :size="button.size || 'small'" @click="button.handler"
                        v-hasPermi="button.permission"
                        >
                        {{button.name}}
                    </el-button>
                </div>
                <div v-if="button.newIconField">
                    <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                        :name="button.name" :size="button.size" :color="button.color" @click="button.handler"
                        v-hasPermi="button.permission">
                        <component :is="button.icon" />
                    </el-icon>
                </div>
                <div v-if="button.add">
                    <el-icon v-if="!button.prop || !('value' in button)
                        || rowData[button.prop] == button.value
                        && (button.condition ? button.condition(rowData) : true)" :name="button.name"
                        :size="button.size || 20" :color="button.color || 'darkgreen'" @click="handleAdd"
                        v-hasPermi="button.permission || ['system:user:add']">
                        <component :is="button.icon || 'Plus'" />
                    </el-icon>
                </div>
                <div v-if="button.edit">
                    <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                        :name="button.name" :size="button.size || 20" :color="button.color || 'blue'"
                        @click="handleUpdate(selectedRows)" v-hasPermi="button.permission || ['system:user:add']">
                        <component :is="button.icon || 'Edit'" />
                    </el-icon>
                </div>
                <div v-if="button.delete">
                    <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                        :name="button.name" :size="button.size || 20" :color="button.color || 'red'" @click="handleDelete"
                        v-hasPermi="button.permission || ['system:user:add']">
                        <component :is="button.icon || 'Delete'" />
                    </el-icon>
                </div>
            </div>
        </div>
        <buttons :handleAdd="handleAdd" 
        :handleUpdate="handleUpdate" 
        :handleDelete=" handleDelete" 
        :buttonsConfig="buttonsConfig"
        :stylingClass="stylingTopButtons||'button-container'"
         ></buttons>
    </div>
</template>
  
<script>

import buttons from "/src/views/components/PopUpFields/buttons"
export default {
    components:{
        buttons
    },
    props: {
        // handleAdd: Function,
        // handleUpdate: Function,
        // handle_SideDelete: Function,
        buttonsConfig: {
            type: Array,
            default: () => ([]),
        },
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
  
<style scoped>
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

.button-container {
    display: flex;
    justify-content: right;
    /*This will space the buttons evenly*/
    align-items: top;
    /* Aligns buttons at the top of the container */
    gap: 2px;
}</style> -->