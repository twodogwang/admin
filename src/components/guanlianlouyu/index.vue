<template>
  <div>
    <!-- 关联到楼宇 -->
    <el-dialog size="large" title="关联到楼宇" :visible.sync="visi">
      <el-table id="" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="userName" label="楼宇编号" width="120">
        </el-table-column>
        <el-table-column prop="group.name" label="楼宇名称" width="120">
        </el-table-column>
        <el-table-column prop="name" label="省" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="phoneNum" label="市" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="email" label="区/县" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="email" label="社区" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="email" label="楼号" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
                  <template scope="scope">
                    <el-button size="mini" @click="editUserInfo(scope.$index, dataList)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteUser(scope.$index, dataList)">删除</el-button>
                  </template>
                </el-table-column> -->
      </el-table>
      <Pagination pageType="adminList" :pageInfo="page"></Pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    visi
  },
  data() {
    return {
      // builddialogFormVisible: false
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>


