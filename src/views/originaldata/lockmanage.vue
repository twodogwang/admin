<template>
  <div>
      <el-row class="dr-datatable">
            <el-col :span="24">
                <el-row class="dr-datatable">
                    关键字搜索:<el-input v-model="searchString" size="small" placeholder="请选择小区" class="serchSelect">
                    </el-input>
                    <el-button size="small" type="primary" icon="search" class="serchBtn" @click="searchLock">搜索</el-button>
                    <el-button size="small" type="primary" icon="search" class="addBtn" @click="addLock">添加</el-button>
                    <h3>门禁锁列表</h3>
                </el-row>
            
             <el-table border :data="lockmanageInfo" align="center" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
               <el-table-column prop="doorName" label="门禁锁名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="snCode" label="门禁锁编码" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatPayState" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="propertyName" label="物业名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="communityName" label="小区名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="nperName" label="期数名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="floorName" label="楼栋名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="unitName" label="单元名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column   label="操作" width="150">
                    <template scope="scope">
                        <el-button size="small" type="info" @click="opendialog(scope.$index, lockmanageInfo)">编辑</el-button>
                        <el-button size="small" type="danger" @click="DeleteLockmanageInfo(scope.$index, lockmanageInfo)">删除</el-button>
                    </template>
                </el-table-column>
             </el-table>
             <Pagination pageType="getLockmanageInfo" :searchString="searchString" searchType="searchLockmanageInfo" :pageInfo="lockmanagePage"></Pagination>
            </el-col>
      </el-row>
      <el-dialog
        :title="menjinTitle"
        :visible.sync="dialogFormVisible"
        width="30%">
        <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="门禁锁名称" prop="sImg">
            <el-input size="small" v-model="formState.doorName"></el-input>
          </el-form-item>
          <el-form-item label="门禁锁编码" prop="sImg">
            <el-input size="small" v-model="formState.snCode"></el-input>
          </el-form-item>   
          <el-form-item label="门禁锁类型" prop="sImg">
            <el-select v-model="formState.type" size="small" placeholder="请选择门禁锁类型" class="serchSelect" @change="changeLockType">
              <el-option
                  v-for="item in lockType"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>   
          <el-form-item label="小区" prop="sImg">
            <el-select v-model="formState.communityId" size="small" placeholder="请选择小区" class="serchSelect" @change="changeCommunities">
                <el-option
                    v-for="item in communities"
                    :key="item.communityid"
                    :label="item.communityname"
                    :value="item.communityid">
                </el-option>
            </el-select>
          </el-form-item>   
          <el-form-item label="期数" prop="sImg" v-if="selectVisible">
            <el-select v-model="formState.nperId" size="small" placeholder="请选择期数" class="serchSelect" @change="changeNper">
                <el-option
                    v-for="item in nper"
                    :key="item.nperid"
                    :label="item.npername"
                    :value="item.nperid"
                    >
                </el-option>
            </el-select>
          </el-form-item>   
          <el-form-item label="楼栋" prop="sImg" v-if="selectVisible">
            <el-select v-model="formState.floorId" size="small" placeholder="请选择楼栋" class="serchSelect" @change="changeFloor">
                <el-option
                    v-for="item in floor"
                    :key="item.floorid"
                    :label="item.floorname"
                    :value="item.floorid"
                    >
                </el-option>
            </el-select>
          </el-form-item>     
          <el-form-item label="单元" prop="sImg" v-if="selectVisible">
            <el-select v-model="formState.unitId" size="small" placeholder="请选择单元" class="serchSelect" @change="changeUnit">
                <el-option
                    v-for="item in unit"
                    :key="item.unitname"
                    :label="item.unitname"
                    :value="item.unitid">
                </el-option>
            </el-select>
          </el-form-item>   
          <el-form-item class="dr-submitContent" v-show="showBtn">
            <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button size="small" @click="dialogFormVisible = false;formState={};dialogFormVisible=false">取消</el-button>
          </el-form-item>
          <el-form-item class="dr-submitContent" v-show="showBtn2">
            <el-button size="small" type="primary" @click="upLock">确定</el-button>
            <el-button size="small" @click="dialogFormVisible = false;formState={};dialogFormVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/pageLXL.vue";
