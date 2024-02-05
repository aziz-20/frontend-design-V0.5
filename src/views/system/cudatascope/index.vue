<template>
    <div class="app-container">
        <search_control v-if="showSearch" ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
            :hierarchicalData="transNameList" :handleQuery="search" :resetQuery="Reload" :emptyFields="resetQuery"
            :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
            :resetIcon="resetIcon">
        </search_control>

       
            <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
                :buttons="{ new: true, edit: true, expand: false, delete: true, filter: true }" :handleAdd="handleAdd"
                :handleUpdate="handleTopUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelete"
                :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
                :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
        
       
            <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
            <ReusableTable :data="DatascopeList" :columns="tableColumns" rowKey="customId" :loading="loading"
                :refreshTable="refreshTable" :default-expand-all="isExpandAll"
                :handleSelectionChange="handleSelectionChange" :handleAdd="handleAdd" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete" :openDetails="openDetails" popUpTitle="Test"
                :columnPopUp="columnPopUp" columnLabel="hello" :rowClassChecker="rowClassChecker"
                :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />
        
        
            <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
                :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete">
            </PhoneTablePopUp>
       


        <template v-if="open">
            <addoredit :open="open" :mode="mode" :title="title"
                :init="mode === 'add' ? initialValuesAdd : initialValuesEdit" :fields="fields" @close="closeAddEdit"
                @submit="onsubmit" :rules="rules">
            </addoredit>
        </template>

        
            <custom-pagination v-show="total > 0" :total-items="total" :current-page.sync="queryParams.pageNo"
                :page-size.sync="queryParams.pageSize" :pagination-layout="paginationLayout"
                @page-change="handlePageChange">
            </custom-pagination>
        



    </div>
</template>
<script>

