// const focus =  (el) => el.style.color = binding.value.color
import store from '@/store'
export default {
  mounted(el, binding, vnode){
    console.log(binding.value  )
    console.log(el)
    const value  = binding.value
    const permissions = store.getters && store.getters.routePerms
    const code = permissions.map(item => item.code)
    console.log(code)
  
      console.log('ddd')
      const hasPermission = code.includes(value)
      console.log(hasPermission)
      if(!hasPermission){
        el.parentNode && el.parentNode.removeChild(el)
      }
    // console.l
    //bindling.value为指令的绑定值
    // console.log(bindling.value)
    //   let perVal = bindling.value;
    //   if(bindling.value){
      //假设某用户对某模块只有添加和删除的权限
    //这个权限信息(即pers)应该是不同用户登录时从后台拿到的对应的信息
          // let pers=['add','delete','system:user:view'];
          //hasPer为true为有权限
      //hasPer为false为无权限
          // let hasPer = pers.some(item=>{
          //     return item == perVal
          // });
          // console.log(hasPer)
           //没有权限就先隐藏此元素吧
          // if(!hasPer){
          //     el.style.display="none"
          // }
      // }
  }


  // mounted(el, binding, vnode)  {
  
  //  // Get the required permission from the directive argument
  //  const requiredPerm = binding.value;
  //  const route = vnode.context.$route;
  //  console.log(route)
  //   // Check if the user has the required permission dynamically
  //   // const routePerms = this.$route.meta.perms.code;
  //   // console.log(routePerms)
  //   // const hasPermission = routePerms && routePerms.includes(requiredPerm);
  //   if(value == 'red'){
  //        el.parentNode && el.parentNode.removeChild(el)   

  //   }
  //   el.style.backgroundColor = binding.value

  //   console.log(el)
  //   console.log(binding.value)
  //   console.log(vnode)
  // }

} 