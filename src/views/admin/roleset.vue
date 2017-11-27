<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class='dr-datatable'>
        <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
        <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button> -->
        </el-row>
        <el-table :data="roleInfo" border align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="name" label="角色名称" width="120">
          </el-table-column>
          <el-table-column prop="description" label="备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="查看" width="150">
            <template scope="scope">
              <el-button size="mini" @click="showRoles(scope.$index, roleInfo)">查看权限</el-button>
              <!-- <el-button size='mini' @click='changeState(scope.$index, roleInfo)'>{{roleInfo[scope.$index].statusCode==1?'停用':'启用'}}</el-button> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editroleInfo(scope.$index, roleInfo)">编辑</el-button>
              <el-button size="mini" type="danger" @click="Deleterole(scope.$index, roleInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType="role" :pageInfo="rolePage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog size="large" title="查看权限" :visible.sync="permissiondialogFormVisible">
      <el-row class='dr-datatable'>
        <el-select size='small' v-model='newAddedPermission' placeholder='请选择权限'>
          <el-option v-for='item in roleList' :key='item.url' :label='item.name' :value='item.id'>
          </el-option>
        </el-select>
        <el-button size="small" type="primary" icon="plus" @click="addpermission">添加权限</el-button>
      </el-row>
      <el-table border stripe :data="permissionInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" >
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="aPermission.name" label="已有权限" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="aPermission.url" label="路径" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">              
            <el-button size="mini" type="danger" @click="Deletepermission(scope.$index, permissionInfo)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- Form -->
    <el-dialog title='编辑' :visible.sync='editdialogFormVisible' :before-close='beforeclose'>
      <el-form :model='roleformState' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
        <el-form-item label='角色名称' prop='buildingId'>
          <el-input size='small' v-model='roleformState.name'></el-input>
        </el-form-item>
        <el-form-item label='备注' prop='name'>
          <el-input size='small' v-model='roleformState.description'></el-input>
        </el-form-item>
        <el-form-item v-if="!edit" label='编号' prop='towernum'>
          <el-input placeholder='' size='small' v-model='roleformState.type'></el-input>
        </el-form-item>
        <el-form-item class='dr-submitContent'>
          <el-button size='small' type='primary' @click="submitForm('ruleForm')">确定</el-button>
          <el-button size='small' @click='editdialogFormVisible = false;roleformState = {};'>取消</el-button>
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
      edit: false,
      rId: "",
      loading: false,
      roleformState: {
        groupId: ""
      },
      data: "",
      editdialogFormVisible: false,
      permissiondialogFormVisible: false,
      deleteState: true,
      multipleSelection: "",
      newAddedPermission: "",
      rules: {},
      permissionInfo: [],
      groupList: [],
      roleList: []
    };
  },
  methods: {
    changeState(index, rows) {
      // 启用停用
      let tempCode = "";
      if (rows[index].statusCode == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baserole/role/updateByStatus",
        method: "post",
        params: { id: rows[index].id, statusCode: tempCode }
      }).then(() => {
        tempCode = "";
        if (!this.$store.getters.rolePage) {
          this.$store.dispatch("getList", {
            pageInfo: {
              pageSize: 10,
              pageNum: 1
            },
            type: "role"
          });
        } else {
          this.$store.dispatch("getList", {
            pageInfo: {
              pageNum: this.$store.getters.rolePage.pageNum,
              pageSize: this.$store.getters.rolePage.pageSize
            },
            type: "role"
          });
        }
      });
    },
    editroleInfo(index, rows) {
      console.log(this.groupList);
      this.edit = true;
      console.log("---index---", index);
      console.log("---rows---", rows);
      const rowData = rows[index];
      this.editdialogFormVisible = true;
      this.roleformState = rowData;
      this.editdialogFormVisible = true;
    },
    addInfo() {
      this.edit = false;
      this.editdialogFormVisible = true;
    },
    addpermission() {
      fetch({
        url: "/baseAdmin/role/addRole2Apermission",
        method: "post",
        params: {
          rId: Number(this.rId),
          pId: Number(this.newAddedPermission)
        }
      }).then(result => {
        /* this.$notify({
          title: "成功",
          message: "添加权限成功",
          type: "success",
          duration: 1000
        }); */
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
              type: "role"
            })
            .then(result => {
              /* this.$notify({
                title: "成功",
                message: "批量删除成功",
                type: "success",
                duration: 2000
              }); */
              // this.$store.dispatch('getInfo', this.$store.getters.communityPage);
            })
        );
      }
    },
    Deleterole(index, rows) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("deleteList", {
            id: { id: rows[index].id },
            type: "role"
          });
          /* .then
            this.$message({
                type: "success",
                message: "删除成功!"
              })
            (); */
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
            form: this.roleformState,
            type: "role"
          })
          .then(result => {
            console.log(result);
            // if (result.code === 0) {
            // this.loading = true;
            this.$notify({
              title: "成功",
              message: "新建成功",
              type: "success",
              duration: 1500
            });
            this.loading = false;
            this.roleformState = {};
            // }
          });
      } else {
        this.$store
          .dispatch("updateList", {
            form: this.roleformState,
            type: "role"
          })
          .then(result => {
            // if (result.code === 0) {
            // this.loading = true;
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 1500
            });
            this.loading = false;
            this.roleformState = {};
            // }
          });
      }

      this.editdialogFormVisible = false;
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.roleformState = { groupId: "" };
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    showRoles(index, rows) {
      this.permissiondialogFormVisible = true;
      this.rId = rows[index].id;
      fetch({
        url: "/baseAdmin/role/selectPersByRoleId",
        method: "get",
        params: { rId: rows[index].id }
      }).then(result => {
        this.permissionInfo = result.data;
      });
    },
    Deletepermission(index, rows) {
      this.$store
        .dispatch("deleteList", {
          id: { rapId: rows[index].id },
          type: "roledpermission"
        })
        .then(result => {
          this.permissiondialogFormVisible = false;
        });
    }
  },
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(["roleInfo", "rolePage"])
  },
  mounted() {
    if (!this.$store.getters.roleInfo) {
      if (!this.$store.getters.rolePage) {
        this.$store.dispatch("getList", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "role"
        });
      } else {
        this.$store.dispatch("getList", {
          pageInfo: {
            pageSize: this.$store.getters.rolePage.pageSize,
            pageNum: this.$store.getters.rolePage.pageNum
          },
          type: "role"
        });
      }
    }
    fetch({
      url: "/baseAdmin/aPermission/selectAll",
      params: { pageNum: 1, pageSize: 100 }
    }).then(result => {
      this.roleList = result.data.list;
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
