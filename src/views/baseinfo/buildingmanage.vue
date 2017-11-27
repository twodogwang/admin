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
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search" placeholder="请输入楼栋名以查询"></el-input>
        </el-row>
        <el-table border :data="buildingInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="floorid" label="ID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="floorname" label="楼栋" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="nper.npername" label="期数" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="community.communityname" label="小区" show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="community.property" label="物业" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column label="关联" width="100">
            <template scope="scope">
              <el-button size="mini" type="primary" icon="circle-check" @click="cooperatecommunity(scope.$index, data)">关联期数</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="editInfo(scope.$index, data)">编辑</el-button>
              <el-button size="small" type="danger" @click="Delete(scope.$index, data)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :is-search="isSearch" :search-params="searchParams" :search-params2="searchParams2" pageType="building" :pageInfo="buildingPage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :title="edit?'编辑':'新建'" :visible.sync="dialogFormVisible" :before-close="beforeclose">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="楼栋名" prop="sImg">
          <el-input size="small" v-model="formState.floorname"></el-input>
        </el-form-item>      
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 关联 -->
    <el-dialog size="large" title="选择期数" :visible.sync="buildingdialogFormVisible">
      <el-table border stripe :data="nperInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" @row-click="correlatebuilding">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="npername" label="期数名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="community.communityname" label="小区名" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination is-search="none" pageType="nper" :pageInfo="nperPage"></Pagination>
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
      buildingdialogFormVisible: false,
      formState: {},
      search: "",
      deleteState: true,
      selectedCorrelationbuilding: {},
      rules: {},
      datapasser: null,
      buildingInfoChangepasser: null,
      searchforbuilding: "",
      searchfornper: "",
      communitylist: [],
      nperlist: [],
      placeholder1: "请先选择省市区",
      placeholder2: "请先选择小区",
      isSearch: "none",
      searchParams: null,
      searchParams2: null
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
        this.communitylist = result.data;
      });
    },
    searchnper(code) {
      // 先通过省市区查询小区列表
      fetch({
        url: "/baseMessage/nper/selectByCommunityId",
        methods: "get",
        params: { communityid: code }
      }).then(result => {
        this.placeholder2 = "请选择期数";
        this.nperlist = result.data;
      });
    },
    searchbuilding(code) {
      this.isSearch = "codeSearch";
      this.searchParams = { nperid: code };
      this.$store.dispatch("selectInfoById", {
        data: this.searchParams,
        page: { pageNum: 1, pageSize: 10 },
        type: "building"
      });
    },
    cooperatecommunity(index, rows) {
      // 关联小区
      this.buildingdialogFormVisible = true;
      this.selectedCorrelationbuilding.floorid = rows[index].floorid;
      if (!this.buildingInfo) {
        this.$store.dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "building"
        });
      }
    },
    correlatebuilding(currentRow, oldCurrentRow) {
      this.$confirm("确定要关联吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return new Promise((resolve, reject) => {
          this.selectedCorrelationbuilding.nperid = currentRow.nperid;
          resolve();
        }).then(
          fetch({
            url: "/baseMessage/floor/uptade2Nper",
            method: "post",
            params: this.selectedCorrelationbuilding
          })
            .then(() => {
              this.selectedCorrelationbuilding = {};
              this.buildingdialogFormVisible = false;
              this.$store.dispatch("getInfo", {
                pageInfo: this.$store.getters.buildingPage,
                type: "building"
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
        (currentValue, index, arr) => currentValue.buildingid
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
              delete: { buildingids: deleteArr },
              type: "building"
            })
            .then(result => {
              this.$notify({
                title: "成功",
                message: "批量删除成功",
                type: "success",
                duration: 2000
              });
              // this.$store.dispatch('getInfo', this.$store.getters.buildingPage);
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
          this.$store
            .dispatch("deleteInfo", {
              id: { floorid: rows[index].floorid },
              type: "building"
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
      this.isSearch = "paramsSearch";
      this.searchParams2 = {
        floorname: this.search,
        pageNum: 1,
        pageSize: this.$store.getters.buildingPage.pageSize
      };
      this.$store.dispatch("selectInfo", {
        data: this.searchParams2,
        type: "building"
      });
      // }
    },
    editInfo(index, rows) {
      this.edit = true;
      this.dialogFormVisible = true;
      /* if (!this.buildingType) {
        fetch({
          url: '/baseMessage/buildingType/selectbuildingType',
          methods: 'get'
        }).then((result) => {
          this.buildingType = result.data;
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
          .dispatch("addInfo", { form: this.formState, type: "building" })
          .then(() => {
            /* this.formState.name = null;
          this.selectedOptions = null;
          this.formState.areaCode = null;
          this.formState.communitiesCode = null; */
            this.formState = {};
          });
      } else {
        this.$store
          .dispatch("updateInfo", {
            form: this.formState,
            type: "building"
          })
          .then(() => {
            this.formState = {};
          });
      }
      this.dialogFormVisible = false;
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        /* this.formState.name = null;
        this.selectedOptions = null;
        this.formState.areaCode = null;
        this.formState.communitiesCode = null; */
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
    ...mapGetters(["buildingInfo", "buildingPage", "nperInfo", "nperPage"]),
    data: {
      get: function() {
        return this.datapasser || this.buildingInfo;
      },
      set: function(value) {
        return value;
      }
    },
    buildingInfoChange: {
      get: function() {
        return this.buildingInfoChangepasser || this.buildingPage;
      },
      set: function(value) {
        console.log(value);
        return value;
      }
    }
  },
  mounted() {
    console.log(this.loading);
    // debugger;
    // if (!this.$store.getters.buildingInfo) {
    if (!this.$store.getters.buildingPage) {
      this.$store
        .dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "building"
        })
        .then(() => {
          console.log(123);
          this.loading = false;
          // this.data = this.buildingInfo;
          // this.buildingInfoChange = this.buildingPage;
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
          // this.data = this.buildingInfo;
          // this.buildingInfoChange = this.buildingPage;
        });
    }
    if (!this.$store.getters.nperPage) {
      this.$store
        .dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "nper"
        })
        .then(() => {
          console.log(123);
          this.loading = false;
        });
    } else {
      this.$store
        .dispatch("getInfo", {
          pageInfo: this.$store.getters.nperPage,
          type: "nper"
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
