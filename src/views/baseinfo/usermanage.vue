<template>
  <div class='app-container'>  
    <el-row class='dr-datatable'>  
      <el-col :span='24'>
        <el-row class="dr-datatable">          
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search.mobilephone" placeholder="请输入手机号以查询"></el-input>
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search.name" placeholder="请输入用户名以查询"></el-input>
        </el-row>
        <el-table stripe border :data='userInfo' align='center' v-loading='loading' ref='multipleTable' tooltip-effect='dark' style='width: 100%' >
          <!-- <el-table-column type='selection' width='55'>
          </el-table-column> -->
          <el-table-column type='index' width='55'>
          </el-table-column>
          <el-table-column prop='cMemberid' label='ID号' show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop='mobilephone' label='手机号' show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop='sex' :formatter="genderFormatter" :filters="[{text:'男',value:'1'},{text:'女',value:'0'}]" :filter-method='filterHandler' label='性别' show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop='addTime' label='注册时间' show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop='realState' :formatter="identityFormatter" :filters="[{text:'已认证',value:'1'},{text:'未认证',value:'0'}]" :filter-method='filterHandler' label='实名认证' show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop='deviceId' label='设备' show-overflow-tooltip>
          </el-table-column>
          <el-table-column label='权限' width='150'>  
            <template scope='scope'>  
                <el-button size='mini' @click='viewpermission(scope.$index, userInfo)'>查看权限</el-button>
            </template>
          </el-table-column>
          <el-table-column label='实名认证' width='150'>  
            <template scope='scope'>
                <el-button size='mini' @click='changerealnameState(scope.$index, userInfo)'>{{userInfo[scope.$index].realState==1?'确认':'已确认'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :is-search="isSearch" :search-params2="searchParams2" pageType='user' :pageInfo='userPage'></Pagination>
      </el-col>
    </el-row>
    <el-dialog title='查看权限信息' :visible.sync='dialogFormVisible' size="large">
      <el-table border stripe :data="userdetailsInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%">
        <el-table-column fixed type="index" width="55">
        </el-table-column>
        <el-table-column prop="community.communityname" label="小区名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="nper.npername" label="期数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="floor.floorname" label="楼栋" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unit.unitname" label="单元" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="door.doorname" label="门牌" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="customername" label="授权用户" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="customertel" label="电话" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop='roletype' :formatter="roleFormatter" :filter-method='filterHandler' label='角色' show-overflow-tooltip>
          </el-table-column>
        <el-table-column prop="ownerid" label="业主ID" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop='ownerStatus' :formatter="guardFormatter"  :filter-method='filterHandler' label='门禁状态' show-overflow-tooltip>
          </el-table-column>
        <el-table-column prop='propertyStatus' :formatter="propertyguardFormatter" :filter-method='filterHandler' label='物业门禁状态' show-overflow-tooltip>
          </el-table-column>
        <el-table-column prop="addTime" label="加入时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="reviewTime" label="审核授权时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="reviewName" label="授权人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop='delFlag' :formatter="deleteFormatter" :filter-method='filterHandler' label='删除状态' show-overflow-tooltip>
          </el-table-column>
        <el-table-column prop='addStatus' :formatter="applicationFormatter" :filter-method='filterHandler' label='申请授权状态' show-overflow-tooltip>
          </el-table-column>
        <el-table-column prop="propertyid" label="物业ID" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label='门禁状态' >  
            <template scope='scope'>  
                <el-button size='mini' @click='changeOwnerState(scope.$index, userdetailsInfo)'>{{userdetailsInfo[scope.$index].ownerStatus==1?'停用':'启用'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label='物业门禁状态'>  
            <template scope='scope'>
                <el-button size='mini' @click='changePropertyState(scope.$index, userdetailsInfo)'>{{userdetailsInfo[scope.$index].propertyStatus==1?'停用':'启用'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label='删除状态'>  
            <template scope='scope'>  
                <el-button size='mini' @click='changeDelState(scope.$index, userdetailsInfo)'>{{userdetailsInfo[scope.$index].delFlag==1?'停用':'启用'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label='申请授权状态' >  
            <template scope='scope'>
                <el-button size='mini' @click='changeAddState(scope.$index, userdetailsInfo)'>{{userdetailsInfo[scope.$index].addStatus==1?'停用':'启用'}}</el-button>
            </template>
          </el-table-column>
      </el-table>
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
      search: { name: "", mobilephone: "" },
      loading: false,
      dialogFormVisible: false,
      rules: {},
      userdetailsInfo: [],
      mobilephone: "",
      isSearch: "none",
      searchParams2: null
    };
  },
  methods: {
    searcher() {
      // if (this.search && this.search !== '') {
      this.isSearch = "paramsSearch";
      this.searchParams2 = {
        name: this.search.name,
        mobilephone: this.search.mobilephone,
        pageNum: 1,
        pageSize: this.$store.getters.userPage.pageSize
      };
      this.$store.dispatch("selectInfo", {
        data: this.searchParams2,
        type: "user"
      });
      // }
    },
    changerealnameState(index, rows) {
      let tempCode = "";
      if (rows[index].realState == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseMessage/customer/customer/updateByRealState",
        method: "post",
        params: { cMemberid: rows[index].cMemberid, realState: tempCode }
      }).then(() => {
        tempCode = "";
        if (!this.$store.getters.userPage) {
          this.$store.dispatch("getInfo", {
            pageInfo: {
              pageSize: 10,
              pageNum: 1
            },
            type: "user"
          });
        } else {
          this.$store.dispatch("getInfo", {
            pageInfo: this.$store.getters.userPage,
            type: "user"
          });
        }
      });
    },
    changeOwnerState(index, rows) {
      let tempCode = "";
      if (rows[index].ownerStatus == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseMessage/customer/permission/updateByOwnerStatus",
        method: "post",
        params: {
          permissionid: rows[index].permissionid,
          ownerStatus: tempCode
        }
      }).then(() => {
        tempCode = "";
        fetch({
          url: "/baseMessage/customer/permission/selectByPhone",
          method: "get",
          params: { mobilephone: this.mobilephone, pageNum: 1, pageSize: 10 }
        }).then(result => {
          this.userdetailsInfo = result.data.list;
          this.dialogFormVisible = true;
        });
      });
    },
    changePropertyState(index, rows) {
      let tempCode = "";
      if (rows[index].propertyStatus == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseMessage/customer/permission/updateByPropertyStatus",
        method: "post",
        params: {
          permissionid: rows[index].permissionid,
          propertyStatus: tempCode
        }
      }).then(() => {
        tempCode = "";
        fetch({
          url: "/baseMessage/customer/permission/selectByPhone",
          method: "get",
          params: { mobilephone: this.mobilephone, pageNum: 1, pageSize: 10 }
        }).then(result => {
          this.userdetailsInfo = result.data.list;
          this.dialogFormVisible = true;
        });
      });
    },
    changeDelState(index, rows) {
      let tempCode = "";
      if (rows[index].delFlag == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseMessage/customer/permission/updateByDelFlag",
        method: "post",
        params: { permissionid: rows[index].permissionid, delFlag: tempCode }
      }).then(() => {
        tempCode = "";
        fetch({
          url: "/baseMessage/customer/permission/selectByPhone",
          method: "get",
          params: { mobilephone: this.mobilephone, pageNum: 1, pageSize: 10 }
        }).then(result => {
          this.userdetailsInfo = result.data.list;
          this.dialogFormVisible = true;
        });
      });
    },
    changeAddState(index, rows) {
      let tempCode = "";
      if (rows[index].addStatus == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseMessage/customer/permission/updateByAddStatus",
        method: "post",
        params: { permissionid: rows[index].permissionid, addStatus: tempCode }
      }).then(() => {
        tempCode = "";
        fetch({
          url: "/baseMessage/customer/permission/selectByPhone",
          method: "get",
          params: { mobilephone: this.mobilephone, pageNum: 1, pageSize: 10 }
        }).then(result => {
          this.userdetailsInfo = result.data.list;
          this.dialogFormVisible = true;
        });
      });
    },
    guardFormatter(row, column, cellValue) {
      switch (cellValue) {
        case 0:
          return "禁用";
        case 1:
          return "启用";
        case 2:
          return "申请中";
        case 3:
          return "拒绝";
      }
    },
    roleFormatter(row, column, cellValue) {
      switch (cellValue) {
        case 0:
          return "业主";
        case 1:
          return "租客";
        case 2:
          return "业主家属";
        case 3:
          return "租客家属";
      }
    },
    propertyguardFormatter(row, columu, cellValue) {
      switch (cellValue) {
        case 0:
          return "禁用";
        case 1:
          return "启用";
      }
    },
    identityFormatter(row, columu, cellValue) {
      switch (cellValue) {
        case 1:
          return "已认证";
        case 0:
          return "未认证";
      }
    },
    genderFormatter(row, columu, cellValue) {
      switch (cellValue) {
        case 1:
          return "男";
        case 0:
          return "女";
      }
    },
    deleteFormatter(row, columu, cellValue) {
      switch (cellValue) {
        case 1:
          return "未删";
        case 0:
          return "已删";
      }
    },
    applicationFormatter(row, columu, cellValue) {
      switch (cellValue) {
        case 1:
          return "已授权";
        case 0:
          return "未授权";
        case 2:
          return "拒绝授权";
      }
    },
    filterHandler(value, row) {
      return row.statusCode === value;
    },
    viewpermission(index, rows) {
      const rowData = rows[index];
      this.mobilephone = rowData.mobilephone;
      fetch({
        url: "/baseMessage/customer/permission/selectByPhone",
        method: "get",
        params: { mobilephone: this.mobilephone, pageNum: 1, pageSize: 10 }
      }).then(result => {
        this.userdetailsInfo = result.data.list;
        this.dialogFormVisible = true;
      });
    }
  },
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(["terminalInfo", "terminalPage", "userInfo", "userPage"]),
    handle(index, userInfo) {
      console.log(userInfo);
      if (userInfo[index].statusCode == 1) {
        return "0";
      } else {
        return "1";
      }
    }
  },
  mounted() {
    if (!this.$store.getters.userInfo) {
      if (!this.$store.getters.userPage) {
        this.$store.dispatch("getInfo", {
          pageInfo: {
            pageSize: 10,
            pageNum: 1
          },
          type: "user"
        });
      } else {
        this.$store.dispatch("getInfo", {
          pageInfo: this.$store.getters.userPage,
          type: "user"
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.dr-datatable {
  margin-bottom: 1em;
}
.search {
  width: 20%;
}
.pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic-uploader .el-upload:hover {
  border-color: #409eff;
}
.pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.pic {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
