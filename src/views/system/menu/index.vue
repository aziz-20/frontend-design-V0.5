<template>
  <!-- <script src="//unpkg.com/@element-plus/icons-vue"></script> -->
  <div class="app-container">
    <div class="flex" v-if="showSearch">
      <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
        :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetQuery"
        :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
        :resetIcon="resetIcon">
      </search_control>

    </div>

    <!-- Table Header -->
    <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
      :buttons="{ new: true, edit: true, expand: false, delete: true, filter: true }" :handleAdd="handleAdd"
      :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelete"
      :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
      :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />


    <!-- Table view  -->
    <el-config-provider>
      <el-table flex :data="menuList" style="width:100%" row-key="menuId" v-loading="loading"
        element-loading-text="Loading..." :default-expand-all="isExpandAll" v-if="refreshTable"
        @selection-change="handleSelectionChange" show-overflow-tooltip="true">
        <el-table-column :selectable="selectable" type="selection"></el-table-column>
        <el-table-column label="Name" prop="name" class="no-wrap">
          <!-- <template #default="{ row }">
            <div class="no-wrap">{{ row.name }}</div>
          </template> -->
        </el-table-column>
        <el-table-column fixed="right" label="Actions" align="center" class-name="small-padding fixed-width">
          <template #default="{ row, column, index }">
            <div class="actions_buttons">
              <el-icon :size="15" color="lightblue" size="mini" type="text" @click="handleAdd(row, index)"
                :el-icon-plus="Add" v-hasPermi="['system:user:add']" v-if="row.type === 0">
                <Plus />
              </el-icon>
              <el-icon :size="15" color="blue" @click="handleUpdate(row)" v-hasPermi="['system:user:edit']">
                <Edit />
              </el-icon>
              <el-icon :size="15" color="red" :el-icon-plus="Delete" size="small" @click="handle_SideDelete(row)"
                v-hasPermi="['system:user:remove']">
                <Delete />
              </el-icon>
              <el-icon :size="15" color="silver" @click="openDetails(row)">
                <View />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column >
          <template #default="{row,column}">
            <el-dialog class="inside-dialog" v-model="detailsDialogVisible" title="Details">
              <div class="button-container">
                <el-icon :size="20" color="green" size="mini" @click="handleAdd(row)" :el-icon-plus="Add"
                  v-hasPermi="['system:user:add']" v-if="row.type === 0">
                  <Plus />
                </el-icon>
                <el-icon :size="20" color="blue" @click="handleUpdate(row)" v-hasPermi="['system:user:edit']">
                  <Edit />
                </el-icon>
                <el-icon :size="20" color="red" :el-icon-plus="Delete" @click="handle_SideDelete(row)"
                  v-hasPermi="['system:user:remove']">
                  <Delete />
                </el-icon>
              </div>
              <div v-if="mobileView" class="details-container">
                <div class="details-row">
                  <div class="details-label">Name:</div>
                  <div class="details-value">{{ row.name }}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Note:</div>
                  <div class="details-value">{{ row.remark }}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Type:</div>
                  <div class="details-value">
                    <el-tag :type="row.type === 0 ? 'success' : row.type === 1 ? 'Silver' : 'warning'">
                      {{ row.type === 0 ? 'Directory' : row.type === 1 ? 'File' : 'Link' }}
                    </el-tag>
                  </div>
                </div>
                <div class="details-row">
                  <div class="details-label">status:</div>
                  <div class="details-value">
                    <el-tag :type="row.status === 0 ? 'success' : row.status === 1 ? 'danger' : 'warning'">
                      {{ row.status === 0 ? 'Enabled' : row.status === 1 ? 'Disabled' : 'Sleep' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-dialog width="100%"  v-model="detailsDialogVisible" title="Details">
        <div class="button-container">
          <el-icon :size="20" color="green" size="mini"  @click="handleAdd(mobileView)" :el-icon-plus="Add"
            v-hasPermi="['system:user:add']" v-if="mobileView.type === 0">
            <Plus />
          </el-icon>
          <el-icon :size="20" color="blue" @click="handleUpdate(mobileView)" v-hasPermi="['system:user:edit']">
            <Edit />
          </el-icon>
          <el-icon :size="20" color="red" :el-icon-plus="Delete"  @click="handle_SideDelete(mobileView)"
            v-hasPermi="['system:user:remove']">
            <Delete />
          </el-icon>
        </div>
        <div v-for="item in items" :key="item.key" class="tableRow">
          <div class="tableCell tableHeader">{{ item.label }}</div>
          <div class="tableCell tableData">{{ mobileView[item.key] }}</div>
        </div>
      </el-dialog> -->


      <!-- <el-dialog v-model="detailsDialogVisible" title="Row Details">
        <el-table :data="mobileView ? [mobileView] : []">
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column prop="type" label="Type"></el-table-column>
        </el-table>
      </el-dialog> -->
      <!-- Add a new modal component -->

      <!-- <el-dialog class="inside-dialog" v-model="detailsDialogVisible" title="Details">
        <div class="button-container">
          <el-icon :size="20" color="green" size="mini" @click="handleAdd(mobileView)" :el-icon-plus="Add"
            v-hasPermi="['system:user:add']" v-if="mobileView.type === 0">
            <Plus />
          </el-icon>
          <el-icon :size="20" color="blue" @click="handleUpdate(mobileView)" v-hasPermi="['system:user:edit']">
            <Edit />
          </el-icon>
          <el-icon :size="20" color="red" :el-icon-plus="Delete" @click="handle_SideDelete(mobileView)"
            v-hasPermi="['system:user:remove']">
            <Delete />
          </el-icon>
        </div>
        <div v-if="mobileView" class="details-container">
          <div class="details-row">
            <div class="details-label">Name:</div>
            <div class="details-value">{{ mobileView.name }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Note:</div>
            <div class="details-value">{{ mobileView.remark }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">Type:</div>
            <div class="details-value">
              <el-tag :type="mobileView.type === 0 ? 'success' : mobileView.type === 1 ? 'Silver' : 'warning'">
                {{ mobileView.type === 0 ? 'Directory' : mobileView.type === 1 ? 'File' : 'Link' }}
              </el-tag>
            </div>
          </div>
          <div class="details-row">
            <div class="details-label">status:</div>
            <div class="details-value">
              <el-tag :type="mobileView.status === 0 ? 'success' : mobileView.status === 1 ? 'danger' : 'warning'">
                {{ mobileView.status === 0 ? 'Enabled' : mobileView.status === 1 ? 'Disabled' : 'Sleep' }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-dialog> -->
      <!-- <s>ADD, EDIT</s> -->
      <addoredit ref="form" style="width:40%" :rules="fields_rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
        initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit"
        @emi="emitChange">
      </addoredit>
    </el-config-provider>

  </div>
</template>
  
  
  
<script >
// src="//unpkg.com/@element-plus/icons-vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import addoredit from "@/views/components/addoredit/index.vue"
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import search_control from '@/views/components/qureyParams/index.vue'




export default {
  // name: "Job",
  dicts: ['sys_normal_disable'],

  components: {
    addoredit,
    search_control,
    tableHeader,
  },
  data() {
    return {
      detailsDialogVisible: false,
      mobileView: null,
      items: [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'orderNum', label: 'Order' },
        { key: 'component', label: 'Component' },
        { key: 'remark', label: 'Note' },
        { key: 'createBy', label: 'ADD By' },

        // Add more items as needed
      ],
      selectedRows: [],
      mode: 'add',
      loading: true,
      showSearch: true,
      switching: undefined,
      initialValuesEdit: undefined,
      initialValuesAdd: undefined,
      isExpandAll: false,
      refreshTable: true,
      loading: false,
      displaySearch: true,
      open: false,
      form: {},
      title: "", // Default title for the dialog
      menuList: [],
      types: [{ label: 'Directory', value: 0 }, { label: 'menu', value: 1 }, { label: 'Button', value: 2 }],
      // total: 0,
      // paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
      // isHasNextPage: false,
      // isHasPreviousPage: false,
      queryParams: {
        name: undefined,
        status: '',
        createTime: undefined,
        leader: undefined,
        parentId: null,
        deptId: undefined,
        userId: undefined,
        jobId: undefined,
        pageNo: 1,
        pageSize: 0
      },


      Add_Edit:
        [
          {
            "type": "text",
            inputtype: "text",
            name: "component",
            label: "component Name ",
            placeholder: "Enter the component name",
            span: 24
          },
          {
            "type": "menu",
            inputtype: "menu",
            name: "parentId",
            label: "Parent Menu",
            placeholder: "Selected Departments",
            span: 12,
          },
          {
            "type": "selectV",
            inputtype: "selectV",
            name: "type",
            label: "Enter the Type ",
            placeholder: "Select the Type ",
            data: [{ label: 'Directory', value: 0 }, { label: 'File', value: 1 }, { label: 'Link', value: 2 }],
            span: 24,
            multiple: false
          },
          {
            "type": "text",
            inputtype: "text",
            name: "icon",
            label: "Icon Name ",
            placeholder: "Enter an Icon",
            span: 24
          },
          {
            "type": "text",
            inputtype: "text",
            name: "name",
            label: "Menu Name ",
            placeholder: "Select an Icon",
            span: 24
          },
          {
            inputtype: "text",
            name: "path",
            label: "Please add a Path",
            placeholder: "Enter Description ",
            span: 24
          },
          {
            "type": "sorting",
            inputtype: "sorting",
            name: "orderNum",
            label: "Sorting Position",
            placeholder: "Display Sorting",
            span: 24
          },
          {
            inputtype: 'switch',
            name: 'status',
            label: 'menu Status',
            switchOnColor: '#309f62',
            switchOffColor: '#ff4949',
            activeText: 'Activate',
            inactiveText: 'Disabled',
            activeValue: 0,
            inactiveValue: 1,
            span: 24
          },
          {
            "type": "textarea",
            inputtype: "textarea",
            name: "remark",
            label: "Menu Note/Description",
            placeholder: "Please enter a description or note ",
            span: 24
          },

        ],
      fields_rules:
      {

        menuName: [
          { required: true, message: "Menu name cannot be empty", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "Menu order cannot be empty", trigger: "blur" }
        ],
        path: [
          { required: true, message: "Route address cannot be empty", trigger: "blur" }
        ],
        type: [
          { required: true, message: "Please select type ", trigger: "blur" }
        ],

        // parentId: [
        //   { required: true, message: "Please select Parent ", trigger: "blur" }
        // ],

        status: [
          { required: true, message: "Please select display status can't ", trigger: "blur" }
        ],
      }
      ,
      searchFields: [
        // Define your search field configurations here
        // Example:
        {
          'type': 'menu',
          inputtype: "menu",
          name: 'name',
          label: 'Menu name',
          style: 'width: 150px',
          multiple: 'false'


        },
        {
          'type': 'roles',
          inputtype: "roles",
          name: 'roleId',
          label: 'Role',
          placeholder: 'Select Role',
          style: 'width: 150px'

        },

        {
          inputtype: 'StatusSelect',
          name: 'status',
          label: 'Menu Status',
        },
        {
          'type': 'userField',
          inputtype: "userField",
          name: 'userId',
          label: 'UserName',
          data: 'username',
          // style: 'width: 150px'
        },
        {
          type: 'Position',
          inputtype: "Position",
          name: 'jobId',
          label: 'Job Name',
          data: 'Position',
          // style: 'width: 150px'

        },
      ],
      searchButtonText: 'Search',
      resetButtonText: 'Reset',
      searchIcon: 'el-icon-search',
      resetIcon: 'el-icon-refresh',

    };
  },
  //**************Creating ************************************** */  
  created() {
    this.getList();
  },
  //**************Methods Control*********************************************** */

  methods: {
    openDetails(row) {
      this.mobileView = row;
      this.detailsDialogVisible = true;
    },

    //Watch the form input
    emitChange(x) {
      // this.$emit('fieldChanged', this.formData);
      console.log(x)
      const { type } = x
      this.switching = type
      console.log(this.switching)
      // this.generateForm(triggerType)
      console.log(x)
    },
    //*****************Pagination control********************************** */
    handlePageChange(newPage) {
      // Update the queryParams with the new page number
      this.queryParams.pageNo = newPage;

      // Fetch data for the new page
      this.getList();
    },

    //********Node control**************************************************************************************** */


    getList() {
      this.loading = true;
      console.log(this.queryParams)
      this.$http.menu.MenuHierarchy(this.queryParams).then(res => {
        if (res.result && res.result.data) {
          this.menuList = res.result.data;
          // this.isHasNextPage = res.result.isHasNextPage;
          // this.isHasPreviousPage = res.result.isHasPreviousPage;
          // this.total = res.result.total;
          console.log(this.menuList)
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error('Failed to load the Menu List');
        }
      });
    },

    //****************** */ Open and Close***************************************

    openAddEdit() {
      this.open = true
      this.reset(this.form)

    },
    closeAddEdit() {
      this.open = false
      this.reset(this.form);
    },
    //************************************** */
    handleQuery(e) {
      this.getList();
    },

    /** Reset button operation */

    resetQuery() {
      this.queryParams.name = ''
      this.queryParams.status = ''
      this.queryParams.parentId = ''
      this.queryParams.roleId = ''
      this.queryParams.type = ''
      this.queryParams.userId = ''
      this.queryParams.jobId = ''
      this.handleQuery();
      this.getList();
    },
    //**************** Add, Edit and delete control section******************************************* */
    //***************************Fields************************************************************/
    generateForm(type) {
      console.log(type)
      this.Add_Edit =
        [
          {
            "type": "selectV",
            inputtype: "selectV",
            name: "type",
            label: "Enter the Type ",
            placeholder: "Select the Type ",
            data: [{ label: 'Directory', value: 0 }, { label: 'File', value: 1 }, { label: 'External Link', value: 2 }],
            span: 24,
            multiple: false
          }
        ]

      if (type === 0 || type === 1) {
        console.log("Hellow")
        this.Add_Edit.push(
          {
            "type": "text",
            inputtype: "text",
            name: "component",
            label: "component Name ",
            placeholder: "Enter the component name",
            span: 24
          },
          // {
          //   "type": "menu",
          //   inputtype: "menu",
          //   name: "parentId",
          //   label: "Parent Menu",
          //   placeholder: "Selected Departments",
          //   span: 12,
          // },

          {
            "type": "text",
            inputtype: "text",
            name: "name",
            label: "Menu Name ",
            placeholder: "Select an Icon",
            span: 24
          },

        )
      }

      if (type === 2) {
        if (this.mode === 'add' && this.open === true) {
          this.initialValuesAdd = {
            'delFlag': 0,
            'status': 1,
            'type': 2,
            'parentId': 0
          }
        }

      }

      this.Add_Edit.push(
        {
          inputtype: "text",
          name: "path",
          label: "Please add a Path",
          placeholder: "Enter Description ",
          span: 24
        },
        {
          "type": "text",
          inputtype: "text",
          name: "icon",
          label: "Icon Name ",
          placeholder: "Enter an Icon",
          span: 24
        },
        {
          "type": "sorting",
          inputtype: "sorting",
          name: "orderNum",
          label: "Sorting Position",
          placeholder: "Display Sorting",
          span: 24
        },
        {
          inputtype: 'switch',
          name: 'status',
          label: 'menu Status',
          switchOnColor: '#309f62',
          switchOffColor: '#ff4949',
          activeText: 'Activate',
          inactiveText: 'Disabled',
          activeValue: 0,
          inactiveValue: 1,
          span: 24
        },
        {
          "type": "textarea",
          inputtype: "textarea",
          name: "remark",
          label: "Menu Note/Description",
          placeholder: "Please enter a description or note ",
          span: 24
        },
      )



    },

    // *********************************ADDing*****************************
    handleAdd(row) {
      this.mode = "add"
      this.open = true;
      console.log(row.parentId)
      if (row.parentId === undefined) {
        console.log(" I am here")
        this.initialValuesAdd = { "delFlag": "0", 'type': 0, "parentId": 0 }
        // this.generateForm(this.switching)
      }

      if (row.parentId !== undefined) {
        console.log(row)
        this.initialValuesAdd = { "delFlag": "0", "parentId": row.menuId }
        // this.generateForm(this.switching)
      }
    },

    //*******************Edit control section**********************************/
    handleUpdate(row) {
      this.mode = "Edit"
      this.open = true

      this.initialValuesEdit = row
      // this.generateForm(this.switching)
      this.open = true
    },

    /**************************** Submit button**************************** */
    onSubmit(n) {
      this.form = n
      if (this.mode == 'add') {
        this.$http.menu.addMenu(this.form).then(response => {
          console.log()
          console.log('sssssssssssssssssssssss' + response.data)
          this.$modal.msgSuccess("Addition successful");
          this.open = false;
          this.getList();
        }).catch(message => {
          ("The error:*" + message + ":*");
        });

      }
      else {
        this.$http.menu.updateMenu(this.form).then(response => {
          console.log('sssssssssssssssssssssss' + this.form)
          this.$modal.msgSuccess("Update successful");
          this.open = false;
          this.getList();
        }).catch(message => {
          ("The error:*" + message + ":*");
        });
      }
    },
    //********************Reset************************************************ */
    reset() {
      this.form = {
        parentId: '',
        name: '',
        type: '',
        status: '',
        path: '',
        remark: '',
        orderNum: '',
      };
    },
    //*******************************************Delete Control Section************************************* */  
    handle_SideDelete(row) {
      this.selectedRows.push(row)
      console.log(this.selectedRows)
      if (this.selectedRows.length > 0) {
        // Check if any of the selected items have children
        const hasChildren = this.selectedRows.some(row => row.children && row.children.length > 0);
        if (hasChildren) {
          this.$modal.msgError("Cannot delete menu that have children. Please delete the children first. or select and delete from the {top}");
          this.selectedRows = [];
        } else {
          this.$modal.confirm('Are you sure you want to delete the following : ' + this.selectedRows.map(row => row.name).join(', ') + '?').then(() => {
            this.selectedRows.forEach(row => {
              // Assuming this.$http.dept.deleteDeptid can take a deptId and delete the corresponding department
              this.$http.menu.deleteMenuid(row.menuId);
            });
            this.getList();
            this.$modal.msgSuccess("Deletion successful");
            this.selectedRows = [];
          }).catch(() => { });
        }
      } else {
        console.log('No data');
      }
    },

    handleDelete() {
      if (this.selectedRows.length > 0) {
        this.$modal.confirm('WARNING: You are about to permanently delete the following Item/Items:{ '
          + this.selectedRows.map(row => row.name).join(', ')
          + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
            this.selectedRows.forEach(row => {
              // Delete the department
              this.$http.menu.deleteMenuid(row.menuId);
              // If the department has children, delete them as well
            });
            this.getList();
            this.$modal.msgSuccess("Deletion successful");
          }).catch(() => { });
      } else {
        console.log('No data');
      }
    },

    //************Header control****************************************************************** */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },

    //*************handle selection section************************* */
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.selectedRows.forEach(row => {
        console.log(row.menuId, row.name); // logs the deptId and name of each selected row
      });

    },
  },
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
  
  
  
  