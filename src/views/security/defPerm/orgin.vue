<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" @submit.prevent="handleQuery">
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
        </el-form>
        <el-row :gutter="10">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleadd">
                    new default permision
                </el-button>
            </el-col>
        </el-row>
        <el-table  :row-class-name="tableRowClassName" :data=permList row-key="defId" default-expand-all v-loading="loading"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
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
            <el-table-column label="oparation" align="center" class-name="small-padding fixed-width">
                <template #default="{ row, column, $index }">
                    <el-button size="small"  icon="el-icon-edit" @click="handleUpdate(row)">edit</el-button>
                    <el-button size="small" type="danger" icon="el-icon-edit" @click="handleDelet(row)">delet</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='row-b margin-top-20'>
            <el-col :span="24">
                <el-button type="primary" size="mini"
                    @click="handleapplyChange">applyChange</el-button>
                <el-button  size="mini" @click="resetFactory">resetFactory</el-button>
            </el-col>
        </div>
        <addoredit :open="open" :mode="mode" :title="title" :init="mode === 'add' ? initialValuesAdd : initialValuesEdit"
            :fields="fields" @close="closeAddEdit" @submit="onsubmit" :rules="rules">
        </addoredit>


    </div>
</template>
<script>

import addoredit from "@/views/components/addoredit/index.vue"
import { ElMessage } from 'element-plus'
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
            init: undefined,
            initialValuesAdd: {},
            initialValuesEdit: undefined,
            permList: [],
            form: {},
            Statusoptions: [0, 1],
            queryParams: {
                name: undefined,
                status: undefined,
                pageNo: 1,
                pageSize: 0
            },
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

        this.getlist()

    },

    methods: {

        tableRowClassName({ row, rowIndex }) {
      
            if (row.applyAdd === 0) {
                return 'warning-row';
            }
            return '';
        },


        getlist() {
            this.loading = true
            this.$http.defpermision.permlist(this.queryParams).then(res => {
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
        handleDelet(row) {
            const { defId } = row
            this.$http.defpermision.deletDeper(defId).then(_ => {
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
