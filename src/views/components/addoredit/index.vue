<template>
  <el-dialog :class="'d'" ref="form" :before-close="beforeclose" :model-value="visble" :title="`${title}`"
    :visible.sync="open" :width="'60%'" :closed="closemodel" :modal-class="'editAdd'">
    <el-form :class="'form'" :model="form" ref="editForm" :rules="ru" label-position="top">
      <div :class="'form-row'">
        <div :class="field.class || 'co-16  col-6'" v-for="(field, index) in fields" :key="index">
          <!-- <template v-if="1"> -->
          <template v-if="shouldShowField(field)">
            <template v-if="field.type !== 'address'">
              <el-form-item :label="field.label" :prop="field.prop" :style="field.style">
                <template v-if="field.inputtype === 'email'">
                  <el-input :type="'email'" v-model="form[field.name]" :placeholder="field.placeholder"
                    :size="field.size || 'mini'" />
                </template>
                <template v-if="field.type === 'photo'">
                  <div>
                    <el-avatar v-model="form[field.name]" shape="square" :size="100" :fit="fit"
                      :src="this.$http.photos.image(form[field.name])" />
                  </div>
                </template>
                <template v-else-if="field.inputtype === 'text'">
                  <el-input :type="'text'" v-model="form[field.name]" :placeholder="field.placeholder"
                    :size="field.size || 'mini'" :suffix-icon="field.icon ?? ''" />
                </template>
                <template v-else-if="field.inputtype === 'upload'">
                  <!-- <el-upload v-model:fileList="form[field.name]" class="upload-demo" :action="field.action"
                    :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload"
                    :list-type="field.listType" :auto-upload="field.autoUpload" :limit="field.limit">
                    <el-button type="primary"> {{ field.buttonText || "Click to upload" }}</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        {{ field.tip
                          || "Please Enter A tip If exist if not pleas lef the (tip) empty to stop the message" }}
                      </div>
                    </template>
                  </el-upload> -->
                  <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="requestUpload"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="Avatar" :src="url + Avatar.src" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                      {{ '+' }}
                    </el-icon>
                    <el-progress type="circle" :percentage="progress" v-show="isprogress" status="exception" />
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
                    :size="field.size || 'mini'" />
                </template>
                <template v-else-if="field.inputtype === 'verifyPassword'">
                  <el-form-item :label="field.label" :prop="field.name" :rules="verifyPasswordRule()">
                    <el-input :type="'password'" v-model="verifyPassword" :placeholder="field.placeholder"
                      :size="field.size || 'mini'" />
                  </el-form-item>
                </template>

                <template v-else-if="field.inputtype === 'confirm'">
                  <el-row :class="field.row" :span="12" flex>
                    <el-input :type="'password'" v-model="form[field.name]" :placeholder="field.placeholder"
                      :span="field.span" :size="field.size || 'mini'" multiple checkbox />
                  </el-row>
                </template>
                <!-- Phone Field -->
                <template v-else-if="field.inputtype === 'phone'">
                  <el-row :class="field.row" :span="12" flex>
                    <el-input type="phone" v-model="form[field.name]" :placeholder="field.placeholder" :span="field.span"
                      :size="field.size || 'mini'" />
                  </el-row>
                </template>

                <!-- Sorting Field -->
                <template v-else-if="field.inputtype === 'sorting'">
                  <!-- <el-row :class="field.row" flex> -->
                  <el-input-number v-model="form[field.name]" :placeholder="field.placeholder" controls-position="right"
                    :min="field.min || 0" :max="field.max" :size="field.size || 'mini'" />
                  <!-- </el-row> -->
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
                      multiple :size="field.size || 'mini'"></el-option>
                  </el-select>
                </template>
                <template v-if="field.inputtype === 'selectV'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="field.data"
                    :multiple="field.multiple" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
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
                <template v-else-if="field.inputtype === 'departmentNew'">
                  <el-tree-select v-model="form[field.name]" :data="departmentNew" :multiple="field.multiple"
                    :render-after-expand="true" :placeholder="field.placeholder" check-strictly check-on-click-node
                    filterable />
                  <!-- {{ 'the data is as follows:' + this.form[field.name] }} -->
                </template>

                <!-- Roles Selecting Section -->
                <template v-if="field.inputtype === 'roles'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="roles"
                    :multiple="field.multiple" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                  <!-- {{ this.role }} -->
                </template>
                <!-- Position Selecting Section -->
                <template v-if="field.inputtype === 'Position'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="Position"
                    :multiple="field.multiple" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                </template>
                <!-- Menu Selecting Section -->
                <template v-else-if="field.inputtype === 'menu'">
                  <el-tree-select v-model="form[field.name]" :data="menus" :render-after-expand="true"
                    :placeholder="field.placeholder" check-strictly check-on-click-node filterable
                    :multiple="field.multiple" :show-checkbox="field.showCheckbox" />
                </template>
                <!-- Group permissions -->

                <template v-else-if="field.inputtype === 'gpermision'">
                  <el-tree-select v-model="field.name" ref="myTreeSelect" :data="this.GpermsOptions"
                    :render-after-expand="true" :placeholder="field.placeholder" check-strictly check-on-click-node
                    filterable :multiple="field.multiple" :show-checkbox="field.showCheckbox"
                    @check-change="organizeSelection(field.name)" />
                  {{ console.log(this.GpermsOptions) }}
                </template>


                <!-- CustomData Scop -->
                <template v-if="field.inputtype === 'customDataScop'">
                  <el-select-v2 v-model="form[field.name]" :placeholder="field.placeholder" :options="customdata"
                    collapse-tags collapse-tags-tooltip :max-collapse-tags="3" :multiple="field.multiple || false"
                    :show-checkbox="field.showCheckbox || false" />
                  {{ this.role }}
                </template>
                <!-----------------------------User Name-------------------- -->
                <template v-if="field.inputtype === 'userField'">
                  <el-select-v2 v-model="form[field.name]" :multiple="field.multiple" :placeholder="field.placeholder"
                    :options="username" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" filterable />
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
                    :size="field.size || 'mini'" />
                </template>
              </el-form-item>
            </template>
            <!-- Icon Field -->

            <!-- -------------------------------------------------------------------- -->
            <template v-if="field.inputtype === 'schedule'">
              <div :class="'row'">
                <div :class="'col-16'" v-for="(subField, index) in field.data" :key="index">
                  <!-- <template v-if="1"> -->
                  <template v-if="shouldShowField(subField)">
                    <el-form-item :label="subField.label">
                      <template v-if="subField.inputtype === 'DaysWeek'">
                        <el-select-v2 v-model="form['schedule'][subField.name]" :placeholder="subField.placeholder"
                          :options="days" :multiple="subField.multiple" collapse-tags collapse-tags-tooltip
                          :max-collapse-tags="3" />
                        <!-- {{ typeof (form['schedule'][subField.name]) }} -->
                      </template>
                      <template v-if="subField.inputtype === 'text'">
                        <el-input v-model="form['schedule'][subField.name]"
                          :placeholder="subField.placeholder"></el-input>
                        <!-- {{ "Hello " + form['schedule'][subField.name] }} -->
                      </template>
                      <template v-else-if="subField.inputtype === 'sorting'">
                        <el-input-number v-model="form['schedule'][subField.name]" :placeholder="field.placeholder"
                          controls-position="right" :min="subField.min || 0" :max="subField.max"
                          :size="subField.size || 'mini'" />
                      </template>
                    </el-form-item>
                  </template>
                </div>
              </div>
            </template>
            <!------------- Address Fields ---------------------->
            <template v-if="field.inputtype === 'address'">
              <div :class="'row'">
                <div :class="'col-16'" v-for="(subField, index) in field.data" :key="index">
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
                </div>
              </div>
            </template>
            <!---------------------- Address---------------------------------------------------- -->
            <template v-if="field.inputtype === 'country'">
              <el-select v-model="form[field.name]" :placeholder="field.placeholder || 'Select Country'"
                @change="countryChange" filterable>
                <el-option v-for="country in countries" :key="country.value" :label="country.label"
                  :value="country.value">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="field.inputtype === 'state'">
              <el-select v-model="form[field.name]" placeholder="Select State" filterable>
                <el-option v-for="region in selectedCountryRegions" :key="region.value" :label="region.label"
                  :value="region.value">
                </el-option>
              </el-select>
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
        </div>
      </div>
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


