<template>
 
  <el-dialog ref="form" :before-close="beforeclose" :model-value="visble" :title="`${title}`"
    :visible.sync="open" :width="'68%'" :closed="closemodel" :modal-class="'editAdd'">
    <el-form :class="'col-12'" :model="form" ref="editForm" :rules="ru" label-position="top">
      <el-row :class="'col-12'" :gutter="24" flex flex-direction="column">
        <el-col :class="'col-12 row-s'" :span="calculateSpan(field)" v-for="(field, index) in fields" :key="index">
          <!-- <template v-if="1"> -->
          <template v-if="shouldShowField(field)">
            <template v-if="field.type !== 'address'">
              <el-form-item :label="field.label" :prop="field.prop" :style="field.style">
                <template v-if="field.inputtype === 'email'">
                  <el-input :type="'email'" v-model="form[field.name]" :placeholder="field.placeholder" size="default" />
                </template>
                <template v-else-if="field.inputtype === 'text'">
                  <el-input :type="'text'" v-model="form[field.name]" :placeholder="field.placeholder" size="default"
                    :suffix-icon="field.icon ?? ''" />
                </template>
                <template v-else-if="field.inputtype === 'upload'">
                  <el-upload v-model:fileList="form[field.name]" class="upload-demo" :action="field.action"
                    :on-preview="handlePreview" :on-remove="handleRemove" :beforeUpload="field.beforeUpload"
                    :list-type="field.listType" :auto-upload="field.autoUpload" :limit="field.limit">
                    <el-button type="primary"> {{ field.buttonText || "Click to upload" }}</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        {{ field.tip
                          || "Please Enter A tip If exist if not pleas lef the (tip) empty to stop the message" }}
                      </div>
                    </template>
                  </el-upload>
                </template>

                <template v-else-if="field.inputtype === 'selectBoxField'">
                  <el-input placeholder="Please enter keyword" @input="onQueryChanged" />
                  <el-tree v-model="form[field.name]" :data="field.data" :filter-method="filterMethod"
                    :style="{ height: '200px', width: '100%' }" check-strictly check-on-click-node show-checkbox multiple
                    :default-expanded-keys="generateDefaultExpandedKeys(field.data)" />
                  {{ form[field.name] }}
                </template>
                <!-- Password Fields -->
                <template v-else-if="field.inputtype === 'password'">
                  <el-input :type="'password'" v-model="form[field.name]" :placeholder="field.placeholder"
                    size="default" />
                </template>
                <template v-else-if="field.inputtype === 'verifyPassword'">
                  <el-form-item :label="field.label" :prop="field.name" :rules="verifyPasswordRule()">
                    <el-input :type="'password'" v-model="verifyPassword" :placeholder="field.placeholder"
                      size="default" />
                  </el-form-item>
                </template>

                <template v-else-if="field.inputtype === 'confirm'">
                  <el-row :class="field.row" :span="12" flex>
                    <el-input :type="'password'" v-model="form[field.name]" :placeholder="field.placeholder"
                      :span="field.span" size="default" multiple checkbox />
                  </el-row>
                </template>
                <!-- Phone Field -->
                <template v-else-if="field.inputtype === 'phone'">
                  <el-row :class="field.row" :span="12" flex>
                    <el-input type="phone" v-model="form[field.name]" :placeholder="field.placeholder" :span="field.span"
                      size="default" />
                  </el-row>
                </template>

                <!-- Sorting Field -->
                <template v-else-if="field.inputtype === 'sorting'">
                  <el-row :class="field.row" flex>
                    <el-input-number v-model="form[field.name]" :placeholder="field.placeholder" controls-position="right"
                    :min="field.min || 0 " size="default" />
                  </el-row>
                </template>

                <!-- Selection Fields -->
                <template v-else-if="field.inputtype === 'multipleSelect'">
                  <el-tree-select v-model="form[field.name]" :data="field.data" multiple :render-after-expand="false"
                    show-checkbox :placeholder="field.placeholder" check-strictly check-on-click-node filterable />
                  <!-- {{ field.data }} -->
                </template>
                <template v-else-if="field.inputtype === 'selectbox'">
                  <el-tree-select v-model="form[field.name]" :data="field.data" multiple :render-after-expand="false"
                    show-checkbox :placeholder="field.placeholder" check-strictly check-on-click-node filterable
                    :max-collapse-tags="3" />
                  {{ 'the data is as follows:' + field.name }}
                </template>
                <template v-else-if="field.inputtype === 'treeSelect'">
                  <el-tree-select v-model="form[field.name]" :data="field.data" :render-after-expand="true"
                    :placeholder="field.placeholder" check-strictly check-on-click-node filterable />
                  {{ 'the data is as follows:' + this.form[field.name] }}
                </template>
                <template v-else-if="field.inputtype === 'select'">
                  <el-select v-model="form[field.name]" :placeholder="field.placeholder">
                    <el-option v-for="d in field.data" :key="d.value" :label="d.label" :value="d.value"
                      filterable></el-option>
                  </el-select>
                </template>
                <template v-else-if="field.inputtype === 'MSelect'">
                  <el-select v-model="form[field.name]" :placeholder="field.placeholder">
                    <el-option v-for="d in field.data" :key="d.value" :label="d.label" :value="d.value" filterable
                      multiple size="default"></el-option>
                  </el-select>
                </template>
                <template v-if="field.inputtype === 'selectV'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="field.data"
                    style="width: 240px" :multiple="field.multiple" collapse-tags collapse-tags-tooltip
                    :max-collapse-tags="3" />
                </template>
                <!-------------------------------------------------------------------------------------  -->
                <!-- System Fields selections -->

                <!--Department Selecting Section -->
                <template v-else-if="field.inputtype === 'departments'">
                  <el-tree-select v-model="form[field.name]" :data="department" :multiple="field.multiple"
                    :render-after-expand="true" :placeholder="field.placeholder" check-strictly check-on-click-node
                    filterable />
                  <!-- {{ 'the data is as follows:' + this.form[field.name] }} -->
                </template>

                <!-- Roles Selecting Section -->
                <template v-if="field.inputtype === 'roles'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="roles"
                    style="width: 240px" :multiple="field.multiple" collapse-tags collapse-tags-tooltip
                    :max-collapse-tags="3" />
                  <!-- {{ this.role }} -->
                </template>
                <!-- Position Selecting Section -->
                <template v-if="field.inputtype === 'Position'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="Position"
                    style="width: 240px" :multiple="field.multiple" collapse-tags collapse-tags-tooltip
                    :max-collapse-tags="3" />
                </template>
                <!-- Menu Selecting Section -->
                <template v-else-if="field.inputtype === 'menu'">
                  <el-tree-select v-model="form[field.name]" :data="menus" :render-after-expand="true"
                    :placeholder="field.placeholder" check-strictly check-on-click-node filterable
                    :multiple="field.multiple" :show-checkbox="field.showCheckbox" />
                </template>
                <!-- Group permissions -->

                <template v-else-if="field.inputtype === 'gpermision'">
                  {{ console.log(this.GpermsOptions) }}
                  <el-tree-select v-model="form[field.name]" :data="this.GpermsOptions" :render-after-expand="true"
                    :placeholder="field.placeholder" check-strictly check-on-click-node filterable
                    :multiple="field.multiple" :show-checkbox="field.showCheckbox" />
                  {{ console.log(this.GpermsOptions) }}
                </template>


                <!-- CustomData Scop -->
                <template v-if="field.inputtype === 'customDataScop'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="customdata"
                    style="width: 240px" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
                    :multiple="field.multiple || false" :show-checkbox="field.showCheckbox || false" />
                  {{ this.role }}
                </template>


                <!-------------------------------------------- --------------------------------------------- -->
                <template v-else-if="field.inputtype === 'Gender'">
                  <el-select-v2 v-model="form[field.name]" placeholder="Select Gander" :options="gander" />
                  <!-- {{ typeof (field.name) }} -->
                </template>

                <!-- Switch Field -->
                <template v-else-if="field.inputtype === 'switch'">
                  <el-switch v-model="form[field.name]" class="ml-2" inline-prompt
                    :style="{ '--el-switch-on-color': field.switchOnColor, '--el-switch-off-color': field.switchOffColor }"
                    :active-text="field.activeText" :inactive-text="field.inactiveText" :active-value="field.activeValue"
                    :inactive-value="field.inactiveValue">
                  </el-switch>

                  <!-- Text Field -->
                </template>
                <template v-else-if="field.inputtype === 'textarea'">
                  <el-input v-model="form[field.name]" :rows="2" type="textarea" :placeholder="field.placeholder"
                    size="default" />
                </template>
              </el-form-item>
            </template>

            <!-- -------------------------------------------------------------------- -->
            <template v-if="field.inputtype === 'schedule'">
              <el-row :class="'col-12'" :gutter="24" flex flex-direction="column">
                <el-col :class="'col-12 row-s'" flex :span="calculateSpan(subField)"
                  v-for="(subField, index) in field.data" :key="index">
                  <!-- <template v-if="1"> -->
                  <template v-if="shouldShowField(subField)">
                    <el-form-item :label="subField.label">
                      <template v-if="subField.inputtype === 'DaysWeek'">
                        <el-select-v2 v-model="form['schedule'][subField.name]" :placeholder="subField.placeholder"
                          :options="days" style="width: 240px" multiple collapse-tags collapse-tags-tooltip
                          :max-collapse-tags="3" />
                        <!-- {{ typeof (form['schedule'][subField.name]) }} -->
                      </template>
                      <template v-if="subField.inputtype === 'text'">
                        <el-input v-model="form['schedule'][subField.name]"
                          :placeholder="subField.placeholder"></el-input>
                        <!-- {{ "Hello " + form['schedule'][subField.name] }} -->
                      </template>
                      <template v-else-if="subField.inputtype === 'sorting'">
                        <el-row :class="subField.row" flex>
                          <el-input-number v-model="form[field.name]" :placeholder="field.placeholder"
                            controls-position="right" :min="0" size="default" />
                        </el-row>
                      </template>
                    </el-form-item>
                  </template>
                </el-col>
              </el-row>
            </template>

            <template v-if="field.inputtype === 'address'">
              <el-row :class="'col-12'" :gutter="24" flex flex-direction="column">
                <el-col :class="'col-12 row-s'" :span="calculateSpan(subField)" v-for="(subField, index) in field.data"
                  :key="index">
                  <!-- <template v-if="1"> -->
                  <template v-if="shouldShowField(subField)">
                    <el-form-item :label="subField.label">
                      <template v-if="subField.inputtype === 'country'">
                        <el-select v-model="form['address'][subField.name]" placeholder="Select Country"
                          @change="countryChange" filterable>
                          <el-option v-for="country in countries" :key="country.value" :label="country.label"
                            :value="country.value">
                          </el-option>
                        </el-select>
                      </template>
                      <template v-else-if="subField.inputtype === 'state'">
                        <el-select v-model="form['address'][subField.name]" placeholder="Select State" filterable>
                          <el-option v-for="region in selectedCountryRegions" :key="region.value" :label="region.label"
                            :value="region.value">
                          </el-option>
                        </el-select>
                      </template>
                      <template v-else-if="subField.inputtype === 'text'">
                        <el-input v-model="form['address'][subField.name]" :placeholder="subField.placeholder"></el-input>
                      </template>
                    </el-form-item>
                  </template>
                </el-col>
              </el-row>
            </template>
            <!------------ Dynamic Field Control------------------ -->
            <template v-else-if="field.inputtype === 'dynamicFeild'">
              <el-form-item :label="field.name" :prop="field.name">
                <el-row v-for="(item, index) in pairs" :key="index">
                  <el-col :span="12">
                    <el-tree-select v-model="item.deptId" :props="{}" :data="department" />

                  </el-col>
                  <el-col :span="12">
                    <el-select v-model="item.userIds" multiple placeholder="User IDs">
                      <el-option v-for="item in field.data.userIds" :key='item.value' :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-button @click="addScoping" type="primary" icon="el-icon-plus">Add Scoping</el-button>
              </el-form-item>
            </template>
            <!-- -------------------------------------------------------------------------------------------- -->
            <!-- Add this template block to your existing component -->
            <template v-else-if="field.inputtype === 'dynamicFieldWithOptions'">
              <el-form-item :label="field.label">
                <el-select v-model="form[field.name]" :placeholder="field.placeholder" @change="handleOptionChange">
                  <el-option v-for="option in field.options" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
                </el-select>

                <!-- Conditionally render sub-fields based on the selected option -->
                <template v-if="form[field.name] === 'A'">
                  <el-input v-model="form.subField1" placeholder="Sub Field 1"></el-input>
                  <el-input v-model="form.subField2" placeholder="Sub Field 2"></el-input>
                </template>
                <template v-else-if="form[field.name] === 'B'">
                  <el-input v-model="form.subField4" placeholder="Sub Field 4"></el-input>
                  <el-input v-model="form.subField5" placeholder="Sub Field 5"></el-input>
                </template>
                <!-- Add more conditions based on your requirements -->

              </el-form-item>
            </template>


          </template>
          <!-- </template> -->
        </el-col>
      </el-row>
    </el-form>
    {{ f }}
    {{ visble }}

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelForm">Cancel</el-button>

        <el-button type="primary" @click="onSubmit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>


