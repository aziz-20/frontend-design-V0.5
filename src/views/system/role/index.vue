<template>
  <div class="app-container">
    <div class="overlay" :class="{ 'is-active': showSide }" @click="showSide = false"></div>
    <div class="custom-drawer" :class="{ 'is-visible': showSide }">
      <el-button class="toggle-button" icon="el-icon-menu" @click="toggleDrawer"></el-button>
      <div class="custom-drawer" :class="{ 'is-visible': showSide }">
        <DrawerToggleButton :isDrawerOpen="showSide" @toggle-drawer="toggleDrawer" />
        <el-input v-model="sideSearch" placeholder="Please enter keyword" @input="filterMethod"
          :expand-on-click-node="true" />
        <el-tree :data="deptOptions" :filter-method="filterMethod" :height="208" :default-expand-all="isExpandAll"
          highlight-current @node-click="handleNodeClick" />
      </div>
    </div>
    <el-main>
      <div class="flex" v-if="showSearch">
        <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
          :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetQuery"
          :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
          :resetIcon="resetIcon" :visible="isFormVisible" :hiddenFields="hiddenFields">
        </search_control>
      </div>
      <!-- Table Header -->
      <el-row class="mb-4" :gutter="10">
        <div>
          <!-- Table Header -->
          <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
            :buttonsConfig="headers" :buttons="{ new: true, edit: true, expand: true, delete: true, filter: true }"
            :handleAdd="handleAdd" :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll"
            :handleDelete="handleDelete" :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
            :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
        </div>

        <el-col :span="1.5">
          <el-button v-if="!showSide" @click="showSide = true">Show Side</el-button>
          <el-button v-else @click="showSide = false" style="float: left;">Hide Side</el-button>
        </el-col>
      </el-row>
      <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
        :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig" :handleUpdate="handleUpdate"
        :handle_SideDelete="handle_SideDelete">
      </PhoneTablePopUp>

      <dev>
        <ReusableTable :data="roleList" :columns="tableColumns" rowKey="roleId" :loading="loading"
          :refreshTable="refreshTable" :default-expand-all="isExpandAll" :handleSelectionChange="handleSelectionChange"
          :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete" :openDetails="openDetails" popUpTitle="Test"
          :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />
      </dev>
      <template v-if="open">
        <addoredit ref="form" style="width:35%" :rules="fields_rules" :open="open" :mode="modeType" :title="title"
          :init="modeType === 'add' ? initialValuesAdd : initialValuesEdit" :visible="isFormVisible" :fields="Add_Edit"
          @close="closeAddEdit" @submit="onSubmit">
        </addoredit>
      </template>
    </el-main>

  </div>
  <div>
    <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
      :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout" @page-change="handlePageChange">
    </custom-pagination>
  </div>
