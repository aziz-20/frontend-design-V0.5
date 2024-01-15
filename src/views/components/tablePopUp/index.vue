<template>
    <div v-if="visible" class="details-row">
      <div class="details-label">{{ label }}</div>
      <div class="details-value">
        <!-- Check if the type is 'tag', to render el-tag -->
        <el-tag v-if="type === 'tag'" :type="getTagType">
          {{ value }}
        </el-tag>
        <!-- Render plain text for other types -->
        <template v-else>
          {{ value }}
        </template>
      </div>
    </div>
  
  </template>

  <script>
  export default {
    name: 'DetailsRow',
    props: {
      label: String,
      value: [String, Number],
      type: {
        type: String,
        default: 'text' // default type is text
      },
      tagType: Number,
      visible: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      getTagType() {
        switch (this.tagType) {
          case 0:
            return 'success';
          case 1:
            return 'danger';
          default:
            return 'warning';
        }
      }
    }
  };
  </script>
  <style>

  .details-layout {
    display: flex;
    flex-direction: column;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .detail-label {
    font-weight: bold;
  }
  
  .detail-value {
    margin-left: 10px;
  }
  
  /* .no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } */
  
  .tableRow {
    display: flex;
  }
  
  .tableCell {
    flex: 1;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .tableHeader {
    font-weight: bold;
  }
  
  .tableData {
    word-wrap: break-word;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    /*This will space the buttons evenly*/
    word-spacing: normal;
    align-items: top;
    /* Aligns buttons at the top of the container */
    gap: 20px;
  }
  
  .actions_buttons {
    display: flex;
    word-spacing: normal;
    align-items: top;
    justify-content: center;
    /* Centers content horizontally */
    align-items: center;
    /* Centers content vertically */
    /* Aligns buttons at the top of the container */
    gap: 4px;
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