import fetch from "@/utils/fetch";
import qs from "qs";
export default {
  name: "lickmanage",
  data() {
    return {
      showBtn:true,
      showBtn2:false,
      menjinTitle:"添加门禁",
      searchString:"",
      dialogFormVisible:false,
      selectVisible:false,
      formState:{
        type:"",
        communityId:"",
        nperId:"",
        floorId:"",
        unitId:"",
        doorName:"",
        snCode:""
      },
      lockId:"",
      rules: {},
      lockType:[{
        type:1,
        name:"小区大门锁"
      },{
        type:2,
        name:"单元楼门锁"
      }]
    };
  },
  components: {
    Pagination
  },
  methods: {
    opendialog(index,row){
      this.lockId = row[index].lockId
      this.menjinTitle = "编辑门禁"
      this.showBtn = false
      this.showBtn2 = true
      this.dialogFormVisible = !this.dialogFormVisible
      this.formState.doorName = row[index].doorName
      this.formState.snCode = row[index].snCode
    },
    upLock(){
      this.dialogFormVisible = !this.dialogFormVisible
      if(this.formState.type == 1){
        this.$store.dispatch("upLock",{
          lock:{
            lockId:this.lockId,
            doorName:this.formState.doorName,
            snCode:this.formState.snCode,
            type:this.formState.type,
            communityId:this.formState.communityId
          }
        }).then(() => {
          this.loading = false;
        })
      }else{
        this.$store.dispatch("upLock",{
          lock:{
            lockId:this.lockId,
            doorName:this.formState.doorName,
            snCode:this.formState.snCode,
            type:this.formState.type,
            communityid:this.formState.communityId,
            nperid:this.formState.nperId,
            floorid:this.formState.floorId,
            unitid:this.formState.unitId
          }
        }).then(() => {
          this.loading = false;
        })
      }
    },
    submitForm(form) {
        this.$store.dispatch("addLock", {
            lock: this.formState,
          })
          .then(() => {
            this.formState = {};
          });
      this.dialogFormVisible = false;
    },
    addLock(){
      this.dialogFormVisible = !this.dialogFormVisible
      this.showBtn = true
      this.showBtn2 = false
      this.menjinTitle = "添加门禁"
    },
    searchLock(){
        this.$store.dispatch("searchLockmanageInfo",{
          content: { pageSize: 10, pageNum: 1, search: this.searchString }
        }).then(() => {
          this.loading = false;
        })
    },
    formatPayState(row, cloumu, value) {
      switch (value) {
        case 1:
          return "小区大门锁";
        default:
          return "单元楼门锁";
      }
    },
    // formatTime(row, cloumu, value){
    //     console.log("value",value,typeof value)
    //     return new Date(value).toLocaleString();
    // },
    DeleteLockmanageInfo(index, rows) {
      this.$store.dispatch("deleteLockmanageInfo",{
        lockId:{lockId:rows[index].lockId}
      }).then(() => {
        this.loading = false;
      })
    },
    changeLockType(val){
      if(val === 2){
        this.selectVisible = true
      }else{
        this.selectVisible = false
      }
    },
    changeCommunities(val) {
      if(!val){
        return;
      }
      this.formState.nperId = "";
      this.formState.floorId = "";
      this.formState.unitId = "";
      this.$store.dispatch("getNper", {
        pageInfo: {communityid:this.formState.communityId}
      }).then(() => {
        this.loading = false;
      });
    },
    changeNper(val){
      if(!val){
        return;
      }
      this.$store.dispatch("getFloor", {
        pageInfo: {nperid:this.formState.nperId}
      }).then(() => {
        this.loading = false;
      });
    },
    changeFloor(val){
      if(!val){
        return;
      }
      this.$store.dispatch("getUnit", {
        pageInfo: {floorid:this.formState.floorId}
      }).then(() => {
        this.loading = false;
      });
    },
    changeUnit(val){
      if(!val){
        return;
      }
      this.$store.dispatch("getRoom", {
        pageInfo: {unitid:this.formState.unitId}
      }).then(() => {
        this.loading = false;
      });
    },
  },
  beforeCreate() {
    if (!this.$store.getters.lockmanageInfo) {
      if (!this.$store.getters.lockmanagePage) {
        this.$store
          .dispatch("getLockmanageInfo", {
            pageInfo: { pageSize: 10, pageNum: 1, search: "" }
          })
          .then(() => {
            console.log("getLockmanageInfo");
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("getLockmanageInfo", {
            pageInfo: this.$store.getters.lockmanageInfo
          }).then(() => {
            console.log("getLockmanageInfo");
            this.loading = false;
          });
      }
    }
    this.$store.dispatch("getCommunities").then(() => {
      this.loading = false;
    });
  },
  
  computed: {
    ...mapGetters(["lockmanageInfo", "lockmanagePage"]),
    communities() {
      return this.$store.state.getwuyeinfo.LXLcommunities.content;
    },
    nper() {
      return this.$store.state.getwuyeinfo.LXLnper.content;
    },
    floor() {
      console.log("LXLfloor", this.$store.state.getwuyeinfo.LXLfloor);
      return this.$store.state.getwuyeinfo.LXLfloor.content;
    },
    unit() {
      return this.$store.state.getwuyeinfo.LXLunit.content;
    }
  }
};
</script>

<style>
.serchSelect {
  width: 200px;
  margin-right: 10px;
}
.serchBtn {
  margin-left: 20px;
}
.wuyefeiinput {
  margin-top: 10px;
  display: inline-block;
}
.infoInput {
  width: 150px;
}
.timepicker {
  display: block;
}
.moneyperm2 {
  width: 20%;
}
.dia1Box label{
  display: inline-block;
  text-align: right;
  font-size: 18px;
  width:5em;
}
</style>
