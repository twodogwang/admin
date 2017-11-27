<template>
  <div>
    <!-- <h1>{{noticeInfo}}</h1> -->
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <!-- <el-button size="small" :data="myMessage" type="primary" icon="plus" @click="addNotice">新建</el-button> -->
          <el-input :on-icon-click="search" class="search" icon="search" placeholder="请输入标题或内容以查询" v-model="searchString"></el-input>
          <el-button size="small" type="primary" @click="search" icon="search" >搜索</el-button>
          <el-button size="small" type="primary" icon="plus" @click="opendialog">发布公告</el-button>
        </el-row>
        <el-table border :data="noticeInfo" align="center" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="noticeId" label="ID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="noticer" label="创建人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" :formatter="formatdata" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="title" label="标题" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="content" label="内容" show-overflow-tooltip>
          </el-table-column>
          <el-table-column   label="操作" width="150">
            <template scope="scope">
              <el-button size="small" type="danger" @click="DeleteNotice(scope.$index, noticeInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination pageType="getwuyeInfo" :pageInfo="noticePage" searchType="serchNotice" :searchString="searchString"></Pagination>
      </el-col>
    </el-row>
    <el-dialog 
        title="编辑公告内容" 
        v-model="dialogVisible"
        :close-on-click-modal="false">
        <div>
          创建人<el-input icon="people" class="dialogInput" placeholder="请输入创建人" v-model="noticer"></el-input>
        </div>
        <div class="dialogDiv">
          标&nbsp;&nbsp;&nbsp;题<el-input icon="people" class="dialogInput" placeholder="请输入标题" v-model="title"></el-input>
        </div>
        <div class="dialogDiv">
          内&nbsp;&nbsp;&nbsp;容<el-input class="dialogInput" type="textarea" v-model="content" placeholder="请输入内容"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="addLoading" @click="addNotice">提交</el-button>
        </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/pageLXL.vue";
import fetch from "@/utils/fetch"
import qs from 'qs';
export default {
  name: "wuye",
  data() {
    return {
      myMessage: "hello",
      data: "",
      // communityChange: "communitylist",
      // communityInfoChange: this.communityInfo,
      dialogVisible: false, //模态框是否显示
      addLoading: false, //是否显示loading
      noticer: "", //创建人
      title: "",
      content: "",
      type: 1,
      notice_type: 1,
      searchString:""
    };
  },
  components: {
    Pagination
  },
  methods: {
    DeleteNotice(index, rows) {
      this.$confirm("此操作将永久删除该公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          // this.$store.dispatch("deleteNoticeInfo", {
          //     id: { noticeId: rows[index].noticeId },
          //   }).then(
          //     this.$message({
          //       type: "success",
          //       message: "删除成功!"
          //     })
          //   );
          fetch({
            url:"/propertyFunctions/notice/deNotice",
            method: 'post',
            data: qs.stringify({ noticeId: rows[index].noticeId })
          }).then(result => {
            this.$message({
                type: "success",
                message: "删除成功!"
              })
            this.search()
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    search() {
      if(this.searchString){
        this.$store.dispatch("serchNotice", {
          content: {
            pageNum: 1,
            pageSize: 10,
            search: this.searchString
          },
        }).then(() => {
          this.$message({
            type: "success",
            message: "搜索成功!"
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "搜索失败"
          });
        });
      }else{
        history.go(0)
      }
    },
    addNotice() {
      this.$store.dispatch("addNotice", {
          content: {
            noticer: this.noticer,
            title: this.title,
            content: this.content,
            type: this.type,
            notice_type: this.notice_type
          },
        }).then(() => {
          this.noticer = "";
          this.title = "";
          this.content = "";
          this.$message({
            type: "success",
            message: "发布成功"
          });
          this.dialogVisible = !this.dialogVisible;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "发布失败"
          });
          this.dialogVisible = !this.dialogVisible;
        });
    },
    opendialog() {
      //代开模态框
      this.dialogVisible = !this.dialogVisible;
    },
    formatdata(row, cloumu, value) {
      return new Date(value).toLocaleString();
    }
  },
  computed: {
    ...mapGetters(["noticeInfo", "noticePage"]),
    noticeInfo() {
      console.log("notice", this.$store.getters.noticeInfo);
      return this.$store.getters.noticeInfo;
    }
  },
  beforeCreate() {
    if (!this.$store.getters.noticeInfo) {
      if (!this.$store.getters.noticePage) {
        this.$store.dispatch("getwuyeInfo", {
            pageInfo: { 
              pageSize: 10, 
              pageNum: 1,
              search:"" 
            }
          }).then(() => {
            console.log("notice");
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("getwuyeInfo", {
            pageInfo: this.$store.getters.noticePage
          })
          .then(() => {
            console.log("notice");
            this.loading = false;
          });
      }
    }
  },
  mounted() {
    // this.noticeInfo1 = noticeInfo
  }
};
</script>

<style scoped>
.search {
  width: 20%;
}
.dialogInput {
  width: 90%;
}
.dialogDiv {
  margin-top: 10px;
}
</style>
