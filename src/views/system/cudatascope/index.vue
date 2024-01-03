<template>
    <div class="app-container">

        <div class="flex" v-if="showSearch">
            <search_control ref="form" :displaySearch="true" :fields="searchFields" :queryParams="queryParams"
                :hierarchicalData="transNameList" :handleQuery="handleQuery" :resetQuery="resetqueary"
                :searchButtonText="searchButtonText" :resetButtonText="resetButtonText" :searchIcon="searchIcon"
                :resetIcon="resetIcon">
            </search_control>
        </div>
        <el-row :gutter="10">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleadd">
                    new custom data scope
                </el-button>
            </el-col>
        </el-row>
        <el-table @selection-change="handleSelectionChange" style="width: 100%" :data=DatascopeList row-key="groupId"
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
            <el-table-column prop="perms" label="permissions" width="300" aria-label="prems" column-key="permId">
                <template #default="{ row, column, $index }">
                    <el-tag class="tagpoint" v-for="perm in row.perms" :key="perm.permId" closable
                        @click="handeltagclick(perm)" disable-transitions>
                        {{ perm.name }}
                    </el-tag>
                </template>
            </el-table-column>


            <el-table-column fixed="right" label="oparation" align="center" width="150">
                <template #default="{ row, column, $index }">

                    <el-button size="small" icon="el-icon-edit" @click="handleUpdate(row)">edit</el-button>
                    <el-button size="small" type="danger" icon="el-icon-edit" @click="handleDelet(row)">delet</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='row-b margin-top-20'>

        </div>
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



    </div>
</template>
<script>

import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
import { treeTransformerTwoValues } from '@/utils/dTransformer'
import search_control from '@/views/components/qureyParams/index.vue'
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
        search_control

    },

    data() {
        return {
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
                pageSize: 0
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
                    "inputtype": "dynamicFeild", data: {
                        Dept: undefined, userIds: undefined
                    }, inputtype: "dynamicFeild", name: "scopping", placeholder: "Enter the permision remark", span: "col-6"
                },
                { "type": "textarea", inputtype: "textarea", name: "remark", label: "remark", placeholder: "Enter the permision remark", span: "col-6" },


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

        getlist() {
            this.loading = true
            this.$http.cusdatascope.customDatascopelist
            this.$http.cusdatascope.customDatascopelist(this.queryParams).then(res => {
                const data = res?.result?.data
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
        handleadd(row) {


            this.initialValuesAdd = { "delFlag": 0, }
            this.mode = "add"
            this.open = true

        },
        handleDelet(row) {
            const { customId } = row
            console.log(customId)

            this.$http.cusdatascope.delet(customId).then(_ => {
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
