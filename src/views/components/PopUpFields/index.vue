<template>
    <el-dialog class="inside-dialog"  :closed="closeDialog" v-model="localVisible" :title="dialogTitle">
        <buttons :handleAdd="handleAdd" :handleUpdate="handleUpdate" :handleDelete="handle_SideDelete"
            :buttonsConfig="buttonsConfig" :rowData="rowData"></buttons>
        <div v-if="rowData" class="details-container">
            <div class="details-row" v-for="field in fieldsConfig">
                <div class="details-label">{{ field.label }}</div>
                <div v v-if="field.type === 'tag'" class="details-value">
                    <el-tag v-if="rowData[field.prop] !== null && rowData[field.prop]
                        !== undefined && field.tagType(rowData[field.prop]) !== undefined"
                        :type="tagTypeControl(field, rowData[field.prop])"
                        :color="checkTagColorFunction(field, rowData[field.prop])">
                        {{ field.tagLabel(rowData[field.prop]) }}
                    </el-tag>
                </div>
                <div v-else-if="field.type === 'tagPopup'" :class="field.tagPop || 'details-value'">
                    <el-tag v-for="value in rowData[field.parent]" :key="rowData[field.insideKey]"
                        @click="field.click(value)">
                        {{ value[field.name] }}
                    </el-tag>
                </div>
                <div v-else-if="field.type === 'icon'" class="details-value"><svg-icon :icon-class="rowData[field.prop]" />
                </div>
                <div v-else class="details-value">{{ rowData[field.prop] }}</div>
            </div>
        </div>
    </el-dialog>
</template>
  
