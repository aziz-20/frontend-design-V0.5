<template>
    <div class="app-container">
        <div class="flex" v-if="showSearch">
            <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
                :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="Reload" :emptyFields="resetQuery"
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
        <div>
            <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
            <ReusableTable :data="taskLogsList" :columns="tableColumns" rowKey="taskId" :loading="loading"
                :refreshTable="refreshTable" :openDetails="openDetails" :buttonsConfig="tablebuttons" />
        </div>
        <!-- :handleSelectionChange="handleSelectionChange" -->
        <div>
            <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
                :fieldsConfig="tableColumns" :buttonsConfig="popUpButton" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete">
            </PhoneTablePopUp>
        </div>
        <!-- Table view  -->
        <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
            :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout" @page-change="handlePageChange">
        </custom-pagination>
    </div>
</template>

  
  
<script >
import ReusableTable from "@/views/components/defaultTable"
import addoredit from "@/views/components/addoredit/index.vue"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import search_control from '@/views/components/qureyParams/index.vue'
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"

export default {
    // name: "Job",
    dicts: ['sys_normal_disable'],

    components: {
        addoredit,
        search_control,
        CustomPagination,
        tableHeader,
        ReusableTable,
        PhoneTablePopUp
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
            initialValuesAdd: { "delFlag": "0", 'triggerType': 0 },
            refreshTable: true,
            loading: false,
            displaySearch: true,
            open: false,
            total: 0,
            paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
            isHasNextPage: false,
            isHasPreviousPage: false,
            form: {},
            tableColumns: [],
            dialogVisible: false,
            tablebuttons: [{ view: true }],
            title: "", // Default title for the dialog
            taskLogsList: [],
            queryParams:
            {
                targetTask: undefined,
                taskGroup: undefined,
                taskLogId: undefined,
                taskName: undefined,
                startTime: undefined,
                status: undefined,
                taskDetail: undefined,
                triggerType: undefined,
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
                    type: 'taskLog',
                    inputtype: "taskLog",
                    name: 'taskId',
                    taskName:true,
                    label: 'Task Name',
                    // data: 'Position',
                },
                {
                    type: 'taskLog',
                    inputtype: "taskLog",
                    name: 'taskGroup',
                    taskGroup:true,
                    label: 'Task Name',
                    // data: 'Position',
                },
                {
                    "type": "selectV",
                    inputtype: "selectV",
                    name: 'triggerType',
                    label: "Trigger Group",
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
        this.table();
    },
    //**************Methods Control*********************************************** */

    methods: {

        //**********************Table**********************************************/
        table() {
            this.tableColumns =
                [
                    { type: 'select'},
                    { select: false, prop: 'taskName', label: 'Task Name', fixed: true, minWidth: '100', show: true },
                    { select: false, prop: 'taskGroup', label: 'Task Group', fixed: true, minWidth: '100'},
                    {
                        prop: 'triggerType', label: 'Trigger Type', type: 'tag',
                        tagType: (triggerType) => {
                            return triggerType === 0 ? 'success' : 'warning';
                        },
                        tagLabel: (triggerType) => {
                            return triggerType === 0 ? 'Active' : 'Not Active';
                        },
                        tagColor: (triggerType) => { /* ... */ }
                    },
                    {
                        label: 'Status',
                        prop: 'status',
                        type: 'tag',
                        tagType: (type) => {
                            return type === 0 ? 'success' : 'warning';
                        },
                        tagLabel: (type) => {
                            return type === 0 ? 'Active' : 'Not Active';
                        },
                        tagColor: (value) => { /* ... */ }
                    },
                    { prop: 'taskDetail', label: 'Task Details', minWidth: '100' },
                    { prop: 'startTime', label: 'Trigger Starting Time', minWidth: '100' },
                    { prop: 'endTime', label: 'Trigger Ending Time', minWidth: '100' },
                    {
                        type: 'actions', label: 'Operation', align: 'center', fixed: 'right', show: true,
                        ClassButton: 'centered-glow-button'
                    }
                ]
        },


        //**************************PopUp**************************************** */
        openDetails(row) {
            this.mobileView = row;

            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false; // Method to close the dialog
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
        Reload() {
            this.resetQuery()
            this.getList();

        },

        resetQuery() {
            this.queryParams.targetTask = undefined,
                this.queryParams.taskGroup = undefined,
                this.queryParams.taskLogId = undefined,
                this.queryParams.taskName = undefined,
                this.queryParams.startTime = undefined,
                this.queryParams.status = undefined,
                this.queryParams.startTime = undefined,
                this.queryParams.exceptionInfo = undefined,
                this.queryParams.targetTask = undefined
        },

    },

};
</script>
  
  
  
<!-- <style >
 .centered-glow-button {
  display: flex;
  justify-content: left;
  align-items: left;
}
</style> -->