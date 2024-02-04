<template>
  <!-- <div v-if="item.hidden === 1">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <el-menu-item class="menu-item" :index="item.id">
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
          <Item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </app-link>

        <template #title>
          {{ this.item.meta.title }}
        </template>

      </el-menu-item>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="item" popper-append-to-body>
      <template #title>
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" /> 
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div> -->
  <template v-if="route.type == 0">
    <el-sub-menu :index="route.id" >
      <template #title>
        <svg-icon v-if="route.meta.icon" :icon-class="route.meta.icon" />
        <span>{{ route.meta.title }}</span>
      </template>
      <template v-for="subItem in route.children" :key="subItem.id">
        <template v-if="route.children.length >= 1"> 
          <Sidebar-Item :base-path="basePath" :item= "route" :route="subItem" />
        </template>
        <template v-else>
          <el-menu-item :index="subItem.id" @click="onsubmenuClick(route.path)">
            <template #title>
              <router-link :to="basePath + '/' + subItem.path">
                <!-- {{ basePath + '/' + route.path }} -->

              <!-- <svg-icon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
              <span>{{ subItem.meta.title }}</span> -->
            </router-link>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-sub-menu>
  </template>
  <template v-else-if="route.type == 1">
    <el-menu-item :index="'' + route.id" @click="onsubmenuClick(route.path)">
      <template #title>
        <router-link :to="basePath + '/' + route.path">
          {{ basePath + '/' + route.path }}
        <!-- <svg-icon v-if="route.meta.icon" :icon-class="route.meta.icon" /> -->
        <!-- <span>{{ route.meta.title }}</span> -->
        </router-link>
      </template>
    </el-menu-item>
  </template>
</template>
<!-- <template>
  <div v-if="!item.hidden">
     <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
 
       <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>Navigator Four</template>
   </el-menu-item>
     </template>
        
 </div>
</template> -->
<script>

import { isExternal } from '@/utils/validate';
import Item from './Item';
import SidebarItem from './SidebarItem.vue';
import AppLink from './Link';
import path from 'path';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import router from '@/router';
// import FixiOSBug from './FixiOSBug';

export default {
  name: 'SidebarItem',
  components: { Item, AppLink, router },
  // mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    route: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    onsubmenuClick(path) {
      console.log(path)
      console.log(this.basePath)
      console.log(this.basePath + '/' + path)
  
     console.log('1')
    },
    hasOneShowingChild(children, parent) {
      children = children || [];

      const showingChildren = children.filter(item => {
        if (item.hidden == 0) {
          console.log(item)
          return false;
        } else {
          console.log(item)
          this.onlyOneChild = item;
          return true;
        }
      });

      if (showingChildren.length === 1) {
        console.log('1')
        return true;
      }

      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        console.log('x')
        return routePath;
      }
      if (isExternal(this.basePath)) {
        console.log('x')
        return this.basePath;
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery);
        return { path: path.resolve(this.basePath, routePath), query: query };
      }

      console.log(this.basePath)
      console.log(routePath)
      console.log('1')
      // return this.basePath;
      // return path.join(this.basePath, routePath);
         return   "ffff"
      //  return {path:  routePath};


    }
  }
};
</script>
<style> .menu-item {
   display: flex;
   flex-direction: row;
   align-items: center;
   gap: 10px;
   padding: 0px 20px;
   height: 50px;
   font-size: 14px;
   color: #fff;
   font-weight: 500;
   cursor: pointer;
 }
</style>