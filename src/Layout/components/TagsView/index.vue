
<template>
  <el-tabs v-model="activeName" type="card" class="demo-tabs"  @tab-remove="removeTab" @tab-click="handleClick">
    <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name" :closable = "item.name !== 'Index'">
      {{ editableTabs }}
    </el-tab-pane>

  </el-tabs>
</template>
<script>
import path from 'path'
export default {

  data() {
    return {
      editableTabs: [


      ],
      activeName: '',
    }
  },
  computed: {

    activeName() {
      const { name } = this.$route
      this.activeName = name
      return name
    }

  },
  mounted() {
    this.addTab()
  },
  watch: {
    $route(to, from) {
      this.addTab(to)
    },


  },

  methods: {

    addTab(to) {
      const tab = {
        title: this.$route.meta.title || 'no-name',
        name: this.$route.name,
        path: this.$route.path,
        fullPath: this.$route.fullPath,
        query: this.$route.query,
        params: this.$route.params,
        meta: this.$route.meta,
      }
      console.log(to)
      const { name } = this.$route
      if (name && !this.editableTabs.some(item => item.path === this.$route.path)) {
        this.editableTabs.push(
          Object.assign({}, tab, {
            title: tab.meta.title || 'no-name'
          }))
      }

      return false
    }
    ,
    handleClick(tab, event) {

      const nextview = this.editableTabs.find(item => item.name === tab.props.name)
      console.log(nextview)
      if (this.$route.name !== tab.props.name) {

        this.$router.replace(nextview)
    
      }

    }
    ,
    removeTab(targetName) {
      console.log(targetName)
      const tabs = this.editableTabs
      let active = this.activeName
      console.log(active)
      if (active === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              active = nextTab.name
              this.$router.replace(nextTab)
            }
          }
        })
      }
        this.activeName = active
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}
</script>
<style>
.demo-tabs>.el-tabs__content {
   display: none;
}
</style>