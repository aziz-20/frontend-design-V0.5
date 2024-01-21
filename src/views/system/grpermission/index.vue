<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" @submit.prevent="handleQuery">
            <el-form-item label="name" prop="name">
                <el-input v-model="queryParams.name" placeholder="name" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="permId" prop="permId">
                <el-input v-model="queryParams.permId" placeholder="permId" @keyup.enter="handleQuery" />
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
        </el-form>{{ dialogVisible }}
        <el-row :gutter="10">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleadd">
                    new group permision
                </el-button>
            </el-col>
        </el-row>
        <div>
            <!-- Table Header -->
            <tableHeader :isDark="isDark" buttonColor="#626aef" deleteButtonColor="red" :selectedRows="selectedRows"
                :buttonsConfig="headers" :buttons="{ new: true, edit: true, expand: true, delete: true, filter: true }"
                :handleAdd="handleAdd" :handleUpdate="handleUpdate" :toggleExpandAll="toggleExpandAll"
                :handleDelete="handleDelete" :showSearch="showSearch" @toggleFilter="showSearch = !showSearch"
                :permissions="{ new: 'system:user:add', edit: 'system:user:edit', delete: 'system:post:remove' }" />
        </div>

        <div>
            <!-- Here is the table You will need to specify the data hadling here add classes and so on -->
            <ReusableTable :data="permList" :columns="tableColumns" rowKey="groupId" :loading="loading"
                :refreshTable="refreshTable" :default-expand-all="isExpandAll"
                :handleSelectionChange="handleSelectionChange" :handleAdd="handleAdd" :handleUpdate="handleUpdate"
                :handle_SideDelete="handle_SideDelete" :openDetails="openDetails" popUpTitle="Test"
                :columnPopUp="columnPopUp" columnLabel="hello" :rowClassChecker="rowClassChecker"
                :buttonsConfig="tablebuttons" @open-popup="handleOpenPopup" />
        </div>
        <div>
            <PopupColumn v-model:visible="columnVisible" :buttonsConfig="tablebuttons" :selectedPerm="selectedItem"
                :popUpTitle="popUpTitle" :columnPopUp="columnPopUp" :handleAdd="handleAdd" :handleUpdate="handleUpdate"
                :handle_SideDelete="handleDelet">
            </PopupColumn>
        </div>

        <div>
            <PhoneTablePopUp :visible="dialogVisible" dialog-title="Detailed" @close="closeDialog" :rowData="mobileView"
                :fieldsConfig="tableColumns" :buttonsConfig="buttonsConfig" :handleAdd="handleAdd"
                :handleUpdate="handleUpdate" :handle_SideDelete="handle_SideDelete">
            </PhoneTablePopUp>
        </div>


        <addoredit :open="open" :mode="mode" :title="title" :init="mode === 'add' ? initialValuesAdd : initialValuesEdit"
            :fields="fields" @close="closeAddEdit" @submit="onsubmit" :rules="rules">
        </addoredit>



    </div>
