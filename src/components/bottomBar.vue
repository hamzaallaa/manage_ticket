<template>
    <div  class="fixed bottom-0 left-0 right-0 z-10 px-5 mrgin" bis_skin_checked="1">
      <div class="px-4 py-3 bg-white border-0 border-blue-400 border-solid rounded shadow border-t-3">
        <div v-if="isFull" class="flex items-center justify-between flex-nowrap">
          <slot></slot>
        </div>
        <div v-else class="flex items-center justify-between flex-nowrap">
          <h5 class="text-secondary">Actions</h5>
          <div class="flex flex-no-wrap " bis_skin_checked="1">
           <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['isFull']
  };
  </script>
  
  <style>
  .mrgin{
    margin-left: 256px;
  }
  </style>
  