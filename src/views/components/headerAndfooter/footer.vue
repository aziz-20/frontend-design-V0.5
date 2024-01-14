<template>
    <div class="footer">
      <el-pagination
        v-show="totalItems > 0"
        background
        layout="prev, pager, next"
        :total="totalItems"
        :page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="paginationLayout"
        @current-change="handlePageChange"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomPagination',
    props: {
      totalItems: Number,
      currentPage: Number,
      pageSize: Number,
      paginationLayout: String
    },
    methods: {
      handlePageChange(newPage) {
        this.$emit('page-change', newPage);
      }
    }
  };
  </script>

<style>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
  /* Adjust as needed */
}

</style>