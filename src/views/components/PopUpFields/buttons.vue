<template>
    <div :class="stylingClass || 'button-container'">
        <div v-for="button in buttonsConfig" >

            <div v-if="button.edit">
                <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                    :name="button.name" :size="button.size || 20" :color="button.color || 'blue'"
                    @click="handleUpdate(rowData)" v-hasPermi="['system:user:add']">
                    <component :is="button.icon || 'Edit'" />
                </el-icon>
            </div>
            <div v-else-if="button.delete">
                <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                    :name="button.name" :size="button.size || 20" :color="button.color || 'red'"
                    @click="handleDelete(rowData)" v-hasPermi="['system:user:add']">
                    <component :is="button.icon || 'Delete'" />
                </el-icon>
            </div>
            <div v-else-if="button.add">
                <el-icon v-if="!button.prop || !('value' in button)
                    || rowData[button.prop] == button.value
                    && (button.condition ? button.condition(rowData) : true)" :name="button.name"
                    :size="button.size || 20" :color="button.color || 'darkgreen'" @click="handleAdd(rowData)"
                    v-hasPermi="['system:user:add']">
                    <component :is="button.icon || 'Plus'" />
                </el-icon>
            </div>
            <div v-else-if="button.normal">
                <el-button :dark="button.isDark" :class="button.class" :plain="button.plain" :type="button.type"
                    :icon="button.icon || Edit" :color="button.color" :size="button.size || 'small'" @click="button.handler"
                    v-hasPermi="button.permission">
                    {{ button.name }}
                </el-button>
            </div>
            <div v-else-if="button.newIcon">
                <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                    :name="button.name" :size="button.size" :color="button.color" @click="button.handler(rowData)"
                    v-hasPermi="button.permission">
                    <component :is="button.icon" />
                </el-icon>
            </div>
        </div>
    </div>
</template>
<script>

export default {

    data() {
        return {
            localVisible: this.visible, // Initialize localVisible based on the prop value

        };
    },

    props: {
        handleAdd: Function,
        handleUpdate: Function,
        handleDelete: Function,
        buttonsConfig: {
            type: Array,
            default: () => ([]),
        },
        visible:
        {
            type: Boolean,
            required: true
        },
        rowData: {
            type: Object,
            default: () => ({})
        },
    },

    methods: {
        tagTypeControl(field, value) {
            if (typeof field.tagType !== 'function') {
                console.error('tagColor is not a function. Field:', field);
                return '';
            }
            // console.log(value)
            return field.tagType(value);
        },
        checkTagColorFunction(field, value) {
            if (typeof field.tagColor !== 'function') {
                console.error('tagColor is not a function. Field:', field);
                return 'defaultColor';
            }
            // console.log(value)
            return field.tagColor(value);
        },
        closeDialog() {
            this.$emit('update:visible', false); // Emit event to update visible prop in parent
        },
    },
    watch: {
        visible(newVal) {
            console.log(newVal)
            this.localVisible = newVal;
        },
        localVisible(newVal) {
            this.$emit('update:visible', newVal);
        }
    },
}
</script>

<style scoped>
.button-container {
    display: flex;
    justify-content: center;
    /*This will space the buttons evenly*/
    word-spacing: normal;
    align-items: top;
    /* Aligns buttons at the top of the container */
    gap: 20px;
}
</style>