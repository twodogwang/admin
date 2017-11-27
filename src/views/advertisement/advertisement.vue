<template>
  <div class='app-container'>
  
    <el-row class='dr-datatable'>
  
      <el-col :span='24'>
  
        <el-row class='dr-datatable'>
  
          <el-button size='small' type='primary' icon='plus' @click='addInfo'>新建广告</el-button>
  
          <el-button size='small' type='danger' :disabled='deleteState' icon='delete' @click='Deletes'>删除</el-button>
  
          <!-- <el-input class='search' icon='search' size='small' v-model='search.mobilephone' placeholder='请输入手机号以查询'></el-input>
  
            <el-input class='search' icon='search' size='small' v-model='search.realname' placeholder='请输入真实姓名以查询'></el-input>
  
            <el-input class='search' icon='search' size='small' v-model='search.deviceId' placeholder='请输入设备id以查询'></el-input>
  
            <el-button size='small' type='default' icon='search' @click='searcher'>搜索</el-button> -->
  
        </el-row>
  
        <el-table stripe border :data='advertiseInfo' align='center' v-loading='loading' ref='multipleTable' tooltip-effect='dark' style='width: 100%' @selection-change='handleSelectionChange'>
  
          <el-table-column type='selection' width='55'>
  
          </el-table-column>
  
          <el-table-column type='index' width='55'>
  
          </el-table-column>
          <el-table-column prop='id' label="ID" width='55'>
  
          </el-table-column>
  
          <el-table-column prop='name' label='广告名称' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='adveraddressId' :formatter="placeFormatter" label='广告位置' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='imageurl' label='图片地址' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='urladdress' label='跳转路径' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='statusCode' :formatter="statusFormatter" :filters="[{text:'启用',value:'1'},{text:'禁用',value:'0'}]" :filter-method='filterHandler' label='状态' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='startTime' label='开始时间' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='stopTime' label='结束时间' show-overflow-tooltip>
  
          </el-table-column>
  
          <!-- <el-table-column prop='statusCode' label="状态筛选测试" :filters="[{text:'启用',value:'1'},{text:'禁用',value:'0'}]" :filter-method='filterHandler'></el-table-column>        -->
  
          <el-table-column label='操作' width='150'>
  
            <template scope='scope'>
  
                <el-button size='mini' @click='changeState(scope.$index, advertiseInfo)'>{{advertiseInfo[scope.$index].statusCode==1?'停用':'启用'}}</el-button>
  
                <!-- <el-button size='mini' @click='editInfo(scope.$index, advertiseInfo)'>{{handle}}</el-button> -->
  
                <el-button size='mini' type='danger' @click='Delete(scope.$index, advertiseInfo)'>删除</el-button>
