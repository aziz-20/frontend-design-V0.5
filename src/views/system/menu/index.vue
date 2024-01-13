<template>
  <div class="app-container">
    <div class="flex" v-if="showSearch">
      <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
        :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetQuery"
        :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
        :resetIcon="resetIcon">
      </search_control>

    </div>

    <!-- Table Header -->
    <el-row class="mb-4" :gutter="10">
      <el-col :span="1.5">
        <el-button color="#626aef" :dark="isDark" plain type="primary" :icon="Add" size="mini"
          @click="handleAdd">NEW</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" :icon="el - icon - sort" size="mini" @click="toggleExpandAll">Expand/collaps</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" @click="handleDelete" v-hasPermi="['system:post:remove']" color="red" :dark="isDark"
          plain>Delete</el-button>
      </el-col>
      <el-col :span="1.5" :offset="22.5" :class="{ 'show-search': showSearch }">
        <el-button v-if="!showSearch" @click="showSearch = true" style="float: right;">Show Filter</el-button>
        <el-button v-else @click="showSearch = false" style="float: right;">Hide Filter</el-button>
      </el-col>
    </el-row>

    <!-- Table view  -->
    <el-config-provider>
      <el-table flex :data="menuList" style="width:200%" row-key="parentId" v-loading="loading"
        element-loading-text="Loading..." :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50"
        :default-expand-all="isExpandAll" element-loading-background="rgba(122, 122, 122, 0.8)" v-if="refreshTable"
        @selection-change="handleSelectionChange">

        <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="name" label="Name" width="180" />
        <el-table-column fixed prop="type" label="Type" width="120" />
        <el-table-column prop="icon" label="Icon" align="center" width="100">
          <template slot-scope="scope">
            <!-- <svg-icon :icon-class="scope.row.icon" /> -->
          </template>
        </el-table-column>
        <el-table-column fixed prop="orderNum" label="Order" width="150" />
        <el-table-column fixed prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="component" label="Component" width="120" />
        <el-table-column prop="path" label="Path" width="200" />
        <!-- <el-table-column type="icon" prop="Icon " label="Icons" width="200" /> -->
        <el-table-column prop="remark" label="Note" width="200" />
        <el-table-column prop="createBy" label="ADD By " width="200" />
        <el-table-column fixed="right" label="Actions" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row, column, index }">
            <el-row class="mb-4">
              <el-button size="mini" type="text" @click="handleAdd(row, index)" :el-icon-plus="Add"
                v-hasPermi="['system:user:add']" v-if="row.type === 0">
                Add</el-button>
              <el-button type="primary" :el-icon-plus="Edit" size="small" @click="handleUpdate(row)"
                v-hasPermi="['system:user:edit']">
                Edit</el-button>
              <el-button type="warning" :el-icon-plus="Delete" size="small" @click="handle_SideDelete(row)"
                v-hasPermi="['system:user:remove']">Delete</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- <s>ADD, EDIT</s> -->
      <addoredit ref="form" style="width:40%" :rules="fields_rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
        initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit"
        @emi="emitChange">
      </addoredit>
    </el-config-provider>

  </div>
</template>
  
  
  
<script >
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
    // IconSelect
  },
  data() {
    return {
      selectedRows: [],
      mode: 'add',
      loading: true,
      showSearch: true,
      switching: undefined,
      initialValuesEdit:undefined ,
      initialValuesAdd: undefined,
      isExpandAll: true,
      refreshTable: true,
      loading: false,
      displaySearch: true,
      open: false,
      form: {},
      title: "", // Default title for the dialog
      menuList: [],
      types: [{ label: 'Directory', value: 0 }, { label: 'menu', value: 1 }, { label: 'Button', value: 2 }],
      total: 0,
      paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
      isHasNextPage: false,
      isHasPreviousPage: false,
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
          // {
          //   "inputtype": "dynamicFeild", 
          //   data: {
          //     Dept: undefined, userIds: undefined
          //   }, inputtype: "dynamicFeild", name: "scopping", placeholder: "Enter the permision remark", span: "col-6"
          // },
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
            data: [{ label: 'Directory', value: 0 }, { label: 'menu', value: 1 }, { label: 'Link', value: 2 }],
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
            'parentId':0
          }
        }
        // if (this.mode === 'Edit' && this.open === true) {
        //   this.initialValuesEdit = {
        //     'delFlag': 0,
        //     'triggerType': 1,
        //     'status': 1,
        //     'taskRun': 1
        //   }
        // }
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
      this.initialValuesAdd = { "delFlag": "0", 'type': 0,"parentId": 0}
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
};
</script>
  
  
  
  