<template>
    <div class="app-container">
        <div class="flex" v-if="showSearch">
            <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
                :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetQuery"
                :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
                :resetIcon="resetIcon">
            </search_control>
        </div>


        <el-row class="mb-4" :gutter="10">
            <el-col :span="1.5" :offset="22.5" :class="{ 'show-search': showSearch }">
                <el-button v-if="!showSearch" @click="showSearch = true" style="float: right;">Show Filter</el-button>
                <el-button v-else @click="showSearch = false" style="float: right;">Hide Filter</el-button>
            </el-col>
        </el-row>

        <!-- Table view  -->
        <el-table flex :data="taskLogsList" style="width:150%" row-key="taskId" v-loading="loading"
            element-loading-text="Loading..." :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)" v-if="refreshTable"
            @selection-change="handleSelectionChange">
            <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="taskName" label="Task Name" width="240" />
            <el-table-column fixed prop="triggerType" label="Trigger Type" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.status === 0 ? 'default' : 'yellow'">
                        {{ row.status === 0 ? 'Simple' : 'Cron' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="taskGroup" label="Task Group" width="170" />
            <el-table-column prop="status" label="Status" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.status === 0 ? 'success' : 'danger'">
                        {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="taskDetail" label="Task Details" width="200" />
            <!-- <el-table-column prop="updateTime" label="Last Update Time" width="200" /> -->
            <el-table-column fixed="right" prop="startTime" label="Trigger Starting Time" width="200" />
            <el-table-column prop="endTime" label="Trigger Ending Time" width="200" />
       </el-table>]
        <el-row justify="center">
            <el-col :span="24" :sm="12" :md="8">
                <el-pagination v-show="total > 0" background layout="prev, pager, next" :total="total"
                    :page.sync="queryParams.pageNo" :page-size.sync="queryParams.pageSize" :layout="paginationLayout"
                    @current-change="handlePageChange" />
            </el-col>
        </el-row>

    </div>
</template>

  
  
<script >
import addoredit from "@/views/components/addoredit/index.vue"
import search_control from '@/views/components/qureyParams/index.vue'



export default {
    // name: "Job",
    dicts: ['sys_normal_disable'],

    components: {
        addoredit,
        search_control
    },
    props: {
        formDataFromParent: Object
    },
    data() {
        return {
            selectedRows: [],
            mode: 'add',
            switching: null,
            loading: true,
            showSearch: true,
            initialValuesEdit: undefined,
            initialValuesAdd: { "delFlag": "0", triggerType: 0 },
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
            taskLogsList: [],
            queryParams:
            {
                targetTask: undefined,
                taskGroup: null,
                taskLogId: '',
                taskName: undefined,
                startTime: undefined,
                status: undefined,
                taskDetail: undefined,
                triggerType: null,
                pageNo: 1,
                pageSize: 30
            },
            Add_Edit: [],

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
                    type: 'tasks',
                    inputtype: "tasks",
                    name: 'taskName',
                    label: 'Task Name',
                    // data: 'Position',
                    style: 'width: 150px'

                },
                {
                    "type": "selectV",
                    inputtype: "selectV",
                    name: 'triggerType',
                    label: "Trigger Type",
                    data: [{ label: 'Simple ', value: 0 }, { label: 'Cron', value: 1 }],
                    placeholder: "Please Select a Trigger",


                },

                {
                    inputtype: 'StatusSelect',
                    name: 'status',
                    label: 'Log Status',

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
            this.$http.taskControl.listTaskLogs(this.queryParams).then(res => {
                if (res.result && res.result.data) {
                    this.isHasNextPage = res.result.isHasNextPage;
                    this.isHasPreviousPage = res.result.isHasPreviousPage;
                    this.total = res.result.total;
                    this.taskLogsList = res.result.data;
                    console.log(this.taskLogsList)
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error('Failed to load the Table list');
                }
            });
        },

        //****************** */ Open and Close***************************************

        // openAddEdit() {
        //     this.open = true
        //     // this.reset();
        //     // this.reset(this.form)

        // },
        // closeAddEdit() {
        //     this.open = false
        //     // this.reset(this.form);
        // },
        //************************************** */
        handleQuery(e) {
            this.getList();
        },

        /** Reset button operation */

        resetQuery() {
            this.queryParams.targetTask = undefined,
                this.queryParams.taskGroup = null,
                this.queryParams.taskLogId = null,
                this.queryParams.taskName = undefined,
                this.queryParams.startTime = undefined,
                this.queryParams.status = undefined,
                this.queryParams.taskDetail = undefined,
                this.queryParams.triggerType = null,
                this.handleQuery();
            this.getList();
        },

    },
 
};
</script>
  
  
  
  