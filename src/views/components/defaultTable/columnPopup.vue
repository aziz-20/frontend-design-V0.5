<template>
    <el-dialog :model-value="visible" :title="popUpTitle" @close="closeDialog" class="inside-dialog">
        <div class="button-container">
            <reusableButtons :handleAdd="handleAdd" :handleUpdate="handleUpdate" :handleDelete="handle_SideDelete"
                :buttonsConfig="buttonsConfig" :rowData="selectedPerm">
            </reusableButtons>
        </div>
        <div class="details-container">
            <div class="details-row" v-for="field in columnPopUp">
                <div class="details-label"><strong>{{ field.label }}</strong></div>
                <div class="details-value"> {{ selectedPerm[field.prop] }}</div>
            </div>
        </div>
    </el-dialog>
</template>
  
<script>
import reusableButtons from "/src/views/components/PopUpFields/buttons"
export default {
    components: {
        reusableButtons
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        popUpTitle: String,
        columnPopUp: Array,
        selectedPerm: Object,
        handleAdd: Function,
        handleUpdate: Function,
        handle_SideDelete: Function,
        buttonsConfig: {
            type: Array,
            default: () => ([]),
        },
    },
    methods: {
        closeDialog() {
            // Emit update event for the visible prop to ensure parent's state is in sync
            this.$emit('update:visible', false);
        }
    }
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

.inside-dialog {
    /* width: 90%; */
    /* max-width: 700px; */
    justify-content: center;
    align-items: center;
    /* border-radius: 25px; */
    /* margin-bottom: 70%; */
    display: flex;
    flex-direction: column;
    /* padding: 10px; */

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
</style>
  