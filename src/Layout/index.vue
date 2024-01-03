<template>
  <div :class="classObj" class="col-12 app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- sidebar -->
    <sidebar v-if="!sidebar.hide" class="sidebar-container  " />
    <div class="main-container">
      <Navbar />
      <TagsView/>
      <AppMain />

    </div>



    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <Sidebar v-if="!sidebar.hide" class="sidebar-container"/>
      <div :class="{hasTagsView:needTagsView,sidebarHide:sidebar.hide}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <Navbar/>
          <tags-view v-if="needTagsView"/>
        </div>
        <app-main/>
      </div> -->

  </div>
</template>

<script>

// import { AppMain, Navbar, Sidebar} from './components'
import { mapState } from 'vuex'
import variables from "@/assets/styles/variables.scss"


import { Sidebar, Navbar, TagsView, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'Layout',
  components: {
    // AppMain,
    Navbar,
    Sidebar,
    TagsView,
    AppMain

  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}

</script>

<style lang="css" scoped>
#app .app-wrapper {

  position: relative;
  height: 100%;

}

#app .sidebar-container {
  
  display: flex;
  flex-direction: column;
  transition: width 0.28s;
  width: 200px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
      /* font-size: 0px; */
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

#app .main-container {
  height: 100%;
  transition: margin-left 0.28s;
  margin-left: 200px;
  position: relative;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
#app .hideSidebar .sidebar-container {
  width: 54px !important;
}
#app .hideSidebar .main-container {
  margin-left: 54px;
}
#app .hideSidebar.mobile{
 
    .main-container {
      margin-left: 0px;
    }
    .sidebar-container {
      
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-200px, 0, 0);
        

    }
}





/* &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .sidebarHide .fixed-header {
    width: 100%;
  }

  .mobile .fixed-header {
    width: 100%;
  } */
</style>