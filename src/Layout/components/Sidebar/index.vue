<template>
    <div :class="{ 'has-logo': showLogo }" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme">
            <el-menu class="menu" :default-active="activeMenu" :collapse="isCollapse"
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true" :active-text-color="settings.theme" :collapse-transition="false" mode="vertical">
                <template v-for="(route, index) in sidebarRouters" :key=route.id>
                    <!-- <template v-if="route.type == 0">
                        <el-sub-menu :index="route.id" >
                            <template #title>
                                <svg-icon v-if="route.meta.icon" :icon-class="route.meta.icon" />
                                
                                <span>{{ route.meta.title }}</span>
                            </template>
                            <template v-for="subItem in route.children" :key="subItem.id" >
                                <el-menu-item :index="subItem.id" >
                                    <template #title>
                                        <svg-icon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
                                        <span>{{ subItem.meta.title }}</span>
                                    </template>
                                </el-menu-item>


                            </template>

                        </el-sub-menu> 


                    </template>
                    <template v-else-if="route.type == 1">
                        <el-menu-item :index="route.id" >
                            <template #title>
                                <svg-icon v-if="route.meta.icon" :icon-class="route.meta.icon" />
                                <span>{{ route.meta.title }}</span>
                            </template>
                        </el-menu-item>
                    </template>    -->

                </template>


                <sidebar-item
                    v-for="(route, index) in sidebarRouters"
                    :key="route.path  + index"
                    :item= "route"
                    :base-path="route.path"
                    :route="route"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from '@/assets/styles/variables.scss'

export default {

    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
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
<style  >
.menu {

    display: flex;
    flex-direction: column;
    padding: 0;

}
</style>