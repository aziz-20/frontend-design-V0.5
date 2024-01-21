<template>
  <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" class="demo-form-inline"
    v-show="displaySearch">
    <el-form-item v-for="(field, index) in fields" :key="index" :label="field.label">
      <template v-if="shouldShowField(field)">
        <template v-if="field.type === 'tree-select'">
          <el-tree-select v-model="queryParams[field.name]" :size='field.size || "small"' :data="field.data" filterable
            :style="field.style" check-strictly check-on-click-node>
          </el-tree-select>
        </template>
        <template v-else-if="field.inputtype === 'switch'">
          <el-switch v-model="queryParams[field.name]" :data="field.switchData" class="ml-2" inline-prompt
            :style="{ '--el-switch-on-color': field.switchOnColor, '--el-switch-off-color': field.switchOffColor }"
            :active-text="field.activeText" :inactive-text="field.inactiveText" :active-value="field.activeValue"
            :inactive-value="field.inactiveValue" :size='field.size || "small"'>
          </el-switch>
        </template>
        <template v-if="field.inputtype === 'selectV'">
          <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="field.data"
            :multiple="field.multiple" collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
            :size='field.size || "small"' />
        </template>
        <!-- <template v-if="field.inputtype === 'StatusSelect'">
          <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="field.data"
            style="width: 240px" :multiple="field.multiple" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
        </template> -->
        <template v-if="field.inputtype === 'StatusSelect'">
          <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="statuses"
            :size='field.size || "small"' collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
          {{ this.role }}
        </template>
        <template v-else-if="field.inputtype === 'data-picker'">
          <el-date-picker v-model="queryParams[field.name]" :size='field.size || "small"' :style="field.style"
            value-format="yyyy-MM-dd" start-placeholder="Please add the data"></el-date-picker>
        </template>

        <!-------------------------------------------------------------------------------------  -->
        <!-- System Fields selections -->

        <!--Department Selecting Section -->
        <template v-if="field.inputtype === 'departments'">
          <el-tree-select v-model="queryParams[field.name]" :data="field.name === 'deptId' ? department : leaders"
            :render-after-expand="true" :placeholder="field.placeholder" :size='field.size || "small"' check-strictly
            check-on-click-node filterable />
        </template>

        <!-- Roles Selecting Section -->
        <template v-if="field.inputtype === 'roles'">
          <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="roles"
            :size='field.size || "small"' collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
          {{ this.role }}
        </template>
        <!-- Position Selecting Section -->
        <template v-if="field.inputtype === 'Position'">
          <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder"
            :options="field.name === 'abbrev' ? abbrev : Position" :size='field.size || "small"' collapse-tags
            collapse-tags-tooltip :max-collapse-tags="3" filterable />
        </template>

        <!-- Menu Selecting Section -->
        <template v-if="field.inputtype === 'menu'">
          <el-tree-select v-model="queryParams[field.name]" :data="menu" :render-after-expand="true"
            :placeholder="field.placeholder" filterable check-strictly check-on-click-node
            :size='field.size || "small"' />
          <!-- {{ 'the data is as follows:' + this.form[field.name] }} -->
        </template>
        <!-----------------------------User Name-------------------- -->
        <template v-if="field.inputtype === 'userField'">
          <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder"
            :options="field.name === 'userId' ? username : email" :size='field.size || "small"' collapse-tags
            collapse-tags-tooltip :max-collapse-tags="3" filterable />
        </template>

        <!-- Task fields -->
        <template v-if="field.inputtype === 'tasks'">
          <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="taskname"
            :size='field.size || "small"' collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
          <!-- {{ this.role }} -->
        </template>

        <!-------------------------------------------- --------------------------------------------- -->
      </template>

    </el-form-item>

    <!-- Move to the next row for search and reset buttons -->
    <el-form-item class="center-buttons">
      <el-button @click="handleQuery" :icon="Search" size="small">{{ searchButtonText }}</el-button>
      <el-button @click="resetQuery" :icon="Search" size="small">{{ resetButtonText }}</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject } from '@/utils/dtControl/dTransformer'
