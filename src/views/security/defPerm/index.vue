<template>
    <div class="app-container">
        <search_control v-if="showSearch" ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
          :handleQuery="search" :resetQuery="Reload" :emptyFields="resetQuery" :searchButtonText="searchButtonText"
            :resetButtonText="resetButtonText" :searchIcon="searchIcon" :resetIcon="resetIcon">
        </search_control>
        <div>
            <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
                :buttons="{ new: true, edit: true, expand: false, delete: true, filter: true }" :handleAdd="handleadd"
                :handleUpdate="handleTopUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelet"
                :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
                :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
        </div>
        <div>
            <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
            <ReusableTable :data="DatascopeList" :columns="tableColumns" rowKey="defId" :loading="loading"
                :refreshTable="refreshTable" :default-expand-all="isExpandAll"
                :handleSelectionChange="handleSelectionChange" :handleAdd="handleadd" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete" :openDetails="openDetails" popUpTitle="Test"
                :columnPopUp="columnPopUp" columnLabel="hello" :rowClassChecker="tableRowClassName"
                :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />
        </div>
        <div>
            <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
                :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete">
            </PhoneTablePopUp>
        </div>
    
        <div class='row-b margin-top-20'>
            <el-col :span="24">
                <el-button type="primary" size="mini" @click="handleapplyChange">applyChange</el-button>
                <el-button size="mini" @click="resetFactory">resetFactory</el-button>
            </el-col>
        </div>
        <addoredit :open="open" :mode="mode" :title="title" :init="mode === 'add' ? initialValuesAdd : initialValuesEdit"
            :fields="fields" @close="closeAddEdit" @submit="onsubmit" :rules="rules">
        </addoredit>
        <div>
            <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
                :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout"
                @page-change="handlePageChange">
            </custom-pagination>
        </div>


    </div>
</template>
<script>