<script>
import buttons from "/src/views/components/PopUpFields/buttons"
export default {

    data() {
        return {
            localVisible: this.visible, // Initialize localVisible based on the prop value

        };
    },
    components: {
        buttons
    },

    props: {
        handleAdd: Function,
        handleUpdate: Function,
        handle_SideDelete: Function,
        buttonsConfig: {
            type: Array,
            default: () => ([]),
        },
        visible:
        {
            type: Boolean,
            required: true
        },

        dialogTitle: {
            type: String,
            default: 'Details'
        },
        rowData: {
            type: Object,
            default: () => ({})
        },
        fieldsConfig: {
            type: Array,
            default: () => ([])
        }
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

<style>
.button-container {
    display: flex;
    justify-content: center;
    /*This will space the buttons evenly*/
    word-spacing: normal;
    align-items: top;
    /* Aligns buttons at the top of the container */
    gap: 20px;
}
.inside-dialog {
    width: 90%;
    max-width: 700px;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    /* margin-bottom: 70%; */

}

.details-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.details-row {
    display: flex;
    /* Aligns items in a row */
    justify-content: space-between;
    /* Spreads the label and value */
    align-items: center;
    /* Vertically centers the content */
    padding: 10px;
    border-bottom: 1px solid #776e6e;
}

.details-label {
    font-weight: bold;
    margin-right: 10px;
    word-wrap: break-word;
    /* Space between label and value */
}

.details-value {
    flex-grow: 1;
    /* Allows the value to take the remaining space */
    text-align: center;
    word-wrap: break-word;
    flex-wrap: wrap;
    /* Allows items to wrap onto multiple lines */
    gap: 2px;
}

.tagPopup {
    display: flex;
    justify-content: center;
    align-items: center;
    /* Aligns items at the top of the container */
    flex-wrap: wrap;
    /* Allows items to wrap onto multiple lines */
    gap: 2px;
    /* Sets a gap of 2px between items */
    /* cursor: pointer; */
    /* transition: box-shadow 0.3s; */
}
</style>
  
  
  
<!--   
<template>
    <el-dialog class="inside-dialog" :closed="closeDialog" v-model="localVisible" :title="dialogTitle" >
        <div class="button-container">
            <div v-for="button in buttonsConfig" :key="index">
                <div v-if="button.newField">
                    <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                        :name="button.name" :size="button.size" :color="button.color" @click="button.handler(rowData)"
                        v-hasPermi="button.permission">
                        <component :is="button.icon" />
                    </el-icon>
                </div>
                <div v-if="button.add">
                    <el-icon v-if="!button.prop || !('value' in button)
                        || rowData[button.prop] == button.value
                        && (button.condition ? button.condition(rowData) : true)" :name="button.name"
                        :size="button.size || 20" :color="button.color || 'darkgreen'" @click="handleAdd(rowData)"
                        v-hasPermi="button.permission || ['system:user:add']">
                        <component :is="button.icon || 'Plus'" />
                    </el-icon>
                </div>
                <div v-if="button.edit">
                    <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                        :name="button.name" :size="button.size || 20" :color="button.color || 'blue'"
                        @click="handleUpdate(rowData)" v-hasPermi="button.permission || ['system:user:add']">
                        <component :is="button.icon || 'Edit'" />
                    </el-icon>
                </div>
                <div v-if="button.delete">
                    <el-icon v-if="!button.prop || !('value' in button) || rowData[button.prop] == button.value"
                        :name="button.name" :size="button.size || 20" :color="button.color || 'red'"
                        @click="handle_SideDelete(rowData)" v-hasPermi="button.permission || ['system:user:add']">
                        <component :is="button.icon || 'Delete'" />
                    </el-icon>
                </div>
            </div>
        </div>
        <buttons 
        :handleAdd="handleAdd" 
        :handleUpdate="handleUpdate" 
        :handleDelete=" handle_SideDelete" 
        :buttonsConfig="buttonsConfig"
        :rowData="rowData"
         ></buttons>

        <div v-if="rowData" class="details-container">
            <div class="details-row" v-for="field in fieldsConfig">
                <div class="details-label">{{ field.label }}</div>
                <div v v-if="field.type === 'tag'" class="details-value">
                    <el-tag v-if="rowData[field.prop] !== null && rowData[field.prop]
                        !== undefined && field.tagType(rowData[field.prop]) !== undefined"
                        :type="tagTypeControl(field, rowData[field.prop])"
                        :color="checkTagColorFunction(field, rowData[field.prop])">
                        {{ field.tagLabel(rowData[field.prop]) }}
                    </el-tag>
                </div>
                <div v-else-if="field.type === 'icon'" class="details-value"><svg-icon :icon-class="rowData[field.prop]" /></div>
                <div v-else class="details-value">{{ rowData[field.prop] }}</div>
            </div>
        </div>
    </el-dialog>
</template>
  
<script>
import buttons from "/src/views/components/PopUpFields/buttons"
export default {

    data() {
        return {
            localVisible: this.visible, // Initialize localVisible based on the prop value

        };
    },
    components:{
        buttons
    },

    props: {
        handleAdd: Function,
        handleUpdate: Function,
        handle_SideDelete: Function,
        buttonsConfig: {
            type: Array,
            default: () => ([]),
        },
        visible:
        {
            type: Boolean,
            required: true
        },

        dialogTitle: {
            type: String,
            default: 'Details'
        },
        rowData: {
            type: Object,
            default: () => ({})
        },
        fieldsConfig: {
            type: Array,
            default: () => ([])
        }
    },
    // computed: {
    //     isTagField() {
    //         // Using a computed property as a method
    //         return (field) => field.type === 'tag';
    //     },
    //     // ... add other computed properties for different field types if needed ...
    // },

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
        // rowData(newVal) {
        //     this.buttonsConfig.forEach(button => {
        //         if (button && typeof button.condition === 'function') {
        //             console.log("MMMMMMMMMM" + typeof (button.condition))
        //             console.log(`Condition for button ${button.name}:`, button.condition(newVal[button.prop]));
        //         } else {
        //             console.log(`Button or condition not defined for button:`, button);
        //             // console.log(typeof field.tagColor);
        //         }
        //     });
        // },
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

<style >
.button-container {
    display: flex;
    justify-content: center;
    /*This will space the buttons evenly*/
    word-spacing: normal;
    align-items: top;
    /* Aligns buttons at the top of the container */
    gap: 20px;
}


.inside-dialog {
    width: 90%;
    max-width: 700px;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    /* margin-bottom: 70%; */

}

.details-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.details-row {
    display: flex;
    /* Aligns items in a row */
    justify-content: space-between;
    /* Spreads the label and value */
    align-items: center;
    /* Vertically centers the content */
    padding: 10px;
    border-bottom: 1px solid #776e6e;
}

.details-label {
    font-weight: bold;
    margin-right: 10px;
    /* Space between label and value */
}

.details-value {
    flex-grow: 1;
    /* Allows the value to take the remaining space */
    text-align: center;
    word-wrap: break-word;
}
</style>
  
  
   -->