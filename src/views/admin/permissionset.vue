 isSearch="none"<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class='dr-datatable'>
        <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
        <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button> -->
        </el-row>
        <el-table :data="permissionInfo" border align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="name" label="权限名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="url" label="路径" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column label="查看" width="150">
            <template scope="scope">
              <el-button size="mini" @click="showpermissions(scope.$index, permissionInfo)">查看权限</el-button>
              <el-button size='mini' @click='changeState(scope.$index, permissionInfo)'>{{permissionInfo[scope.$index].statusCode==1?'停用':'启用'}}</el-button>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editpermissionInfo(scope.$index, permissionInfo)">编辑</el-button>
              <el-button size="mini" type="danger" @click="Deletepermission(scope.$index, permissionInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType="permission" :pageInfo="permissionPage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <!-- <el-dialog size="large" title="查看权限" :visible.sync="permissiondialogFormVisible">
      <el-row class='dr-datatable'>
        <el-select size='small' v-model='newAddedPermission' placeholder='请选择权限'>
          <el-option v-for='item in permissionList' :key='item.url' :label='item.name' :value='item.id'>
          </el-option>
        </el-select>
        <el-button size="small" type="primary" icon="plus" @click="addpermission">添加权限</el-button>
      </el-row>
      <el-table border stripe :data="permissionInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" >
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="name" label="已有角色" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="type" label="类型" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog> -->
    <!-- Form -->
    <el-dialog title='编辑' :visible.sync='editdialogFormVisible' :before-close='beforeclose'>
      <el-form :model='permissionformState' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
        <el-form-item label='权限名称' prop='buildingId'>
          <el-input size='small' v-model='permissionformState.name'></el-input>
        </el-form-item>
        <el-form-item label='URL' prop='name'>
          <el-input size='small' v-model='permissionformState.url'></el-input>
        </el-form-item>
        <el-form-item class='dr-submitContent'>
          <el-button size='small' type='primary' @click="submitForm('ruleForm')">确定</el-button>
          <el-button size='small' @click='editdialogFormVisible = false;permissionformState = {};'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import fetch from "@/utils/fetch";
import Pagination from "../../components/pagination/page.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      rId: "",
      loading: false,
      permissionformState: {},
      data: "",
      editdialogFormVisible: false,
      permissiondialogFormVisible: false,
      deleteState: true,
      multipleSelection: "",
      newAddedPermission: "",
      rules: {},
      groupList: [],
      permissionList: []
    };
  },
  methods: {
    /* changeState(index, rows) {
      // 启用停用
      let tempCode = "";
      if (rows[index].statusCode == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url:
          "/basepermission/permission/updateByStatus",
        method: "post",
        params: { id: rows[index].id, statusCode: tempCode }
      }).then(() => {
        tempCode = "";
        if (!this.$store.getters.permissionPage) {
          this.$store.dispatch("getList", {
            pageInfo: {
              pageSize: 10,
              pageNum: 1
            },
            type: "permission"
          });
        } else {
          this.$store.dispatch("getList", {
            pageInfo: {
              pageNum: this.$store.getters.permissionPage.pageNum,
              pageSize: this.$store.getters.permissionPage.pageSize
            },
            type: "permission"
          });
        }
      });
    }, */
    editpermissionInfo(index, rows) {
      console.log(this.groupList);
      this.edit = true;
      console.log("---index---", index);
      console.log("---rows---", rows);
      const rowData = rows[index];
      this.editdialogFormVisible = true;
      this.permissionformState = rowData;
      this.editdialogFormVisible = true;
    },
    addInfo() {
      this.edit = false;
      this.editdialogFormVisible = true;
    },
    addpermission() {
      fetch({
        url: "/baseAdmin/permission/addpermission2Apermission",
        method: "post",
        params: {
          rId: Number(this.rId),
          pId: Number(this.newAddedPermission)
        }
      }).then(result => {
        this.$notify({
          title: "成功",
          message: "添加权限成功",
          type: "success",
          duration: 1000
        });
        this.permissiondialogFormVisible = false;
      });
    },
    Deletes() {
      let deleteArr = this.multipleSelection.map(
        (currentValue, index, arr) => currentValue.id
      );
      console.info(deleteArr);
      deleteArr = deleteArr.join(",");
      if (deleteArr && deleteArr.length !== 0) {
        this.$confirm("此操作将永久删除设备, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() =>
          this.$store
            .dispatch("deleteInfoes", {
              delete: { communitiesIds: deleteArr },
              type: "permission"
            })
            .then(result => {
              this.$notify({
                title: "成功",
                message: "批量删除成功",
                type: "success",
                duration: 2000
              });
              // this.$store.dispatch('getInfo', this.$store.getters.communityPage);
            })
        );
      }
    },
    Deletepermission(index, rows) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("deleteList", {
              id: { id: rows[index].id },
              type: "permission"
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
    handleSelectionChange(val) {
      if (val.length !== 0) {
        this.deleteState = false;
      } else {
        this.deleteState = true;
      }
      this.multipleSelection = val;
    },
    submitForm(form) {
      if (!this.edit) {
        this.$store
          .dispatch("addList", {
            form: this.permissionformState,
            type: "permission"
          })
          .then(result => {
            console.log(result);
            // if (result.code === 0) {
            // this.loading = true;
            /* this.$notify({
              title: "成功",
              message: "新建成功",
              type: "success",
              duration: 1500
            }); */
            this.loading = false;
            this.permissionformState = {};
            // }
          });
      } else {
        this.$store
          .dispatch("updateList", {
            form: this.permissionformState,
            type: "permission"
          })
          .then(result => {
            // if (result.code === 0) {
            // this.loading = true;
            /* this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 1500
            }); */
            this.loading = false;
            this.permissionformState = {};
            // }
          });
      }

      this.editdialogFormVisible = false;
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.permissionformState = { groupId: "" };
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    showpermissions(index, rows) {
      this.permissiondialogFormVisible = true;
      this.rId = rows[index].id;
      fetch({
        url: "/baseAdmin/permission/selectPersBypermissionId",
        method: "get",
        params: { rId: rows[index].id }
      }).then(result => {
        this.permissionInfo = result.data;
      });
    }
  },
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(["permissionInfo", "permissionPage"])
  },
  mounted() {
    if (!this.$store.getters.permissionInfo) {
      if (!this.$store.getters.permissionPage) {
        this.$store.dispatch("getList", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "permission"
        });
      } else {
        this.$store.dispatch("getList", {
          pageInfo: {
            pageSize: this.$store.getters.permissionPage.pageSize,
            pageNum: this.$store.getters.permissionPage.pageNum
          },
          type: "permission"
        });
      }
    }
    fetch({
      url: "/baseAdmin/aPermission/selectAll",
      params: { pageNum: 1, pageSize: 100 }
    }).then(result => {
      this.permissionList = result.data.list;
    });
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