</template>
<script>
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
import addoredit from "@/views/components/addoredit/index.vue"
import ReusableTable from "@/views/components/defaultTable"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import search_control from '@/views/components/qureyParams/index.vue'
import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject, treeTransformerMultiyvalue, treeTransformerFlexMultiyvalue } from '@/utils/dtControl/dTransformer'
// import { prefetchDepartments, getDepartmentName, getCachedDepartmentName } from '@/store/system/dept/index.js';
import { ElAside, ElInput, ElTree, ElButton, ElDrawer } from 'element-plus';
import inspector from "@/http/inspector";
// import { Edit, View as IconView } from '@element-plus/icons-vue';
export default {
  // name: "Job",
  dicts: ['sys_normal_disable'],

  components: {
    addoredit,
    search_control,
    ElAside,
    ElDrawer,
    CustomPagination,
    PhoneTablePopUp,
    tableHeader,
    ReusableTable
  },
  data() {
    return {

      tableColumns: [],
      tablebuttons:
        [
          {
            edit: true,
          },
          {
            delete: true,
          },
          {
            view: true,
          }
        ],
      selectedRows: [],
      loading: true,
      modeType: '',
      showSearch: true,
      mobileView: [],
      dialogVisible: false,
      initialValuesEdit: undefined,
      initialValuesAdd: undefined,
      showSide: false,
      isExpandAll: true,
      refreshTable: true,
      loading: false,
      displaySearch: true,
      roleList: [],
      sideSearch: [],
      open: false,
      usersList: [],
      originalDeptOptions: [],
      total: 0,
      paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
      isHasNextPage: false,
      isHasPreviousPage: false,
      custom: [
        { label: 'Personal ', value: 1 }, { label: 'Department', value: 2 }, { label: 'Department hierarchy', value: 3 }, { label: 'ALL', value: 4 }, { label: 'Custom', value: 5 }],
      form: {},
      title: "", // Default title for the dialog
      usersList: [],
      queryParams: {
        name: undefined,
        status: '',
        roleId: '',
        createTime: undefined,
        permId: undefined,
        deptId: undefined,
        userId: undefined,
        sideSearchToAdd: '',
        customId: '',
        pageNo: 1,
        pageSize: 30
      },
      Add_Edit: [
        {
          "type": "text",
          inputtype: "text",
          name: "name",
          label: "Role name",
          placeholder: "Please Enter Name for the Role",
        },
        {
          inputtype: 'switch',
          name: 'status',
          label: 'User Status',
          switchOnColor: '#309f62',
          switchOffColor: '#ff4949',
          activeText: 'Activate',
          inactiveText: 'Disabled',
          activeValue: 0,
          inactiveValue: 1,

        },
        // {
        //   "type": "customDataScop",
        //   inputtype: "customDataScop",
        //   name: "parentId",
        //   label: "Custom Data Scop",
        //   placeholder: "Department selected",
        //   span: 12

        // },
        {
          "type": "selectV",
          inputtype: "selectV",
          name: 'scopeId',
          label: "Type of the trigger Action",
          data: [{ label: 'Personal ', value: 1 }, { label: 'Department', value: 2 }, { label: 'Department hierarchy', value: 3 }, { label: 'ALL', value: 4 }, { label: 'Custom', value: 5 }],
          placeholder: "Please Select a Trigger",

        },
        {
          inputtype: 'gpermision',
          name: 'perms',
          label: "Custom Data Scop",
          placeholder: "Department selected",
          span: 12,
          multiple: true,
          // showMode: 'edit'

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
          "type": "textarea",
          inputtype: "textarea",
          name: "remark",
          label: "Role Note",
          placeholder: "Enter Description of the User",
          span: 24,
        },

      ],

      fields_rules:
      {
        abbrev:
          [
            { required: true, message: "Please add a Code for the Job ", trigger: "blur" }
          ],
        name: [
          { required: true, message: "Job name cannot be empty", trigger: "blur" }
        ],
        status: [
          { required: true, message: "Please Job be empty", trigger: "blur" }
        ],
      }
      ,
      searchFields: [
        // Define your search field configurations here
        // Example:
        {
          type: 'roles',
          inputtype: "roles",
          name: 'roleId',
          label: 'Role Name',
          style: 'width: 150px'

        },
        {
          inputtype: 'StatusSelect',
          name: 'status',
          label: 'Roles Status',
        },
        {
          type: 'userField',
          inputtype: "userField",
          name: 'userId',
          label: 'User Name',
          style: 'width: 150px'
        },
        {
          type: 'departments',
          inputtype: "departments",
          name: 'deptId',
          // data: 'deptId',
          label: 'Department',
          style: 'width: 150px'
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
    this.getSideSelection();
    this.getList();
    this.table()
  },


  methods: {
    handlePageChange(newPage) {
      this.queryParams.pageNo = newPage;
      this.getList();
    },
    //*******************table********************************************** */
    table() {

      this.tableColumns =
        [
          { type: 'select' },
          { prop: 'name', label: 'Role Name', fixed: true, minWidth: '100', show: true },
          { prop: 'orderNum', label: 'Order' },
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
          }, { label: 'ADD By', prop: 'createByName',minWidth:'100' },
          { prop: 'createTime', label: 'Create Date', type: 'calendar',minWidth:'100' },
          { label: 'Updated By', prop: 'updateByName',minWidth:'100' },
          { prop: 'updateTime', label: 'Last Update Time',minWidth:'100' },
          { prop: 'remark', label: 'Roles Note', minWidth: '100',minWidth:'100' },
          {
            prop: 'perms', label: 'Role Permission/s', fixed: 'right', minWidth: '100', type: 'custom',
            customRender: row => {
              if (row.perms && row.perms.length > 0) {
                return `<el-tooltip effect="dark" content="${this.getJobNames(row.perms)}">
                        <div>${row.perms.name}</div>
                      </el-tooltip>`;
              } else {
                return 'No Roles';
              }
            }
          },
          {
            type: 'actions', label: 'Operations', align: 'right', 
            fixed: 'right', minWidth: '100', show: true
          }
        ]
      this.tablebuttons =
        [
          {
            edit: true,
          },
          {
            delete: true,
          },
          {
            view: true,
          }
        ]


    },
    
    //**************PopUp*********************************************** */

    openDetails(row) {
      this.mobileView = row;
      this.buttonsConfig = [
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
    //**************************Side search control *****************************************************************/

    getSideSelection() {
      this.$http.dept.DeptlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
        if (res.result && res.result.data) {
          this.deptOptions = treeTransformerTwoValues(res.result.data, 'name', 'deptId');
          console.log(this.deptOptions)
          this.originalDeptOptions = treeTransformerTwoValues(res.result.data, 'name', 'deptId');;
          console.log(this.originalDeptOptions)
        }
        else {
          this.loading = false;
          this.$message.error('Failed to load department list for the selection section');
        }
      });
    },

    filterMethod() {
      // Convert the value in the input box to lowercase
      const searchValue = this.sideSearch.toLowerCase();
      // Create a deep copy of the originalDeptOptions
      let filteredDeptOptions = JSON.parse(JSON.stringify(this.originalDeptOptions));
      // Filter the `deptOptions`
      filteredDeptOptions = filteredDeptOptions.filter(node => checkNode(node, searchValue));

      this.deptOptions = filteredDeptOptions;

      function checkNode(node, searchValue) {
        let isMatch = node.label.toLowerCase().includes(searchValue);
        if (node.children) {
          // Filter the children of the node
          node.children = node.children.filter(child => checkNode(child, searchValue));
          // If any children match, the node is a match
          isMatch = isMatch || node.children.length > 0;
        }

        return isMatch;
      }
    },
    resetSideQuery() {
      this.queryParams.deptId = '',
        this.queryParams.sideSearchToAdd = '',
        console.log("I am here" + this.queryParams.deptId)
      this.getList();
    },

    //****************************************handle side search********************************************************* */
    handleNodeClick(data) {
      this.queryParams.sideSearchToAdd = data
      console.log(data.value)
      this.queryParams.deptId = data.value;
      this.handleQuery();
    },

    //**************Jobs/Dept Join Control***************************************** */
    getJobNames(perms) {
      return perms.map(perm => perm.name).join(",")
    },

    //*********************************** */
    getList() {
      this.loading = true;
      // this.getQuarrySelection(),
      this.$http.role.listRole(this.queryParams).then(res => {
        console.log(this.queryParams)
        if (res.result && res.result.data) {
          this.isHasNextPage = res.result.isHasNextPage;
          this.isHasPreviousPage = res.result.isHasPreviousPage;
          this.total = res.result.total;
          this.roleList = res.result.data;
          console.log(this.roleList)
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error('Failed to load the Job list');
        }
      });

    },


    //****************** */ Open and Close***************************************
    openAddEdit() {
      this.open = true
      this.reset()

    },
    closeAddEdit() {

      this.modeType = ''
      this.open = false
    },
    //************************************** */
    handleQuery(e) {
      this.getList();
    },

    /** Reset button operation */

    resetQuery() {
      this.queryParams = {
        name: undefined,
        status: '',
        createTime: undefined,
        permId: undefined,
        deptId: undefined,
        userId: undefined,
        sideSearchToAdd: '',
        customId: '',
        pageNo: 1,
        pageSize: 0
      }

      this.handleQuery();
      this.getList();
    },

    //**************** Add, Edit and delete control section******************************************* */
    getAddEditSelection() {

      this.$http.Job.listJob({ "pageNo": 1, "pageSize": 0 }).then(res => {
        this.postionList = NormalmapTwoPropsToObject(res.result.data, 'name', 'jobId');
        console.log(this.postionList);
        resolve();
      }).catch(error => {
        console.error(error);

      });

    },


    //****************************************ADDing*****************************

    handleAdd() {

      this.title = "Adding New Role"
      // this.formFieldSelectData()
      this.open = true;
      this.modeType = "add";
      this.initialValuesAdd = { "delFlag": "0", "status": 0 }

    },

    //***************************Edit control section**********************************/
    handleUpdate(row) {
      console.log(row)
      const permissions = ''
      if (row.perms !== null) {
        console.log("I am here" + row.perms.permId)
        return permissions = row.perms.permId;
      }
      // console.log(row.perms.map(item => item.groupId + item.permId))
      console.log(permissions)

      this.initialValuesEdit = {
        ...row,
        perms: permissions
      }
      this.open = true
    },

    // formFieldSelectData() {
    //   this.Add_Edit.forEach((field, index) => {
    //     if (field.name === 'perms') {
    //       console.log(typeof (this.permsOptions))
    //       return this.Add_Edit[index].data = this.permsOptions;
    //     }
    //   });
    // },


    //************************************** Submit button**************************** */
    onSubmit(n) {
      this.form = n
      if (this.modeType === 'add') {
        console.log(this.form.avatar)
        this.$http.role.addRole(this.form).then(response => {
          // this.Upload()
          console.log('sssssssssssssssssssssss' + response.data)
          this.$modal.msgSuccess("Addition successful");
          console.log(this.form)
          this.open = false;
          this.mode = ''
          this.getList();
        }).catch(response => {
          console.error('Error:', response);
          // Handle your error here
        });
      } else {
        this.$http.role.addRole(this.form).then(response => {
          console.log('sssssssssssssssssssssss' + this.form)
          this.$modal.msgSuccess("Update successful");
          this.open = false;
          this.mode = ''
          this.getList();
        }).catch(response => {
          console.error('Error:', response);
          // Handle your error here
        });
      }
    },

    //************************************************Delete Control Section***********************************************/
    handle_SideDelete(row) {
      console.log(row.name + ":delete")
      if (row.roleId > 0) {
        console.log("delete")
        this.$modal.confirm('Are you sure you want to delete the data Menu with the name "' + row.name + '"?').then(() => {
          return this.$http.role.deleteRole(row.roleId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Deletion successful");
        }).catch(() => { });
      }
    },

    handleDelete() {
      if (this.selectedRows.length > 0) {
        this.$modal.confirm('WARNING: You are about to permanently delete the following Menu/s:{ '
          + this.selectedRows.map(row => row.name).join(', ')
          + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
            this.selectedRows.forEach(row => {
              // Delete the Selected Jobs
              this.$http.role.deleteRole(row.menId);
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
        console.log(row.menId, row.name); // logs the deptId and name of each selected row
      });

    },

  },

};


</script>

<style scoped>
.custom-drawer {
  position: fixed;
  top: 0;
  right: -300px;
  /* Start off-screen */
  width: 300px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: transform 0.3s ease, right 0.3s ease;
  /* Animate these properties */
  transform: rotateY(10deg);
  /* Slight tilt */
}

.custom-drawer.is-visible {
  right: 0;
  /* Slide in */
  transform: rotateY(0deg);
  /* Reset tilt when visible */
}

.drawer-content {
  padding: 20px;
  transform: rotateY(-10deg);
  /* Counteract the drawer tilt for content */
  transition: transform 0.3s ease;
}

.custom-drawer.is-visible .drawer-content {
  transform: rotateY(0deg);
  padding-top: 50px;
  /* Make space for the toggle button */
}

.app-container {
  transition: margin-right 0.3s ease;
}

.toggle-button {
  position: absolute;
  top: 10px;
  /* Adjust as needed */
  right: -40px;
  /* Half outside the drawer */
  z-index: 1010;
  /* Above the drawer */
  border: none;
  background: #fff;
  /* Match with drawer background or as per your design */
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  /* Optional: adds depth */
  transition: all 0.3s ease;
}

.custom-drawer.is-visible .toggle-button {
  right: -40px;
  /* Adjust if necessary */
  transform: rotate(180deg);
  /* Rotate button for a cool effect */
}

.overlay {
  display: none;
  /* Hide by default */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  /* Below the drawer but above everything else */
  background: rgba(0, 0, 0, 0.5);
  /* Dimmed background - adjust color/opacity as needed */
}

.overlay.is-active {
  display: block;
  /* Show when the drawer is visible */
}

.custom-drawer {
  /* ... */
  z-index: 1000;
  /* Above the overlay */
}
</style>
