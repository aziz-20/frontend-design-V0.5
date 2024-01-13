<template>
  <div class="app-container">
    <div class="common-layout">
      <el-container>
        <el-aside width="250px" v-if="showSide">
          <el-input v-model="sideSearch" placeholder="Please enter keyword" @input="filterMethod"
            :expand-on-click-node="true" />
          <el-tree :data="deptOptions" :filter-method="filterMethod" :height="208" :default-expand-all="isExpandAll"
            highlight-current @node-click="handleNodeClick" />
        </el-aside>
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
            <el-col :span="1.5">
              <el-button type="primary" :icon="Add" size="mini" v-hasPermi="['system:user:add']"
                @click="handleAdd">NEW</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="info" :icon="el - icon - sort" size="mini"
                @click="toggleExpandAll">Expand/collaps</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="mini" :icon="Delete" type="primary" :disabled="multiple" @click="handleDelete"
                v-hasPermi="['system:post:remove']" color="red" :dark="isDark" plain>Delete</el-button>
            </el-col>
            <el-col :span="1.5" :offset="22.5" :class="{ 'show-search': showSearch }">
              <el-button v-if="!showSearch" @click="showSearch = true" style="float: right;">Show
                Filter</el-button>
              <el-button v-else @click="showSearch = false" style="float: right;">Hide Filter</el-button>
            </el-col>
            <el-col :span="1.5" :offset="22.5">
              <el-button @click="resetSideQuery" style="float: right;">Reset Side Filter
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button v-if="!showSide" @click="showSide = true">Show Side</el-button>
              <el-button v-else @click="showSide = false" style="float: left;">Hide Side</el-button>
            </el-col>
          </el-row>

          <!-- Table view  -->
          <el-config-provider>
            <dev>
              <el-table :data="roleList" style="width:150%" row-key="roleId" v-loading="loading"
                element-loading-text="Loading..." :element-loading-spinner="svg"
                element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.8)"
                :default-expand-all="isExpandAll" v-if="refreshTable" @selection-change="handleSelectionChange">
                <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="name" label="Role Name" width="250" />
                <el-table-column fixed prop="orderNum" label="Order" width="80">
                </el-table-column>
                <el-table-column fixed prop="status" label="Status" width="200">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 0 ? 'success' : 'danger'">
                      {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column type="Calender" prop="createTime" label="Registry Data" width="200" />
                <!-- <el-table-column prop="updateTime" label="Last Update Time" width="200" /> -->
                <el-table-column prop="remark" label="Roles Note" width="220" />
                <el-table-column fixed="right" label="Role Permission/s" width="200">
                  <template #default="scope">
                    <div v-if="scope.row.perms && scope.row.perms.length > 0">
                      <el-tooltip effect="dark" :content="getJobNames(scope.row.perms)">
                        <div v-for="perm in scope.row.perms" :key="perm.permId">
                        </div>
                      </el-tooltip>
                    </div>
                    <div v-else>
                      No Roles
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="Actions" width="180" align="center"
                  class-name="small-padding fixed-width">
                  <template #default="{ row, column, index }">
                    <el-row class="mb-4" justify="center">
                      <el-button type="primary" :el-icon-plus="Edit" size="small" v-hasPermi="['system:user:edit']"
                        @click="handleUpdate(row)">
                        Edit</el-button>
                      <el-button type="warning" :el-icon-plus="Delete" size="small" v-hasPermi="['system:user:remove']"
                        @click="handle_SideDelete(row)">Delete</el-button>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </dev>
          </el-config-provider>
          <template v-if="open">
            <addoredit ref="form" style="width:35%" :rules="fields_rules" :open="open" :mode="modeType" :title="title"
              :init="modeType === 'add' ? initialValuesAdd : initialValuesEdit" :visible="isFormVisible"
              :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit">
            </addoredit>
          </template>
          <el-row justify="center">
            <el-col :span="24" :sm="12" :md="8">
              <el-pagination v-show="total > 0" background layout="prev, pager, next" :total="total"
                :page.sync="queryParams.pageNo" :page-size.sync="queryParams.pageSize" :layout="paginationLayout"
                @current-change="handlePageChange" />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
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
import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject, treeTransformerMultiyvalue, treeTransformerFlexMultiyvalue } from '@/utils/dtControl/dTransformer'
// import { prefetchDepartments, getDepartmentName, getCachedDepartmentName } from '@/store/system/dept/index.js';
import { ElAside, ElInput, ElTree, ElButton } from 'element-plus';
import inspector from "@/http/inspector";
// import { Edit, View as IconView } from '@element-plus/icons-vue';
export default {
  // name: "Job",
  dicts: ['sys_normal_disable'],

  components: {
    addoredit,
    search_control,
    ElAside
  },
  data() {
    return {
      selectedRows: [],
      loading: true,
      modeType: '',
      showSearch: true,
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
      custom:[
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
          span: 24,
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
          span: 12,
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
          span: 24

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
    this.getQuarrySelection()
    this.getList();


  },
  //**************Methods Control*********************************************** */

  methods: {
    handlePageChange(newPage) {

      this.queryParams.pageNo = newPage;

      this.getList();
    },

    //********Node control**************************************************************************************** */
    getQuarrySelection() {

      this.$http.grpermision.permlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
        if (res.result && res.result.data) {
          console.log(res.result.data)


          this.permsOptions = treeTransformerMultiyvalue(res.result.data, 'name', 'groupId', 'perms', 'name', 'permId');
          console.log(this.permsOptions)
          // this.searchFields[3].data = treeTransformerMultiyvalue(res.result.data, 'name', 'groupId', 'perms', 'name', 'permId');

        } else {
          this.loading = false;
          this.$message.error('Failed to load Permission Group list for the selection section');
        }

      }),

        this.$http.role.listRole({ "pageNo": 1, "pageSize": 0 }).then(res => {
          console.log(res)
          if (res.result && res.result.data) {

          } else {
            this.loading = false;
            this.$message.error('Failed to load Role list for the selection section');
          }

        })
      this.$http.MgUsers.listUsers({ "pageNo": 1, "pageSize": 0 }).then(res => {
        console.log(res)
        if (res.result && res.result.data) {
          //****const name=******************************/
          // this.searchFields[2].data = NormalmapTwoPropsToObject(res.result.data, 'username', 'userId');

        }
        else {
          this.loading = false;
          this.$message.error('Failed to load User list for the selection section');
        }
      });

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
      console.log(row.perms.map(item => item.groupId + item.permId))
      console.log(row)

      this.initialValuesEdit = {
        ...row,
        perms: row.perms.map(item => item.permId)
      }
      // this.formFieldSelectData()
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
      if (row.jobId > 0) {
        this.$modal.confirm('Are you sure you want to delete the data User/Users with the name "' + row.name + '"?').then(() => {
          return this.$http.MgUsers.deleteJob(row.jobId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Deletion successful");
        }).catch(() => { });
      }
    },

    handleDelete() {
      if (this.selectedRows.length > 0) {
        this.$modal.confirm('WARNING: You are about to permanently delete the following User/Users:{ '
          + this.selectedRows.map(row => row.name).join(', ')
          + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
            this.selectedRows.forEach(row => {
              // Delete the Selected Jobs
              this.$http.MgUsers.deleteJob(row.jobId);
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
        console.log(row.jobId, row.name); // logs the deptId and name of each selected row
      });

    },

  },

};


</script>

