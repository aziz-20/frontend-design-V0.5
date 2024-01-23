<template>
  <!-- <script src="//unpkg.com/@element-plus/icons-vue"></script> -->
  <div class="app-container">
    <div class="flex" v-if="showSearch">
      <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
        :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="Reload" :emptyFields="resetQuery"
        :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
        :resetIcon="resetIcon">
      </search_control>
    </div>

    <div>
      <!-- Table Header -->
      <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
        :buttonsConfig="headers" :buttons="{ new: true, edit: true, expand: true, delete: true, filter: true }"
        :handleAdd="handleSideAdd" :handleUpdate="handleSideUpdate" :toggleExpandAll="toggleExpandAll"
        :handleDelete="handleDelete" :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
        :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
    </div>

    <div>
      <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
      <ReusableTable :data="menuList" :columns="tableColumns" rowKey="menuId" :loading="loading"
        :refreshTable="refreshTable" :default-expand-all="isExpandAll" :handleSelectionChange="handleSelectionChange"
        :handleAdd="handleAdd" :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete"
        :openDetails="openDetails" popUpTitle="Test" :columnPopUp="columnPopUp" columnLabel="hello"
        :rowClassChecker="rowClassChecker" :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />
    </div>

    <div>

      <PopupColumn v-model:visible="columnVisible" :buttonsConfig="tablebuttons" :selectedPerm="selectedItem"
        :popUpTitle="popUpTitle" :columnPopUp="columnPopUp" :handleAdd="handleAdd" :handleUpdate="handleUpdate"
        :handle_SideDelete="handle_SideDelete">
      </PopupColumn>
    </div>

    <div>
      <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
        :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig" :handleAdd="handleAdd" :handleUpdate="handleUpdate"
        :handle_SideDelete="handle_SideDelete">
      </PhoneTablePopUp>
    </div>


    <addoredit ref="form" style="width:40%" :rules="fields_rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
      initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit"
      @emi="emitChange">
    </addoredit>

  </div>
</template>
  
  
  
<script >
import PopupColumn from "/src/views/components/defaultTable/columnPopup"
import ReusableTable from "@/views/components/defaultTable"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import addoredit from "@/views/components/addoredit/index.vue"

import search_control from '@/views/components/qureyParams/index.vue'




