<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class='dr-datatable'>
        <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
        <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button> -->
        </el-row>
        <el-table :data="adminInfo" border align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="name" label="管理员名称" width="120">
          </el-table-column>
          <el-table-column prop="group.groupName" label="组" width="120">
          </el-table-column>
          <el-table-column prop="telnum" label="电话" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="description" label="备注" show-overflow-tooltip>
          </el-table-column>
           <el-table-column prop='statusCode' :formatter="statusFormatter" label='启用状态' show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="查看" width="150">
            <template scope="scope">
              <el-button size="mini" @click="showRoles(scope.$index, adminInfo)">查看角色</el-button>
              <el-button size='mini' @click='changeState(scope.$index, adminInfo)'>{{adminInfo[scope.$index].statusCode==1?'停用':'启用'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editAdminInfo(scope.$index, adminInfo)">编辑</el-button>
              <el-button size="mini" type="danger" @click="DeleteAdmin(scope.$index, adminInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType="admin" :pageInfo="adminPage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog size="large" title="查看角色" :visible.sync="roledialogFormVisible">
      <el-row class='dr-datatable'>
        <el-select size='small' v-model='newAddedRole' placeholder='请选择角色'>
          <el-option v-for='item in roleList' :key='item.id' :label='item.name' :value='item.id'>
          </el-option>
        </el-select>
        <el-button size="small" type="primary" icon="plus" @click="addrole">添加角色</el-button>
      </el-row>
      <el-table border stripe :data="roleInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" >
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="role.name" label="已有角色" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="role.description" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="role.type" label="类型" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- Form -->
    <el-dialog title='编辑' :visible.sync='editdialogFormVisible' :before-close='beforeclose'>
      <el-form :model='adminformState' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
        <el-form-item label='账号' prop='buildingId'>
          <el-input size='small' v-model='adminformState.name'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='name'>
          <el-input size='small' v-model='adminformState.password'></el-input>
        </el-form-item>
        <el-form-item label='组' prop=''>
          <el-select size='small' v-model='adminformState.groupId' placeholder='请选择群组'>
            <el-option v-for='item in groupList' :key='item.id' :label='item.name' :value='item.id'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='电话号码' prop='towernum'>
          <el-input placeholder='' size='small' v-model='adminformState.telnum'></el-input>
        </el-form-item>
        <el-form-item label='备注' prop='towernum'>
          <el-input placeholder='' size='small' v-model='adminformState.description'></el-input>
        </el-form-item>
        <el-form-item label='类别' prop='towernum'>
           <el-select v-model="adminformState.propertyId" placeholder="请选择">
            <el-option-group
              v-for="group in propertyType"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.propertyid"
                :label="item.propertyname"
                :value="item.propertyid">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item class='dr-submitContent'>
          <el-button size='small' type='primary' @click="submitForm('ruleForm')">确定</el-button>
          <el-button size='small' @click='editdialogFormVisible = false;adminformState = {  };'>取消</el-button>
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
      aId: "",
      loading: false,
      adminformState: { groupId: "", propertyId: "" },
      data: "",
      editdialogFormVisible: false,
      roledialogFormVisible: false,
      deleteState: true,
      multipleSelection: "",
      newAddedRole: "",
      rules: {},
      roleInfo: [],
      groupList: [],
      roleList: [],
      propertyType: [
        { options: [{ propertyname: "管理员", propertyid: 0 }], label: "管理员" },
        { label: "物业", options: [] }
      ]
    };
  },
  methods: {
    statusFormatter(row, column, value) {
      switch (value) {
        case "1":
          return "启用";
        case "0":
          return "停用";
      }
    },
    changeState(index, rows) {
      // 启用停用
      let tempCode = "";
      if (rows[index].statusCode == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseAdmin/admin/updateByStatus",
        method: "post",
        params: { id: rows[index].id, statusCode: tempCode }
      }).then(() => {
        tempCode = "";
        if (!this.$store.getters.adminPage) {
          this.$store.dispatch("getList", {
            pageInfo: {
              pageSize: 10,
              pageNum: 1
            },
            type: "admin"
          });
        } else {
          this.$store.dispatch("getList", {
            pageInfo: {
              pageNum: this.$store.getters.adminPage.pageNum,
              pageSize: this.$store.getters.adminPage.pageSize
            },
            type: "admin"
          });
        }
      });
    },
    editAdminInfo(index, rows) {
      console.log(this.groupList);
      this.edit = true;
      console.log("---index---", index);
      console.log("---rows---", rows);
      const rowData = rows[index];
      this.editdialogFormVisible = true;
      this.adminformState = rowData;
      this.editdialogFormVisible = true;
    },
    addInfo() {
      this.edit = false;
      this.editdialogFormVisible = true;
    },
    addrole() {
      fetch({
        url: "/baseAdmin/admin/addAdmin2Role",
        method: "post",
        params: {
          aId: Number(this.aId),
          rId: Number(this.newAddedRole)
        }
      }).then(result => {
        this.$notify({
          title: "成功",
          message: "添加角色成功",
          type: "success",
          duration: 1000
        });
        this.roledialogFormVisible = false;
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
              type: "admin"
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
    DeleteAdmin(index, rows) {
      this.$confirm("此操作将永久删除该鹳狸猿, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("deleteList", {
              id: { id: rows[index].id },
              type: "admin"
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
            form: this.adminformState,
            type: "admin"
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
            this.adminformState = {
              groupId: "",
              propertyId: ""
            };

            // }
          });
      } else {
        this.$store
          .dispatch("updateList", {
            form: this.adminformState,
            type: "admin"
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
            this.adminformState = {
              groupId: "",
              propertyId: ""
            };
            // }
          });
      }

      this.editdialogFormVisible = false;
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.adminformState = { groupId: "", propertyId: "" };
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    showRoles(index, rows) {
      this.roledialogFormVisible = true;
      this.aId = rows[index].id;
      fetch({
        url: "/baseAdmin/admin/selectRolesById",
        method: "get",
        params: { id: rows[index].id }
      }).then(result => {
        this.roleInfo = result.data;
      });
    }
  },
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(["adminInfo", "adminPage"])
  },
  mounted() {
    if (!this.$store.getters.adminInfo) {
      if (!this.$store.getters.adminPage) {
        this.$store.dispatch("getList", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "admin"
        });
      } else {
        this.$store.dispatch("getList", {
          pageInfo: {
            pageSize: this.$store.getters.adminPage.pageSize,
            pageNum: this.$store.getters.adminPage.pageNum
          },
          type: "admin"
        });
      }
    }
    fetch({
      url: "/baseMessage/group/groupList",
      params: { pageNum: 1, pageSize: 100 }
    }).then(result => {
      this.groupList = result.data.list;
    });
    fetch({
      url: "/baseAdmin/role/selectAll",
      params: { pageNum: 1, pageSize: 100 }
    }).then(result => {
      this.roleList = result.data.list;
    });
    fetch({
      url: "/baseMessage/property/selectAll",
      params: { pageNum: 1, pageSize: 100 }
    }).then(result => {
      /* const temp = result.data.list.slice(0);
      for (const i in temp) {
        temp[i].label = temp[i].propertyname;
        temp[i].value = temp[i].propertyid;
      }
      console.log(temp);
      this.propertyType[1].options = temp; */
      this.propertyType[1].options = result.data.list.slice(0);
      console.log(this.propertyType);
      // console.log(this.propertyType[1].children)
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
