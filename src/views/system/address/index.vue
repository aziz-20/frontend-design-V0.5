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
        <div>
            <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
            <ReusableTable :data="addressList" :columns="tableColumns" rowKey="taskId" :loading="loading"
                :refreshTable="refreshTable" :default-expand-all="isExpandAll"
                :handleSelectionChange="handleSelectionChange" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete" :openDetails="openDetails" :buttonsConfig="tablebuttons"
                @open-popup="handleOpenPopup" />
        </div>

        <div>
            <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
                :fieldsConfig="tableColumns" :buttonsConfig="popUpButton" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete">
            </PhoneTablePopUp>
        </div>

        <!-- <s>ADD, EDIT</s> -->
        <template v-if="open">
            <addoredit ref="form" style="width:35%" :rules="fields_rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
                initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit"
                @emi="emitChange">
            </addoredit>
        </template>
        <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
            :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout" @page-change="handlePageChange">
        </custom-pagination>

    </div>
</template>

  
  
<script >
import ReusableTable from "@/views/components/defaultTable"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import addoredit from "@/views/components/addoredit/index.vue"
import search_control from '@/views/components/qureyParams/index.vue'


export default {
    name: "address",
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
            columnVisible: false,
            selectedItem: null,
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
            dialogVisible: false,
            selectedRows: [],
            tableColumns: [],
            mode: null,
            switching: null,
            loading: true,
            showSearch: true,
            initialValuesEdit: undefined,
            initialValuesAdd: { "delFlag": "0", triggerType: 0 },
            refreshTable: true,
            displaySearch: true,
            open: false,
            popUpButton: [],

            total: 0,
            paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
            isHasNextPage: false,
            isHasPreviousPage: false,
            form: {},
            title: "", // Default title for the dialog
            addressList: [],
            queryParams:
            {
                targetTask: undefined,
                taskGroup: null,
                taskLogId: '',
                taskName: undefined,
                startTime: undefined,
                status: undefined,
                taskDetail: undefined,
                triggerType: undefined,
                pageNo: 1,
                pageSize: 20
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
        this.table()
    },
    //**************Methods Control*********************************************** */


    methods: {

        //**********************Table******************************************************** */
        table() {
            this.tableColumns = [
                { type: 'select' },
                { prop: 'country', label: 'Country', fixed: true, show: true ,minWidth:'100' },
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
                { prop: 'state', label: 'State',minWidth:'100' },
                { prop: 'city', label: 'City',minWidth:'100' },
                { prop: 'zipcode', label: 'ZipCode',minWidth:'100' },
                { prop: 'detail', label: 'detail',minWidth:'100' },
                { label: 'ADD By', prop: 'createByName',minWidth:'100' },
                { prop: 'createTime', label: 'Create Date', type: 'calendar',minWidth:'100' },
                { label: 'Updated By', prop: 'updateByName',minWidth:'100' },
                { prop: 'updateTime', label: 'Last Update Time',minWidth:'100' },
                {
                    type: 'actions', label: 'Actions', align: 'right', fixed: 'right', show: true
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

        //*****************PopUp*********************** */

        openDetails(row) {
            this.mobileView = row;
            this.popUpButton = [
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
        //******************************************************** */

        emitChange(x) {
            // this.$emit('fieldChanged', this.formData);
            console.log(x)
            const { triggerType } = x
            this.switching = triggerType
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
            this.$http.address.listAddress(this.queryParams).then(res => {
                if (res.result && res.result.data) {
                    this.isHasNextPage = res.result.isHasNextPage;
                    this.isHasPreviousPage = res.result.isHasPreviousPage;
                    this.total = res.result.total;
                    this.addressList = res.result.data;
                    this.loading = false
                    console.log(this.addressList)
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error('Failed to load the Table list');
                }
            });
        },

        //****************** */ Open and Close***************************************

        openAddEdit() {
            this.open = true
            // this.reset();
            // this.reset(this.form)

        },
        closeAddEdit() {
            this.open = false
            // this.reset(this.form);
        },
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

        //**************** Add, Edit and delete control section******************************************* */
        generateForm(triggerType) {
            console.log(triggerType)

            this.Add_Edit = [
                {
                    "type": "selectV",
                    inputtype: "selectV",
                    name: 'triggerType',
                    label: "Type of the trigger Action",
                    data: [{ label: 'Simple ', value: 0 }, { label: 'Cron', value: 1 }],
                    placeholder: "Please Select a Trigger",
                    span: 24

                },
                {
                    "type": "input",
                    inputtype: "text",
                    name: "taskGroup",
                    label: "Task Group ",
                    placeholder: "Please Enter the Task Group name",
                    span: 24

                },
                {
                    "type": "input",
                    inputtype: "text",
                    name: "taskName",
                    label: "Name of the Task ",
                    placeholder: "Please Enter the job Title",
                    span: 24

                },
                {
                    "type": "text",
                    inputtype: "text",
                    name: "targetTask",
                    label: "Task Action",
                    placeholder: "Please Enter Task Action",
                    span: 24

                },

                {
                    inputtype: 'switch',
                    name: 'status',
                    label: 'Task Status',
                    switchOnColor: '#309f62',
                    switchOffColor: '#ff4949',
                    activeText: 'Activate',
                    inactiveText: 'Disabled',
                    activeValue: 0,
                    inactiveValue: 1,
                    span: 12
                },

            ];
            // if (this.mode === 'add' && this.open === true) {
            //     this.handleAdd(); // Call anotherMethod whenever `this.switching` changes
            // }

            if (triggerType === 1) {
                if (this.mode === 'add' && this.open === true) {
                    this.initialValuesAdd = {
                        'delFlag': 0,
                        'triggerType': 1,
                        'status': 1,
                        'taskRun': 1
                    }
                }
                if (this.mode === 'edit' && this.open === true) {
                    this.initialValuesEdit = {
                        'delFlag': 0,
                        'triggerType': 1,
                        'status': 1,
                        'taskRun': 1
                    }
                }
                console.log("I am here")
                this.Add_Edit.push(
                    {
                        "type": "text",
                        inputtype: "text",
                        name: "cronExpression",
                        label: "Cron Expiration",
                        placeholder: "Please Enter Expiration for the Cron",
                        span: 12
                    },
                );
            }
            if (triggerType === 0) {
                if (this.mode === 'add' && this.open === true) {
                    this.initialValuesAdd = {
                        'delFlag': 0,
                        'triggerType': 0,
                        'status': 1,
                        'taskRun': 1
                    }
                }
                if (this.mode === 'edit' && this.open === true) {
                    console.log('mmmmm')
                    this.initialValuesEdit = {
                        'delFlag': 0,
                        'triggerType': 0,
                        'status': 1,
                        'taskRun': 1
                    }
                }
                this.Add_Edit.push(
                    {
                        "type": "sorting",
                        inputtype: "sorting",
                        name: "taskDuration",
                        label: "Duration",
                        placeholder: "Enter Code for the Position",
                        min: 1,
                        span: 12
                    },
                    {
                        "type": "sorting",
                        inputtype: "sorting",
                        name: "taskCount",
                        label: "Number of time",
                        // placeholder: "Enter Code for the Position",
                        min: 1,
                        span: 12
                    },
                );
            }
            this.Add_Edit.push(

                {
                    inputtype: 'switch',
                    name: 'taskRun',
                    label: 'RUN TASK',
                    switchOnColor: '#309f62',
                    switchOffColor: '#ff4949',
                    activeText: 'Enable',
                    inactiveText: 'Disable',
                    activeValue: 0,
                    inactiveValue: 1,
                    span: 12
                },
                {
                    inputtype: 'switch',
                    name: 'taskConcurrent',
                    label: 'Run Task Concurrently ',
                    switchOnColor: '#309f62',
                    switchOffColor: '#ff4949',
                    activeText: 'True',
                    inactiveText: 'False',
                    activeValue: 0,
                    inactiveValue: 1,
                    span: 12
                },

                {

                    "type": "sorting",
                    inputtype: "sorting",
                    name: "misFirePolicy",
                    label: "Task order",
                    placeholder: "Enter Code for the Position",
                    min: 1,
                    span: 12
                },
                {

                    "type": "sorting",
                    inputtype: "sorting",
                    name: "orderNum",
                    label: "Task Policy",
                    placeholder: "Enter Code for the Position",
                    span: 12
                },

                // {
                //     "type": "selectV",
                //     inputtype: "selectV",
                //     name: 'misFirePolicy',
                //     label: "Task Policy",
                //     data: [{ label: 'MISFIRE_DEFAULT ', value: 0 }, { label: 'MISFIRE_IGNORE_MISFIRES', value: 1 }, { label: 'MISFIRE_FIRE_AND_PROCEED', value: 2 }, { label: 'MISFIRE_DO_NOTHING', value: 1 }],
                //     placeholder: "Please Select a Trigger",
                //     span: 12
                // },
                {
                    "type": "textarea",
                    inputtype: "textarea",
                    name: "remark",
                    label: "Job Description",
                    placeholder: "Enter Description or Note of the Job ",
                    span: 24
                },

            );
            console.log(this.initialValuesAdd)

            return this.Add_Edit;
        },


        // *********************************ADDing*****************************
        handleAdd() {
            this.mode = "add"
            // this.generateForm(this.switching)
            this.open = true;
            this.initialValuesAdd
            console.log(this.switching);

            console.log(this.form);
        },

        //*******************Edit control section**********************************/
        handleUpdate(row) {
            this.mode = "edit"
            this.initialValuesEdit = row
            console.log(row)
            // this.generateForm(this.switching)
            this.open = true
        },

        /**************************** Submit button**************************** */
        onSubmit(n) {
            this.form = n
            if (this.mode === 'add') {
                this.$http.address.addAddress(this.form).then(response => {
                    console.log()
                    console.log('sssssssssssssssssssssss' + response.data)
                    this.$modal.msgSuccess("Addition successful");
                    console.log(this.form)
                    this.open = false;
                    this.getList();

                }).catch(message => {
                    ("The error:*" + message + ":*");
                });

            }
            else {
                this.$http.address.updateAddress(this.form).then(response => {
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



        //*******************************************Delete Control Section************************************* */
        handle_SideDelete(row) {
            if (row.addId > 0) {
                this.$modal.confirm('Are you sure you want to delete the Address"'+row.zipcode+':'+ row.detail + '"?').then(() => {
                    return this.$http.address.deleteAddress(row.addId);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("Deletion successful");
                }).catch(() => { });
            }
        },

        handleDelete() {
            if (this.selectedRows.length > 0) {
                this.$modal.confirm('WARNING: You are about to permanently delete the following Task/s:{ '
                    + this.selectedRows.map(row => row.detail).join('},{')
                    + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
                        this.selectedRows.forEach(row => {
                            // Delete the Selected Jobs
                            this.$http.taskControl.deleteTask(row.addId);
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
                console.log(row.addId, row.detail); // logs the deptId and name of each selected row
            });
        },

    },
    watch: {
        switching(newVal, oldVal) {
            if (this.mode === 'add' && this.open === true) {
                this.handleAdd(); // Call anotherMethod whenever `this.switching` changes
            }
            if (this.mode === 'edit' && this.open === true) {
                this.handleUpdate(); // Call anotherMethod whenever `this.switching` changes
            }
        },
    },
};
</script>
  
  
