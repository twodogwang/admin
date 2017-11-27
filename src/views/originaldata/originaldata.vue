<template>
    <div>
        <el-row class="dr-datatable">
            <el-col :span="24">
                <el-row class="dr-datatable">
                    小区:<el-select v-model="searchObj.community_id" size="small" placeholder="请选择小区" class="serchSelect" @change="changeCommunities">
                        <el-option
                            v-for="item in communities"
                            :key="item.communityid"
                            :label="item.communityname"
                            :value="item.communityid">
                        </el-option>
                    </el-select>
                    期数:<el-select v-model="searchObj.nper_id" size="small" placeholder="请选择期数" class="serchSelect" @change="changeNper">
                        <el-option
                            v-for="item in nper"
                            :key="item.nperid"
                            :label="item.npername"
                            :value="item.nperid"
                            >
                        </el-option>
                    </el-select>
                    楼栋:<el-select v-model="searchObj.floor_id" size="small" placeholder="请选择楼栋" class="serchSelect" @change="changeFloor">
                        <el-option
                            v-for="item in floor"
                            :key="item.floorid"
                            :label="item.floorname"
                            :value="item.floorid"
                            >
                        </el-option>
                    </el-select>
                    单元:<el-select v-model="searchObj.unit_id" size="small" placeholder="请选择单元" class="serchSelect" @change="changeUnit">
                        <el-option
                            v-for="item in unit"
                            :key="item.unitid"
                            :label="item.unitname"
                            :value="item.unitid"
                            >
                        </el-option>
                    </el-select>
                    房间:<el-select v-model="searchObj.door_id" size="small" placeholder="请选择房间" class="serchSelect">
                        <el-option
                            v-for="item in room"
                            :key="item.doorid"
                            :label="item.doorname"
                            :value="item.doorid"
                            >
                        </el-option>
                    </el-select>
                    <el-button size="small" type="primary" icon="search" class="serchBtn" @click="searchOriginalData">搜索</el-button>
                    <!-- <el-button size="small" type="primary" icon="plus" class="luruBtn">录入新信息</el-button> -->
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="http://47.92.106.249:8089/xyzhiping/baseMessage/owner/importOwner"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :file-list="file"
                      :on-success="importSuccess"
                      name="file"
                      :with-credentials="true"
                      :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入业主信息</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="addyezhu">添加业主(单个)</el-button>
                      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                    
                    <h3>业主原始资料管理</h3>
                </el-row>
                <el-table border :data="OriginalDataInfo" align="center" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
                    <el-table-column prop="ownerPhone" label="手机号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="ownerName" label="姓名" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="o_community" label="小区" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="o_nper" label="期数" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="o_floor" label="楼栋" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="o_unit" label="单元" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="o_door" label="房间" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column   label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" type="info" @click="opendialog(scope.$index, OriginalDataInfo)">编辑</el-button>
                            <el-button size="small" type="danger" @click="DeleteOriginalDataInfo(scope.$index, OriginalDataInfo)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination pageType="GetOriginalDataInfo" :pageInfo="OriginalDataPage" :searchObj="searchObj" searchType="searchOriginalData"></Pagination>
            </el-col>
        </el-row>
        <el-dialog title="编辑业主资料" v-model="dialogVisible" :close-on-click-modal="false">
            <div>
            姓&nbsp;&nbsp;&nbsp;名<el-input icon="people" class="dialogInput" placeholder="请输入业主姓名" v-model="ownerName"></el-input>
            </div>
            <div class="dialogDiv">
            手机号<el-input icon="people" class="dialogInput" placeholder="请输入业主手机号" v-model="ownerPhone"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="addLoading" @click="updateOriginalDataInfo">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog width="20%" title="添加业主资料" v-model="dialogVisible2" :close-on-click-modal="false">
          <el-form :model="newYezhu" label-width="120px" >
            <el-form-item label="业主姓名" prop="ownerName">
              <el-input size="small" v-model="newYezhu.ownerName"></el-input>
            </el-form-item>
            <el-form-item label="业主电话" prop="ownerPhone">
              <el-input size="small" v-model="newYezhu.ownerPhone"></el-input>
            </el-form-item>
            <el-form-item label="物业名称" prop="o_property">
              <el-input size="small" v-model="newYezhu.o_property"></el-input>
            </el-form-item>
            <el-form-item label="小区名称" prop="o_community">
              <el-input size="small" v-model="newYezhu.o_community"></el-input>
            </el-form-item>
            <el-form-item label="期数名称" prop="o_nper">
              <el-input size="small" v-model="newYezhu.o_nper"></el-input>
            </el-form-item>
            <el-form-item label="楼栋名称" prop="o_floor">
              <el-input size="small" v-model="newYezhu.o_floor"></el-input>
            </el-form-item>
            <el-form-item label="单元名称" prop="o_unit">
              <el-input size="small" v-model="newYezhu.o_unit"></el-input>
            </el-form-item>
            <el-form-item label="房间名称" prop="o_door">
              <el-input size="small" v-model="newYezhu.o_door"></el-input>
            </el-form-item>
            <el-form-item label="房屋面积" prop="o_doorSpace">
              <el-input size="small" v-model="newYezhu.o_doorSpace"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click.native="dialogVisible2 = false">取消</el-button>
              <el-button type="primary" :loading="addLoading" @click="addyezhuBtn">提交</el-button>
          </div>
        </el-dialog>
    </div>
  
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/pageLXL2.vue";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      addLoading: false, //是否显示loading
      ownerPhone: "",
      ownerName: "",
      ownerId: 0,
      myindex: 0,
      file: [],
      newYezhu:{
        ownerName:"",
        ownerPhone:"",
        o_property:"",
        o_community:"",
        o_nper:"",
        o_floor:"",
        o_unit:"",
        o_door:"",
        o_doorSpace:""
      },
      searchObj:{
        community_id:"",
        nper_id:"",
        floor_id:"",
        unit_id:"",
        door_id:""
      },
    };
  },
  components: {
    Pagination
  },
  beforeCreate() {
    if (!this.$store.getters.OriginalDataInfo) {
      if (!this.$store.getters.OriginalDataPage) {
        this.$store
          .dispatch("GetOriginalDataInfo", {
            pageInfo: { pageSize: 10, pageNum: 1 }
          })
          .then(() => {
            console.log("OriginalDataInfo");
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("GetOriginalDataInfo", {
            pageInfo: this.$store.getters.OriginalDataInfo
          })
          .then(() => {
            console.log("OriginalDataInfo");
            this.loading = false;
          });
      }
    }
    this.$store.dispatch("getCommunities").then(() => {
      this.loading = false;
    });
  },
  computed: {
    ...mapGetters(["OriginalDataInfo", "OriginalDataPage"]),
    communities() {
      return this.$store.state.getwuyeinfo.LXLcommunities.content;
    },
    nper() {
      return this.$store.state.getwuyeinfo.LXLnper.content;
    },
    floor() {
      return this.$store.state.getwuyeinfo.LXLfloor.content;
    },
    unit() {
      return this.$store.state.getwuyeinfo.LXLunit.content;
    },
    room() {
      return this.$store.state.getwuyeinfo.LXLroom.content;
    }
  },
  methods: {
    addyezhu(){
      this.dialogVisible2 = !this.dialogVisible2
    },
    addyezhuBtn(){
      this.$store.dispatch("addYezhu",{
        newYezhu:{
          ownerName:this.newYezhu.ownerName,
          ownerPhone:this.newYezhu.ownerPhone,
          o_property:this.newYezhu.o_property,
          o_community:this.newYezhu.o_community,
          o_nper:this.newYezhu.o_nper,
          o_floor:this.newYezhu.o_floor,
          o_unit:this.newYezhu.o_unit,
          o_door:this.newYezhu.o_door,
          o_doorSpace:this.newYezhu.o_doorSpace
        }
      }).then(() => {
            console.log("添加业主成功");
            this.dialogVisible2 = !this.dialogVisible2
            this.loading = false;
          });
    },
    importSuccess(){
      history.go(0)
    },
    searchOriginalData(){
      this.$store.dispatch("searchOriginalData",{
        content: { 
          pageSize: 10, 
          pageNum: 1,
          community_id : this.searchObj.community_id,
          nper_id : this.searchObj.nper_id,
          floor_id : this.searchObj.floor_id,
          unit_id : this.searchObj.unit_id,
          door_id : this.searchObj.door_id 
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    DeleteOriginalDataInfo(index, rows) {
      this.$confirm("是否确定修改该用户信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$store.dispatch("DeleteOriginalData", {
              id: {
                ownerId: rows[index].ownerId,
                ownerName: rows[index].ownerName,
                ownerPhone: rows[index].ownerPhone
              }
            }).then(
              this.$message({
                type: "success",
                message: "删除成功!"
              })
            );
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateOriginalDataInfo() {
      this.$confirm("请确认业主信息无误", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("UpdateOriginalData", {
              id: {
                ownerId: this.ownerId,
                ownerName: this.ownerName,
                ownerPhone: this.ownerPhone
              },
              myindex: this.myindex
            })
            .then(() => {
              this.dialogVisible = !this.dialogVisible;
              this.ownerPhone = "";
              this.ownerName = "";
              this.ownerId = 0;
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消编辑"
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
      return;
    },
    opendialog(index, value) {
      //代开模态框
      this.dialogVisible = !this.dialogVisible;
      this.ownerPhone = value[index].ownerPhone;
      this.ownerName = value[index].ownerName;
      this.ownerId = value[index].ownerId;
      this.myindex = index;
    },
    formatdata(row, cloumu, value) {
      return new Date(value).toLocaleString();
    },
    changeCommunities() {
      this.searchObj.nper_id = "";
      this.searchObj.floor_id = "";
      this.searchObj.unit_id = "";
      this.searchObj.room_id = "";
      this.searchOriginalData();
      this.$store
        .dispatch("getNper", {
          pageInfo: { communityid: this.searchObj.community_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeNper() {
      this.searchOriginalData();
      this.$store
        .dispatch("getFloor", {
          pageInfo: { nperid: this.searchObj.nper_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeFloor() {
      this.searchOriginalData();
      this.$store
        .dispatch("getUnit", {
          pageInfo: { floorid: this.searchObj.floor_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeUnit() {
      this.searchOriginalData();
      this.$store
        .dispatch("getRoom", {
          pageInfo: { unitid: this.searchObj.unit_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeRoom() {
      this.searchOriginalData();
      this.$store
        .dispatch("getRoom", {
          pageInfo: { roomid: this.searchObj.room_id }
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scope>
.serchSelect {
  width: 120px;
}
.serchBtn {
  margin-left: 20px;
}
.luruBtn {
  margin-left: 50px;
}
.dialogInput {
  width: 90%;
}
.dialogDiv {
  margin-top: 15px;
}
</style>
