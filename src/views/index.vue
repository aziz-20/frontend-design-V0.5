<template>
               <h1  v-focus="'system:view'" v-for="(route, index) in sidebar">
                     {{ route.path }}
               </h1>
              

</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
    name: 'HelloWorld',
   computed:{
    ...mapGetters(["sidebarRouters", "sidebar"]),

   },
   data(){
       return{
           sidebar :[{path:"/home",name:"home",permissions:'red'},{path:"/about",name:"about",permissions:'blue'}
      ,{path:"/about",name:"about",permissions:'blue'},{path:"/about",name:"about",permissions:'blue'}]
       }
   }
}


</script>