<template>
    <div class="app-container">
        <search_control v-if="showSearch" ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
            :handleQuery="handleQuery" :resetQuery="resetqueary" :searchButtonText="searchButtonText"
            :resetButtonText="resetButtonText" :searchIcon="searchIcon" :resetIcon="resetIcon">
        </search_control>
        <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" @submit.prevent="handleQuery">
            <el-form-item label="name" prop="name">
                <el-input v-model="queryParams.name" placeholder="name" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.status" placeholder="status" clearable>
                    <el-option v-for="op in Statusoptions" :key="op.index" :label="op" :value="op" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">Query</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetqueary">Reset</el-button>
            </el-form-item>
        </el-form> -->
        <!-- <el-row :gutter="10">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleadd">
                    new default permision
                </el-button>
            </el-col>
        </el-row> -->
        <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
            :buttons="{ new: true, edit: true, expand: false, delete: true, filter: true }" :handleAdd="handleadd"
            :handleUpdate="handleTopUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelet"
            :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
            :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />

        <ReusableTable :data="DatascopeList" :columns="tableColumns" rowKey="permId" :loading="loading"
            :refreshTable="refreshTable" :default-expand-all="isExpandAll" :handleSelectionChange="handleSelectionChange"
            :handleAdd="handleAdd" :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete"
            :openDetails="openDetails" popUpTitle="Test" :columnPopUp="columnPopUp" columnLabel="hello"
            :rowClassChecker="rowClassChecker" :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />


        <!-- <el-table :row-class-name="tableRowClassName" :data=permList row-key="defId" default-expand-all v-loading="loading"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="name" label="name" column-key="defId" width="200" />
            <el-table-column prop="status" label="status" column-key="defId" width="150" />
            <el-table-column prop="createTime" label="createTime" column-key="defId" width="200">
                <template #scope>
                    {{ scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="createBy" column-key="permId" width="150" />
            <el-table-column prop="updateBy" label="updateBy" width="150" />
            <el-table-column prop="createBy" label="createBy" column-key="permId" width="150" />
            <el-table-column prop="remark" label="remark" column-key="permId" width="150" />
            <el-table-column prop="groupId" label="groupId" column-key="permId" width="150">
                <template #default="{ row, column, $index }">
                    <span>{{ row.groupId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="oparation" align="center" class-name="small-padding fixed-width">
                <template #default="{ row, column, $index }">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">edit</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelet(row)">delet</el-button>
                </template>
            </el-table-column>
        </el-table> -->

        <addoredit :open="open" :mode="mode" :title="title" :init="mode === 'add' ? initialValuesAdd : initialValuesEdit"
            :fields="fields" @close="closeAddEdit" @submit="onsubmit" :rules="rules">
        </addoredit>


        <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
            :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout" @page-change="handlePageChange">
        </custom-pagination>



    </div>
</template>
<script>

import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
import { treeTransformerTwoValues } from '@/utils/dTransformer'
import search_control from '@/views/components/qureyParams/index.vue'
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import ReusableTable from "@/views/components/defaultTable"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
export default {
    components: {
        addoredit,
        search_control,
        tableHeader,
        ReusableTable,
        PhoneTablePopUp,
        CustomPagination

    },

    data() {
        return {
            dialogVisible: false,
            mobileView: [],
            refreshTable: true,
            DatascopeList: [],
            selectedRows: [],
            buttonsConfig: [],
            tableColumns: [],
            searchButtonText: 'Search',
            resetButtonText: 'Reset',
            searchIcon: 'el-icon-search',
            resetIcon: 'el-icon-refresh',
            isHasNextPage: false,
            isHasPreviousPage: false,
            loading: true,
            paginationLayout: 'prev, pager, next',
            total: 0,
            showSearch: true,
            loading: true,
            mode: 'add',
            open: false,
            title: "permision",
            init: undefined,
            initialValuesAdd: {},
            options: [],
            initialValuesEdit: undefined,
            permList: [],
            form: {},
            Statusoptions: [0, 1],
            groupidname: '',
            queryParams: {
                name: undefined,
                status: undefined,
                pageNo: 1,
                pageSize: 10
            },
            searchFields: [
                {
                    inputtype: 'text',
                    name: 'name',
                    label: 'Permision Name'
                },
                {
                    inputtype: 'StatusSelect',
                    name: 'status',
                    label: ' Status',
                },
            ],
            fields: [
                { "type": "input", inputtype: "text", name: "name", label: "name", placeholder: "Enter the permision name", span: "col-6" },
                { "type": "input", inputtype: "text", name: "func", label: "func", placeholder: "Enter the permision fuction", span: "col-6" },
                { "type": "input", inputtype: "text", name: "code", label: "code", placeholder: "Enter the permision code", span: "col-6" },
                { "type": "select", inputtype: "select", name: "type", label: "type", placeholder: "Enter the permision type", data: [{ value: 0, label: 'view' }, { value: 1, label: 'operational' }], span: "col-6" },
                { "type": "select", inputtype: "select", name: "status", label: "status", placeholder: "Enter the permision status", data: [{ value: 0, label: 'active' }, { value: 1, label: 'deactive' }], span: "col-6" },
                { "type": "input", inputtype: "text", name: "remark", label: "remark", placeholder: "Enter the permision remark", span: "col-6" },
                {
                    inputtype: 'gpermision2',
                    name: 'groupId',
                    label: "group Permision",
                    placeholder: "Enter the permision group",
                }
            ]
            ,
            rules: {
                name: [
                    { required: true, message: "cant be empty", trigger: "blur" }
                ],
                func: [
                    { required: true, message: "cant be empty", trigger: "blur" }
                ],
                type: [
                    { required: true, message: "cant be empty", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "cant be empty", trigger: "blur" }
                ],


            }

        }
    },

    created() {

        this.getlist()
        this.getoptions()
        this.table()

    },
    computed: {


    },


    methods: {
        handleTopUpdate() {
            // let side=null
            if (this.selectedRows.length === 1) {
                // row = ;
                this.handleUpdate(this.selectedRows[0])
            }

        },
        handlePageChange(newPage) {
            // Update the queryParams with the new page number
            this.queryParams.pageNo = newPage;
            // Fetch data for the new page
            this.getlist();
        },
        closeDialog() {
            this.dialogVisible = false; // Method to close the dialog
        },
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
        handeltagclick(val) {
            console.log(val)
            this.selectedPerm = val;
            this.dialogVisible = true;


        },
        handleSelectionChange(selection) {
            this.selectedRows = selection;
            this.selectedRows.forEach(row => {
                console.log(row.name); // logs the deptId and name of each selected row
            });
        },
        table() {
            this.tableColumns = [
                { type: 'select' },
                { prop: 'name', label: 'Name', fixed: true, minWidth: '150', show: true },
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
                }, {
                    label: 'Type',
                    prop: 'type',
                    type: 'tag',
                    tagType: (statusValue) => {
                        return statusValue === 0 ? 'success' : 'warning';
                    },
                    tagLabel: (statusValue) => {
                        return statusValue === 0 ? 'View' : 'operational';
                    },
                    tagColor: (value) => { /* ... */ }
                },
                { prop: 'func', label: 'Function', minWidth: '130' },
                { prop: 'remark', label: 'Note', minWidth: '100' },
                { label: 'ADD By', prop: 'createByName', minWidth: '100' },
                { prop: 'createTime', label: 'Create Date', type: 'calendar', minWidth: '100' },
                { label: 'Updated By', prop: 'updateByName', minWidth: '100' },
                { prop: 'updateTime', label: 'Last Update Time', minWidth: '100' },
                { prop: 'groupId', label: 'Group', minWidth: '100', type: 'tagPopup', parent: 'group', insideKey: 'groupId', name: 'name', tagPop: 'tagPop', ClassButton: 'Table-button-container' },
                {
                    type: 'actions', label: 'Operations', fixed: 'right', align: 'right', show: true, minWidth: '100'
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
        getoptions() {

            this.$http.grpermision.permlistHierarchy({
                "pageNo": 1,
                "pageSize": 0
            }).then(res => {
                const data = res?.result?.data
                if (data) {
                    this.options = treeTransformerTwoValues(data, 'name', 'groupId')

                }


            })

        },


        tableRowClassName({ row, rowIndex }) {

            if (row.applyAdd === 0) {
                return 'warning-row';
            }
            return '';
        },

        // getgroupname(id) {
        //     this.$http.grpermision.getbyid(id).then(res => {
        //         const data = res?.result?.name
        //         console.log(data)
        //         this.groupidname = data.name
        //         return data?.name
        //     })
        // },

        getlist() {
            this.loading = true
            this.$http.permision.permlist(this.queryParams).then(res => {
                const data = res?.result?.data
                this.isHasNextPage = res.result.isHasNextPage;
                this.isHasPreviousPage = res.result.isHasPreviousPage;
                this.total = res.result.total;
                this.DatascopeList = data
                console.log(res.result.total)
                this.loading = false
                console.log(data)
            })

        },
        resetqueary() {
            this.resetForm('queryForm')
            this.handleQuery()

        }
        ,
        resetForm(refName) {
            if (this.$refs[refName]) {
                this.$refs[refName].resetFields();
            }
        }
        ,
        handleQuery(e) {
            this.getlist();

        },
        handleUpdate(row) {
            this.mode = "edit"
            this.fields[0].data = this.options
            console.log(this.fields[0].data)
            this.initialValuesEdit = row
            this.open = true
        },
        handleadd(row) {

            this.mode = "add"
            this.fields[0].data = this.options
            // this.initialValuesEdit = row
            this.initialValuesAdd = { "delFlag": 0 }
            this.open = true

        },
        handleDelet(row) {
            if (this.selectedRows.length > 0) {
                this.$modal.confirm('WARNING: You are about to permanently delete the following:{ '
                    + this.selectedRows.map(row => row.name).join('},{')
                    + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
                        this.selectedRows.forEach(row => {
                            // Delete the Selected Jobs
                            this.$http.permision.deletDeper(row.permId);
                            this.getlist();
                        });
                        this.getlist();
                        this.$modal.msgSuccess("Deletion successful");
                    }).catch(() => { });
            } else {
                console.log('No data');
            }
        },
        openAddEdit() {

            this.open = true
        },
        closeAddEdit() {
            this.open = false
        },
        onsubmit(n) {
            this.form = n
            if (this.mode == 'add') {

                this.$http.permision.addDeper(this.form).then(_ => {
                    ElMessage({
                        message: ` permition.${this.mode} success`,
                        type: 'success',
                    })
                    this.getlist()
                })

            }
            else {

                this.$http.permision.editDeper(this.form).then(_ => {
                    ElMessage({
                        message: ` permition.${this.mode} success`,
                        type: 'success',
                    })
                    this.getlist()
                })

            }

        },
    },

}

</script>
<style>
.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.margin-top-20 {
    margin-top: 20px;
}
</style>