export default {
  name: "Menu",
  dicts: ['sys_normal_disable'],

  components: {
    addoredit,
    search_control,
    tableHeader,
    PhoneTablePopUp,
    ReusableTable,
    PopupColumn
  },
  data() {
    return {
      // Visible: false,
      columnVisible: false,
      selectedItem: null,

      // headers: [
      //   {
      //     add: true,
      //   },
      //   {
      //     edit: true,
      //   },
      //   {
      //     delete: true,
      //   },
      //   {
      //     view: true,
      //   },
      //   {
      //     normal: true,
      //     name: 'test',
      //     size: 'small',
      //     color: 'green',
      //     handler: this.handleAdd
      //   }
      // ],
      columnPopUp: [{ label: 'Name', prop: 'name' }, { label: 'ID', prop: 'menuId' }],
      dialogVisible: false,
      buttonsConfig: [],
      mobileView: null,
      popUpFields: [],
      tableColumns: [],
      tablebuttons: [],
      columns: null,
      selectedRows: [],
      mode: '',
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
            "type": "selectV",
            inputtype: "selectV",
            name: "redirect",
            label: "Direction Type ",
            placeholder: "Select the Type ",
            data: [{ label: 'Direct', value: 0 }, { label: 'Redirect', value: 1 }],
            multiple: false
          },

          {
            inputtype: 'switch',
            name: 'hidden',
            label: 'Menu view access',
            switchOnColor: '#309f62',
            switchOffColor: '#ff4949',
            activeText: 'Show',
            inactiveText: 'Hide',
            activeValue: 0,
            inactiveValue: 1,
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
            inputtype: "icon",
            name: "icon",
            label: "Icons",
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
  // watch: {
  //   switching(newVal, oldVal) {
  //     if (this.mode === 'add' && this.open === true) {
  //       this.handleAdd(); // Call anotherMethod whenever `this.switching` changes
  //     }
  //     if (this.mode === 'edit' && this.open === true) {
  //       this.handleUpdate(); // Call anotherMethod whenever `this.switching` changes
  //     }
  //   },
  // },
  methods: {
    handleOpenPopup(selectedData) {
      console.log('Iam here')
      this.selectedItem = selectedData;
      this.columnVisible = true;
    },
    handeltagclick(val) {
      //When using the pop up  inside the columns please don't forget to add the closing method
      this.$emit('open-popup', val);
    },


    //********************************table***************************************************************************************
    rowClassChecker({ row }) {
      if (row.children && row.children.length > 0) {
        return 'greenClass';
      }
    },
    table() {
      this.tableColumns = [
        { type: 'select' },
        { prop: 'name', label: 'Name', minWidth: '150', fixed: 'left', show: true },
        // { label: 'Name Children', parent: 'children', type: 'tagPopup', insideKey: 'children', name: 'name', minWidth: '150' },
        { label: 'Order', prop: 'orderNum' },
        {
          label: 'Status',
          prop: 'status',
          type: 'tag',
          tagType: (statusValue) => {
            return statusValue === 0 ? 'success' : 'warning';
          },
          tagLabel: (statusValue) => {
            return statusValue === 0 ? 'Active' : 'Not Active';
          },
          tagColor: (value) => { /* ... */ }
        },
        {
          label: 'Type',
          prop: 'type',
          type: 'tag',
          // type: true,
          tagType: (value) => {
            const type = value === 0 ? 'success' : (value === 1 ? 'info' : 'warning');
            return type;
          },
          tagLabel: (value) => {
            const label = value === 0 ? 'Directory' : (value === 1 ? 'File' : 'Link');
            return label;
          },
          tagColor: (value) => { /* ... */ },
        },
        { label: 'Icon', prop: 'icon', minWidth: '100', type: 'icon' },
        { label: 'Path', prop: 'path', minWidth: '100' },
        { label: 'Component', prop: 'component', minWidth: '100' },
        { label: 'ADD By', prop: 'createByName' },
        { prop: 'createTime', label: 'Create Date', type: 'calendar' },
        { label: 'Updated By', prop: 'updateByName' },
        { prop: 'updateTime', label: 'Last Update Time' },
        { type: 'actions', label: 'Operation', minWidth: '100', fixed: 'right', align: 'right', show: true },

      ]

      this.tablebuttons =
        [
          {
            add: true,
            prop: 'type',
            value: 0,
          },
          {
            edit: true,
          },
          {
            delete: true,
          },
          {
            view: true,
          }
        ];
    },

    //**********************PopUp*************************************************** */
    openDetails(row) {
      this.mobileView = row;
      this.buttonsConfig = [
        {
          add: true,
          prop: 'type',
          value: 0,
        },
        {
          edit: true,
        },
        {
          delete: true,
        },
      ];
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false; // Method to close the dialog
    },
    //********************************************************************* */
    //Watch the form input
    emitChange(x) {
      const { type } = x
      this.switching = type
      console.log(this.switching)
    },
    //*****************Pagination control********************************** */
    handlePageChange(newPage) {
      this.queryParams.pageNo = newPage;
      this.getList();
    },

    //********Node control**************************************************************************************** */


    getList() {
      this.loading = true;
      this.$http.menu.MenuHierarchy(this.queryParams).then(res => {
        if (res.result && res.result.data) {
          this.menuList = res.result.data;
          console.log(this.menuList)
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error('Failed to load the Menu List');
        }
      });
      this.table();
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
    Reload() {
      this.resetQuery();
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
            multiple: false
          },
          {
            "type": "selectV",
            inputtype: "selectV",
            name: "redirect",
            label: "Direction Type ",
            placeholder: "Select the Type ",
            data: [{ label: 'Direct', value: 0 }, { label: 'Redirect', value: 1 }],
            multiple: false
          },

          {
            inputtype: 'switch',
            name: 'hidden',
            label: 'Menu view access',
            switchOnColor: '#309f62',
            switchOffColor: '#ff4949',
            activeText: 'Show',
            inactiveText: 'Hide',
            activeValue: 0,
            inactiveValue: 1,
          },
        ]
      if (type === 2) {
        if (this.mode === 'add' && this.open === true) {
          this.initialValuesAdd = {
            'delFlag': 0,
            'status': 1,
            'type': 2,
            'parentId': 0
          }
        }

      } else {
        this.Add_Edit.push(
          {
            "type": "text",
            inputtype: "text",
            name: "component",
            label: "component Name ",
            placeholder: "Enter the component name",
          },

          {
            "type": "text",
            inputtype: "text",
            name: "name",
            label: "Menu Name ",
            placeholder: "Select an Icon",
          },

        )
      }



      this.Add_Edit.push(
        {
          inputtype: "text",
          name: "path",
          label: "Please add a Path",
          placeholder: "Enter Description ",

        },
        {
          "type": "text",
          inputtype: "text",
          name: "icon",
          label: "Icon Name ",
          placeholder: "Enter an Icon",

        },
        {
          "type": "sorting",
          inputtype: "sorting",
          name: "orderNum",
          label: "Sorting Position",
          placeholder: "Display Sorting",

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
        },
        {
          "type": "textarea",
          inputtype: "textarea",
          name: "remark",
          label: "Menu Note/Description",
          placeholder: "Please enter a description or note ",
        },
      )



    },

    // *********************************ADDing*****************************
    handleSideAdd(selectedRows) {
      console.log(this.selectedRows[0])
      if (this.selectedRows.length === 1) {
        this.handleAdd(this.selectedRows[0])
      }
      else {
        this.handleAdd()
      }
    },
    handleAdd(row) {
      this.mode = "add"
      this.open = true;
      console.log(row)
      if (row === undefined) {
        this.initialValuesAdd = { "delFlag": "0", 'type': 0, "parentId": 0 }
        // console.log(this.switching)
        // this.generateForm(this.switching)
      }

      if (row !== undefined) {
        if (row.parentId !== 0) {
          console.log("Hello")
          this.initialValuesAdd = { "delFlag": "0", "parentId": row.parentId }
          // console.log(this.switching)
          // this.generateForm(this.switching)
        }
        if (row.parentId === 0) {
          this.initialValuesAdd = { "delFlag": "0", "parentId": row.menuId }
          // console.log(this.switching)
          // this.generateForm(this.switching)
        }
        // console.log(this.switching)
        // this.generateForm(this.switching)
      }
    },

    //*******************Edit control section**********************************/
    handleSideUpdate(selectedRows) {
      if (this.selectedRows.length === 1) {
        this.handleUpdate(this.selectedRows[0])
      }
    },
    handleUpdate(row) {
      this.mode = "edit"
      this.open = true
      this.initialValuesEdit = row
      // this.generateForm(this.switching)
      // this.open = true
    },

    /**************************** Submit button**************************** */
    onSubmit(n) {
      this.form = n
      if (this.mode == 'add') {
        this.$http.menu.addMenu(this.form).then(response => {

          this.$modal.msgSuccess("Addition successful");
          this.open = false;
          this.getList();
        }).catch(message => {
          ("The error:*" + message + ":*");
        });

      }
      else {
        this.$http.menu.updateMenu(this.form).then(response => {
          // console.log('sssssssssssssssssssssss' + this.form)
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
        // console.log('No data');
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
        // console.log('No data');
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

<style >
.greenClass {
  background-color: rgb(227, 235, 227);
}
</style>
  
  
  
  