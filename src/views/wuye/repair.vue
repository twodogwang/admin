<template>
    <div>
        <el-row class="dr-datatable">
            <el-col :span="24">
                <el-row class="dr-datatable">
                    <el-input :on-icon-click="search" class="search" icon="search" placeholder="请输入内容以查询" v-model="searchString"></el-input>
                    <el-button size="small" type="primary" icon="search" @click="search">搜索</el-button>
                </el-row>
                <el-table border :data="repairInfo" align="center" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
                    <el-table-column prop="repair_no" label="工单号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="mobilePhone" label="账号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="contact_way" label="联系电话" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="communityName" label="住址" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="repair_content" label="故障描述" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="pic_url" label="故障图片" :formatter="renderimg" show-overflow-tooltip>
                        <template scope="scope">
                            <img @click="imgclick(item.pic_url)"  class="repaire_img"  v-for="(item,index) in scope.row.pic_url" :src="item.pic_url" :key="index"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="add_time" label="申请时间" :formatter="formatdata" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="repair_status" label="维修状态" :formatter="repairState" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="repair_time" label="维修时间" :formatter="formatdata" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column   label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" type="info" @click="Updaterepair(scope.$index, repairInfo)" v-if="repairInfo[scope.$index].repair_status == 0">完成</el-button>
                            <el-button size="small" v-else>完成</el-button>
                            <el-button size="small" type="danger" @click="Deleterepair(scope.$index, repairInfo)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination pageType="getrepairInfo" :pageInfo="repairPage" :searchString="searchString" searchType="serchRepair"></Pagination>
            </el-col>
        </el-row>
        <el-dialog title="报修图片" :visible.sync="dialogState" :close-on-click-modal="false">
            <img class="repaire_url" :src="repaire_url" />
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/pageLXL.vue";
import fetch from "@/utils/fetch"
export default {
  name: "repair",
  data() {
    return {
      data: "",
      dialogVisible: false, //模态框是否显示
      addLoading: false, //是否显示loading
      content: "",
      searchString:"",
      dialogState:false,
      repaire_url:""
    };
  },
  components: {
    Pagination
  },
  beforeCreate() {
    if (!this.$store.getters.repairInfo) {
      if (!this.$store.getters.repairPage) {
        this.$store
          .dispatch("getrepairInfo", {
            pageInfo: { pageSize: 10, pageNum: 1, search: "" }
          })
          .then(() => {
            console.log("repair");
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("getrepairInfo", {
            pageInfo: this.$store.getters.repairPage
          })
          .then(() => {
            console.log("repair");
            this.loading = false;
          });
      }
    }
  },
  computed: {
    ...mapGetters(["repairInfo", "repairPage"])
  },
  methods: {
    imgclick(url){
      console.log(url)
      this.repaire_url = url
      this.dialogState = !this.dialogState
    },
    Deleterepair(index, rows) {
      this.$confirm("此操作将永久删除该报修, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$store
          //   .dispatch("deleteRepairInfo", {
          //     id: { repair_id: rows[index].repair_id },
          //     type: "GETREPAIRINFO"
          //   })
          //   .then(
          //     this.$message({
          //       type: "success",
          //       message: "删除成功!"
          //     })
          //   );
          fetch({
            url:"/propertyFunctions/repair/delete",
            method:"get",
            params:{ repair_id: rows[index].repair_id }
          }).then(result => {
            this.search()
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    Updaterepair(index, rows) {
      this.$confirm("是否已完成该维修", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("UpdateRepairInfo", {
              id: { repair_id: rows[index].repair_id },
              type: "GETREPAIRINFO"
            })
            .then(
              this.$message({
                type: "success",
                message: "操作成功!"
              })
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    repairState(row, cloumu, value) {
      switch (value) {
        case 0:
          return "未修";
        default:
          return "已修";
      }
    },
    renderimg(row, cloumu, value) {
      var imgarr = [];
      for (let i = 0; i < value.length; i++) {
        var image = `<img src="${value[i].pic_url}">`;
        imgarr[imgarr.length] = image;
      }
      return imgarr;
    },
    search() {
      if (this.searchString) {
        this.$store
          .dispatch("serchRepair", {
            content: {
              pageNum: 1,
              pageSize: 10,
              search: this.searchString
            }
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "搜索成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "搜索失败"
            });
          });
      } else {
        history.go(0);
      }
      return;
    },
    opendialog() {
      //代开模态框
      this.dialogVisible = !this.dialogVisible;
    },
    formatdata(row, cloumu, value) {
      return new Date(value).toLocaleString();
    }
  }
};
</script>

<style>
.search {
  width: 20%;
}
.repaire_img{
  width:150px;
  height:150px;
}
.repaire_url{
  width:100%;
  height:100%;
}
</style>