import { mapOnePropToObject, treeTransformerTwoValues, NormalmapTwoPropsToObject, treeTransformerMultiyvalue, treeTransformerTwoValuesAndNew } from '@/utils/dtControl/dTransformer'
import countriesAndregions from '@/utils/Countries&Regions/data'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue';
console.log("Countries", countriesAndregions)
console.log(Plus)
export default {

  data() {
    return {
      pairs: [
        { deptId: 0, userIds: [] },
      ],
      progress: 0,
      isprogress: false,
      imageUrl: null,
      Avatar: null,
      usersName: [],
      verifyPassword: '',
      selectedCountryRegions: [],
      roles: [],
      menus: {},
      Position: [],
      department: [],
      departmentNew: [],
      username: {},
      ilteredData: [],
      fieldData: {},
      GpermsOptions: [],
      customdata: [],
      days: [],
      gander: [{ label: 'Male', value: 0 },
      { label: 'Female', value: 1 }],
      selectedValues: {}, // Selected values storage
      query: '',
      form: {},
      url: 'http://181.215.79.209:9005',

      countries: countriesAndregions.map(country => ({
        value: country.countryName,
        label: country.countryName,
        regions: country.regions.map(region => ({
          value: region.name,
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
  },
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
    form: {

      deep: true,
      handler(val) {
        console.log(val)
        this.$emit('emi', val)

      }
    }
    ,

    init: {
      immediate: true,

      handler(val) {
        // this.someMethod()
        this.form = { ...val };
        console.log('sss')
        console.log(val)
        // this.emitFormData()
        this.formFieldSelectData()
        if (this.mode === 'edit' && val.scoping) {
          this.pairs = Object.keys(val.scoping).map((item) =>
           ({ deptId: parseInt(item), userIds: val.scoping[item] }));
        }
        if (this.mode === 'edit' && val.avatar) {
          console.log(this.form)
          this.Avatar = {
            "bucketName": this.form.avatar.split('/')[1],
            "url": this.form.avatar,
            "src": this.form.avatar
          }
          console.log(this.Avatar)

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
    }
    ,


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
    // x(){
    //     if(this.mode === 'edit'){
    //          console.log(this.form)
    //          this.Avatar ={
    //             "bucketName": this.form.avatar.split('/')[1],
    //             "url": this.form.avatar,
    //             "src": this.form.avatar
    //          }
    //           console.log(this.Avatar)

    //          return 1 
    //     }
    //     else return this.imageUrl
    // },

    // someMethod() {
    //   if (!this.form.address) {
    //     console.log("I am in address")
    //     this.form.address =
    //     {
    //       delFlag: 0,
    //       status: 0,
    //       country: '',
    //       state: '',
    //       city: '',
    //       zipcode: '',
    //       detail: ''
    //     };
    //   }
    // },
    // Icon method
    selected(name) {
      this.form.icon = name;
    },
    //
    requestUpload(file) {
      this.isprogress = true
      this.progress = 0;
      let formData = new FormData();
      formData.append('file', file.file);
      formData.append('bucketName', 'useravatar');
      this.$http.upload.uploadImage(formData, this.progress).then(res => {
        if (res.code === '0') {
          this.progress = 100;
          this.$message.success('Upload successfully');
          this.imageUrl = process.env.VUE_APP_IMAGE_URL + res.result.bucketName + '/' + res.result.url;
          this.Avatar = {
            "bucketName": res.result.bucketName,
            "url": res.result.url,
            "src": '/' + res.result.bucketName + '/' + res.result.url
          }
          this.form.avatar = '/'+this.Avatar.bucketName + '/' + this.Avatar.url
          // console.log(this.form.avatar)
          setTimeout(() => {
            this.isprogress = false
          }, 200);
          return res.result;
        } else {
          this.isprogress = false
          this.$message.error('Upload failed');
        }
      }).catch(error => {
        this.isprogress = false
        console.error(error);
      });

    },


    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        this.$message.error('File must be an image!');
      }
      if (!isLt2M) {
        this.$message.error('Image size can not exceed 2MB!');
      }
      return isImage && isLt2M;
    },
    // beforeAvatarUpload(file) {
    //   console.log(file)
    //   const isJPG = file.type === 'image/jpeg/png';
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isJPG) {
    //     this.$message.error('Picture must be JPG format!');
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('Picture size can not exceed 2MB!');
    //   }
    //   return isJPG && isLt2M;
    // },
    organizeSelection(selectedValues) {
      const organizedData = {};
      // Helper function to find the parent of a given value
      const findParent = (value, options) => {
        for (const option of options) {
          if (option.children && option.children.some(child => child.value === value)) {
            return option.value;
          }
          if (option.children) {
            const found = findParent(value, option.children);
            if (found) return found;
          }
        }
        return null;
      };
      // Helper function to check if a value is also a parent
      const isParent = (value, options) => {
        for (const option of options) {
          if (option.value === value && option.children && option.children.length > 0) {
            return true;
          }
          if (option.children) {
            const found = isParent(value, option.children);
            if (found) return true;
          }
        }
        return false;
      };
      for (const value of selectedValues) {
        // Check if the value is a parent
        if (isParent(value, this.GpermsOptions)) {
          organizedData[value] = []; // Treat as a separate parent
          continue;
        }
        const parent = findParent(value, this.GpermsOptions);
        if (parent && selectedValues.includes(parent)) { // Check if the parent is also selected
          if (!organizedData[parent]) {
            organizedData[parent] = [];
          }
          organizedData[parent].push(value);
        } else {
          // If no parent, or the parent is not selected, treat as a separate parent
          organizedData[value] = [];
        }
      }
      console.log(organizedData);
      // this.form.forEach((field, index) => {
      //   if (field.name === 'perms') {
      //     console.log(typeof (this.permsOptions))
      //     return this.Add_Edit[index].data = this.permsOptions;
      //   }
      // });
      this.form['perms'] = organizedData
      return organizedData;
    },

    handleResize() {
      // Force the component to update when the window is resized
      this.$forceUpdate();
    },
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
            console.log("Searching")
            this.$http.dept.DeptlistHierarchy({ "pageNo": 1, "pageSize": 0 }).then(res => {
              console.log(res)
              if (field.new) {
                console.log("new")
                this.department = treeTransformerTwoValuesAndNew(res.result.data, 'name', 'deptId');
              } else {
                console.log('other')
                this.department = treeTransformerTwoValues(res.result.data, 'name', 'deptId');
              }

            }).catch(message => {
              ("The error:*" + message + ":*");
            });
          }
          if (field.inputtype === 'customDataScop') {
            console.log("I am here")
            this.$http.cusdatascop.customDatascopelist({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.customdata = NormalmapTwoPropsToObject(res.result.data, 'name', 'customId');

            }).catch(message => {
              ("The error:*" + message + ":*");
            });
          }
          if (field.inputtype === 'Position') {
            this.$http.Job.listJob({ "pageNo": 1, "pageSize": 0 }).then(res => {
              console.log("Position")
              this.Position = NormalmapTwoPropsToObject(res.result.data, 'name', 'jobId');
            }).catch(message => {
              ("The error:*" + message + ":*");
            });
          }
          if (field.inputtype === 'roles') {
            console.log("I am here")
            this.$http.role.listRole({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.roles = NormalmapTwoPropsToObject(res.result.data, 'name', 'roleId');
              // this.fields.options = this.mapFieldValues(field, this.roles);
            }).catch(message => {
              ("The error:*" + message + ":*");
            });
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
            }).catch(message => {
              ("The error:*" + message + ":*");
            });
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

            }).catch(message => {
              ("The error:*" + message + ":*");
            });
          }

          if (field.inputtype === 'userField') {
            this.$http.MgUsers.listUsers({ "pageNo": 1, "pageSize": 0 }).then(res => {
              this.username = NormalmapTwoPropsToObject(res.result.data, 'username', 'userId')
              // this.email = mapOnePropToObject(res.result.data, 'email');
            }).catch(message => {
              ("The error:*" + message + ":*");
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
            }).catch(message => {
              ("The error:*" + message + ":*");
            });
            this.$http.MgUsers.listUsers({
              "pageNo": 1,
              "pageSize": 0
            }).then(res => {

              this.usersName = res?.result?.data.map((item) => {
                return { value: item.userId, label: item.username }
              }).catch(message => {
                ("The error:*" + message + ":*");
              });


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
    colclass(feild) {

    },
    // calculateSpan(field) {
    //   if (window.innerWidth < 700) {
    //     // If so, set the span to 24 for all fields
    //     console.log("I am here")
    //     return 24;
    //   } else {
    //     console.log("I am here")
    //     // Otherwise, use the existing span logic
    //     return this.shouldShowField(field) ? (field.span || 12) : 0;
    //   }
    // },
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
      this.$confirm('ARE YOU SURE TO CLOSEe THIS WINDOW？')
        .then(_ => {
          console.log(this.mode)
          if (this.mode === 'add') {
            if (this.Avatar !== null) {
              console.log(this.Avatar)
              this.$http.upload.deleteUsesAvatar([this.Avatar]).then(res => {
                console.log(res)
                if (res.code === '0') {
                  this.$message.success('Delete successfully');
                  done();
                } else {
                  this.$message.error('Delete failed');
                }
              }).catch(error => {
                console.error(error);
              });
            }

          } else {

          }
          // if(this.imageUrl !== null){
          //   console.log(this.imageUrl)
          //   this.$http.upload.deleteImage(this.imageUrl).then(res => {
          //     console.log(res)
          //     if (res.code === '0') {
          //       this.$message.success('Delete successfully');
          //       done();
          //     } else {
          //       this.$message.error('Delete failed');
          //     }
          //   }).catch(error => {
          //     console.error(error);
          //   });
          // }
          // else{
          //   done();
          // }
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

<style scoped>
.form-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 5px;

}

.form-row div {
  flex-grow: 1;
}

@media (max-width: 720px) {
  .d {
    width: 90% !important;
  }
}

@media (max-width: 500px) {
  .form-row {
    display: block;

  }

  .co-16 {
    width: 100% !important;
  }
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader .el-progress--circle {
  position: absolute;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

