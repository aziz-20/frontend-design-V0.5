<template>
    <div class="app-container">
        <div class="common-layout">
            <el-container>
                <el-aside width="250px" v-if="showSide">
                    <el-input v-model="sideSearch" placeholder="Please enter keyword" @input="filterMethod"
                        :expand-on-click-node="true" />
                    <el-tree :data="deptOptions" :filter-method="filterMethod" :height="208"
                        :default-expand-all="isExpandAll" highlight-current @node-click="handleNodeClick" />
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
                        <el-table :data="usersList" style="width:150%" row-key="userId" v-loading="loading"
                            element-loading-text="Loading..." :element-loading-spinner="svg"
                            element-loading-svg-view-box="-10, -10, 50, 50"
                            element-loading-background="rgba(122, 122, 122, 0.8)" :default-expand-all="isExpandAll"
                            v-if="refreshTable" @selection-change="handleSelectionChange">
                            <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
                            <el-table-column fixed prop="avatar" label="Photo" width="80">
                                <template v-slot="{ row }">
                                    <img :src="`http://181.215.79.209:9005${row.avatar}`" class="icon"
                                        style="width: 45px; height: 45px; object-fit: cover; border-radius: 50%;" />
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="username" label="User Name" width="150" />
                            <el-table-column prop="sex" label="Gander" width="100">
                                <template #default="{ row }">
                                    {{ row.sex === 0 ? 'Man' : 'Woman' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" label="Status" width="120">
                                <template #default="{ row }">
                                    <el-tag :type="row.status === 0 ? 'success' : 'danger'">
                                        {{ row.status === 0 ? 'Enabled' : 'Disabled' }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="Department/s" width="130">
                                <template #default="scope">
                                    <div v-if="scope.row.dept">
                                        {{ scope.row.dept.name }}
                                    </div>
                                    <div v-else>
                                        No Department
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Role/s" width="150">
                                <template #default="scope">
                                    <div v-if="scope.row.rolIds && scope.row.rolIds.length > 0">
                                        <el-tooltip effect="dark" :content="getRoleNames(scope.row.rolIds)">
                                            <div v-for="roleId in scope.row.rolIds" :key="roleId.roleId">
                                                {{ roleId.name }}
                                            </div>
                                        </el-tooltip>
                                    </div>
                                    <div v-else>
                                        No Job
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column type="Calender" prop="createTime" label="Registry Data" width="200" />
                            <el-table-column prop="updateTime" label="Last Update Time" width="200" />
                            <el-table-column prop="phoneNumber" label="Phone" width="170" />
                            <el-table-column label="Job/s" width="150">
                                <template #default="scope">
                                    <div v-if="scope.row.jobs && scope.row.jobs.length > 0">
                                        <el-tooltip effect="dark" :content="getJobNames(scope.row.jobs)">
                                            <div v-for="job in scope.row.jobs" :key="job.jobId">
                                                {{ job.name }}
                                            </div>
                                        </el-tooltip>
                                    </div>
                                    <div v-else>
                                        No Job
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="email" label="Email" width="200" />
                            <el-table-column fixed="right" label="Actions" width="180" align="center"
                                class-name="small-padding fixed-width">
                                <template #default="{ row, column, index }">
                                    <el-row class="mb-4">
                                        <el-button type="primary" :el-icon-plus="Edit" size="small"
                                            v-hasPermi="['system:user:edit']" @click="handleUpdate(row)">
                                            Edit</el-button>
                                        <el-button type="warning" :el-icon-plus="Delete" size="small"
                                            v-hasPermi="['system:user:remove']"
                                            @click="handle_SideDelete(row)">Delete</el-button>
                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-config-provider>
                    <!-- <s>ADD, EDIT</s> -->
                    <template v-if="open">
                        <addoredit ref="form" :rules="fields_rules" :open="open" :mode="modeType" :title="title"
                            :init="modeType === 'add' ? initialValuesAdd : initialValuesEdit" :visible="isFormVisible"
                            :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit">
                        </addoredit>
                    </template>

                    <el-row justify="center">
                        <el-col :span="24" :sm="12" :md="8">
                            <el-pagination v-show="total > 0" style="width:50%" background layout="prev, pager, next" :total="total"
                                :page.sync="queryParams.pageNo" :page-size.sync="queryParams.pageSize"
                                :layout="paginationLayout" @current-change="handlePageChange" />
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
import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject } from '@/utils/dtControl/dTransformer'
import { ElAside, ElInput, ElTree, ElButton } from 'element-plus';
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
            initialValuesEdit: null,
            initialValuesAdd: undefined,
            showSide: true,
            isExpandAll: true,
            refreshTable: true,
            loading: false,
            displaySearch: true,
            deptOptions: [],
            sideSearch: [],
            originalDeptOptions: [],
            open: false,
            usersList: [],
            total: 0,
            paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
            isHasNextPage: false,
            isHasPreviousPage: false,
            form: {
                email: '',
                deptId: '',
                userId: '',
                username: '',
                password: '',
                roleIds: '',
                jobs: '',
                phoneNumber: '',
                address: {
                    country: '',
                    state: '',
                    city: '',
                    zipcode: '',
                    detail: ''
                },
            },
            title: "", // Default title for the dialog
            usersList: [],
            queryParams: {
                username: undefined,
                status: '',
                createTime: undefined,
                leader: undefined,
                deptId: undefined,
                userId: undefined,
                sideSearchToAdd: '',
                email: '',
                pageNo: 1,
                pageSize: 20
            },
            Add_Edit: [
                {

                    "type": "upload",
                    inputtype: "upload",
                    name: "avatar",
                    // action:'sad',
                    // label: "Upload Photo",
                    autoUpload: false,
                    placeholder: "Please Enter the User name",
                    listType: "picture",
                    limit: 1,
                    // beforeUpload: this.checkingfileSize,
                    // buttonText:"Upload",
                    tip: "Please Enter Only one photo and the size should be less then 2/MG",
                    span: 12,
                    showMode: 'add'

                },
                {

                    "type": "text",
                    inputtype: "text",
                    name: "username",
                    label: "Username",
                    placeholder: "Please Enter the User name",
                    span: 12,
                    showMode: 'add'

                },
                {
                    "type": "email",
                    inputtype: "email",
                    name: "email",
                    label: "Email Address",
                    placeholder: "Email Address",
                    span: 12,
                    // showMode: 'edit'

                },
                {

                    "type": "password",
                    inputtype: "password",
                    name: "password",
                    label: "Password",
                    placeholder: "Please Make Password",
                    span: 12,
                    showMode: 'add'

                },

                {

                    "type": "password",
                    inputtype: "password",
                    name: "password",
                    label: "Recover Password",
                    placeholder: "Please Add New Password",
                    span: 12,
                    showMode: 'edit'

                },
                {

                    "type": "Gender",
                    inputtype: "Gender",
                    name: "sex",
                    label: "Gender",
                    placeholder: "Please select the user Gender",
                    span: 12,
                    // style: 'w50%',

                },
                {
                    "type": "input",
                    inputtype: "text",
                    name: "phoneNumber",
                    label: "Phone Number",
                    placeholder: "Phone Number",
                    span: 12,
                },
                {
                    "type": "departments",
                    inputtype: "departments",
                    name: "deptId",
                    label: "Department",
                    placeholder: "Selected Departments",
                    span: 12,
                },
                {
                    "type": "Position",
                    inputtype: "Position",
                    name: "jobs",
                    label: "Position",
                    placeholder: "User Position",
                    span: 12,
                    multiple: false,
                },

                {
                    "type": "roles",
                    inputtype: "roles",
                    name: "roleIds",
                    label: "User Role",
                    placeholder: "User Role/s",
                    span: 12,
                    showMode: 'add'
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
                    span: 6,
                },
                {
                    "type": "sorting",
                    inputtype: "sorting",
                    name: "capacity",
                    label: "User Capacity",
                    placeholder: "Display Sorting",
                    span: 6

                },

                {
                    inputtype: "address",
                    name: "address", // This will be the name of the object
                    label:"Address",
                    span: 24,
                    data: [
                        {
                            inputtype: "country",
                            name: 'country',
                            label: "Nationality",
                            placeholder: "Please select an option",
                            span: 12,
                            // showMode: 'edit'

                        },
                        {
                            inputtype: "state",
                            name: 'state',
                            label: "Provence/State",
                            placeholder: "Please select an option",
                            span: 12,
                            // showMode: 'edit'

                        },
                        {
                            inputtype: "text",
                            name: "city",
                            label: "City",
                            placeholder: "Please enter a value",
                            span: 12
                        },
                        {
                            inputtype: "text",
                            name: "zipcode",
                            label: "Zip code",
                            placeholder: "Please enter a value",
                            span: 12
                        },
                        {
                            inputtype: "text",
                            name: "detail",
                            label: "Street/Home Address",
                            placeholder: "Please enter a value",
                            span: 12
                        },
                        // Add more sub-fields as needed
                    ],
                    // span: 12,
                },

                {
                    inputtype: "schedule",
                    name: "schedule", // This will be the name of the object
                    span: 24,
                    data: [
                        {
                            inputtype: "DaysWeek",
                            name: 'dayIds',
                            label: "Select Day/s",
                            placeholder: "Please select an option",
                            span: 6,
                            // showMode: 'edit'

                        },
                        {
                            inputtype: "text",
                            name: "startHour",
                            label: "Starting Hour",
                            placeholder: "Please enter a value",
                            span: 6
                        },
                        {
                            inputtype: "text",
                            name: "endHour",
                            label: "Ending Hour",
                            placeholder: "Please enter a value",
                            span: 6
                        },
                        // Add more sub-fields as needed
                    ],
                    // span: 12,
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
                    type: 'userField',
                    inputtype: "userField",
                    name: 'userId',
                    label: 'User Name',
                    placeholder: "Enter username",
                    style: 'width: 150px'

                },
                {
                    inputtype: 'StatusSelect',
                    name: 'status',
                    label: 'Users Status',

                },
                {
                    type: 'userField',
                    inputtype: "userField",
                    name: 'email',
                    label: 'Users Email',
                    placeholder: "Select Email",
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
        this.getSideSelection();
    },
    methods: {
        handlePageChange(newPage) {
            // Update the queryParams with the new page number
            this.queryParams.pageNo = newPage;

            // Fetch data for the new page
            this.getList();
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
        getRoleNames(roleIds) {
            return roleIds.map(roleId => roleId.name).join(',\n ');
        },


        getJobNames(jobs) {
            return jobs.map(job => job.name).join(",")
        },

        //*********************************** */
        getList() {
            this.loading = true;
            this.$http.MgUsers.listUsers(this.queryParams).then(res => {
                console.log(this.queryParams)
                if (res.result && res.result.data) {
                    this.isHasNextPage = res.result.isHasNextPage;
                    this.isHasPreviousPage = res.result.isHasPreviousPage;
                    this.total = res.result.total;

                    this.usersList = res.result.data;
                    console.log(this.usersList)
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
            this.queryParams.username = ''
            this.queryParams.status = ''
            this.queryParams.email = ""
            this.queryParams.jobId = ''
            this.queryParams.userId = ''
            this.queryParams.abbrev = ''
            this.queryParams.createTime = ''
            this.queryParams.pageNum = ''
            this.handleQuery();
            this.getList();
        },

        //**************** Add, Edit and delete control section******************************************* */

        //****************************************ADDing*****************************
        handleAdd() {

            this.title = "Adding User"
            this.open = true;
            this.modeType = "add";
            // this.formFieldSelectData(),
            this.initialValuesAdd = {
                status: 0,
                delFlag: 0,

                schedule: {
                    dayIds: [],
                    endHour: '',
                    startHour: '',
                },
                address: {
                    delFlag: 0,
                    status: 0,
                    country: '',
                    state: '',
                    city: '',
                    zipcode: null,
                    detail: ''
                }
            }

        },
        //***************************Edit control section**********************************/
        handleUpdate(row) {

            this.modeType = "edit"
            this.title = "Editing User: " + row.username
            const { country, state, city, zipcode, detail } = row.address;
            console.log("Country:", country)


            // console.log(row)
            let jobData = row.jobs.map(item => item.jobId);

            console.log(row.roleIds)

            let roleData = []
            if (row.roleIds && Array.isArray(row.roleIds) && row.roleIds.length) {
                return roleData = row.roleIds.map(item => item.roleId);
                // Now you can use roleIds
            } else {
                roleData = []
            }
            console.log(roleData)

            this.initialValuesEdit =
            {
                delFlag: 0,
                avatar: row.avatar,
                deptId: row.dept.deptId,
                userId: row.userId,
                status: row.status,
                capacity: row.capacity,
                jobs: jobData,
                email: row.email,
                sex: row.sex,
                phoneNumber: row.phoneNumber,
                schedule: {

                    dayIds: row.schedule.days,
                    startHour: row.schedule.startHour,
                    endHour: row.schedule.endHour

                },
                address: {
                    delFlag: 0,
                    state: row.address.state,
                    city: row.address.city,
                    status: row.address.status,
                    country: row.address.country,
                    zipcode: row.address.zipcode,
                    detail: row.address.detail
                }
                ,
            }

            this.open = true
        },

        //************************************** Submit button**************************** */
        onSubmit(n) {
            this.form = n
            if (this.modeType === 'add') {
                console.log(this.form.avatar)
                this.$http.MgUsers.addUsers(this.form).then(response => {
                    this.Upload()
                    console.log('sssssssssssssssssssssss' + response.data)
                    this.$modal.msgSuccess("Addition successful");
                    console.log(this.form)
                    this.open = false;
                    this.mode = ''
                    this.getList();
                }).catch(error => {
                    console.error('Error:', error);
                    // Handle your error here
                });
            } else {
                this.$http.MgUsers.updateUsers(this.form).then(response => {
                    console.log('sssssssssssssssssssssss' + this.form)
                    this.$modal.msgSuccess("Update successful");
                    this.open = false;
                    this.mode = ''
                    this.getList();

                }).catch(error => {
                    console.error('Error:', error);
                    // Handle your error here
                });
            }
        },

        checkingfileSize(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            console.log("I am in checking process of :" + file)
            if (!isLt2M) {
                this.$message.error('Uploaded file size should not exceed 2MB!');
            }
            return isLt2M;
        },
        Upload() {
            this.$http.MgUsers.UploadAvatar(this.form.avatar).then(response => {
                this.$modal.msgSuccess("Adding photos");
            }).catch(error => {
                console.error('Upload Photo Error:', error);
                // Handle your error here
            });
        },

        //********************Reset*************************************************/
        reset() {
            this.form.username = '',
                this.form.password = '',
                this.form.phoneNumber = '',
                this.form.jobIds = '',
                this.form.deptId = '',
                this.form.email = '',
                this.form.status = '',
                this.form.roleIds = '',
                this.form.sex = null,
                this.form.avatar = ''
            this.form.address = '',

                console.log("I Have reseted everything")
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