import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
import { treeTransformerTwoValues } from '@/utils/dTransformer'
import search_control from '@/views/components/qureyParams/index.vue'
import ReusableTable from "@/views/components/defaultTable"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import CustomPagination from "@/views/components/headerAndfooter/footer.vue"
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'
export default {
    components: {
        addoredit,
        search_control,
        PhoneTablePopUp,
        ReusableTable,
        tableHeader,
        CustomPagination,


    },

    data() {
        return {
            selectedRows: [],
            buttonsConfig: [],
            mobileView: [],
            tablebuttons: [],
            tableColumns: [],
            refreshTable: true,
            total: 0,
            paginationLayout: 'prev, pager, next', // Customize the layout based on your needs
            isHasNextPage: false,
            isHasPreviousPage: false,
            loading: true,
            showSearch: true,
            mode: 'add',
            open: false,
            title: "permision",
            dialogVisible: false,
            selectedPerm: null,
            init: undefined,
            multipleSelection: [],
            transNameList: [],
            initialValuesAdd: {},
            initialValuesEdit: undefined,
            deplist: [],
            options: [],
            DatascopeList: [],
            form: {},
            Statusoptions: [0, 1],
            queryParams: {
                name: undefined,
                status: undefined,
                userId: undefined,
                roleId: undefined,
                pageNo: 1,
                pageSize: 20
            },
            fields: [

                {
                    "type": "input",
                    inputtype: "text",
                    name: "name",
                    label: "name",
                    placeholder: "Enter the permision name",
                    span: 24
                },
                {
                    "type": "number",
                    inputtype: "sorting",
                    name: "orderNum",
                    label: "orderNum",
                    placeholder: "Enter the permision orderNum",
                    span: 6
                },
                {
                    inputtype: 'switch',
                    name: 'status',
                    label: 'Department Status',
                    switchOnColor: '#309f62',
                    switchOffColor: '#ff4949',
                    activeText: 'Enabled',
                    inactiveText: 'Disabled',
                    activeValue: 0,
                    inactiveValue: 1,
                },
                {
                    "type": "dynamicFeild",
                    inputtype: "dynamicFeild", data: {
                        Dept: undefined, userIds: undefined
                    }, placeholder: "Enter the permision remark", span: "col-6"
                },
                { "type": "textarea", inputtype: "textarea", name: "remark", label: "remark", placeholder: "Enter the permision remark", span: 24 },


            ],
            searchFields: [
        
                {
                    inputtype: "Custompersmission",
                    name:"name",
                    label: "Custom persmission name",
                    placeholder: "Enter Custom persmission name",
                },

                {
                    'type': 'roles',
                    inputtype: "roles",
                    name: 'roleId',
                    label: 'Role',
                    placeholder: 'Select Role',


                },
                {
                    inputtype: 'StatusSelect',
                    name: 'status',
                    label: 'Data scope Status',
                },


            ],
            searchButtonText: 'Search',
            resetButtonText: 'Reset',
            searchIcon: 'el-icon-search',
            resetIcon: 'el-icon-refresh',
            rules: {
                name: [
                    { required: true, message: "cant be empty", trigger: "blur" }
                ],
                orderNum: [
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

        this.getList()
        this.getoptions()
        this.table()

    },


    methods: {
        //*****************Pagination control********************************** */
        handlePageChange(newPage) {
            // Update the queryParams with the new page number
            this.queryParams.pageNo = newPage;
            // Fetch data for the new page
            this.getList();
        },

        //********Node control**************************************************************************************** */
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



        //**************************PopUp******************************** */

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
        closeDialog() {
            this.dialogVisible = false; // Method to close the dialog
        },


        //*************************************************************** */

        handeltagclick(val) {
            console.log(val)
            this.selectedPerm = val;
            this.dialogVisible = true;


        },
        // handleSelectionChange(val) {
        //     this.multipleSelection = val

        // },


        getoptions() {

            this.$http.cusdatascope.customDatascopelist({
                "pageNo": 1,
                "pageSize": 0
            }).then(res => {

                const data = res?.result?.data.map((item) => {
                    return { value: item.name, label: item.name }
                })
                // this.searchFields[0].data = data


            })
            this.$http.MgUsers.listUsers({
                "pageNo": 1,
                "pageSize": 0
            }).then(res => {

                const data = res?.result?.data.map((item) => {
                    return { value: item.userId, label: item.username }
                })
                // this.searchFields[1].data = data
                this.fields[3].data.userIds = data

            })
            this.$http.dept.DeptlistHierarchy({
                "pageNo": 1,
                "pageSize": 0
            }).then((res) => {

                const data = treeTransformerTwoValues(res.result.data, 'name', 'deptId')
                // this.fields[3].data.Dept = data
                // console.log(this.fields[3].data.Dept)
                // this.fields[0].data = data
            })
            this.$http.dept.listDept({
                "pageNo": 1,
                "pageSize": 0
            }).then((res) => {
                console.log(res)
                const data = res?.result?.data.map((item) => {
                    return { value: item.deptId, label: item.name }
                })
                this.deplist = data

            })

        },

        getList() {
            this.loading = true
            this.$http.cusdatascope.customDatascopelist(this.queryParams).then(res => {
                const data = res?.result?.data
                this.isHasNextPage = res.result.isHasNextPage;
                this.isHasPreviousPage = res.result.isHasPreviousPage;
                this.total = res.result.total;
                this.DatascopeList = data
                console.log(data)
                this.loading = false
            })

        },
        resetqueary() {
            this.queryParams.name = ''
            this.queryParams.status = ''
            this.queryParams.userId = ''
            this.queryParams.roleId = ''


            // this.queryParams.pageNum = 1
            this.handleQuery();
        }
        ,
        search(e) {
            this.getList();

        },
        Reload() {
            this.resetQuery()
            this.getList();
        },

        /** Reset button operation */

        resetQuery() {
            this.queryParams.name = undefined
            this.queryParams.status = undefined
            this.queryParams.userId = undefined
            this.queryParams.roleId = undefined
       
       
        },
        handleTopUpdate() {
            // let side=null
            if (this.selectedRows.length === 1) {
                // row = ;
                this.handleUpdate(this.selectedRows[0])
            }

        },
        handleUpdate(row) {
            this.mode = "edit"
            // this.fields[0].data = this.options
            console.log(row)
            // const updatedScoping = {};
            this.initialValuesEdit = row
            this.open = true

        },
        handleAdd(row) {

            this.initialValuesAdd = { "delFlag": 0, }
            this.mode = "add"
            this.open = true

        },
        // handleDelet(row) {
        //     const { customId } = row
        //     console.log(customId)

        //     this.$http.cusdatascope.delet(customId).then(_ => {
        //         ElMessage({
        //             message: ` permition.${this.mode} success`,
        //             type: 'success',
        //         })
        //         this.getlist()
        //     })

        // },
        //********************************************************************** */
        //*******************************************Delete Control Section************************************* */
        handle_SideDelete(row) {
            if (row.customId > 0) {
                this.$modal.confirm('Are you sure you want to delete the"{' + row.name + '}"?').then(() => {
                    return this.$http.cusdatascope.delet(row.customId);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("Deletion successful");
                }).catch(() => { });
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
                            this.$http.cusdatascope.delet(row.defId).then(_ => {
                            
                                this.$modal.msgSuccess("Deletion successful");
                            })
                            // this.getList();
                           this.search()
                        });
                        
    
                    }).catch(() => { });
            } else {
                console.log('No data');
            }


        },

        //*************handle selection section************************* */
        handleSelectionChange(selection) {
            this.selectedRows = selection;
            this.selectedRows.forEach(row => {
                console.log(row.customId, row.name); // logs the deptId and name of each selected row
            });
        },

        //********************************************* */

        openAddEdit() {

            this.open = true
        },
        closeAddEdit() {
            this.open = false
        },
        onsubmit(n) {
            this.form = n
            console.log(n)
            if (this.mode == 'add') {

                this.$http.cusdatascope.add(this.form).then(_ => {
                    ElMessage({
                        message: ` permition.${this.mode} success`,
                        type: 'success',
                    })
                    this.getList()
                })

            }
            else {

                this.$http.cusdatascope.edit(this.form).then(_ => {
                    ElMessage({
                        message: ` permition.${this.mode} success`,
                        type: 'success',
                    })
                    this.getList()
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

.tagpoint {
    cursor: pointer;
}
</style>
