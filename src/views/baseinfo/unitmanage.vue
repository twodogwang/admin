<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" :data="data" type="primary" icon="plus" @click="addInfo">新建</el-button>
          <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button> -->
          <el-cascader placeholder="请选择省市区" size="small" :options="options"  @change="searchcommunity">
    </el-cascader>    
    <el-select filterable @change="searchnper" size="small" v-model="searchfornper" :placeholder="placeholder1">
      <el-option v-for="item in communitylist" :key="item.id" :label="item.communityname" :value="item.communityid">
      </el-option>
    </el-select>
    <el-select filterable @change="searchbuilding" size="small" v-model="searchforbuilding" :placeholder="placeholder2">
      <el-option v-for="item in nperlist" :key="item.id" :label="item.npername" :value="item.communityid">
      </el-option>
    </el-select>
    <el-select filterable @change="searchunit" size="small" v-model="searchforunit" :placeholder="placeholder3">
      <el-option v-for="item in buildinglist" :key="item.id" :label="item.floorname" :value="item.floorid">
      </el-option>
    </el-select>
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search" placeholder="请输入单元名以查询"></el-input>
        </el-row>
        <el-table border :data="data" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="unitid" label="ID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitname" label="单元" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="floor.npername" label="物业" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="floor.floorname" label="楼栋" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="community.property" label="物业" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column label="关联" width="100">
            <template scope="scope">
              <el-button size="mini" type="primary" icon="circle-check" @click="cooperatecommunity(scope.$index, data)">关联楼栋</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="editInfo(scope.$index, data)">编辑</el-button>
              <el-button size="small" type="danger" @click="Delete(scope.$index, data)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination pageType="unit" :pageInfo="unitInfoChange"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :title="edit?'编辑':'新建'" :visible.sync="dialogFormVisible" :before-close="beforeclose">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="单元" prop="sImg">
          <el-input size="small" v-model="formState.unitname"></el-input>
        </el-form-item>      
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 关联 -->
    <el-dialog size="large" title="选择楼栋" :visible.sync="unitdialogFormVisible">
      <el-table border stripe :data="buildingInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" @row-click="correlateunit">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="floorname" label="楼栋" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="nper.npername" label="期数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="community.communityname" label="小区" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination is-search="none" pageType="building" :pageInfo="buildingPage"></Pagination>
    </el-dialog>
  </div>
</template>

