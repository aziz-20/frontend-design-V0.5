<template>
  <div v-if="item.hidden === 1">
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
  </div>
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
import AppLink from './Link';
import path from 'path';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
// import FixiOSBug from './FixiOSBug';

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
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
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    hasOneShowingChild(children, parent) {
      children = children || [];

      const showingChildren = children.filter(item => {
        if (item.hidden  == 0) {
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
      console.log(routePath )
      console.log('1')
      return path.join(this.basePath, routePath);

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