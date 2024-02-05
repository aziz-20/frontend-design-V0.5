<template>
  <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" class="query-form-container"
    v-show="displaySearch">
    <div class="queryParams-container">
      <el-form-item v-for="(field, index) in fields" :key="index">
        <div class="queryParams-label">{{ field.label }}
          <div class="queryParams-field">
            <template v-if="shouldShowField(field)">
              <template v-if="field.type === 'tree-select'">
                <el-tree-select v-model="queryParams[field.name]" :size='field.size || "width:250px"' :data="field.data"
                  filterable check-strictly check-on-click-node>
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
                <el-date-picker v-model="queryParams[field.name]" value-format="yyyy-MM-dd"
                  start-placeholder="Please add the data"></el-date-picker>
              </template>
              <template v-else-if="field.inputtype === 'text'">
                <el-input v-model="queryParams[field.name]" :placeholder="field.placeholder" :size='field.size || "small"'
                  clearable />
              </template> 

              <!-------------------------------------------------------------------------------------  -->
              <!-- System Fields selections -->

              <!--Department Selecting Section -->
              <template v-if="field.inputtype === 'departments'">
                <el-tree-select v-model="queryParams[field.name]"
                  :data="field.deptemail ? deptemail : (field.deptparent ? deptparent : department)"
                  :render-after-expand="true" :placeholder="field.placeholder" check-strictly check-on-click-node
                  filterable />
              </template>
               <!--permissionGroup Selecting Section -->
              <template v-if="field.inputtype === 'permissionGroup'">
                        <el-tree-select v-model="queryParams[field.name]" :data="permissionGroup" :render-after-expand="true"
                          :placeholder="field.placeholder"  filterable check-strictly check-on-click-node />
              </template>
              <!--permissionGroup name tree Selecting Section -->
              <template v-if="field.inputtype === 'permissionGroupname'">
                <el-tree-select v-model="queryParams[field.name]" :data="permissionGroupname" :render-after-expand="true"
                  :placeholder="field.placeholder"  filterable check-strictly check-on-click-node />
              </template> 

             

              <!-- Roles Selecting Section -->
              <template v-if="field.inputtype === 'roles'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="roles"
                  collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
              </template>
               <!-- Permission Selecting Section -->
              <template v-if="field.inputtype === 'permission'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="permission"
                  collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
              </template>
              <!-- defaultpermission Selecting Section -->
              <template v-if="field.inputtype === 'defaultpermission'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="defaultpermission"
                  collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
              </template>
              <!-- Custompersmission Selecting Section -->
              <template v-if="field.inputtype === 'Custompersmission'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="Custompersmission"
                  collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
              </template>
              <!-- Position Selecting Section -->
              <template v-if="field.inputtype === 'Position'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder"
                  :options="field.name === 'abbrev' ? abbrev : Position" collapse-tags collapse-tags-tooltip
                  :max-collapse-tags="3" filterable />
              </template>

              <!-- Menu Selecting Section -->
              <template v-if="field.inputtype === 'menu'">
                <el-tree-select v-model="queryParams[field.name]" :data="menu" :render-after-expand="true"
                  :placeholder="field.placeholder" filterable check-strictly check-on-click-node />
                <!-- {{ 'the data is as follows:' + this.form[field.name] }} -->
              </template>
              <!-- Menu Name vs ID Selecting Section -->
              <template v-if="field.inputtype === 'menuNameId'">
                <el-tree-select v-model="queryParams[field.name]" :data="menuNameId" :render-after-expand="true"
                  :placeholder="field.placeholder"  filterable check-strictly check-on-click-node />
              </template>
              <!-----------------------------User Name-------------------- -->
              <template v-if="field.inputtype === 'userField'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder"
                  :options="field.email ? email : username" collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
                  filterable />
              </template>

              <!-- Task fields -->
              <template v-if="field.inputtype === 'tasks'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="taskname"
                  collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
                <!-- {{ this.role }} -->
              </template>
              <template v-if="field.inputtype === 'taskLog'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder"
                  :options="field.taskGroup ? taskgroup : taskLogs" collapse-tags collapse-tags-tooltip filterable
                  :max-collapse-tags="3" />
                <!-- {{ this.role }} -->
              </template>
              <template v-if="field.inputtype === 'address'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder"
                  :options="field.state === true ? state : countries" collapse-tags collapse-tags-tooltip filterable
                  :max-collapse-tags="3" />
              </template>
              <template v-if="field.inputtype === 'state'">
                <el-select-v2 v-model="queryParams[field.name]" :placeholder="field.placeholder" :options="state"
                  collapse-tags collapse-tags-tooltip filterable :max-collapse-tags="3" />
              </template>
              <!-------------------------------------------- --------------------------------------------- -->
            </template>
          </div>
        </div>
      </el-form-item>
      <!-- Move to the next row for search and reset buttons -->
      <div class="queryParams-buttons">
        <el-icon :color="'darkgreen'" color="'blue'" @click="handleQuery" size="20">
          <Search />
        </el-icon>
        <el-icon @click="emptyFields" :icon="Search" size="20" :color="'blue'">
          <Refresh />
        </el-icon>
        <el-icon @click="resetQuery" size="20" :color="'silver'">
          <Loading />
        </el-icon>
      </div>
    </div>

    <!-- <el-icon><Loading /></el-icon> -->
  </el-form>
  <!-- <el-button @click="handleQuery" :icon="Search" size="small">{{ searchButtonText }}</el-button>
        <el-button @click="resetQuery" :icon="Search" size="small">{{ resetButtonText }}</el-button> -->
