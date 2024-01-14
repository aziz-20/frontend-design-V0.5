<template>
               <h1 v-for="(route, index) in sidebarRouters">
                     {{ route.name }}
               </h1>
              

</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
    name: 'HelloWorld',
   computed:{
    ...mapGetters(["sidebarRouters", "sidebar"]),

   }
}


</script>