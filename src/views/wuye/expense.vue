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
            <el-button size="small" type="primary" icon="search" @click="search">搜索</el-button>
            <el-button size="small" type="primary" icon="plus" @click="opendialog">添加物业费</el-button>
        </el-row>
        <el-button size="small" type="primary" icon="search" @click="unpay">未支付订单</el-button>
        <el-button size="small" type="primary" icon="search" @click="alreadypay">已支付订单</el-button>
        <el-table border :data="expenseInfo" align="center" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="orderNum" label="订单号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="orderTime" label="下单时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="communityName" label="小区" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="nperName" label="期数" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="floorName" label="楼栋" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitName" label="单元" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="doorName" label="房间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="rentMoney" label="缴费金额" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payState" label="支付状态" :formatter="formatPayState" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="mypaystate" label="操作" width="280">
            <template scope="scope">
              <el-button size="mini" type="success" @click="ChangeExpenseInfo(scope.$index, expenseInfo)">已支付</el-button>
              <el-button size="mini" @click="opendialog2(scope.$index, expenseInfo)">设　置</el-button>
              <el-button size="mini" type="info" @click="CollectionExpense(scope.$index, expenseInfo)">催　收</el-button>
              <el-button size="mini" type="danger" @click="DeleteExpenseInfo(scope.$index, expenseInfo)">删　除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageType="pageType" :searchObj="searchObj" :searchType="searchType" :pageInfo="expensePage"></Pagination>
      </el-col>
    </el-row>
    <el-dialog 
        title="物业费管理" 
        v-model="dialogVisible"
        :close-on-click-modal="false">
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="物业费设置" name="first">
          <div class="wuyefeiinput">
            选择小区:<el-select v-model="searchObj.community_id" size="small" placeholder="请选择小区" class="serchSelect">
                <el-option
                    v-for="item in communities"
                    :key="item.communityid"
                    :label="item.communityname"
                    :value="item.communityid">
                </el-option>
            </el-select>
          </div>
          <div class="wuyefeiinput">
            单位面积:<el-input size="small" class="moneyperm2" v-model="orderPrice"></el-input>元 (设置每平米物业费，系统将为您自动计算)
          </div>
          <div style="margin-top:10px">
            备注:</span><el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="note">
                    </el-input>
          </div>
          <div class="wuyefeiinput timepicker">
                      <div class="block">
                        <span class="demonstration">收取物业费时间:</span>
                        <el-date-picker
                          v-model="orderTime"
                          type="datetime"
                          placeholder="选择日期时间"
                          align="right"
                          :picker-options="pickerOptions1"
                          @change="timeFormat">
                        </el-date-picker>
                      </div>
                    </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
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
                    房间:<el-select v-model="searchObj.door_id" size="small" placeholder="请选择房间" class="serchSelect" @change="getYezhuName">
                        <el-option
                            v-for="item in room"
                            :key="item.doorid"
                            :label="item.doorname"
                            :value="item.doorid"
                            >
                        </el-option>
                    </el-select>
                    <div class="wuyefeiinput"><span>姓名:</span><el-input class="infoInput" v-model="realName"></el-input></div>
                    <div class="wuyefeiinput"><span>联系电话:</span><el-input class="infoInput" v-model="mobilePhone"></el-input></div>
                    <div class="wuyefeiinput"><span>物业费:</span><el-input class="infoInput" v-model="rentMoney"></el-input></div>
                    <div class="wuyefeiinput"><span>备注:</span><el-input class="infoInput"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="note">
                    </el-input></div>
                    <div class="wuyefeiinput timepicker">
                      <div class="block">
                        <span class="demonstration">收取物业费时间:</span>
                        <el-date-picker
                          v-model="orderTime"
                          type="datetime"
                          placeholder="选择日期时间"
                          align="right"
                          :picker-options="pickerOptions1"
                          @change="timeFormat">
                        </el-date-picker>
                      </div>
                    </div>
        </el-tab-pane>
    </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="addLoading" @click="addOrder">提交</el-button>
        </div>
    </el-dialog>

    <el-dialog
      title="设置物业费"
      :visible.sync="dialogVisible2"
      width="30%"
      :close-on-click-modal="false">
      <div>
        <p>业主信息</p>
        <span v-text="realName" style="margin-right:15px;"></span><span>{{communityName}}--{{nperName}}--{{floorName}}--{{unitName}}--{{doorName}}</span>
        <div style="margin-top:15px;">
          <span>联系电话</span><br>
          <span v-html="mobilePhone"  style="margin-top:10px;display:inline-block"></span>
        </div>
        <div style="margin-top:15px;">
          <span>物业费:</span>
          <el-input v-model="rentMoney"></el-input>
        </div>
        <div style="margin-top:15px;">
          <span>收取物业费截止日期:</span>
          <p>{{orderTime}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="changeExpense">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/pageLXL.vue";
import fetch from "@/utils/fetch";
import qs from "qs";
export default {
  name: "expense",
  data() {
    return {
      mypaystate: true,
      activeName: "second",
      data: "",
      dialogVisible: false,
      dialogVisible2: false,
      addLoading: false, //是否显示loading
      options: [{}],
      value: "",
      realName: "",
      mobilePhone: "",
      rentMoney: "",
      orderPrice: "",
      pageType: "getExpenseInfo",
      searchType: "searchExpenseInfo",
      searchObj: {
        community_id: "",
        nper_id: "",
        floor_id: "",
        unit_id: "",
        door_id: ""
      },
      note: "",
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      orderTime: "",
      communityName: "",
      nperName: "",
      floorName: "",
      unitName: "",
      doorName: "",
      orderId: "",
      targetRowindex: {}
    };
  },
  components: {
    Pagination
  },
  methods: {
    alreadypay() {
      this.mypaystate = false;
      this.searchType = "getAlreadypayExpenseInfo";
      this.pageType = "getAlreadypayExpenseInfo";
      this.$store
        .dispatch("getAlreadypayExpenseInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 }
        })
        .then(() => {
          console.log("expensealreadypay");
          this.loading = false;
        });
    },
    unpay() {
      history.go(0);
    },
    CollectionExpense(index, rows) {
      fetch({
        url: "/propertyFunctions/order/orderHasten",
        method: "post",
        data: qs.stringify({
          mobilePhone: rows[index].mobilePhone,
          rentMoney: rows[index].rentMoney
        })
      }).then(results => {
        if (results.code === 0) {
          alert("已发送催收消息");
        }
      });
    },
    ChangeExpenseInfo(index, rows) {
      this.$store
        .dispatch("changeExpenseInfo", {
          orderId: { orderId: rows[index].orderId }
        })
        .then(() => {
          console.log("已支付");
          this.loading = false;
        });
    },
    DeleteExpenseInfo(index, rows) {
      fetch({
        url: "/propertyFunctions/order/deOrder",
        method: "post",
        data: qs.stringify({ orderId: rows[index].orderId })
      }).then(result => {
        this.search();
      });
    },
    changeExpense() {
      fetch({
        url: "/propertyFunctions/order/upOrder",
        method: "post",
        data: qs.stringify({
          orderId: this.orderId,
          rentMoney: this.rentMoney
        })
      }).then(results => {
        if (results.code === 0) {
          this.$store.getters.expenseInfo[
            this.targetRowindex
          ].rentMoney = this.rentMoney;
          this.dialogVisible2 = !this.dialogVisible2;
          alert("物业费修改成功");
          this.orderId = "";
          this.realName = "";
          this.communityName = "";
          this.nperName = "";
          this.floorName = "";
          this.unitName = "";
          this.doorName = "";
          this.mobilePhone = "";
          this.rentMoney = "";
          this.orderTime = "";
        } else {
          alert(msg);
        }
      });
    },
    timeFormat(val) {
      this.orderTime = val;
    },
    addOrder() {
      if (this.activeName === "second") {
        fetch({
          url: "/propertyFunctions/order/addOrder",
          method: "post",
          data: qs.stringify({
            communityId: this.searchObj.community_id,
            nperId: this.searchObj.nper_id,
            floorId: this.searchObj.floor_id,
            unitId: this.searchObj.unit_id,
            doorId: this.searchObj.door_id,
            mobilePhone: this.mobilePhone,
            rentMoney: this.rentMoney,
            note: this.note,
            takeTime: this.orderTime,
            realName: this.realName
          })
        }).then(results => {
          this.dialogVisible = !this.dialogVisible;
          alert("设置成功");
          this.$store
            .dispatch("getExpenseInfo", {
              pageInfo: { pageSize: 10, pageNum: 1 }
            })
            .then(() => {
              console.log("expense");
              this.loading = false;
            });
          // this.searchObj.nper_id = "";
          // this.searchObj.floor_id = "";
          // this.searchObj.unit_id = "";
          // this.searchObj.door_id = "";
          // this.mobilePhone = "";
          // this.rentMoney = "";
          // this.note = "";
          // this.orderTime = "";
          // this.realName = "";
        });
      } else {
        fetch({
          url: "/propertyFunctions/order/addSpaceOrder",
          method: "post",
          data: qs.stringify({
            communityId: this.searchObj.community_id,
            orderPrice: this.orderPrice,
            note: this.note,
            takeTime: this.orderTime
          })
        }).then(results => {
          this.dialogVisible = !this.dialogVisible;
          alert("设置成功");
          this.searchObj.community_id = "";
          this.orderPrice = "";
          this.note = "";
          this.orderTime = "";
        });
      }
    },
    getYezhuName() {
      if (
        this.searchObj.community_id &&
        this.searchObj.nper_id &&
        this.searchObj.floor_id &&
        this.searchObj.unit_id
      ) {
        fetch({
          url: "/baseMessage/owner/namePhone",
          params: this.searchObj
        }).then(results => {
          if (results.code === 0) {
            if (results.data.length > 0) {
              this.realName = results.data[0].ownerName;
              this.mobilePhone = results.data[0].ownerPhone;
            } else {
              alert("该房间没有人");
            }
          }
        });
      }
    },
    search() {
      this.$store
        .dispatch("searchExpenseInfo", {
          content: {
            pageSize: 10,
            pageNum: 1,
            communityId: this.searchObj.community_id,
            nperId: this.searchObj.nper_id,
            floorId: this.searchObj.floor_id,
            unitId: this.searchObj.unit_id,
            doorId: this.searchObj.door_id
          }
        })
        .then(() => {
          this.loading = false;
        });
    },
    opendialog() {
      this.searchObj.nper_id = "";
      this.searchObj.floor_id = "";
      this.searchObj.unit_id = "";
      this.searchObj.door_id = "";
      //代开模态框
      this.dialogVisible = !this.dialogVisible;
    },
    opendialog2(index, rows) {
      //代开模态框
      this.targetRowindex = index;
      this.dialogVisible2 = !this.dialogVisible2;
      this.orderId = rows[index].orderId;
      this.realName = rows[index].realName;
      this.communityName = rows[index].communityName;
      this.nperName = rows[index].nperName;
      this.floorName = rows[index].floorName;
      this.unitName = rows[index].unitName;
      this.doorName = rows[index].doorName;
      this.mobilePhone = rows[index].mobilePhone;
      this.rentMoney = rows[index].rentMoney;
      this.orderTime = rows[index].orderTime;
    },
    formatPayState(row, cloumu, value) {
      switch (value) {
        case 0:
          return "未支付";
        default:
          return "已支付";
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changeCommunities() {
      this.searchObj.nper_id = "";
      this.searchObj.floor_id = "";
      this.searchObj.unit_id = "";
      this.searchObj.door_id = "";
      this.search();
      this.$store
        .dispatch("getNper", {
          pageInfo: { communityid: this.searchObj.community_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeNper() {
      this.search();
      this.$store
        .dispatch("getFloor", {
          pageInfo: { nperid: this.searchObj.nper_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeFloor() {
      this.search();
      this.$store
        .dispatch("getUnit", {
          pageInfo: { floorid: this.searchObj.floor_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeUnit() {
      this.search();
      this.$store
        .dispatch("getRoom", {
          pageInfo: { unitid: this.searchObj.unit_id }
        })
        .then(() => {
          this.loading = false;
        });
    },
    changeRoom() {
      this.search();
      this.$store
        .dispatch("getRoom", {
          pageInfo: { roomid: this.searchObj.room_id }
        })
        .then(() => {
          this.loading = false;
        });
    }
  },
  computed: {
    ...mapGetters([
      "expenseInfo",
      "expensePage",
      "LXLcommunitiesInfo",
      "LXLcommunitiesPage"
    ]),
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
    },
    room() {
      return this.$store.state.getwuyeinfo.LXLroom.content;
    }
  },
  beforeCreate() {
    if (!this.$store.getters.expenseInfo) {
      if (!this.$store.getters.expensePage) {
        this.$store
          .dispatch("getExpenseInfo", {
            pageInfo: { pageSize: 10, pageNum: 1 }
          })
          .then(() => {
            console.log("expense");
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("getExpenseInfo", {
            pageInfo: this.$store.getters.expensePage
          })
          .then(() => {
            console.log("expense");
            this.loading = false;
          });
      }
    }
    this.$store.dispatch("getCommunities").then(() => {
      this.loading = false;
    });
  }
};
</script>

<style>
.serchSelect {
  width: 110px;
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
</style>
