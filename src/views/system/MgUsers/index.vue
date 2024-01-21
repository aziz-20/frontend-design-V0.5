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
                    <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
                        :buttons="{ new: true, edit: true, expand: true, delete: true, filter: true }"
                        :handleAdd="handleAdd" :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll"
                        :handleDelete="handleDelete" :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
                        :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />

                    <!-- Table view  -->
                    <div>
                        <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
                        <ReusableTable :data="usersList" :columns="tableColumns" rowKey="userId" :loading="loading"
                            :refreshTable="refreshTable" :handleSelectionChange="handleSelectionChange"
                            :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete" :openDetails="openDetails"
                            popUpTitle="Test" :columnPopUp="columnPopUp" columnLabel="hello"
                            :rowClassChecker="rowClassChecker" :buttonsConfig="tablebuttons"
                            @open-popup="handleOpenPopup" />
                    </div>
                    <!-- <div>
                        <el-table :data="usersList" row-key="userId" v-loading="loading" element-loading-text="Loading..."
                            v-if="refreshTable" @selection-change="handleSelectionChange" :style="{ width: '100%' }">
                            <el-table-column v-for="(column, index) in tableColumns" :key="index" :prop="column.prop"
                                :label="column.label" :width="column.width" :fixed="column.fixed"
                                :type="column.type === 'select' ? 'selection' : undefined" :class-name="column.className">
                                <template v-if="column.type === 'custom'" v-slot="scope">
                                    <div v-html="column.customRender(scope.row)"></div>
                                </template>
                                <template v-else-if="column.type === 'tag'" v-slot="scope">
                                    <el-tag :type="column.tagType(scope.row)">
                                        {{ column.tagLabel(scope.row) }}
                                    </el-tag>
                                </template> -->
                    <!-- Add other custom template types here as needed -->
                    <!-- </el-table-column>
                        </el-table>
                    </div> -->
                    <div>
                        <PopupColumn v-model:visible="columnVisible" :buttonsConfig="tablebuttons"
                            :selectedPerm="selectedItem" :popUpTitle="popUpTitle" :columnPopUp="columnPopUp"
                            :handleAdd="handleAdd" :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete">
                        </PopupColumn>
                    </div>

                    <div>
                        <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog"
                            :rowData="mobileView" :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig"
                            :handleAdd="handleAdd" :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete">
                        </PhoneTablePopUp>
                    </div>
                    <!-- <s>ADD, EDIT</s> -->
                    <template v-if="open">
                        <addoredit ref="form" :rules="fields_rules" :open="open" :mode="modeType" :title="title"
                            :init="modeType === 'add' ? initialValuesAdd : initialValuesEdit" :visible="isFormVisible"
                            :fields="Add_Edit" @close="closeAddEdit" @submit="onSubmit">
                        </addoredit>
                    </template>
                </el-main>
            </el-container>
            <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
                :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout"
                @page-change="handlePageChange">
            </custom-pagination>
        </div>
    </div>
</template>
<script>
import ReusableTable from "@/views/components/defaultTable"

import PopupColumn from "/src/views/components/defaultTable/columnPopup"

