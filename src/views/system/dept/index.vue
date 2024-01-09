<template>
  <div class="app-container">
    <div class="flex" v-if="showSearch">
      <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
        :handleQuery="handleQuery" :resetQuery="resetQuery" :searchButtonText="searchButtonText"
        :resetButtonText="resetButtonText" :searchIcon="searchIcon" :resetIcon="resetIcon">
      </search_control>
    </div>
    <!-- Table Header -->
    <el-row class="mb-4" :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" :icon="Add" size="mini" @click="handleAdd">NEW</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" :icon="el - icon - sort" size="mini" @click="toggleExpandAll">Expand/collaps</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" :icon="Delete" type="primary" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:post:remove']" color="red" :dark="isDark" plain>Delete</el-button>
      </el-col>
      <el-col :span="1.5" :offset="22.5" :class="{ 'show-search': showSearch }">
        <el-button v-if="!showSearch" @click="showSearch = true" style="float: right;">Show Filter</el-button>
        <el-button v-else @click="showSearch = false" style="float: right;">Hide Filter</el-button>
      </el-col>
    </el-row>

    <!-- Table view  -->
    <el-config-provider>
      <el-table :data="deptList" style="width:150%" row-key="deptId" v-loading="loading" element-loading-text="Loading..."
        :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(122, 122, 122, 0.8)" :default-expand-all="isExpandAll" v-if="refreshTable"
        @selection-change="handleSelectionChange">

        <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="name" label="Department Name" width="240" />
        <el-table-column fixed prop="orderNum" label="Structure order" width="150" />
        <el-table-column fixed prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column type="Calender" prop="createTime" label="Registry Data" width="200" />
        <el-table-column prop="updateTime" label="Last Update Time" width="200" />
        <el-table-column prop="leader" label="Head of the Department" width="200" />
        <el-table-column prop="phone" label="Phone" width="170" />
        <el-table-column prop="email" label="Email" width="170" />
        <el-table-column fixed="right" label="Actions" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row, column, index }">
            <el-row class="mb-4">
              <el-button size="mini" type="text" @click="handleAdd(row, index)" :el-icon-plus="Add"
                v-hasPermi="['system:user:add']">
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
      <addoredit ref="form"  :rules="rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
        initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit">
      </addoredit>

    </el-config-provider>

    <el-row justify="center">
      <el-col :span="24" :sm="12" :md="8">
        <el-pagination v-show="total > 0" background layout="prev, pager, next" :total="total"
          :page.sync="queryParams.pageNo"  :page-size.sync="queryParams.pageSize" :layout="paginationLayout"
          @current-change="handlePageChange" />
      </el-col>
    </el-row>



  </div>
</template>

