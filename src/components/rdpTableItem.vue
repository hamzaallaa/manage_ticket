<template>
  <tr>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-500">{{machine.Date}}</div></td>  
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-500">{{machine.dealerId}}</div></td>   
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-500">{{machine.instanceId}}</div></td>   
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-500">{{machine.appRun}}</div></td>   
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.toBePost}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.posted}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.toBeUpdate}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.toBeSold}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.sold}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.toBeRenew}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.renewed}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.toBeDelete}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.Deleted}}</div></td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-medium text-slate-800">{{machine.error}}</div></td>
  </tr>  
</template>

<script>
// import { computed } from 'vue'
export default {
  name: 'CustomersTableItem',
  props: ['machine', 'value', 'selected'],
  setup(props, context) {return {}},
  methods:{
    startStopRDP: async function (id , action) {alert(id + '======='+ action)}
  }
}
</script>