<template>
  <div class="app-container">
    <div class="flex" v-if="showSearch">
      <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
        :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetQuery"
        :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
        :resetIcon="resetIcon">
      </search_control>
    </div>

    <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
      :buttons="{ new: true, edit: true, expand: false, delete: true, filter: true }" :handleAdd="handleAdd"
      :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelete"
      :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
      :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />


    <!-- Table view  -->
    <el-table flex :data="jobtList" style="width:100%" row-key="jobId" v-loading="loading"
      element-loading-text="Loading..." v-if="refreshTable" @selection-change="handleSelectionChange">


      <el-table-column :selectable="selectable" type="selection"></el-table-column>
      <el-table-column fixed prop="name" label="Position Name"  />
      <!-- <el-table-column fixed prop="jobId" label="Job ID" width="150" /> -->
      <el-table-column fixed prop="abbrev" label="Job code"  />
      <el-table-column fixed prop="status" label="Status" >
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'success' : 'danger'">
            {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="Note"  />
      <el-table-column type="Calender" prop="createTime" label="Create Data"  />
      <el-table-column prop="updateTime" label="Last Update Time" width="200" />
      <!-- <el-table-column prop="email" label="Email" width="170" /> -->
      <el-table-column fixed="right" label="Actions"  align="center" class-name="small-padding fixed-width">
        <template #default="{ row, column, index }">
          <el-row class="mb-4">
            <el-button type="primary" :el-icon-plus="Edit" size="small" @click="handleUpdate(row)"
              v-hasPermi="['system:user:edit']">
              Edit</el-button>
            <el-button type="warning" :el-icon-plus="Delete" size="small" v-if="row.parentId != 0"
              @click="handle_SideDelete(row)" v-hasPermi="['system:user:remove']">Delete</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- <s>ADD, EDIT</s> -->
    <addoredit ref="form" :rules="fields_rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
      initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit">
    </addoredit>
    <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
      :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout" @page-change="handlePageChange">
    </custom-pagination>
  </div>
</template>



<script >
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
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
import { mapOnePropToObject } from '@/utils/dtControl/dTransformer'


export default {
  // name: "Job",
  dicts: ['sys_normal_disable'],

  components: {
    addoredit,
    search_control,
    CustomPagination,
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
      total: 0,
      paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
      isHasNextPage: false,
      isHasPreviousPage: false,
      form: {},
      title: "", // Default title for the dialog
      jobtList: [],
      queryParams:
      {
        name: undefined,
        jobId: null,
        status: '',
        userId: '',
        createTime: undefined,
        leader: undefined,
        deptId: undefined,
        userId: undefined,
        pageNo: 1,
        pageSize: 20
      },
      Add_Edit:
        [

          {
            "type": "input",
            inputtype: "text",
            name: "name",
            label: "Job Title",
            placeholder: "Please Enter the job Title",
            span: 24

          },
          {
            inputtype: 'switch',
            name: 'status',
            label: 'Job Status',
            switchOnColor: '#309f62',
            switchOffColor: '#ff4949',
            activeText: 'Activate',
            inactiveText: 'Disabled',
            activeValue: 0,
            inactiveValue: 1,
            span: 8
          },

          {
            "type": "text",
            inputtype: "text",
            name: "abbrev",
            label: "Position",
            placeholder: "Enter Code for the Position",
            span: 12

          },


          {
            "type": "textarea",
            inputtype: "textarea",
            name: "remark",
            label: "Job Description",
            placeholder: "Enter Description or Note of the Job ",
            span: 24
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
          type: 'Position',
          inputtype: "Position",
          name: 'name',
          label: 'Job Name',
          data: 'Position',
          style: 'width: 150px'

        },
        {
          type: 'Position',
          inputtype: "Position",
          name: 'abbrev',
          label: 'Job code',
          data: 'abbrev',
          style: 'width: 150px'

        },

        {
          inputtype: 'StatusSelect',
          name: 'status',
          label: 'Job Status',
        },
        {
          "type": "departments",
          inputtype: "departments",
          name: "deptId",
          label: "Department",
          placeholder: "Selected Departments",
          span: 6,
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

    };
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
      this.$http.Job.listJob(this.queryParams).then(res => {
        if (res.result && res.result.data) {
          this.isHasNextPage = res.result.isHasNextPage;
          this.isHasPreviousPage = res.result.isHasPreviousPage;
          this.total = res.result.total;
          this.jobtList = res.result.data;
          console.log(this.jobtList)
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
      // this.reset();
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
      this.queryParams.deptId = ''
      this.queryParams.jobId = ''
      this.queryParams.userId = ''
      this.queryParams.abbrev = ''
      this.queryParams.createTime = ''
      this.queryParams.pageNum = ''
      this.handleQuery();
      this.getList();
    },

    //**************** Add, Edit and delete control section******************************************* */


    // *********************************ADDing*****************************
    handleAdd() {
      this.mode = "add"
      this.open = true;
      this.initialValuesAdd = { "delFlag": "0" }
      console.log(this.form)
    },

    //*******************Edit control section**********************************/
    handleUpdate(row) {
      this.mode = "Edit"
      this.initialValuesEdit = row
      this.open = true
    },

    /**************************** Submit button**************************** */
    onSubmit(n) {
      this.form = n
      if (this.mode == 'add') {
        this.$http.Job.addJob(this.form).then(response => {
          console.log()
          console.log(this.form)
          console.log('sssssssssssssssssssssss' + response.data)
          this.$modal.msgSuccess("Addition successful");
          this.open = false;
          this.getList();
        }).catch(message => {
          ("The error:*" + message + ":*");
        });


      }
      else {
        this.$http.Job.updateJob(this.form).then(response => {
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
        name: '',
        abbrev: '',
        status: '',
        hierarchy: '',
        remark: '',
      };
    },

    //*******************************************Delete Control Section************************************* */
    handle_SideDelete(row) {
      if (row.jobId > 0) {
        this.$modal.confirm('Are you sure you want to delete the data Job/Jobs with the name "' + row.name + '"?').then(() => {
          return this.$http.Job.deleteJob(row.jobId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("Deletion successful");
        }).catch(() => { });
      }
    },

    handleDelete() {
      if (this.selectedRows.length > 0) {
        this.$modal.confirm('WARNING: You are about to permanently delete the following Job/Jobs:{ '
          + this.selectedRows.map(row => row.name).join(', ')
          + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
            this.selectedRows.forEach(row => {
              // Delete the Selected Jobs
              this.$http.Job.deleteJob(row.jobId);
            });
            this.getList();
            this.$modal.msgSuccess("Deletion successful");
          }).catch(() => { });
      } else {
        console.log('No data');
      }
    },

    //*************handle selection section************************* */
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.selectedRows.forEach(row => {
        console.log(row.jobId, row.name); // logs the deptId and name of each selected row
      });
    },

  }
};
</script>



