<template>
    <!-- <div :class="{ 'has-logo': showLogo }" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' }"> -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <el-scrollbar  > -->
    <el-menu  :default-active="activeMenu" :collapse="isCollapse" :text-color="'#ffffff'" :background-color="'#304156'"
        :unique-opened="true" :active-text-color="'#bfcbd9'" :collapse-transition="false" mode="vertical">

        <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
            :base-path="route.path" :route="route" />
    </el-menu>
    <!-- </el-scrollbar> -->
    <!-- </div> -->
</template>
<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
// import variables from '@/assets/styles/variables.scss'

export default {

    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            console.log(meta)
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            console.log(this.$store.getters.sidebarRouters)
            return this.$store.state.settings.sidebarLogo;

        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
<style  scoped >
/* .menu {

    display: flex;
    flex-direction: column;
    padding: 0;

} */

</style>