</template>
<script>
import PopupColumn from "/src/views/components/defaultTable/columnPopup"
import ReusableTable from "@/views/components/defaultTable"
import PhoneTablePopUp from "@/views/components/PopUpFields/index.vue"
import tableHeader from "@/views/components/headerAndfooter/tableHeader"
import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
import { treeTransformerTwoValues } from '@/utils/dTransformer'
export default {
    components: {
        addoredit,
        PopupColumn,
        ReusableTable,
        PhoneTablePopUp,
        tableHeader

    },

    data() {
        return {
            selectedRows: [],
            columnVisible: false,
            selectedItem: [],
            buttonsConfig: null,
            columnPopUp: [],
            mobileView: [],
            loading: true,
            tableColumns: [],
            popUpTitle: null,
            refreshTable: true,
            mode: 'add',
            open: false,
            title: "permision",
            dialogVisible: false,
            selectedPerm: null,
            init: undefined,
            multipleSelection: [],
            initialValuesAdd: {},
            initialValuesEdit: undefined,
            options: [],
            permList: [],
            tablebuttons: [],
            form: {},
            Statusoptions: [0, 1],
            queryParams: {
                name: undefined,
                status: undefined,
                permId: undefined,
                pageNo: 1,
                pageSize: 0
            },
            fields: [
                { "inputtype": "treeselect", inputtype: "treeselect", name: "parentId", label: "parent name", data: [], placeholder: "Enter the permision name", span: "col-6" },
                { "inputtype": "input", inputtype: "text", name: "name", label: "name", placeholder: "Enter the permision name", span: "col-6" },
                { "inputtype": "input", inputtype: "number", name: "orderNum", label: "orderNum", placeholder: "Enter the permision orderNum", span: "col-6" },
                // { "type": "select", inputtype: "select", name: "status", label: "status", placeholder: "Enter the permision status", data: [{ value: 0, label: 'active' }, { value: 1, label: 'deactive' }], span: "col-6" },
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
                { "inputtype": "input", inputtype: "text", name: "remark", label: "remark", placeholder: "Enter the permision remark", span: "col-6" },


            ]
            ,
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
        this.getlist()
        this.getoptions()
        this.table()
    },


    methods: {

        //********************************table***************************************************************************************
        // rowClassChecker({ row }) {
        //     if (row.children && row.children.length > 0) {
        //         return 'greenClass';
        //     }
        // },
        table() {
            this.tableColumns = [
                { type: 'select' },
                { prop: 'name', label: 'Name', minWidth: '150', fixed: 'left', show: true },
                // { label: 'Order', prop: 'orderNum' },
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
                { label: 'Permission', parent: 'perms', type: 'tagPopup', align: 'center', insideKey: 'perms', name: 'name', minWidth: '330', click: this.handleOpenPopup },
                // { label: 'Icon', prop: 'icon', minWidth: '100', type: 'icon' },
                { label: 'ADD By', prop: 'createByName', minWidth: '110' },
                { prop: 'createTime', label: 'Create Date', type: 'calendar', minWidth: '110' },
                { label: 'Updated By', prop: 'updateByName', minWidth: '110' },
                { prop: 'updateTime', label: 'Last Update Time', minWidth: '110' },
                { type: 'actions', label: 'Operation', minWidth: '110', fixed: 'right', align: 'right', show: true },

            ]

            this.tablebuttons =
                [
                    // {
                    //     add: true,
                    //     prop: 'type',
                    //     value: 0,
                    // },
                    {
                        edit: true,
                    },
                    {
                        delete: true,
                    },
                    {
                        view: true,
                    }
                ];
        },
        //************************Column PopUp********************************** */
        handleOpenPopup(selectedData) {
            console.log(selectedData)
            this.selectedItem = selectedData;
            this.columnPopUp = [
                { label: 'Name:', prop: 'name' },
                { label: 'Functionality:', prop: 'func' },
                { label: 'Remakes:', prop: 'name' },
                { label: 'ADD By:', prop: 'createByName' },
                { prop: 'createTime', label: 'Create Date:' },
                { label: 'Updated By:', prop: 'updateByName' },
                { prop: 'updateTime', label: 'Last Update Time:' }
            ]
            this.columnVisible = true;
        },
        handeltagclick(val) {
            //When using the pop up  inside the columns please don't forget to add the closing method
            this.$emit('open-popup', val);
        },
        //**********************PopUp*************************************************** */
        openDetails(row) {
            this.mobileView = row;
            console.log(row)
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
        //********************************************************************* */

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
                console.log(row.menuId, row.name); // logs the deptId and name of each selected row
            });
        },
        //***************************************************************************** */

        getoptions() {

            this.$http.grpermision.permlistHierarchy({
                "pageNo": 1,
                "pageSize": 0
            }).then(res => {
                console.log(res)
                const data = res?.result?.data
                if (data) {
                    this.options = treeTransformerTwoValues(data, 'name', 'groupId')

                }
                console.log(this.options)

            })

        },

        getlist() {
            this.loading = true
            this.$http.grpermision.permlistHierarchy(this.queryParams).then(res => {
                const data = res?.result?.data
                this.permList = data
                console.log(data)
                this.loading = false
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
            this.initialValuesEdit = row

            this.open = true
        },
        handleAdd(row) {

            if (row.groupId != undefined) {

                this.initialValuesAdd = { "delFlag": 0, "parentId": row.groupId }
            }
            else {
                this.initialValuesAdd = { "delFlag": 0 }
            }
            this.mode = "add"
            this.fields[0].data = this.options
            this.open = true

        },
        // handleDelet(row) {
        //     const { groupId } = row
        //     console.log(groupId)
        //     this.$http.grpermision.deletDeper(groupId).then(_ => {
        //         ElMessage({
        //             message: ` permition.${this.mode} success`,
        //             type: 'success',
        //         })
        //         this.dialogVisible = false
        //         this.getlist()
        //     })

        // },

        handleDelete(row) {
            const { groupId } = row
            //     console.log(groupId)
            this.$modal.confirm('Are you sure you want to delete the data of permision/Tasks with the name "' + row.name + '"?').then(() => {
                return this.$http.grpermision.deletDeper(row.taskId);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("Deletion successful");
            }).catch(() => { });

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

                this.$http.grpermision.addDeper(this.form).then(_ => {
                    ElMessage({
                        message: ` permition.${this.mode} success`,
                        type: 'success',
                    })
                    this.getlist()
                })

            }
            else {

                this.$http.grpermision.editDeper(this.form).then(_ => {
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
