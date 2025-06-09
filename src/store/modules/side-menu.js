const state = () => {
    return {
      menu: [
        {
          icon: "ashboard",
          path:"/",
          title: " Dashboard",
          role:["supervisor","agent"]
        },
        {
          icon: "tickets",
          path:"/tickets",
          title: " tickets",
          role:["supervisor","agent"],
          access: ["fbmp","all", "mas", "new_mas"],
        },
        {
          icon: "calllog",
          path:"/calllog",
          title: " call log",
          role:["supervisor","agent"],
          access: ["fbmp","all", "mas", "new_mas"],
        }
      ],
    };
  };
  
  // getters
  const getters = {
    menu: (state) => state.menu,
  };
  
  // actions
  const actions = {};
  
  // mutations
  const mutations = {};
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};