<script>
import fetch from "@/utils/fetch";
import { regionData } from "element-china-area-data";
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/page.vue";
export default {
  data() {
    return {
      options: regionData,
      selectedOptions: [],
      selectedOptionsedit: [],
      loading: true,
      edit: true,
      dialogFormVisible: false,
      unitdialogFormVisible: false,
      formState: {},
      search: "",
      deleteState: true,
      selectedCorrelationunit: {},
      rules: {},
      datapasser: null,
      unitInfoChangepasser: null,
      searchforbuilding: "",
      searchfornper: '',
      searchforunit: '',
      communitylist: [],
      nperlist: [],
      buildinglist: [],
      placeholder1: "请先选择省市区",
      placeholder2: "请先选择小区",
      placeholder3: "请先选择楼栋"
    };
  },
  methods: {
    searchcommunity(code) {
      // 先通过省市区查询小区列表
      fetch({
        url: "/baseMessage/communities/selectCommByAreaCode",
        methods: "get",
        params: { areaCode: code[2] }
      }).then(result => {
        this.placeholder1 = "请选择小区";
        this.communitylist = result.data.list;
      });
    },
    searchnper(code) {
      // 先通过省市区查询小区列表
      fetch({
        url: "/baseMessage/unit/selectByCommunityId",
        methods: "get",
        params: { communityid: code }
      }).then(result => {
        this.placeholder2 = "请选择期数";
        this.nperlist = result.data.list;
      });
    },
    searchbuilding(code) {
      // 先通过省市区查询小区列表
      fetch({
        url: "/baseMessage/floor/selectByNperId",
        methods: "get",
        params: { nperid: code }
      }).then(result => {
        this.placeholder3 = "请选择楼栋";
        this.buildinglist = result.data.list;
      });
    },
    searchunit(code) {
      console.log(code);
      // 通过选择小区id查询期数
      fetch({
        url: "/baseMessage/unit/selectByFloorId",
        methods: "get",
        params: { floorid: code }
      }).then(result => {
        this.datapasser = result.data.list;
        this.unitInfoChangepasser = {
          pageSize: result.data.pageSize,
          pageNum: result.data.pageNum,
          totalItems: result.data.total
        };
      });
    },
    cooperatecommunity(index, rows) {
      // 关联小区
      this.unitdialogFormVisible = true;
      this.selectedCorrelationunit.unitid = rows[index].unitid;
      if (!this.unitInfo) {
        this.$store.dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "unit"
        });
      }
    },
    correlateunit(currentRow, oldCurrentRow) {
      this.$confirm("确定要关联吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return new Promise((resolve, reject) => {
          this.selectedCorrelationunit.floorid = currentRow.floorid;
          resolve();
        }).then(
          fetch({
            url: "/baseMessage/unit/toFloor",
            method: "post",
            params: this.selectedCorrelationunit
          })
            .then(() => {
              this.selectedCorrelationunit = {};
              this.unitdialogFormVisible = false;
              this.$store.dispatch("getInfo", {
                pageInfo: this.$store.getters.unitPage,
                type: "unit"
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
    addInfo() {
      // debugger;
      this.edit = false;
      this.dialogFormVisible = true;
      this.formState = {};
    },
    Deletes() {
      let deleteArr = this.multipleSelection.map(
        (currentValue, index, arr) => currentValue.unitid
      );
      deleteArr = deleteArr.join(",");
      if (deleteArr && deleteArr.length !== 0) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() =>
          this.$store
            .dispatch("deleteInfoes", {
              delete: { unitids: deleteArr },
              type: "unit"
            })
            .then(result => {
              this.$notify({
                title: "成功",
                message: "批量删除成功",
                type: "success",
                duration: 2000
              });
              // this.$store.dispatch('getInfo', this.$store.getters.unitPage);
            })
        );
      }
    },
    Delete(index, rows) {
      this.$confirm("此操作将永久删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("deleteInfo", {
              id: { unitid: rows[index].unitid },
              type: "unit"
            })
            .then(result => {
              if (result.code == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
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
    searcher() {
      // if (this.search && this.search !== '') {
      this.$store.dispatch("selectInfo", {
        data: {
          name: this.search,
          pageNum: 1,
          pageSize: this.$store.getters.unitPage.pageSize
        },
        type: "unit"
      });
      // }
    },
    editInfo(index, rows) {
      this.edit = true;
      this.dialogFormVisible = true;
      /* if (!this.unitType) {
        fetch({
          url: '/baseMessage/unitType/selectunitType',
          methods: 'get'
        }).then((result) => {
          this.unitType = result.data;
        });
      } */
      console.log("---index---", index);
      console.log("---rows---", rows);
      const rowData = rows[index];
      console.log(rowData);
      Object.assign(this.formState, rowData);
    },
    submitForm(form) {
      if (!this.edit) {
        console.log(this.formState.name);
        this.$store
          .dispatch("addInfo", { form: this.formState, type: "unit" })
          .then(() => {
            this.formState = {};
          });
      } else {
        this.$store
          .dispatch("updateInfo", {
            form: this.formState,
            type: "unit"
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
    Pagination
    // Pcc
  },
  computed: {
    ...mapGetters(["unitInfo", "unitPage", "buildingInfo", "buildingPage"]),
    data: {
      get: function() {
        return this.datapasser || this.unitInfo;
      },
      set: function(value) {
        return value;
      }
    },
    unitInfoChange: {
      get: function() {
        return this.unitInfoChangepasser || this.unitPage;
      },
      set: function(value) {
        console.log(value);
        return value;
      }
    }
  },
  mounted() {
    if (!this.$store.getters.unitPage) {
      this.$store
        .dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "unit"
        })
        .then(() => {
          this.loading = false;
        });
    } else {
      this.$store
        .dispatch("getInfo", {
          pageInfo: this.$store.getters.unitPage,
          type: "unit"
        })
        .then(() => {
          this.loading = false;
        });
    }
    if (!this.$store.getters.buildingPage) {
      this.$store
        .dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "building"
        })
        .then(() => {
          console.log(123);
          this.loading = false;
        });
    } else {
      this.$store
        .dispatch("getInfo", {
          pageInfo: this.$store.getters.buildingPage,
          type: "building"
        })
        .then(() => {
          console.log(123);
          this.loading = false;
        });
    }
    console.log(this.data);
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
