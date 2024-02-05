<template>
 <div v-for="x in routePerm" >
                {{x.code}}
            </div>

</template>
<script>
export default {
    data(){
        return{
            routePerm: this.$route.meta.perms,
        }
    }
}

</script>