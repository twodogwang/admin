<template>
  <div class='app-container'>  
    <el-row class='dr-datatable'>  
      <el-col :span='24'>
        <el-table stripe border :data='adverplaceInfo' align='center' v-loading='loading' ref='multipleTable' tooltip-effect='dark' style='width: 100%' @selection-change='handleSelectionChange'>
  
          <el-table-column type='selection' width='55'>
  
          </el-table-column>
  
          <el-table-column type='index' width='55'>
  
          </el-table-column>
  
          <el-table-column prop='id' label='ID号' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='name' label='广告位置名称' show-overflow-tooltip>
  
          </el-table-column>
  
          <el-table-column prop='statusCode' :formatter="statusFormatter" :filters="[{text:'启用',value:'1'},{text:'禁用',value:'0'}]" :filter-method='filterHandler' label='状态' show-overflow-tooltip>
  
          </el-table-column>   
          <!-- <el-table-column prop='statusCode' label="状态筛选测试" :filters="[{text:'启用',value:'1'},{text:'禁用',value:'0'}]" :filter-method='filterHandler'></el-table-column>        -->
  
          <el-table-column label='操作' width='150'>  
            <template scope='scope'>  
                <el-button size='mini' @click='changeState(scope.$index, adverplaceInfo)'>{{adverplaceInfo[scope.$index].statusCode==1?'停用':'启用'}}</el-button>  
                <el-button size='mini' @click='editInfo(scope.$index, adverplaceInfo)'>编辑</el-button>
  
                <!-- <el-button size='mini' type='danger' @click='Delete(scope.$index, adverplaceInfo)'>删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType='adverplace' :pageInfo='adverplacePage'></Pagination>
      </el-col>
    </el-row>
    <el-dialog :before-close='beforeclose' title='编辑' :visible.sync='dialogFormVisible'>
      <el-form :model='formState' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
        <!-- <el-form-item v-if='edit' label='ID号' prop='sImg'>
          <el-input size='small' v-model='formState.cMemberid'></el-input>
        </el-form-item> -->
        <el-form-item label='广告位置名称' prop='sImg'>
          <el-input size='small' v-model='formState.name'></el-input>
        </el-form-item>                
      </el-form>
    </el-dialog>
    </div>
</template>
<script>
import fetch from "@/utils/fetch";
import { validateNumandAlp } from "@/utils/validate";
import Pagination from "../../components/pagination/page.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      advertype: "1",
      imageUrl: "",
      pvnum: "1",
      setPv: 1,
      startTime: "",
      stopTime: "",
      loading: false,
      fileList: [],
      edit: false,
      dialogFormVisible: false,
      formState: {
        advertype: "1",
        adveraddressId: ""
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

      rules: {}
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
        type: "firmware"
      });
      this.formState = { firmwareType: "" };
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
        url:
          "/baseMessage/adver/address/updateByStatus",
        method: "post",
        params: { id: rows[index].id, statusCode: tempCode }
      }).then(() => {
        tempCode = "";
        if (!this.$store.getters.adverplacePage) {
          this.$store.dispatch("getInfo", {
            pageInfo: {
              pageSize: 10,

              pageNum: 1
            },

            type: "adverplace"
          });
        } else {
          this.$store.dispatch("getInfo", {
            pageInfo: this.$store.getters.adverplacePage,

            type: "adverplace"
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
        adveraddressId: ""
      };

      this.edit = false;

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
        (currentValue, index, arr) => currentValue.cMemberid
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
                idList: deleteArr
              },

              type: "adverplace"
            })
            .then(result => {
              this.$notify({
                title: "成功",

                message: "批量删除成功",

                type: "success",

                duration: 1000
              });

              // this.$store.dispatch('getInfo', this.$store.getters.adverplacePage);
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
              id: {
                id: rows[index].cMemberid
              },

              type: "adverplace"
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
      // this.formState.startTime = this.startTime;
      // this.formState.stopTime = this.stopTime;
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
            type: "adverplace"
          })
          .then(() => {
            this.formState = {
              advertype: "1",
              adveraddressId: ""
            };
            this.startTime = "";
            this.stopTime = "";
          });
      }
      this.dialogFormVisible = false;
    },

    beforeclose(done) {
      return new Promise((resolve, reject) => {
        this.formState = {
          advertype: "1",
          adveraddressId: ""
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

      "adverplaceInfo",

      "adverplacePage"
    ]),

    handle(index, adverplaceInfo) {
      console.log(adverplaceInfo);
      if (adverplaceInfo[index].statusCode == 1) {
        return "0";
      } else {
        return "1";
      }
    }
  },

  mounted() {
    if (!this.$store.getters.adverplaceInfo) {
      if (!this.$store.getters.adverplacePage) {
        this.$store.dispatch("getInfo", {
          pageInfo: {
            pageSize: 10,

            pageNum: 1
          },

          type: "adverplace"
        });
      } else {
        this.$store.dispatch("getInfo", {
          pageInfo: this.$store.getters.adverplacePage,

          type: "adverplace"
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