</template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType='advertise' :pageInfo='advertisePage'></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :before-close='beforeclose' title='编辑' :visible.sync='dialogFormVisible'>
      <el-form :model='formState' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
        <!-- <el-form-item v-if='edit' label='ID号' prop='sImg'>
          <el-input size='small' v-model='formState.cMemberid'></el-input>
        </el-form-item> -->
        <el-form-item label='广告名称' prop='sImg'>
          <el-input size='small' v-model='formState.name'></el-input>
        </el-form-item>
        <el-form-item label='广告位置' prop='title'>
          <el-select size='small' v-model='formState.adveraddressId' placeholder='请选择位置'>
            <el-option v-for="item in address" :value="item.id" :key="item.id" :label="item.name">
            </el-option>            
          </el-select>
        </el-form-item>
        <el-form-item label='广告设置'>
          <el-radio v-model="advertype" label="1">图片</el-radio>
          <el-radio v-model="advertype" label="2">文字</el-radio>
          <el-radio v-model="advertype" label="3">代码H5</el-radio>       
        </el-form-item>
        <!-- <el-form-item v-if="advertype==1" label='选择图片'>
            <el-upload :data="formState" ref="upload" class='pic-upload' action='/baseMessage/adver/advertising/addAdver' :show-file-list='false' :on-success='handlePicSuccess' :auto-upload="false">
                <img v-if='imageUrl' :src='imageUrl' class='pic'>
                <i v-else class='el-icon-plus pic-uploader-icon'></i>
            </el-upload>
        </el-form-item> -->
        <el-form-item v-if="advertype==1" label="选择图片">
          <el-upload with-credentials :data="formState" name="imageFile" :on-success="uploadsuccess" :before-upload="check" ref="upload" :auto-upload="false" class="upload-demo" action="http://47.92.106.249:8089/xyzhiping/baseMessage/adver/advertising/addAdver" :file-list="fileList">
            <el-button size="small" type="primary">点击选择文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item v-if="advertype==2" label='输入文字'>
          <el-input size="middle" v-model="formState.textcontent"></el-input>
        </el-form-item>
        <el-form-item label='h5广告地址' prop='urladdress'>
          <el-input size="small" v-model="formState.urladdress">
          </el-input>
        </el-form-item>
        <el-form-item label='开始时间' prop='title'>
          <template>
            <div class="block">
              <el-date-picker @change="setStartDate"
                v-model="startTime"
                type="datetime"
                placeholder="选择开始时间"
                align="right"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label='结束时间' prop='title'>
          <template>
            <div class="block">
              <el-date-picker @change="setEndDate"
                v-model="stopTime"
                type="datetime"
                placeholder="选择结束时间"
                align="right"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>   
        <el-form-item label='点击次数设置' prop='title'>
          <el-radio v-model="pvnum" label="1">不设置次数</el-radio>
          <el-radio v-model="pvnum" label="2">设置次数</el-radio>
        </el-form-item>
        <el-form-item v-if="pvnum==2" label='设置次数' prop='title'>
          <el-input-number :controls="false" :min="0" size="small" v-model="setPv"></el-input-number>
        </el-form-item>
        <el-form-item class='dr-submitContent'>
          <el-button size='small' type='primary' @click="submitForm('ruleForm')">确定</el-button>
          <el-button size='small' @click='dialogFormVisible = false;formState={advertype: "1",
        adveraddressId: "",
        urladdress: "http://"}'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 图片上传 -->
    <el-dialog stripe size='small' title='上传图片' :visible.sync='picFormVisible'>
      <el-form>
          <!-- <el-form-item v-if="formState.advertype==1" label='选择图片'>
              <el-upload class='pic-upload' action='' :show-file-list='false' :on-success='handlePicSuccess' :before-upload='beforePicUpload'>
                  <img v-if='imageUrl' :src='imageUrl' class='pic'>
                  <i v-else class='el-icon-plus pic-uploader-icon'></i>
              </el-upload>
          </el-form-item> -->
          <el-form-item>
            <el-input size="middle" v-model="formState.a"></el-input>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import fetch from "@/utils/fetch";
