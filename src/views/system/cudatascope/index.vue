<template>
    <div class="app-container">

        <div class="flex" v-if="showSearch">
            <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
                :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetqueary"
                :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
                :resetIcon="resetIcon">
            </search_control>
        </div>
        <div>
            <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
                :buttons="{ new: true, edit: true, expand: false, delete: true, filter: true }" :handleAdd="handleAdd"
                :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll" :handleDelete="handleDelete"
                :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
                :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
        </div>
        <div>
            <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
            <ReusableTable :data="DatascopeList" :columns="tableColumns" rowKey="jobId" :loading="loading"
                :refreshTable="refreshTable" :default-expand-all="isExpandAll"
                :handleSelectionChange="handleSelectionChange" :handleAdd="handleAdd" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete" :openDetails="openDetails" popUpTitle="Test"
                :columnPopUp="columnPopUp" columnLabel="hello" :rowClassChecker="rowClassChecker"
                :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />
        </div>
        <div>
            <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
                :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete">
            </PhoneTablePopUp>
        </div>

        <!-- <el-table @selection-change="handleSelectionChange" style="width: 100%" :data=DatascopeList row-key="groupId"
            default-expand-all v-loading="loading" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column fixed prop="name" label="name" column-key="defId" width="200" />
            <el-table-column prop="status" label="status" column-key="defId" width="150" />
            <el-table-column prop="createTime" label="createTime" column-key="defId" width="200">
                <template #scope>
                    {{ scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="createBy" column-key="defId" width="150" />
            <el-table-column prop="updateBy" label="updateBy" width="150" />
            <el-table-column prop="createBy" label="createBy" column-key="defId " width="150" />
            <el-table-column prop="remark" label="remark" column-key="defId " width="150" />

            <el-table-column fixed="right" label="oparation" align="center" width="200">
                <template #default="{ row, column, $index }">

                    <el-button size="small" icon="el-icon-edit" @click="handleUpdate(row)">edit</el-button>
                    <el-button size="small" type="danger" icon="el-icon-edit"
                        @click="handle_SideDelete(row)">delet</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='row-b margin-top-20'>

        </div> -->
        <template v-if="open">
            <addoredit :open="open" :mode="mode" :title="title"
                :init="mode === 'add' ? initialValuesAdd : initialValuesEdit" :fields="fields" @close="closeAddEdit"
                @submit="onsubmit" :rules="rules">
            </addoredit>
        </template>
        <el-dialog :model-value="dialogVisible" title="Permission Details" :visible="dialogVisible"
            @close="dialogVisible = false">
            <!-- Display details of the selected permission inside the dialog -->

            <div v-if="selectedPerm">
                <p><strong>Name:</strong> {{ selectedPerm.name }}</p>
                <p><strong>ID:</strong> {{ selectedPerm.permId }}</p>
                <!-- Add more details as needed -->
            </div>
        </el-dialog>
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
                    inputtype: 'departments',
                    name: 'name',
                    data: 'name',
                    label: 'Department Name',

                },
                {
                    type: 'tree-select',
                    name: 'userId',
                    label: 'Data scope User',
                    data: undefined,
                },
                {
                    type: 'userField',
                    inputtype: "userField",
                    name: 'userId',
                    label: 'User Name',
                    // options: 'username',
                    placeholder: "Enter username",
                    style: 'width: 150px'

                },
                {
                    type: 'StatusSelect',
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
                { prop: 'name', label: 'Name', fixed: true, minWidth: '150' },
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
                this.loading = false
            })

        },
        resetqueary() {
            this.queryParams.name = ''
            this.queryParams.status = ''
            this.queryParams.userId = ''
            this.queryParams.pageNum = 1
            this.handleQuery();
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
            if (this.selectedRows.length === 1) {
                row = this.selectedRows[0];
            }

            this.fields[0].data = this.options
            console.log(row.scoping)
            const updatedScoping = {};

            // Object.keys(row.scoping).forEach((deptId) => {
            //     const matchingDepartment = this.deplist.find((department) => department.value === parseInt(deptId, 10));

            //     if (matchingDepartment) {
            //         updatedScoping[matchingDepartment.label] = row.scoping[deptId];
            //     }
            // });

            // console.log(updatedScoping);
            // row.scoping = updatedScoping
            // console.log(row.)
            // let x = Object.keys(row.scoping)
            // console.log(x)

            // let obj = row.scoping
            //  x.forEach((i) => {
            //     const d = this.deplist.filter((e) => {
            //         if (e.value == i) {
            //             console.log(row.scoping[i])
            //             return true
            //         }

            //     })
            //     console.log(d)

            // })

            // for (const key in obj) {

            //     if (obj.hasOwnProperty(key)) {
            //         const array = obj[key];
            //         console.log(`Key: ${key}`);

            //         for (const value of array) {
            //             console.log(`  Value: ${value}`);
            //         }
            //     }
            // }

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

        handleDelete() {
            if (this.selectedRows.length > 0) {
                this.$modal.confirm('WARNING: You are about to permanently delete the following:{ '
                    + this.selectedRows.map(row => row.name).join('},{')
                    + '}. This action CANNOT be undone.Do you want to pressed?').then(() => {
                        this.selectedRows.forEach(row => {
                            // Delete the Selected Jobs
                            this.$http.Job.deleteJob(row.customId);
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
                    this.getlist()
                })

            }
            else {

                this.$http.cusdatascope.edit(this.form).then(_ => {
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

.tagpoint {
    cursor: pointer;
}
</style>
