<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" :data="data" type="primary" icon="plus" @click="addInfo">新建</el-button>
          <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button> -->
          <!-- <el-cascader placeholder="请选择省市区" size="small" :options="options"  @change="searchcommunity">
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
    <el-select filterable @change="searchterminal" size="small" v-model="searchforterminal" :placeholder="placeholder4">
      <el-option v-for="item in unitlist" :key="item.id" :label="item.unitterminal" :value="item.unitid">
      </el-option>
    </el-select> -->
     <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search.communityname" placeholder="请输入小区名以查询"></el-input>
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search.tnum" placeholder="请输入设备名以查询"></el-input>
        </el-row>
        <el-table border :data="data" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column type="index" width="65">
          </el-table-column>
          <el-table-column prop="id" label="ID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="设备名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tnum" label="设备编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="terminaltypeId" :formatter="Formatter" label="类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="macnum" label="MAC地址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="group.name" label="群组" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="communityname" label="小区名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="关联" >
            <template scope="scope">
              <el-button size="mini" type="primary" icon="circle-check" @click="set(scope.$index, data,'sleep')">设置休眠</el-button>
              <el-button size="mini" type="primary" icon="circle-check" @click="set(scope.$index, data,'community')">分配小区</el-button>
              <el-button size="mini" type="primary" icon="circle-check" @click="set(scope.$index, data,'room')">分配房间</el-button>
              <el-button size="mini" type="primary" icon="circle-check" @click="set(scope.$index, data,'user')">分配用户</el-button>
            </template>
          </el-table-column>
          <el-table-column label="查看信息" >
            <template scope="scope">
              <el-button size="mini" type="primary" icon="circle-check" @click="gets(scope.$index, data,'room')">查看房间</el-button>
              <el-button size="mini" type="primary" icon="circle-check" @click="gets(scope.$index, data,'user')">查看用户</el-button>
              <el-button size="mini" type="primary" icon="circle-check" @click="gets(scope.$index, data,'sleep')">查看休眠</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="editInfo(scope.$index, data)">编辑</el-button>
              <el-button size="small" type="danger" @click="Delete(scope.$index, data)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :is-search="isSearch" :search-params="searchParams" :search-params2="searchParams2" pageType="terminal" :pageInfo="terminalInfoChange"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :title="edit?'编辑':'新建'" :visible.sync="dialogFormVisible" :before-close="beforeclose">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="设备名称" prop="sImg">
          <el-input size="small" v-model="formState.name"></el-input>
        </el-form-item> 
        <el-form-item label="设备编号" prop="sImg">
          <el-input size="small" v-model="formState.tnum"></el-input>
        </el-form-item>  
        <el-form-item label="设备类型">
          <el-select size="small" v-model="formState.terminaltypeId">
            <el-option label="云智屏" value="0"></el-option>
            <el-option label="拓展屏" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="MAC地址" prop="sImg">
          <el-input size="small" v-model="formState.macnum"></el-input>
        </el-form-item>  
        <el-form-item label="组" prop="sImg">
          <el-select size="small" v-model="formState.groupId">
            <el-option v-for="(item,index) in grouplist" :key="index" :label="item.name" :value="item.id"></el-option>            
          </el-select>
        </el-form-item>       
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={terminaltypeId:''}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 关联 -->
    <el-dialog size="large" title="选择" :visible.sync="corrdialogFormVisible" @before-close="selectedCorrelation={}">
      <el-table border stripe :data="corrInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" @row-click="correlate">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column v-for="(column,index) in corrColumns" :key="index" :prop="column.prop" :label="column.label" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination is-search="none" :pageType="corrpageType" :pageInfo="corrpageInfo"></Pagination>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog size="large" title="查看" :visible.sync="viewdialogFormVisible">
      <el-table border stripe :data="viewInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" >
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column v-for="(column,index) in viewColumns" :key="index" :prop="column.prop" :label="column.label" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="150">
            <template scope="scope">
              <!-- <el-button size="small" @click="editInfo(scope.$index, data)">编辑</el-button> -->
              <el-button size="small" type="danger" @click="DeleteTerminal(scope.$index, viewInfo)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination class="dr-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="viewpageInfo.pageNum" :page-size="viewpageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="viewpageInfo.totalItems"></el-pagination>
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
      type: "",
      terminalId: "",
      corrColumns: [],
      corrInfo: [],
      corrpageType: "",
      corrpageInfo: null,
      viewColumns: [],
      viewInfo: [],
      viewpageInfo: {},
      options: regionData,
      selectedOptions: [],
      selectedOptionsedit: [],
      loading: true,
      edit: true,
      dialogFormVisible: false,
      corrdialogFormVisible: false,
      viewdialogFormVisible: false,
      formState: { terminaltypeId: "", groupId: "" },
      grouplist: [],
      search: {},
      deleteState: true,
      selectedCorrelation: {},
      rules: {},
      datapasser: null,
      terminalInfoChangepasser: null,
      searchforbuilding: "",
      searchfornper: "",
      searchforunit: "",
      searchforterminal: "",
      communitylist: [],
      nperlist: [],
      buildinglist: [],
      unitlist: [],
      currentPageType: "",
      placeholder1: "请先选择省市区",
      placeholder2: "请先选择小区",
      placeholder3: "请先选择楼栋",
      placeholder4: "请先选择单元",
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
    searchterminal(code) {
      fetch({
        url: "/baseMessage/floor/selectByNperId",
        methods: "get",
        params: { nperid: code }
      }).then(result => {
        this.placeholder4 = "请选择单元";
        this.unitlist = result.data.list;
      });
    },
    searchunit(code) {
      console.log(code);
      // 通过选择小区id查询期数
      fetch({
        url: "/baseMessage/door/selectByNuitId",
        methods: "get",
        params: { unitid: code }
      }).then(result => {
        this.datapasser = result.data.list;
        this.unitInfoChangepasser = {
          pageSize: result.data.pageSize,
          pageNum: result.data.pageNum,
          totalItems: result.data.total
        };
      });
    },
    set(index, rows, type) {
      // 关联
      switch (type) {
        case "sleep":
          this.corrColumns = [
            { label: "编号", prop: "dormancyNum" },
            { label: "休眠名称", prop: "name" },
            { label: "开始时间", prop: "startTime" },
            { label: "结束时间", prop: "stopTime" }
          ];
          break;
        case "community":
          this.corrColumns = [
            { label: "区", prop: "area" },
            { label: "小区名", prop: "communityname" }
          ];
          break;
        case "room":
          this.corrColumns = [
            { label: "小区", prop: "community.communityname" },
            { label: "期数", prop: "nper.npername" },
            { label: "楼栋", prop: "floor.floorname" },
            { label: "单元", prop: "unit.unitname" },
            { label: "房间", prop: "doorname" }
          ];
          break;
        case "user":
          this.corrColumns = [
            { label: "姓名", prop: "realname" },
            { label: "手机号", prop: "mobilephone" }
          ];
          break;
      }
      this.corrInfo = this[`${type}Info`];
      this.selectedCorrelation.terminalId = rows[index].id;
      this.corrdialogFormVisible = true;
      if (type == "community") {
        this.$store
          .dispatch("getInfo", {
            pageInfo: { pageSize: 10, pageNum: 1 },
            type: type
          })
          .then(result => {
            this.corrInfo = this[`${type}Info`];
            this.corrpageType = type;
            this.corrpageInfo = this[`${type}Page`];
          });
      } else if (type == "room") {
        return fetch({
          url: "/baseMessage/terminal/selectDoorByComId",
          params: {
            pageNum: 1,
            pageSize: 10,
            communityid: rows[index].communityid
          }
        }).then(result => {
          this.corrInfo = result.data.list;
          this.corrpageType = type;
          this.corrpageInfo = this[`${type}Page`];
        });
      } else if (type == "user") {
        return fetch({
          url: "/baseMessage/terminal/selectAllByDoorId",
          params: {
            pageNum: 1,
            pageSize: 10,
            communityid: rows[index].doorid
          }
        }).then(result => {
          this.corrInfo = result.data.list;
          this.corrpageType = type;
          this.corrpageInfo = this[`${type}Page`];
        });
      }
    },
    gets(index, rows, type) {
      let url = "";
      switch (type) {
        case "sleep":
          url = "/baseMessage/terminal/selectDorByTerId";
          this.currentPageType = "sleep";
          this.viewColumns = [
            { label: "编号", prop: "dormancyNum" },
            { label: "休眠名称", prop: "name" },
            { label: "开始时间", prop: "startTime" },
            { label: "结束时间", prop: "stopTime" }
          ];
          break;
        case "community":
          this.viewColumns = [
            { label: "区", prop: "area" },
            { label: "小区名", prop: "communityname" }
          ];
          break;
        case "room":
          url = "/baseMessage/terminal/selectDoorByTerminalId";
          this.currentPageType = "room";
          this.viewColumns = [
            { label: "小区", prop: "community.communityname" },
            { label: "期数", prop: "nper.npername" },
            { label: "楼栋", prop: "floor.floorname" },
            { label: "单元", prop: "unit.unitname" },
            { label: "房间", prop: "doorname" }
          ];
          break;
        case "user":
          url = "/baseMessage/terminal/selectCusByTerId";
          this.currentPageType = "user";
          this.viewColumns = [
            { label: "姓名", prop: "realname" },
            { label: "手机号", prop: "mobilephone" }
          ];
          break;
      }
      this.viewdialogFormVisible = true;
      fetch({
        url,
        params: { terminalId: rows[index].id, pageNum: 1, pageSize: 10 }
      }).then(result => {
        this.viewInfo = result.data.list;
        this.viewpageInfo = {
          pageSize: result.data.pageSize,
          pageNum: result.data.pageNum,
          totalItems: result.data.total
        };
      });
    },
    DeleteTerminal(index, rows) {
      let url = "";
      switch (this.currentPageType) {
        case "sleep":
          url = "/baseMessage/terminal/deleteDorById";
          break;
        case "room":
          url = "/baseMessage/terminal/deleteDoorById";
          break;
        case "user":
          url = "/baseMessage/terminal/deleteCusByTerId";
          break;
      }
      fetch({
        url,
        method: "get",
        params: { id: rows[index].id }
      }).then(result => {
        rows.splice(index, 1);
      });
    },
    handleSizeChange(val) {
      let url = "";
      switch (this.currentPageType) {
        case "sleep":
          url = "/baseMessage/terminal/selectDorByTerId";
          break;
        case "room":
          url = "/baseMessage/terminal/selectDoorByTerminalId";
          break;
        case "user":
          url = "/baseMessage/terminal/selectCusByTerId";
          break;
      }
      fetch({
        url,
        params: { terminalId: this.terminalId, pageNum: 1, pageSize: val }
      }).then(result => {
        this.viewInfo = result.data.list;
        this.viewpageInfo = {
          pageSize: result.data.pageSize,
          pageNum: result.data.pageNum,
          totalItems: result.data.total
        };
      });
    },
    handleCurrentChange(val) {
      let url = "";
      switch (this.currentPageType) {
        case "sleep":
          url = "/baseMessage/terminal/selectDorByTerId";
          break;
        case "room":
          url = "/baseMessage/terminal/selectDoorByTerminalId";
          break;
        case "user":
          url = "/baseMessage/terminal/selectCusByTerId";
          break;
      }
      fetch({
        url,
        params: {
          terminalId: this.terminalId,
          pageNum: val,
          pageSize: this.viewpageInfo.pageSize
        }
      }).then(result => {
        this.viewInfo = result.data.list;
        this.viewpageInfo = {
          pageSize: result.data.pageSize,
          pageNum: result.data.pageNum,
          totalItems: result.data.total
        };
      });
    },
    correlate(currentRow, oldCurrentRow) {
      let url = "";
      switch (currentRow.cqyxy) {
        case "dormancy":
          url = "/baseMessage/terminal/addTerminal2Dormancy";
          this.selectedCorrelation.dormancyId = currentRow.id;
          break;
        case "communities":
          url = "/baseMessage/terminal/addTerCommunity";
          this.selectedCorrelation.communityid = currentRow.communityid;
          this.selectedCorrelation.communityname = currentRow.communityname;
          break;
        case "door":
          url = "/baseMessage/terminal/addTerDoor";
          this.selectedCorrelation.doorid = currentRow.doorid;
          break;
        case "customer":
          url = "/baseMessage/terminal/addTerCus";
          this.selectedCorrelation.cMemberid = currentRow.cMemberid;
          this.selectedCorrelation.mobilephone = currentRow.mobilephone;
          break;
      }
      this.$confirm("确定要关联吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return new Promise((resolve, reject) => {
          resolve();
        }).then(
          fetch({
            url: url,
            method: "post",
            params: this.selectedCorrelation
          })
            .then(result => {
              if (result.code == 0) {
                // this.corrdialogFormVisible = false;
                this.$message({
                  showClose: true,
                  message: "恭喜你，关联成功！",
                  type: "success"
                });
              } else {
                this.$message({
                  type: "info",
                  message: "关联未成功"
                });
              }
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
      this.edit = false;
      this.dialogFormVisible = true;
      this.formState = { terminaltypeId: "", groupId: "" };
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
              type: "terminal"
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
          this.$store
            .dispatch("deleteInfo", {
              id: { terminalId: rows[index].id },
              type: "terminal"
            })
            .then(result => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
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
        communityname: this.search.communityname,
        tnum: this.search.tnum,
        pageNum: 1,
        pageSize: this.$store.getters.terminalPage.pageSize
      };
      this.$store.dispatch("selectInfo", {
        data: this.searchParams2,
        type: "terminal"
      });
      // }
    },
    editInfo(index, rows) {
      this.edit = true;
      this.dialogFormVisible = true;
      console.log("---index---", index);
      console.log("---rows---", rows);
      const rowData = rows[index];
      console.log(rowData);
      Object.assign(this.formState, rowData);
    },
    submitForm(form) {
      if (!this.edit) {
        this.$store
          .dispatch("addInfo", { form: this.formState, type: "terminal" })
          .then(() => {
            this.formState = { terminaltypeId: "", groupId: "" };
          });
      } else {
        this.$store
          .dispatch("updateInfo", {
            form: this.formState,
            type: "terminal"
          })
          .then(() => {
            this.formState = { terminaltypeId: "", groupId: "" };
          });
      }
      this.dialogFormVisible = false;
    },
    beforeclose(done) {
      return new Promise((resolve, reject) => {
        console.log("beforeclose");
        this.formState = { terminaltypeId: "", groupId: "" };
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    Formatter(row, column, cellValue) {
      switch (cellValue) {
        case "0":
          return "云智屏";
        case "1":
          return "拓展屏";
      }
    }
  },
  components: {
    Pagination
    // Pcc
  },
  computed: {
    ...mapGetters([
      "roomInfo",
      "roomPage",
      "terminalInfo",
      "terminalPage",
      "userInfo",
      "userPage",
      "sleepInfo",
      "sleepPage",
      "communityInfo",
      "communityPage"
    ]),
    data: {
      get: function() {
        return this.datapasser || this.terminalInfo;
      },
      set: function(value) {
        return value;
      }
    },
    terminalInfoChange: {
      get: function() {
        return this.terminalInfoChangepasser || this.terminalPage;
      },
      set: function(value) {
        console.log(value);
        return value;
      }
    }
  },
  watch: {
    roomInfo: function() {
      this.corrInfo = this.roomInfo;
    },
    communityInfo: function() {
      this.corrInfo = this.communityInfo;
    },
    userInfo: function() {
      this.corrInfo = this.userInfo;
    },
    sleepInfo: function() {
      this.corrInfo = this.sleepInfo;
    }
  },
  mounted() {
    if (!this.$store.getters.terminalInfo) {
      this.$store
        .dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "terminal"
        })
        .then(() => {
          this.loading = false;
        });
    } else {
      this.$store
        .dispatch("getInfo", {
          pageInfo: this.$store.getters.terminalPage,
          type: "terminal"
        })
        .then(() => {
          this.loading = false;
        });
    }
    fetch({
      url: "/baseMessage/group/groupList?pageSize=100&pageNum=1",
      method: "get"
    }).then(result => {
      this.grouplist = result.data.list;
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
.dr-pagination {
  text-align: center;
  margin: 15px auto;
}
</style>
