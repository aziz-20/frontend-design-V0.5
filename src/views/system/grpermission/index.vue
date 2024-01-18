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
        <el-table @selection-change="handleSelectionChange" style="width: 100%" :data=permList row-key="groupId"
            default-expand-all v-loading="loading" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="name" column-key="defId" width="200" />
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
            <el-table-column prop="perms" label="permitions" width="300" aria-label="prems" column-key="permId">
                <template #default="{ row, column, $index }">
                    <el-tag class="tagpoint" v-for="perm in row.perms" :key="perm.permId" closable
                        @click="handeltagclick(perm)" disable-transitions>
                        {{ perm.name }}
                    </el-tag>
                </template>
            </el-table-column>


            <el-table-column label="oparation" align="center" width="500">
                <template #default="{ row, column, $index }">
                    <el-button size="small" type="primary" icon="el-icon-add" @click="handleadd(row)">add</el-button>
                    <el-button size="small" icon="el-icon-edit" @click="handleUpdate(row)">edit</el-button>
                    <el-button size="small" type="danger" icon="el-icon-edit" @click="handleDelet(row)">delet</el-button>


                </template>
            </el-table-column>
        </el-table>
        <div class='row-b margin-top-20'>

        </div>
        <addoredit :open="open" :mode="mode" :title="title" :init="mode === 'add' ? initialValuesAdd : initialValuesEdit"
            :fields="fields" @close="closeAddEdit" @submit="onsubmit" :rules="rules">
        </addoredit>
        <el-dialog :model-value="dialogVisible" title="Permission Details" :visible="dialogVisible"
            @close="dialogVisible = false">
            <!-- Display details of the selected permission inside the dialog -->

            <div v-if="selectedPerm">
                <p><strong>Name:</strong> {{ selectedPerm.name }}</p>
                <p><strong>ID:</strong> {{ selectedPerm.permId }}</p>

                <!-- Add more details as needed -->
            </div>
        </el-dialog>



    </div>
</template>
<script>

import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
import { treeTransformerTwoValues } from '@/utils/dTransformer'
export default {
    components: {
        addoredit
    },

    data() {
        return {
            loading: true,
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

    },


    methods: {

        handeltagclick(val) {
            console.log(val)
            this.selectedPerm = val;
            this.dialogVisible = true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val

        },


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
        handleadd(row) {

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
        handleDelet(row) {
            const { groupId } = row
            this.$http.grpermision.deletDeper(groupId).then(_ => {
                ElMessage({
                    message: ` permition.${this.mode} success`,
                    type: 'success',
                })
                this.getlist()
            })

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