import { validateNumandAlp, validateURL } from "@/utils/validate";
import Pagination from "../../components/pagination/page.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    const validateUri = (rule, value, callback) => {
      console.log(value);
      if (!validateURL(value)) {
        callback(new Error("请输入正确的URL"));
      } else {
        callback();
      }
    };
    return {
      address: [],
      advertype: "1",
      imageUrl: "",
      pvnum: "1",
      setPv: 0,
      startTime: "",
      stopTime: "",
      loading: false,
      fileList: [],
      edit: false,
      dialogFormVisible: false,
      formState: {
        advertype: "1",
        adveraddressId: "",
        urladdress: "http://"
      },
      deleteState: true,
      picFormVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      rules: {
        urladdress: [
          { required: true, trigger: "blur", validator: validateUri }
        ]
      }
    };
  },

  methods: {
    setStartDate(val) {
      this.formState.startTime = val;
    },
    setEndDate(val) {
      this.formState.stopTime = val;
    },
    check(file) {
      console.log(file);
      const pointposition = file.name.lastIndexOf(".");
      const name = file.name.substring(0, pointposition);
      if (!validateNumandAlp(name)) {
        this.$notify({
          showClose: true,
          message: "文件名必须为英文或数字。",
          type: "info"
        });
        return false;
      }
    },
    uploadsuccess(response, file, filelist) {
      console.log("upload success");
      this.$store.dispatch("getInfo", {
        pageInfo: { pageSize: 10, pageNum: 1 },
        type: "advertise"
      });
      this.formState = {
        advertype: "1",
        adveraddressId: ""
      };
      this.$refs.upload.clearFiles();
    },
    advTypeChange(label) {
      console.log(label);
    },
    advPvChange(label) {
      console.log(label);
    },
    changeState(index, rows) {
      let tempCode = "";
      if (rows[index].statusCode == 1) {
        tempCode = 0;
      } else {
        tempCode = 1;
      }
      fetch({
        url: "/baseMessage/adver/advertising/updateByStatusCode",
        method: "post",
        params: { id: rows[index].id, statusCode: tempCode }
      }).then(() => {
        tempCode = "";
        if (!this.$store.getters.advertisePage) {
          this.$store.dispatch("getInfo", {
            pageInfo: {
              pageSize: 10,

              pageNum: 1
            },

            type: "advertise"
          });
        } else {
          this.$store.dispatch("getInfo", {
            pageInfo: this.$store.getters.advertisePage,

            type: "advertise"
          });
        }
      });
    },
    placeFormatter(row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return "头部广告";
        case 2:
          return "顶端下拉广告";
        case 3:
          return "弹窗广告";
        case 4:
          return "个人中心底部广告";
        case 5:
          return "开门广告";
        case 6:
          return "背景广告";
      }
    },

    statusFormatter(row, columu, cellValue) {
      switch (cellValue) {
        case "1":
          return "启用";

        case "0":
          return "停用";
      }
    },

    filterHandler(value, row) {
      return row.statusCode === value;
    },
    handlePicSuccess(response, file, fileList) {},

    addInfo() {
      this.formState = {
        advertype: "1",
        adveraddressId: "",
        urladdress: "http://"
      };

      this.edit = false;
      this.startTime = "";
      this.stopTime = "";

      this.dialogFormVisible = true;

      /* if (!this.roomType) {

          fetch({

            url: '/baseMessage/roomType/selectroomType',

            method: 'get'

          }).then((result) => {

            this.roomType = result.data;

          });

        } */
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
              delete: {
                ids: deleteArr
              },

              type: "advertise"
            })
            .then(result => {
              console.log(result);
              this.$notify({
                title: "成功",

                message: "批量删除成功",

                type: "success",

                duration: 1000
              });

              // this.$store.dispatch('getInfo', this.$store.getters.advertisePage);
            })
        );
      }
    },

    Delete(index, rows) {
      this.$confirm("此操作将永久删除该广告, 是否继续?", "提示", {
        confirmButtonText: "确定",

        cancelButtonText: "取消",

        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("deleteInfo", {
              id: {
                id: rows[index].id
              },

              type: "advertise"
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

            message: "删除未成功"
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
      /* this.formState.startTime = this.startTime;
      this.formState.stopTime = this.stopTime; */
      this.formState.pvnum = this.setPv;
      this.formState.advertype = this.advertype;
      console.log("formState", this.formState);
      console.info("time", this.formState.startTime);
      if (this.advertype == 1) {
        this.$refs.upload.submit();
      } else {
        this.$store
          .dispatch("addInfo", {
            form: this.formState,
            type: "advertise"
          })
          .then(() => {
            this.formState = {
              advertype: "1",
              adveraddressId: "",
              urladdress: "http://"
            };
          });
      }
      this.dialogFormVisible = false;
    },

    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.formState = {
          advertype: "1",
          adveraddressId: "",
          urladdress: "http://"
        };
        resolve(true);
      }).then(_ => {
        done();
      });
    }
  },

  components: {
    Pagination
  },

  computed: {
    ...mapGetters([
      "terminalInfo",

      "terminalPage",

      "advertiseInfo",

      "advertisePage"
    ]),

    handle(index, advertiseInfo) {
      console.log(advertiseInfo);
      if (advertiseInfo[index].statusCode == 1) {
        return "0";
      } else {
        return "1";
      }
    }
  },

  mounted() {
    if (!this.$store.getters.advertiseInfo) {
      if (!this.$store.getters.advertisePage) {
        this.$store.dispatch("getInfo", {
          pageInfo: {
            pageSize: 10,

            pageNum: 1
          },

          type: "advertise"
        });
      } else {
        this.$store.dispatch("getInfo", {
          pageInfo: this.$store.getters.advertisePage,

          type: "advertise"
        });
      }
    }
    fetch({
      url: "/baseMessage/adver/address/selectAll?pageNum=1&pageSize=10",
      method: "get"
    }).then(result => {
      this.address = result.data.list;
    });
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

