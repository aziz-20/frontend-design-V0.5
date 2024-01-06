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
            <el-col :span="1.5">
                <el-button color="#626aef" :dark="isDark" plain type="primary" :icon="Add" size="mini"
                    @click="handleAdd">NEW</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" :icon="el - icon - sort" size="mini"
                    @click="toggleExpandAll">Expand/collaps</el-button>
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
            <el-table-column prop="updateTime" label="Last Update Time" width="200" />
            <el-table-column prop="startTime" label="Trigger Starting Time" width="200" />
            <el-table-column prop="endTime" label="Trigger Ending Time" width="200" />
            <el-table-column fixed="right" label="Actions" width="250" align="center"
                class-name="small-padding fixed-width">
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
            <!-- <div>{{ formData.triggerType }}</div> -->
        </el-table>
        <!-- <s>ADD, EDIT</s> -->
        <addoredit ref="form" style="width:35%" :rules="fields_rules" :open="open" :mode="mode" :title="title" :init="mode === 'add' ?
            initialValuesAdd : initialValuesEdit" :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit">
        </addoredit>
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
        search_control
    },
    props: {
        formDataFromParent: Object
    }, 
    data() {
        return {
            selectedRows: [],
            mode: 'add',
            // switching:null,
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
            Add_Edit: [
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
                    placeholder: "Enter Code for the Position",
                    span: 12

                },
                {
                    "type": "selectV",
                    inputtype: "selectV",
                    name: 'triggerType',
                    label: "Type of the trigger Action",
                    data: [{ label: 'Simple ', value: 0 }, { label: 'Cron', value: 1 }],
                    placeholder: "Please Select a Trigger",
                    span: 12

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
                    span: 8
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
                    type: 'StatusSelect',
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
        emitChange() {
            this.$emit('fieldChanged', this.formData);
            console.log(this.formData)
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
            this.queryParams = {
                targetTask: undefined,
                taskGroup: null,
                taskLogId: null,
                taskName: undefined,
                startTime: undefined,
                status: undefined,
                taskDetail: undefined,
                triggerType: null,
                pageNo: number,
                pageSize: number
            }
            this.handleQuery();
            this.getList();
        },

        //**************** Add, Edit and delete control section******************************************* */
        generateForm(triggerType) {
            console.log(triggerType)
            // this.Add_Edit = [

            // ];
            if (triggerType === 0) {
                this.Add_Edit.push({
                    "type": "text",
                    inputtype: "text",
                    name: "abbrev",
                    label: "Position",
                    placeholder: "Enter Code for the Position",
                    span: 12
                },
                    {
                        "type": "input",
                        inputtype: "text",
                        name: "taskGroup",
                        label: "taskGroup Title",
                        placeholder: "Please Enter the job Title",
                        span: 24

                    },
                );
            }

            return this.Add_Edit;
        },


        // *********************************ADDing*****************************
        handleAdd() {
            this.mode = "add"
            this.open = true;
            this.initialValuesAdd
            console.log(this.form);

            let triggerTypeValues;
            // console.log(this.formData)
            this.Add_Edit.forEach(item => {
                if (item.name === 'triggerType') {
                    triggerTypeValues = item.name;
                }
            });
            console.log(triggerTypeValues);

            this.generateForm(triggerTypeValues);
            console.log(this.form);
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
                    console.log('sssssssssssssssssssssss' + response.data)
                    this.$modal.msgSuccess("Addition successful");
                    console.log(this.form)
                    this.open = false;
                    this.getList();

                }).catch(message => {
                    this.$modal.msgSuccess("The error:*" + message + ":*");
                });

            }
            else {
                this.$http.Job.updateJob(this.form).then(response => {
                    console.log('sssssssssssssssssssssss' + this.form)
                    this.$modal.msgSuccess("Update successful");
                    this.open = false;
                    this.getList();
                }).catch(message => {
                    this.$modal.msgSuccess("The error:*" + message + ":*");
                });
            }
        },

        //********************Reset************************************************ */



        //*******************************************Delete Control Section************************************* */
        handle_SideDelete(row) {
            if (row.taskId > 0) {
                this.$modal.confirm('Are you sure you want to delete the data Job/Jobs with the name "' + row.taskName + '"?').then(() => {
                    return this.$http.taskControl.deleteTask(row.taskId);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("Deletion successful");
                }).catch(() => { });
            }
        },

        handleDelete() {
            if (this.selectedRows.length > 0) {
                this.$modal.confirm('WARNING: You are about to permanently delete the following Task/s:{ '
                    + this.selectedRows.map(row => row.taskName).join(', ')
                    + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
                        this.selectedRows.forEach(row => {
                            // Delete the Selected Jobs
                            this.$http.taskControl.deleteTask(row.taskId);
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
                console.log(row.taskId, row.taskName); // logs the deptId and name of each selected row
            });
        },

    }
};
</script>
  
  
  
  