<script>
import addoredit from "@/views/components/addoredit/index.vue"
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import search_control from '@/views/components/qureyParams/index.vue'
import { mapOnePropToObject, treeTransformerTwoValues } from '@/utils/dtControl/dTransformer'

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],

  components: {
    addoredit,
    search_control
  },
  data() {
    return {
      selectedRows: [],
      mode: 'add',
      loading: true,
      showSearch: true,
      initialValuesEdit: undefined,
      initialValuesAdd: undefined,
      isExpandAll: true,
      refreshTable: true,
      loading: false,
      displaySearch: true,
      open: false,
      inivalu: [],
      form: {},
      title: "", // Default title for the dialog
      transLeaderList: [],
      transNameList: [],
      deptOptions: [], // Populate this with your data
      deptList: [],
      total: 0,
      paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
      isHasNextPage: false,
      isHasPreviousPage: false,
      form: {
        deptId: '',
        parentId: '',
        name: '',
        hierarchy: '',
        orderNum: '',
        leader: '',
        phone: '',
        email: '',
        status: '',
        userId: '',
      },
      queryParams: {
        deptId: undefined,
        status: '',
        deptId: '',
        createTime: undefined,
        leader: undefined,
        pageNo: 1,
        pageSize: 20
      },

      Add_Edit:
        [
          {
            "type": "treeSelect",
            inputtype: "departmentNew",
            name: "parentId",
            label: "Department parent",
            placeholder: "Department selected",
            span: 12

          },
          {
            "type": "input",
            inputtype: "text",
            name: "name",
            label: "Department name",
            placeholder: "Department selected",
            span: 12

          },
          {
            // type: 'select',
            inputtype: "userField",
            name: "leader",
            label: "Department Manger",
            placeholder: "Please add the department Manger",
            style: 'width: 150px'

          },

          {
            "type": "email",
            inputtype: "email",
            name: "email",
            label: "Department Email",
            placeholder: "Enter email",
            data: [{ value: 'email', label: 'email' }],
            span: 12

          },
          {
            "type": "phone",
            inputtype: "phone",
            name: "phone",
            label: "Contact Number ",
            placeholder: "Please add phone number",
            span: 12
          },

          {
            "type": "sorting",
            inputtype: "sorting",
            name: "orderNum",
            label: "Department Sorting",
            placeholder: "Display Sorting",
            span: 12

          },
          {
            inputtype: 'switch',
            name: 'status',
            label: 'Department Status',
            switchOnColor: '#309f62',
            switchOffColor: '#ff4949',
            activeText: 'Enabled',
            inactiveText: 'Disabled',
            activeValue: 0,
            inactiveValue: 1,
            span: 12
          },

        ],
      rules:
      {
        parentId:
          [
            { required: true, message: "Parent Department cannot be empty", trigger: "change" }
          ],
        name: [
          { required: true, message: "Department name cannot be empty", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "Display order cannot be empty", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "Please enter a valid email address",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "Please enter a valid phone number",
            trigger: "blur"
          }
        ]
      }
      ,
      searchFields: [
        // Define your search field configurations here
        // Example:
        {
          inputtype: 'departments',
          name: 'deptId',
          label: 'Department Name',

        },

        {
          inputtype: 'StatusSelect',
          name: 'status',
          label: 'Department Status',
        },
        {
          type: 'userField',
          inputtype: "userField",
          name: 'userId',
          label: 'User Name',
          placeholder: "Enter username",
          style: 'width: 150px'

        },

      ],
      searchButtonText: 'Search',
      resetButtonText: 'Reset',
      searchIcon: 'el-icon-search',
      resetIcon: 'el-icon-refresh',

    }
  },
  //**************Creating ************************************** */  
  created() {
    this.getList();
  },
  //**************Methods Control*********************************************** */

  methods: {
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
      this.$http.dept.DeptlistHierarchy(this.queryParams).then(res => {
        if (res.result && res.result.data) {
          this.deptList = res.result.data;
          this.isHasNextPage = res.result.isHasNextPage;
          this.isHasPreviousPage = res.result.isHasPreviousPage;
          this.total = res.result.total;
          console.log(this.queryParams)
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error('Failed to load department list');
        }
      });

    },
    //************************************** */
    handleQuery(e) {

      this.getList();
    },
    resetQuery() {
      this.queryParams.name = ''
      this.queryParams.status = ''
      this.queryParams.leader = ''
      this.queryParams.userId = ''
      this.queryParams.createTime = ''
      this.queryParams.deptId = ''
      this.handleQuery();
      this.getList();
    },
    //**************** Add, Edit and delete control section******************************************* */
    getParentName(parentId) {
      if (parentId === undefined) {
        const response = this.$http.dept.getDeptyid(parentId);
        console.log(response)
        const parent = response.result.data.find(item => item.deptId === parentId);
        console.log(parent)
        return parent ? parent.name : null;
      } else {
        return this.$modal.msgError(`Could not open the the add :${this.selectedRows.map(row => row.name).join(', ')}`);

      }
    },
    //****************Retrieving making list with value*********************************** */
    handleAdd(row) {
      this.mode = 'add'
      console.log(this.form)
      // this.formFieldSelectData(),
      this.open = true;
      this.initialValuesAdd = { "delFlag": 0, "status": 0, "parentId": row.deptId }
      // if (row.parentId !== undefined) {
      //   console.log(row)
      //   this.open = true;
      //   this.initialValuesAdd = { "delFlag": "0", "parentId": row.deptId, "status": 0, }
      //   console.log(this.form)
      // }
      // else {
      //   this.open = true;
      //   console.log(this.form)
      //   this.initialValuesAdd = { "delFlag": 0, "status": 0, "parentId": 0 }
      // }
    },

    //*******************Edit control section**********************************/
    handleUpdate(row) {
      this.mode = "Edit"
      // this.open = true
      this.initialValuesEdit = row
      this.open = true
      console.log(this.deptOptions)
      if (this.deptOptions === 0) {
        const noResultsOptions = { deptId: this.form.parentId, name: this.form.name, children: [] };
        this.deptOptions.push(noResultsOptions);
      }
    },

    /**************************** Submit button**************************** */
    onSubmit(n) {
      this.form = n
      if (this.mode === 'add') {
        this.$http.dept.addDept(this.form).then(response => {
          console.log()
          console.log('sssssssssssssssssssssss' + response.data)
          this.$modal.msgSuccess("Addition successful");
          console.log(this.form)
          this.open = false;
          this.getList();
        }).catch(message => {
          ("The error:*" + message + ":*");
        });

        this.resetform();
      }
      else {
        if (this.form.deptId !== undefined) {
          this.$http.dept.updateDept(this.form).then(response => {
            console.log('sssssssssssssssssssssss' + this.form)
            this.$modal.msgSuccess("Update successful");
            this.open = false;
            this.getList();

          }).catch(message => {
            ("The error:*" + message + ":*");
          });

        }
        console.log(this.form)
      }

    },
    //****************** */ Open and Close***************************************
    openAddEdit() {
      this.open = true
    },
    closeAddEdit() {
      this.open = false
    },
    //********************Reset************************************************ */
    resetform() {
      this.form.deptId = '',
        this.form.parentId = '',
        this.form.name = '',
        this.form.hierarchy = '',
        this.form.orderNum = 1,
        this.form.leader = '',
        this.form.phone = '',
        this.form.email = '',
        this.form.status = 0
    },

    handle_SideDelete(row) {
      this.selectedRows.push(row)
      console.log(this.selectedRows)
      if (this.selectedRows.length > 0) {
        // Check if any of the selected departments have children
        const hasChildren = this.selectedRows.some(row => row.children && row.children.length > 0);
        if (hasChildren) {
          this.$modal.msgError("Cannot delete departments that have children. Please delete the children first.");
          this.selectedRows = [];
        } else {
          this.$modal.confirm('Are you sure you want to delete the following departments: ' + this.selectedRows.map(row => row.name).join(', ') + '?').then(() => {
            this.selectedRows.forEach(row => {
              // Assuming this.$http.dept.deleteDeptid can take a deptId and delete the corresponding department
              this.$http.dept.deleteDeptid(row.deptId);
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
        this.$modal.confirm('WARNING: You are about to permanently delete the following departments and ALL their children: '
          + this.selectedRows.map(row => row.name).join(', ')
          + '. This action CANNOT be undone. Are you absolutely sure you want to proceed?').then(() => {
            this.selectedRows.forEach(row => {
              // Delete the department
              this.$http.dept.deleteDepid(row.deptId);
              // If the department has children, delete them as well
              if (row.children && row.children.length > 0) {
                row.children.forEach(child => {
                  this.$http.dept.deleteDepid(child.deptId);
                });
              }
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
      this.multipleSelection = selection;
      this.selectedRows = selection;
      this.selectedRows.forEach(row => {
        console.log(row.deptId, row.name); // logs the deptId and name of each selected row
      });

      console.log('test' + selection)

      // if (this.selectedRows.length > 0) {
      //   // console.log('Data exists');
      // } else {
      //   // console.log('No data');
      // }
    },


    //************************************************************** */

  },

  //*********************Active update *********************************/  

};


</script>