import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
import addoredit from "@/views/components/addoredit/index.vue"
import search_control from '@/views/components/qureyParams/index.vue'
import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject } from '@/utils/dtControl/dTransformer'
import { ElAside, ElInput, ElTree, ElButton } from 'element-plus';
export default {
    // name: "Job",
    dicts: ['sys_normal_disable'],

    components: {
        addoredit,
        search_control,
        ElAside,
        CustomPagination,
        tableHeader,
        PhoneTablePopUp,
        ReusableTable,
        PopupColumn
    },
    data() {
        return {
            tablebuttons: [],
            selectedRows: [],
            loading: true,
            modeType: '',
            showSearch: true,
            initialValuesEdit: null,
            initialValuesAdd: undefined,
            showSide: false,
            isExpandAll: true,
            refreshTable: true,
            loading: false,
            displaySearch: true,
            deptOptions: [],
            sideSearch: [],
            originalDeptOptions: [],
            open: false,
            usersList: [],
            columnVisible: false,
            selectedItem: false,
            dialogVisible: false,
            total: 0,
            paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
            isHasNextPage: false,
            isHasPreviousPage: false,
            tableColumns: [],

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
                roleId: undefined,
                sideSearchToAdd: '',
                jobId: '',
                email: '',
                pageNo: 1,
                pageSize: 20
            },
            Add_Edit: [
                {

                    "type": "photo",
                    inputtype: "photo",
                    name: "avatar",
                    // label: "Username",
                    // placeholder: "Please Enter the User name",
                    // span: 12,
                    showMode: 'edit',
                    class: 'col-12',
                    // style:'img'

                },
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
                    label: "Address",
                    span: 24,
                    data: [
                        {
                            inputtype: "country",
                            name: 'country',
                            label: "Nationality",
                            placeholder: "Please select an option",
                            span: 12,
                            // showMode: 'edit'
                            // showMode: 'add'

                        },
                        {
                            inputtype: "state",
                            name: 'state',
                            label: "Provence/State",
                            placeholder: "Please select an option",
                            span: 12,
                            // showMode: 'edit'
                            // showMode: 'add'

                        },
                        {
                            inputtype: "text",
                            name: "city",
                            label: "City",
                            placeholder: "Please enter a value",
                            span: 12,
                            // showMode: 'add'
                        },
                        {
                            inputtype: "text",
                            name: "zipcode",
                            label: "Zip code",
                            placeholder: "Please enter a value",
                            span: 12,
                            // showMode: 'add'
                        },
                        {
                            inputtype: "text",
                            name: "detail",
                            label: "Street/Home Address",
                            placeholder: "Please enter a value",
                            span: 12,
                            // showMode: 'add'
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
                            // span: 6,
                            // showMode: 'edit'

                        },
                        {
                            inputtype: "sorting",
                            name: "startHour",
                            label: "Starting Hour",
                            placeholder: "Please enter a value",
                            max: 23
                        },
                        {
                            inputtype: "sorting",
                            name: "endHour",
                            label: "Ending Hour",
                            placeholder: "Please enter a value",
                            max: 23
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
                {
                    type: 'Position',
                    inputtype: "Position",
                    name: 'jobId',
                    label: 'Job Name',
                    data: 'Position',
                    // style: 'width: 150px'

                },
                {
                    'type': 'roles',
                    inputtype: "roles",
                    name: 'roleId',
                    label: 'Role',
                    placeholder: 'Select Role',
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
        this.table();
    },
    Mounted() {


    },

    methods: {
        // ********************** Table ****************************************************//
        table() {
            this.tableColumns = [
                { type: 'select' },
                { type: 'photo', label: 'avatar', fixed: true },
                { prop: 'username', label: 'User Name', fixed: true, show: true,minWidth:'100' },
                { label: 'Job/s', parent: 'jobs', type: 'tagPopup', secondProp: 'children', insideKey: 'jobId', secondName: 'name', show: true },
                {
                    prop: 'sex', label: 'Gender', type: 'tag',
                    tagType: (statusValue) => {
                        return statusValue === 0 ? 'info' : 'warning';
                    },
                    tagLabel: (statusValue) => {
                        return statusValue === 0 ? 'Male' : 'Female';
                    },
                    tagColor: (value) => { /* ... */ }
                },
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
                { prop: 'email', label: 'Email',minWidth:'100' },
                {
                    parent: 'dept', label: 'Department/s', type: 'nested', prop: 'name',minWidth:'100'
                },

                {
                    prop: 'rolIds', label: 'Role/s', type: 'custom',
                    customRender: row => {
                        if (row.rolIds && row.rolIds.length > 0) {
                            return `<el-tooltip effect="dark" content="${this.getRoleNames(row.rolIds)}">
                        <div>${row.rolIds.map(roleId => roleId.name).join(', ')}</div>
                      </el-tooltip>`;
                        } else {
                            return 'No Role';
                        }
                    }
                },
                { label: 'ADD By', prop: 'createByName',minWidth:'100' },
                { prop: 'createTime', label: 'Create Date', type: 'calendar' ,minWidth:'100'},
                { label: 'Updated By', prop: 'updateByName',minWidth:'100' },
                { prop: 'updateTime', label: 'Last Update Time',minWidth:'100' },
                { type: 'actions', label: 'Operation', minWidth: '100', fixed: 'right', align: 'right', show: true },
                { prop: 'phoneNumber', label: 'Phone' },


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

        // **********************Open view mode****************************************************//

        openDetails(row) {
            this.mobileView = row;
            this.buttonsConfig = [
                {
                    add: true,
                    prop: 'type',
                    value: 0,
                },
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

        //***************************************************************************************** */
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
        handleOpenPopup(selectedData) {
            console.log('Iam here' + selectedData)
            this.selectedItem = selectedData;
            this.columnVisible = true;
        },
        handeltagclick(val) {

            //When using the pop up  inside the columns please don't forget to add the closing method
            this.$emit('open-popup', val);
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
                // console.log( this.$http.photos.image())
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
            this.queryParams.roleId = ''
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
            console.log(row)

            this.modeType = "edit"
            this.title = "Editing User: " + row.username
            // const { country, state, city, zipcode, detail } = row.address;


            console.log(row)
            let jobData = row.jobs.map(item => item.jobId);

            console.log(row.roleIds)

            // let roleData = []
            // if (row.roleIds && Array.isArray(row.roleIds) && row.roleIds.length) {
            //     return roleData = row.roleIds.map(item => item.roleId);
            //     // Now you can use roleIds
            // } else {
            //     roleData = []
            // }

            let department = ''
            if (row.dept !== null) {
                console.log("I am here" + row.dept.deptId)
                department = row.dept.deptId;
            }

            console.log(department)

            if (row.address !== null) {
                this.initialValuesEdit =
                {
                    delFlag: 0,
                    avatar: row.avatar,
                    deptId: department,
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
                        status: 0,
                        state: row.address.state,
                        city: row.address.city,
                        status: row.address.status,
                        country: row.address.country,
                        zipcode: row.address.zipcode,
                        detail: row.address.detail
                    }
                }
            }
            else {
                this.initialValuesEdit =
                {
                    delFlag: 0,
                    avatar: row.avatar,
                    deptId: department,
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
                        status: 0,
                        city: '',
                        state: '',
                        status: '',
                        country: '',
                        zipcode: '',
                        detail: ''
                    }
                }

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
            if (row.userId > 0) {
                this.$modal.confirm('Are you sure you want to delete the data User/Users with the name "' + row.username + '"?').then(() => {
                    return this.$http.MgUsers.deleteJob(row.userId);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("Deletion successful");
                }).catch(() => { });
            }
        },

        handleDelete() {
            if (this.selectedRows.length > 0) {
                this.$modal.confirm('WARNING: You are about to permanently delete the following User/Users:{ '
                    + this.selectedRows.map(row => row.username).join(', ')
                    + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
                        this.selectedRows.forEach(row => {
                            // Delete the Selected Jobs
                            this.$http.MgUsers.deleteJob(row.userId);
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
                console.log(row.userId, row.username); // logs the deptId and name of each selected row
            });
        },

    },



};


</script>

<style>
img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>