import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
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
            loading: true,
            paginationLayout: 'prev, pager, next',
            total: 0,
            showSearch: true,
            mode: 'add',
            open: false,
            title: "permision",
            init: undefined,
            initialValuesAdd: {},
            initialValuesEdit: undefined,
            isHasNextPage: false,
            isHasPreviousPage: false,
            // isHasNextPage,
            // isHasPreviousPage,
            form: {},
            queryParams: {
                name: undefined,
                status: undefined,
                type: undefined,
                pageNo: 1,
                pageSize: 20
            },
            searchFields: [
             
                {
                    inputtype: 'defaultpermission',
                    name: 'name',
                    label: 'Defualt Permision Name',
                    placeholder: 'Enter the Defualt permision name',
                    
                },
                {
                   inputtype: 'selectV',
                    name:'type',
                    label:'Type',
                    data: [{ value: 0, label: 'view' }, { value: 1, label: 'operational' },{value:'',label:'All'}],
                    multiple: false,
                    placeholder: 'Enter the Defualt permision type',
                    
                 },
                
                {
                    inputtype: 'StatusSelect',
                    name: 'status',
                    label: ' Status',
                },


            ],
            searchButtonText: 'Search',
            resetButtonText: 'Reset',
            searchIcon: 'el-icon-search',
            resetIcon: 'el-icon-refresh',
            fields: [
                { "inputtype": "input", inputtype: "text", name: "name", label: "name", placeholder: "Enter the permision name", span: "col-6" },
                { "inputtype": "input", inputtype: "text", name: "func", label: "func", placeholder: "Enter the permision fuction", span: "col-6" },
                { "inputtype": "select", inputtype: "select", name: "type", label: "type", placeholder: "Enter the permision type", data: [{ value: 0, label: 'view' }, { value: 1, label: 'operational' }], span: "col-6" },
                { "inputtype": "select", inputtype: "select", name: "status", label: "status", placeholder: "Enter the permision status", data: [{ value: 0, label: 'active' }, { value: 1, label: 'deactive' }], span: "col-6" },
                { "inputtype": "input", inputtype: "text", name: "remark", label: "remark", placeholder: "Enter the permision remark", span: "col-6" },

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

        this.getlist(),
            this.table()

    },

    methods: {
        handlePageChange(newPage) {
            // Update the queryParams with the new page number
            this.queryParams.pageNo = newPage;
            // Fetch data for the new page
            this.getList();
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
                },
                { prop: 'remark', label: 'Note', minWidth: '100' },
                { label: 'ADD By', prop: 'createByName', minWidth: '100' },
                { prop: 'createTime', label: 'Create Date', type: 'calendar', minWidth: '100' },
                { label: 'Updated By', prop: 'updateByName', minWidth: '100' },
                { prop: 'updateTime', label: 'Last Update Time', minWidth: '100' },
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
        handleTopUpdate() {
            // let side=null
            if (this.selectedRows.length === 1) {
                // row = ;

                this.handleUpdate(this.selectedRows[0])
            }

        },

        tableRowClassName({ row, rowIndex }) {
            console.log(row.applyAdd)
            if (row.applyAdd === 0) {
                return 'warning-row';
            }
            return '';
        },


        getlist() {
            this.loading = true
            this.$http.defpermision.permlist(this.queryParams).then(res => {
                // const data = res?.result?.data
                // this.permList = data
                // this.loading = false
                const data = res?.result?.data
                this.isHasNextPage = res.result.isHasNextPage;
                console.log(this.isHasNextPage)
                console.log(res.result)

                this.total = res.result.total;
                this.DatascopeList = data
                console.log(data)
                this.loading = false
            })

        },
        resetqueary() {
            this.resetForm('queryForm')
            this.handleQuery()

        }
        ,
        handleapplyChange() {
            this.$confirm('Are you sure you want to applyChange?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                ElMessage({
                    message: ` change success`,
                    type: 'success',
                })
                this.$http.defpermision.applyChange().then(_ => {
                    ElMessage({
                        message: ` change success`,
                        type: 'success',
                    })
                    this.getlist()
                }).catch(_ => {
                    ElMessage({
                        message: ` change fail`,
                        type: 'error',
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancel'
                });
            });

        },
        resetFactory() {
            this.$confirm('Are you sure you want to resetFactory?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$http.defpermision.resetFactory().then(res => {

                    if (res?.result?.code === 200) {
                        ElMessage({
                            message: ` resetFactory success`,
                            type: 'success',
                        })
                        this.getlist()
                    }
                    else {
                        ElMessage({
                            message: ` resetFactory fail`,
                            type: 'error',
                        })
                    }

                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancel'
                });
            });
        }
        ,
        search(e) {
            this.getlist();

        },
        Reload() {
            this.resetQuery()
            this.getlist();
        },

        /** Reset button operation */

        resetQuery() {
            this.queryParams. name = undefined
            this.queryParams.status = undefined
            this.queryParams.type = undefined
            // this.queryParams.groupId = ""
       
       
        },
        handleUpdate(row) {
            this.mode = "edit"
            this.initialValuesEdit = row
            this.open = true
        },
        handleadd(row) {
            console.log("xx")
            this.mode = "add"
            // this.initialValuesEdit = row
            this.initialValuesAdd = { "delFlag": 0 }
            this.open = true

        },
        handle_SideDelete(row) {
            if (row.defId > 0) {
                this.$modal.confirm('Are you sure you want to delete the"{' + row.name + '}"?').then(() => {

                    console.log("delet success")
                    this.$http.defpermision.deletDeper(row.defId).then(_ => {
                        this.$modal.msgSuccess("Deletion successful");
                    })
                    this.getlist();
                }).catch(() => { });
                // .then(() => {
                //     this.getList();
                //     console.log("delet success")
                //     this.$modal.msgSuccess("Deletion successful");
                // }).catch(() => { });

            }

        },
        handleDelet(row) {
            if (this.selectedRows.length > 0) {
                console.log(this.selectedRows)
                this.$modal.confirm('WARNING: You are about to permanently delete the following:{ '
                    + this.selectedRows.map(row => row.name).join('},{')
                    + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
                        this.selectedRows.forEach(row => {
                            // Delete the Selected Jobs
                            this.$http.defpermision.deletDeper(row.defId).then(_ => {
                            
                                this.$modal.msgSuccess("Deletion successful");
                            })
                            this.getlist();
                        });
                        
    
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

                this.$http.defpermision.addDeper(this.form).then(_ => {
                    ElMessage({
                        message: ` permition.${this.mode} success`,
                        type: 'success',
                    })
                    this.getlist()
                })

            }
            else {

                this.$http.defpermision.editDeper(this.form).then(_ => {
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
