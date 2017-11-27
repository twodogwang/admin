<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search" placeholder="请输入房间号以查询"></el-input>
        </el-row>

        <el-table stripe border :data="accountInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="roomCode" label="房间代码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="annotation" label="房间备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tnum" label="	设备号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="talkbackmobilephone" label="用户账号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column   label="操作">
            <template scope="scope">
              <el-button type="default" size="mini" @click="editInfo(scope.$index, accountInfo)">编辑</el-button>
              <!-- <el-button size="mini" type="danger" @click="Delete(scope.$index, accountInfo)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination pageType="account" :pageInfo="accountPage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog title="编辑关联" :visible.sync="dialogFormVisible">
      <el-row class="dr-datatable">
        <el-button size="small" type="primary" icon="plus" @click="chooseUser">选择用户</el-button>
      </el-row>
      <el-table border stripe :data="correlation" max-height="650" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" width="65">
        </el-table-column>
        <el-table-column prop="mobilephone" label="用户账号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="roomCode" label="房间代码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tnum" label="设备号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column   label="操作">
          <template scope="scope">
            <!-- <el-button size="mini" @click="chooseUser(scope.$index, correlation)">选择用户</el-button> -->
            <el-button size="mini" type="danger" @click="Delete(scope.$index, correlation)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Pagination pageType="accountlist" :pageInfo="specialPage"></Pagination> -->
    </el-dialog>
    <!-- 关联 -->
    <el-dialog size="large" title="选择用户" :visible.sync="userdialogFormVisible">
      <el-table border stripe :data="userInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" @row-click="correlateuser">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="mobilephone" label="用户账号" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination pageType="user" :pageInfo="userPage"></Pagination>
    </el-dialog>
  </div>
</template>

<script>
import fetch from "@/utils/fetch";
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/page.vue";
import Pcc from "../../components/pcc/pcc.vue";
export default {
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      accountlist: [],
      search: "", // 搜索框input内的内容
      userdialogFormVisible: false,
      correlation: null,
      selectedCorrelation: {},
      rules: {}
    };
  },
  methods: {
    correlateuser(currentRow, oldCurrentRow) {
      this.$confirm("确定要关联吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return new Promise((resolve, reject) => {
          this.selectedCorrelation.mobilephone = currentRow.mobilephone;
          resolve();
        }).then(
          fetch({
            url: "/baseMessage/talkback/addTalkback",
            method: "post",
            params: this.selectedCorrelation
          })
            .then(() => {
              this.userdialogFormVisible = false;
              // this.$store.dispatch('getInfo', { pageInfo: this.$store.getters.accountPage, type: 'account' });
              fetch({
                url: "/baseMessage/talkback/selectByTnum",
                method: "get",
                params: { tnum: this.selectedCorrelation.tnum }
              }).then(result => {
                this.selectedCorrelation = {};
                this.correlation = result.data;
              });
              this.$message({
                showClose: true,
                message: "恭喜你，关联成功！",
                type: "success"
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "关联未成功"
              });
            })
        );
      });
    },
    Delete(index, rows) {
      this.$confirm("此操作将永久删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("deleteInfo", {
              id: { id: rows[index].id },
              type: "account"
            })
            .then(
              this.$message({
                type: "success",
                message: "删除成功!"
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
    searcher() {
      this.$store.dispatch("selectInfo", {
        data: {
          roomCode: this.search,
          pageNum: 1,
          pageSize: this.$store.getters.accountPage.pageSize
        },
        type: "account"
      });
    },
    editInfo(index, rows) {
      this.edit = true;
      console.log("---index---", index);
      console.log("---rows---", rows);
      const rowData = rows[index];
      console.log(rowData);
      this.selectedCorrelation.tnum = rowData.tnum;
      this.selectedCorrelation.roomCode = rowData.roomCode;
      console.warn(this.selectedCorrelation);
      fetch({
        url: "/baseMessage/talkback/selectByTnum",
        method: "get",
        params: { tnum: rowData.tnum }
      }).then(result => {
        console.log(result);
        this.correlation = result.data;
        this.dialogFormVisible = true;
      });
    },
    chooseUser(index, rows) {
      this.userdialogFormVisible = true;
      // this.selectedCorrelation.roomCode = rows[index].roomCode;
      console.warn(this.selectedCorrelation);
      /* fetch({
        url: '/baseMessage/customer/customerList',
        method: 'get',
        params: { pageNum: 1, pageSize: 10 }
      }).then(result => {
        this.userInfo = result.data;
      }); */
    },
    submitForm(form) {
      if (!this.edit) {
        console.log("formState", this.formState);
        this.$store
          .dispatch("addInfo", { form: this.formState, type: "account" })
          .then(() => {
            this.formState = {};
          });
      } else {
        this.$store
          .dispatch("updateInfo", {
            form: this.formState,
            type: "account"
          })
          .then(() => {
            this.formState = {};
          });
      }
      this.dialogFormVisible = false;
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.formState = {};
        resolve(true);
      }).then(_ => {
        done();
      });
    }
  },
  components: {
    Pagination,
    Pcc
  },
  computed: {
    ...mapGetters(["accountInfo", "accountPage", "userInfo", "userPage"])
  },
  mounted() {
    // this.loading = true;
    if (!this.$store.getters.accountInfo) {
      if (!this.$store.getters.accountPage) {
        this.$store
          .dispatch("getInfo", {
            pageInfo: { pageSize: 10, pageNum: 1 },
            type: "account"
          })
          .then(() => {
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("getInfo", {
            pageInfo: this.$store.getters.accountPage,
            type: "account"
          })
          .then(() => {
            this.loading = false;
          });
      }
    }
    if (!this.$store.getters.userInfo) {
      if (!this.$store.getters.userPage) {
        this.$store
          .dispatch("getInfo", {
            pageInfo: { pageSize: 10, pageNum: 1 },
            type: "user"
          })
          .then(() => {
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("getInfo", {
            pageInfo: this.$store.getters.userPage,
            type: "user"
          })
          .then(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dr-datatable {
  margin-bottom: 1em;
}

.search {
  width: 20%;
}
</style>

