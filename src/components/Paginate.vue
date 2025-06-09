<template>
  <div style="width: 80%; overflow-x: scroll; margin: 0px 33px;">
    <ul>
      <li class="prev" @click="goPrev()" :aria-disabled="current_page === 1">
        <span>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="feather feather-chevron-left">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg >
        </span>
      </li>
      <li
        v-for="i in total_pages" 
        :key="i" 
        :class="{ active: current_page === i }"
        v-show="i === 1 || i === total_pages || current_page === i || current_page === i + 1 || current_page === i - 1 || current_page === i + 2 || current_page === i - 2"
        :aria-disabled="(current_page === i || current_page === i + 2 || current_page === i - 2) && !(i === 1 || i === total_pages)"
        @click="i === 1 || i === total_pages || current_page === i || current_page === i + 1 || current_page === i - 1 ? getPage(i) : null">
        <a v-if="i === 1 || i === total_pages || current_page === i || current_page === i + 1 || current_page === i - 1">{{ i }}</a>
        <a v-else>...</a>
      </li>
      
      <li class="next" @click="gotNext()" :aria-disabled="Math.ceil(this.pagination.total / this.perPage) === current_page">
        <span >
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="feather feather-chevron-right">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg >
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    pagination: Object,
    perPage: Number,
    current_page:Number
  },
  data() {
    return {
      // current_page: 1,
      prev_range: 0,
      current_range: 0,
    };
  },
  computed: {
    total_pages() {
      if(this.pagination?.total) return Math.ceil(this.pagination.total / this.perPage);
      return 1
    },
    active_page() {
      return this.current_page;
    },
  },
  watch: {
    // current_page() {
    //   this.prev_range = (this.current_page - 1) 
    //   this.current_range = this.current_page ;
    //   this.$emit("getData", {
    //     from: this.prev_range,
    //     to: this.current_range,
    //   });
    // },
  },
  methods: {
    getPage(page) {
      this.$emit('update-current-page', page);
      this.getData(page);
    },
    gotNext() {
      this.$emit('update-current-page', this.current_page < this.total_pages ? this.current_page + 1 : this.total_pages);
      this.getData(this.current_page < this.total_pages ? this.current_page + 1 : this.total_pages);
      // this.current_page = this.current_page < this.total_pages    ? this.current_page + 1 : this.total_pages;
    },
    goPrev() { 
      this.$emit('update-current-page', this.current_page > 1 ? this.current_page - 1 : 1);
      this.getData(this.current_page > 1 ? this.current_page - 1 : 1);

      // this.current_page = this.current_page > 1 ? this.current_page - 1 : 1; 
    },
    getData(page){
      this.prev_range = (page - 1) 
      this.current_range = page ;
      this.$emit("getData", {
        from: this.prev_range,
        to: this.current_range,
      });
    }
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  display: flex;
  align-items: center;
}
li {
  border: 1px solid rgb(223, 220, 220);
  border-radius: 50%;
  padding: 0.5rem 0.8rem;
  margin: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
li:hover {
  cursor: pointer;
  background-color: #5837D0;
  color: #fff;
  border-color: #5837D0;
}
ul li:first-child,
ul li:last-child {
  padding: 0.3rem 0;
}
.active {
  background-color: #5837D0;
  color: #fff;
  border-color: #5837D0;
}
/* .prev{
  position: absolute;
  left: 11px;

} */
li[aria-disabled=true] {
  opacity: 0.5;
  pointer-events: none;
}
li[aria-disabled=true].active {
  opacity: 1;
}
/* .next{
  position: absolute;
  left: 82%;
} */

.paginate{
  margin-left: 1px;
}
</style>