export default {

  props: {
    options: {
      type: Array,
      required: true
    },
    displaySearch: Boolean,
    fields: Array,
    queryParams: Object,
    hierarchicalData: Array, // New prop for hierarchical data
    handleQuery: Function,
    resetQuery: Function,
    searchButtonText: String,
    resetButtonText: String,
    searchIcon: String,
    resetIcon: String,
  },
  data() {
    return {
      //Roles
      roles: [],

      //Job Managements 
      Position: [],
      abbrev: [],

      // Departments Managements
      department: [],
      leaders: [],

      //Menu Managements 
      menu: [],

      //UserManagements
      username: [],
      email: [],

      //Tasks
      taskname: [],


      days: [],
      statuses: [
        { label: 'ALL', value: '' },
        { label: 'Enabled', value: '0' },
        { label: 'Disabled', value: '1' }
      ],
    }
  },
  mounted() {
    this.formFieldSelectData()

  },
  methods: {
    shouldShowField(field) {
      // console.log(this.mode)
      if (field.showMode === this.mode || !field.showMode) {
        console.log(field)
        return true
      }
      return false
    },
    calculateSpan(field) {
      return this.shouldShowField(field) ? (field.span || 12) : 0;
    },
    formFieldSelectData() {
      this.fields.forEach(field => {
        //Please add all your APIS here and make new select method for each and everyone of them 
        // Check if the field should be included in the data to be sent
        if (this.shouldShowField(field)) {
          console.log("Searching")
          if (field.inputtype === 'departments') {
            this.$http.dept.DeptlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                this.department = treeTransformerTwoValues(res.result.data, 'name', 'deptId');
                this.leaders = mapOnePropToObject(res.result.data, 'leader');
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load department list for the selection section');
              }
            });
          }
          if (field.inputtype === 'Position') {
            console.log("I am here")
            this.$http.Job.listJob({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.Position = NormalmapTwoPropsToObject(res.result.data, 'name', 'jobId');
              // this.PositionCode=mapOnePropToObject(res.result.data, '')
              this.abbrev = mapOnePropToObject(res.result.data, 'abbrev')

            }).catch(error => {
              console.error(error);
            });
          }
          if (field.inputtype === 'roles') {
            console.log("I am here")
            this.$http.role.listRole({ "pageNo": 1, "pageSize": 0 }).then(res => {
              console.log(res)
              if (Array.isArray(res.result.data)) {
                this.roles = NormalmapTwoPropsToObject(res.result.data, 'name', 'roleId');
                // this.fields.options = this.mapFieldValues(field, this.roles);
              } else {
                console.error('res.result.data is not an array');
              }
            })

          }
          if (field.inputtype === 'DaysWeek') {
            console.log("I am in")
            this.$http.daysControl.daysList({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.days = mapOnePropToObject(res.result.data, 'name', 'dayId');
              console.log(days)
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'userField') {
            this.$http.MgUsers.listUsers({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                this.username = NormalmapTwoPropsToObject(res.result.data, 'username', 'userId'),
                  this.email = mapOnePropToObject(res.result.data, 'email');
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load Job list for the selection section');
              }
            });
          }
          if (field.inputtype === 'menu') {
            this.$http.menu.MenuHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                this.menu = mapOnePropToObject(res.result.data, 'name', 'menuId')
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load Menu list for the Quarry Selection Section');
              }
            });
          }
          if (field.inputtype === 'tasks') {
            console.log("I am in")
            this.$http.taskControl.listTask({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.taskname = mapOnePropToObject(res.result.data, 'taskName', 'taskId');
              console.log(days)
            }).catch(message => {
              // console.error(error);
            });
          }
        }
      });

    },
  }


}


</script>

<style scoped>
/* Center the buttons in the next row */
.center-buttons {
  text-align: center;
  margin-top: 10px;
  /* Adjust the margin as needed */
}
</style>