</template>

<script>
import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject } from '@/utils/dtControl/dTransformer'
import countriesAndregions from '@/utils/Countries&Regions/data'
console.log(countriesAndregions)
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
    emptyFields: Function,
  },
  data() {
    return {
      //Roles
      roles: [],
      state: [],
      countries: [],
      taskLogs: [],
      taskgroup: [],
      deptemail: [],
      deptparent: [],
  
      

      //Permission
      permission: [],
      permissionGroup: [],
      permissionGroupname: [],
      defaultpermission:[],
      Custompersmission :[],

      //Job Managements 
      Position: [],
      abbrev: [],

      // Departments Managements
      department: [],
      leaders: [],

      //Menu Managements 
      menu: [],
      menuNameId: [],

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
  // mounted() {
  //   this.formFieldSelectData()

  // },
  created() {
    this.formFieldSelectData()
  },
  // beforeMount() {
  //   this.formFieldSelectData()
  // },
  // beforeMount() {
  //   this.formFieldSelectData()
  // },
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
              console.log(res)
              if (field.deptemail) {
                this.deptemail = mapOnePropToObject(res.result.data, 'email')
              }
              if (field.deptparent) {
                this.deptparent = treeTransformerTwoValues(res.result.data, 'parentName', 'parentId')
              }
              this.department = treeTransformerTwoValues(res.result.data, 'name', 'deptId');
            }).catch(message => {
              console.message(error);
            });
          }
          if (field.inputtype === 'permission') {
            this.$http.permision.permlist({ "pageNo": 1, "pageSize": 0 }).then(res => {
              const data = res?.result?.data
              if (data) {
                this.permission = treeTransformerTwoValues(data, 'name', 'name')
                
              }
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'defaultpermission') {
            this.$http.defpermision.permlist({ "pageNo": 1, "pageSize": 0 }).then(res => {
              const data = res?.result?.data
              if (data) {
                this.defaultpermission = treeTransformerTwoValues(data, 'name', 'name')
                
              }
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'Custompersmission') {
            this.$http.cusdatascope.customDatascopelist({ "pageNo": 1, "pageSize": 0 }).then(res => {
              const data = res?.result?.data
              if (data) {
                this.Custompersmission = treeTransformerTwoValues(data, 'name', 'name')
                
              }
            }).catch(message => {
              console.error(error);
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
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'roles') {
            console.log("I am here")
            this.$http.role.listRole({ "pageNo": 1, "pageSize": 0 }).then(res => {
    
              if (Array.isArray(res.result.data)) {
                this.roles = NormalmapTwoPropsToObject(res.result.data, 'name', 'roleId');
                // this.fields.options = this.mapFieldValues(field, this.roles);
              } else {
                console.error('res.result.data is not an array');
              }
            }).catch(message => {
              console.error(error);
            });

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
              if (field.username) {
                this.username = NormalmapTwoPropsToObject(res.result.data, 'username', 'userId')
              }
              if (field.email) {
                this.email = mapOnePropToObject(res.result.data, 'email');
              }
              // else {
              //   this.loading = false;
              //   this.$message.error('Failed to load Job list for the selection section');
              // }
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'menu') {
            this.$http.menu.MenuHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                this.menu = mapOnePropToObject(res.result.data, 'name', 'menuId')
                console.log(this.menu)
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load Menu list for the Quarry Selection Section');
              }
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'menuNameId') {
            this.$http.menu.MenuHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                this.menuNameId = treeTransformerTwoValues(res.result.data, 'name', 'menuId')
                console.log(this.menuNameId)
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load Menu list for the Quarry Selection Section');
              }
            }).catch(message => {
              console.error(error);
            });
          }
          if (field.inputtype === 'tasks') {
            console.log("I am in")
            this.$http.taskControl.listTask({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.taskname = mapOnePropToObject(res.result.data, 'taskName', 'taskId');
              console.log(taskname)
            }).catch(message => {
              // console.message(message);
            });
          }
          if (field.inputtype === 'taskLog') {
            console.log("I am in")
            this.$http.taskControl.listTaskLogs({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (field.taskName) {
                this.taskLogs = mapOnePropToObject(res.result.data, 'taskName', 'taskId');
                console.log(this.taskLogs)
              }
              if (field.taskGroup) {
                // const taskgroup=[]
                this.taskgroup = mapOnePropToObject(res.result.data, 'taskGroup', 'taskGroup');
                console.log(this.taskgroup)
              }

            }).catch(message => {
              // console.message(message);
            });
          }
          if(field.inputtype === 'permissionGroup' || field.inputtype === 'permissionGroupname'){
            this.$http.grpermision.permlistHierarchy({
                "pageNo": 1,
                "pageSize": 0
            }).then(res => {
                const data = res?.result?.data
                if (data) {
                    this.permissionGroup = treeTransformerTwoValues(data, 'name', 'groupId')
                    this.permissionGroupname = mapOnePropToObject(data, 'name', 'name')

                }


            }).catch(message => {
                console.error(error);
            });
          }
          if (field.inputtype === 'address') {
            console.log("countries")
            if (field.country) {
              this.countries = countriesAndregions.map(country => {
                return {
                  label: country.countryName,
                  value: country.countryName
                };
              });
            }
            if (field.state) {
              this.state = countriesAndregions.flatMap(country => {
                return country.regions.map(region => {
                  return {
                    label: region.name,
                    value: region.name
                  };
                });
              });
            }
            console.log(this.state);
          }
          // if (field.inputtype === 'countries') {
          //   console.log("I am in")
          //   this.$http.address.addAddress({ "pageNo": 1, "pageSize": 0 }).then(res => {
          //     if(field.country){
          //       this.countries = mapOnePropToObject(res.result.data, 'taskName', 'taskId');
          //     }
          //     if(field.city){
          //       this.countries = mapOnePropToObject(res.result.data, 'taskName', 'taskId');
          //     }
          //     if(field.state){
          //       this.countries = mapOnePropToObject(res.result.data, 'taskName', 'taskId');
          //     }
          //     console.log(days)
          //   }).catch(message => {
          //     // console.error(error);
          //   });
          // }
        }
      });

    },
  }


}


</script>

<style scoped>
/* Center the buttons in the next row */

.queryParams-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;

}

.queryParams-buttons {
  display: flex;
  align-self: center;
  /* margin-left: -50px; */
}

.queryParams-field {
  display: flex;
  width: 200px;

}

.queryParams-label {
  margin-right: 1%;
  /* margin-right: -20px; */
}

/* Responsive Design: Adjustments for smaller screens */
@media (max-width: 700px) {
  .queryParams-container {
    display: block;
  }

  .queryParams-field {
    /* width: 100% */
    min-width: 50%;
  }

  .queryParams-buttons {
    display: flex;
    align-self: center;
    justify-content: center;

  }
}
</style>