import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject, treeTransformerMultiyvalue } from '@/utils/dtControl/dTransformer'
import countriesAndregions from '@/utils/Countries&Regions/data'
console.log("Countries", countriesAndregions)

export default {

  data() {
    return {
      pairs: [
        { deptId: 0, userIds: [] },
      ],
      usersName: [],
      verifyPassword: '',
      selectedCountryRegions: [],
      roles: [],
      menus: {},
      Position: [],
      department: [],
      ilteredData: [],
      fieldData: {},
      GpermsOptions: [],
      customdata: [],
      days: [],
      gander: [{ label: 'Man', value: 0 },
      { label: 'Women', value: 1 }],
      selectedValues: {}, // Selected values storage
      query: '',
      form: {
        status: 0,
        delFlag: 0,
        scoping: {}
      },   

      countries: countriesAndregions.map(country => ({
        value: country.countryShortCode,
        label: country.countryName,
        regions: country.regions.map(region => ({
          value: region.shortCode,
          label: region.name,
        })),
      })),

      ru: {
        email: [
          {
            type: "email",
            message: " please enter correct email",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: "please enter password",
            trigger: ["blur", "change"]
          },
          {
            min: 6,
            max: 20,
            message: "password length must be between 6 and 20 characters",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "password can only contain numbers, letters and underscores",
            trigger: ["blur", "change"]
          }
        ],
        confirm: [
          {
            required: true,
            message: "please enter password again",
            trigger: ["blur", "change"]
          },
          {
            min: 6,
            max: 20,
            message: "password length must be between 6 and 20 characters",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "password can only contain numbers, letters and underscores",
            trigger: ["blur", "change"]
          }
        ],
        username: [
          {
            required: true,
            message: "please enter username",
            trigger: ["blur", "change"]
          },
          {
            min: 6,
            max: 20,
            message: "username length must be between 6 and 20 characters",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "username can only contain numbers, letters and underscores",
            trigger: ["blur", "change"]
          }
        ],


      },
    }
  }
  ,
  props: {

    // fields: Array,

    mode: String,

    open: String,

    title: String,

    fields: Array,

    init: Object,

    rules: Object,

    closeAddEdit: Function,

  },

  computed: {

    visble() {
      return this.open

    },
    f() {
      return this.form
    },
    formData() {
      return this.form
    }

  },
  watch: {
    form:{
      deep: true,
      handler(val) {
        this.$emit('emi',val)
      }
    }
    ,

    init: {
      immediate: true,
      
      handler(val) {
        this.form = { ...val };
        console.log('sss')
        console.log(val)
        // this.emitFormData()
        this.formFieldSelectData()
        if (this.mode === 'edit' && val.scoping) {
          this.pairs = Object.keys(val.scoping).map((item) => ({ deptId: parseInt(item), userIds: val.scoping[item] }));
        }
        if (this.mode === 'add') {
          console.log('')
        }

      },
    },
    pairs: {
      deep: true,
      handler(val) {
        console.log(this.init)
        if (val) {
          let obj = {}
          val.forEach((item, index) => {
            obj[item.deptId] = item.userIds
            this.form.scoping = obj
          })
        }
      },
    },

    rules: {
      immediate: true,
      handler(val) {
        this.ru = { ...val };
      },
    },
    mode: {
      immediate: true,
      handler(newMode) {
        console.log('Mode changed:', newMode);
        console.log(this.mode)
        console.log(typeof (this.option))
        console.log(this.formData)
      },
    },
  },


  methods: {
    addScoping() {
      // Check if pairs array exists, if not, initialize it as an empty array
      if (!this.pairs) {
        this.pairs = [];
      }

      // Now you can safely push an item into the pairs array
      this.pairs.push({ deptId: '', userIds: [] });
    },

    optionaldata(type) {
      console.log(type)
      if (type === 'dept') {
        this.$http.dept.DeptlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
          if (res.result && res.result.data) {
            const dept = treeTransformerTwoValues(res.result.data, 'name', 'deptId');
            console.log(dept)
            return dept

          }
          else {
            this.loading = false;
            this.$message.error('Failed to load department list for the selection section');
          }
        });
      }

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
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load department list for the selection section');
              }
            });
          }
          if (field.inputtype === 'customDataScop') {
            console.log("I am here")
            this.$http.cusdatascop.customDatascopelist({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.customdata = NormalmapTwoPropsToObject(res.result.data, 'name', 'customId');
            }).catch(error => {
              console.error(error);
            });
          }
          if (field.inputtype === 'Position') {
            console.log("CustomData Scop")
            this.$http.Job.listJob({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.Position = NormalmapTwoPropsToObject(res.result.data, 'name', 'jobId');
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
          if (field.inputtype === 'menu') {
            console.log("I am here")
            this.$http.menu.MenuHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              console.log(res)
              if (Array.isArray(res.result.data)) {
                this.menus = treeTransformerTwoValues(res.result.data, 'name', 'menuId');
                console.log(this.menus)
              } else {
                console.error('res.result.data is not an array');
              }
            })
          }

          if (field.inputtype === 'gpermision') {
            console.log("in gpermision")
            this.$http.grpermision.permlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                console.log(res.result.data)
                this.GpermsOptions = treeTransformerMultiyvalue(res.result.data, 'name', 'groupId', 'perms', 'name', 'permId');
                console.log(this.GpermsOptions)
                console.log(typeof (this.GpermsOptions))

              } else {
                this.loading = false;
                this.$message.error('Failed to load Permission Group list for the selection section');
              }

            })
          }
          if (field.inputtype === 'dynamicFeild') {
            console.log("I am here")
            this.$http.dept.DeptlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              if (res.result && res.result.data) {
                this.department = treeTransformerTwoValues(res.result.data, 'name', 'deptId');
              }
              else {
                this.loading = false;
                this.$message.error('Failed to load department list for the selection section');
              }
            });
            this.$http.MgUsers.listUsers({
              "pageNo": 1,
              "pageSize": 0
            }).then(res => {

              this.usersName = res?.result?.data.map((item) => {
                return { value: item.userId, label: item.username }
              })


            })

          }
        }
        // Check subFields if they exist
        if (Array.isArray(field.data)) {
          if (field.data) {
            field.data.forEach(subField => {
              if (this.shouldShowField(subField)) {
                if (subField.inputtype === 'DaysWeek') {
                  console.log("I am in")
                  this.$http.daysControl.daysList({ "pageNo": 1, "pageSize": 0 }).then(res => {
                    this.days = NormalmapTwoPropsToObject(res.result.data, 'name', 'dayId');
                    console.log(days)
                  }).catch(error => {
                    console.error(error);
                  });
                }
              }
            });
          }

        }
      });


    },

    countryChange(selectedCountry) {
      const country = this.countries.find(c => c.value === selectedCountry);
      this.selectedCountryRegions = country ? country.regions : [];
    },
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
    mapSexValueToLabel(value) {
      console.log(value)
      return value === 0 ? 'Man' : 'Woman';
    },

    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles);
    },
    handlePreview(file) {
      console.log(file);
    },

    beforeclose(done) {
      this.$confirm('ARE YOU SURE TO CLOSE THIS WINDOW？')
        .then(_ => {
          this.resetForm('editForm');
          done();
        })
        .catch(_ => { });
    },
    closemodel() {
      this.$emit('close')
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    cancelForm() {

      this.$confirm('ARE YOU SURE TO CLOSE THIS WINDOW？')
        .then(_ => {
          this.resetForm('editForm');
          this.$emit('close')
          done();
        })
        .catch(_ => { });
    },
    

    onSubmit() {
      console.log(this.form)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // Emit the submit event with the relevant data
          this.$emit('submit', this.form);

          // Reset the form and close the dialog
          this.resetForm('editForm');
          this.$emit('close');
        }
      });
    },

  },



}

</script>






