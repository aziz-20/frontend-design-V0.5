<template>
    <div class="app-container">
      <div class="flex" v-if="showSearch">
        <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
          :handleQuery="handleQuery" :resetQuery="resetQuery" :searchButtonText="searchButtonText"
          :resetButtonText="resetButtonText" :searchIcon="searchIcon" :resetIcon="resetIcon">
        </search_control>
      </div>
      <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
        :buttons="{ new: true, edit: true, expand: true, delete: true, filter: true }" :handleAdd="handleAdd"
        :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelete"
        :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
        :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
      <!-- Table view  -->
      <!-- <el-config-provider> -->
      <el-table :data="deptList" style="width:100%" row-key="deptId" v-loading="loading" element-loading-text="Loading..."
        :element-loading-spinner="svg" :default-expand-all="isExpandAll" v-if="refreshTable"
        @selection-change="handleSelectionChange">
        <el-table-column :selectable="selectable" type="selection"></el-table-column>
        <el-table-column fixed prop="name" label="Name">
          <template #default="{ row }">
            <div
              :class="['table-row', { 'child-row': row.isChild, 'row-with-children': row.children && row.children.length > 0 }]" >
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="Order" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="Leader" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="email" label="Email" />
        <el-table-column type="Calender" prop="createTime" label="Create Data" />
        <el-table-column prop="updateTime" label="Last Update Time"/>
        <el-table-column fixed="right" label="Actions" align="center" class-name="small-padding fixed-width">
          <template #default="{ row, column, index }">
            <div class="table-button-container">
              <el-button size="mini" type="text" @click="handleAdd(row, index)" :el-icon-plus="Add"
                v-hasPermi="['system:user:add']">
                Add</el-button>
              <el-button type="primary" :el-icon-plus="Edit" size="small" @click="handleUpdate(row)"
                v-hasPermi="['system:user:edit']">
                Edit</el-button>
              <el-button type="warning" :el-icon-plus="Delete" size="small" @click="handle_SideDelete(row)"
                v-hasPermi="['system:user:remove']">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <addoredit ref="form"  :rules="fields_rules" :open="open" :mode="modeType" :title="title"
        :init="modeType === 'add' ? initialValuesAdd : initialValuesEdit" :visible="isFormVisible" :fields="Add_Edit"
        @close="closeAddEdit" @submit="onSubmit">
      </addoredit>
  
    </div>
  </template>
  
  <script>
  import tableHeader from "@/views/components/headerAndfooter/tableHeader"
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
      search_control,
      tableHeader,
  
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
          pageSize: 0
        },
  
        Add_Edit:
          [
            {
              "type": "treeSelect",
              inputtype: "departmentNew",
              name: "parentId",
              label: "Department parent",
              placeholder: "Department selected",
              // span: 12
  
            },
            {
              "type": "input",
              inputtype: "text",
              name: "name",
              label: "Department name",
              placeholder: "Department selected",
              // span: 12
  
            },
            {
              // type: 'select',
              inputtype: "userField",
              name: "leader",
              label: "Department Manger",
              placeholder: "Please add the department Manger",
              // style: 'width: 150px'
  
            },
  
            {
              "type": "email",
              inputtype: "email",
              name: "email",
              label: "Department Email",
              placeholder: "Enter email",
              data: [{ value: 'email', label: 'email' }],
              // span: 12
  
            },
            {
              "type": "phone",
              inputtype: "phone",
              name: "phone",
              label: "Contact Number ",
              placeholder: "Please add phone number",
              // span: 12
            },
  
            {
              "type": "sorting",
              inputtype: "sorting",
              name: "orderNum",
              label: "Department Sorting",
              placeholder: "Display Sorting",
              // span: 12
  
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
              // span: 12
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
            console.log(this.deptList)
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
      },
  
      //*******************Edit control section**********************************/
      handleUpdate(row) {
        this.mode = "Edit"
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
  
  <style>
  .table-row {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .child-row {
    padding-left: 20px;
    /* Adjust as needed */
  }
  
  .row-with-children {
    background-color: rgb(202, 201, 201);
  }
  
  .table-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  @media (max-width: 1000px) {
    .table-button-container {
      flex-direction: column;
    }
  }
  </style>