<template>
  <el-table :data="data" height="100%" :style="style || 'width: 100%'" :row-key="rowKey" v-loading="loading"
    element-loading-text="Loading..." :default-expand-all="isExpandAll" v-if="refreshTable"
    @selection-change="handleSelectionChange" show-overflow-tooltip="true" fit="true" :expand-row-keys="expandRowKeys"
    lazy='true' :row-class-name="rowClassChecker">
    <template v-if="!Selection">
      <el-table-column type="selection" />
    </template>
    <el-table-column v-for="(column, index) in visibleColumns" :key="index" :prop="column.prop" :label="column.label"
      :min-width="column.minWidth || ''" :fixed="column.fixed" :align="column.align" :class="column.class">
      <template v-if="column.type === 'icon'" #default="{ row }" :column-key="column.key" :aria-label="column.ariaLabel">
        <svg-icon :icon-class="row[column.prop]" />
      </template>
      <template v-if="column.type === 'tag'" #default="{ row }">
        <el-tag
          v-if="row[column.prop] !== null && row[column.prop] !== undefined && column.tagType(row[column.prop]) !== undefined"
          :type="column.tagType(row[column.prop])" :color="checkTagColorFunction(column, row[column.prop])">
          {{ column.tagLabel(row[column.prop]) }}
        </el-tag>
        <span v-else>
          Value not available
        </span>
      </template>
      <template v-else-if="column.type === 'photo'" v-slot="{ row }">
        <img :src=this.$http.photos.image(row.avatar) class="icon"
          style="width: 45px; height: 45px; object-fit: cover; border-radius: 50%;" />
      </template>
      <template v-else-if="column.type === 'tagPopup'" #default="{ row }">
        <div :class='column.tagPop||"perColumns"'>
        <el-tag class="table-burtons" v-for="value in row[column.parent]" :key="row[column.insideKey]"
          @click="handeltagclick(value)">
          {{ value[column.name] }}
        </el-tag>
      </div>
      </template>
      <template v-else-if="column.type === 'nested'" #default="scope">
        <div v-if="scope.row[column.parent]">
          {{ scope.row[column.parent][column.prop] }}
        </div>
        <div v-else>
          No Department
        </div>
      </template>
      <template v-else-if="column.type === 'actions'" #default="{ row, index }">
        <div :class="column.ClassButton || 'Table-button-container'">
          <template v-for="button in buttonsConfig" :key="index">
            <div v-if="button.newField">
              <el-icon v-if="!button.prop || !('value' in button) || row[button.prop] == button.value" :name="button.name"
                :size="button.size" :color="button.color" @click="button.handler(row,scoped,index)"
                v-hasPermi="button.permission">
                <component :is="button.icon" />
              </el-icon>
            </div>
            <template v-if="button.add">
              <el-icon v-if="!button.prop || !('value' in button)
              || row[button.prop] == button.value
              && (button.condition ? button.condition(row) : true)" :name="button.name" :size="button.size || 15"
                :color="button.color || 'darkgreen'" @click="handleAdd(row, index)" v-hasPermi="['system:user:add']">
                <component :is="button.icon || 'Plus'" />
              </el-icon>
            </template>
            <div v-if="button.edit">
              <el-icon v-if="!button.prop || !('value' in button) || row[button.prop] == button.value" :name="button.name"
                :size="button.size || 15" :color="button.color || 'blue'" @click="handleUpdate(row)"
                v-hasPermi="['system:user:add']">
                <component :is="button.icon || 'Edit'" />
              </el-icon>
            </div>
            <div v-if="button.delete">
              <el-icon v-if="!button.prop || !('value' in button) || row[button.prop] == button.value" :name="button.name"
                :size="button.size || 15" :color="button.color || 'red'" @click="handle_SideDelete(row)"
                v-hasPermi="['system:user:add']">
                <component :is="button.icon || 'Delete'" />
              </el-icon>
            </div>
            <div v-if="button.view">
              <el-icon v-if="!button.prop || !('value' in button) || row[button.prop] == button.value" :name="button.name"
                :size="button.size || 15" :color="button.color || 'silver'" @click="openDetails(row, index)"
                v-hasPermi="['system:user:add']">
                <component :is="button.icon || 'View'" />
              </el-icon>
            </div>
            <!-- </div> -->
          </template>
        </div>
      </template>
      <template v-else-if="column.type === 'mode'" #default="{ row }">
      </template>
      <template v-else #default="{ row }">
        {{ row[column.prop] }}
      </template>

    </el-table-column>
  </el-table>
</template>
  
<script>
// import PopupColumn from "/src/views/components/defaultTable/columnPopup"
export default {
  components: {
    // PopupColumn
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      selectedPerm: false,
      Visible: false,
    };
  },
  computed: {
    visibleColumns() {
      if (this.windowWidth < 700) {
        return this.columns.filter(column => column.show === true);
      }
      return this.columns;
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateWidth);
    // this.updateWidth()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth);
  },
  props: {
    buttonsConfig: {
      type: Array,
      default: () => ([]),
    },
    columnLabel: String,
    popUpTitle: String,
    columnPopUp: Array,
    data: Array,
    loading: Boolean,
    isExpandAll: Boolean,
    refreshTable: Boolean,
    columns: {
      type: Array,
      default: () => []
    },
    handleSelectionChange: Function,
    handleAdd: Function,
    handleUpdate: Function,
    handle_SideDelete: Function,
    openDetails: Function,
    rowClassChecker: Function
  },

  methods: {
    handeltagclick(val) {
      // Emit an event to the parent, sending the value
      console.log("Iam being clicked" + val)
      this.$emit('open-popup', val);
    },

    // handeltagclick(val) {
    //   console.log(val)
    //   this.selectedPerm = val;
    //   this.Visible = true;
    // },
    updateWidth() {
      // console.log("I am here")
      this.windowWidth = window.innerWidth;
    },
    // checkTagColorFunction(field, value) {
    //   if (typeof field.tagColor !== 'function') {
    //     console.error('tagColor is not a function', field);
    //     return 'defaultColor'; // Provide a default color or handle the error as needed
    //   }
    //   return field.tagColor(value);
    // },
    checkTagColorFunction(field, value) {
      if (typeof field.tagColor !== 'function') {
        console.error('tagColor is not a function. Field:', field);
        return 'defaultColor';
      }
      return field.tagColor(value);
    },
  }
}
</script>
  
<style scoped>
.Table-button-container {
  display: flex;
  justify-content: right;
  /*This will space the buttons evenly*/
  align-items: top;
  /* Aligns buttons at the top of the container */
  gap: 2px;
  /* cursor: pointer; */
  /* transition: box-shadow 0.3s; */
}

/* .button-container:hover {
  box-shadow: 0 0 10px rgba(223, 33, 33, 0.7); Adjust color and size as needed
} */

.margin-top-20 {
  margin-top: 20px;
}

.table-burtons {
  cursor: pointer;
}

.perColumns {
  display: flex;
  justify-content: center;
  align-items: flex-start; /*Aligns items at the top of the container*/
  flex-wrap: wrap;
  /* Allows items to wrap onto multiple lines */
  gap: 2px; /* Sets a gap of 2px between items */
  /* cursor: pointer; */
  /* transition: box-shadow 0.3s; */
}
</style>
