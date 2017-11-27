<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" :data="data" type="primary" icon="plus" @click="addInfo">新建</el-button>
          <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button> -->
          <el-cascader placeholder="请选择省市区" size="small" :options="options"  @change="searchproperty">
    </el-cascader>
          <el-input :on-icon-click="searcher" class="search" icon="search" size="small" v-model="search" placeholder="请输入物业名以查询"></el-input>
        </el-row>
        <el-table border :data="propertyInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="propertyid" label="物业ID" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="propertyname" label="物业名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="leader" label="负责人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tel" label="电话" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address" label="地址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column   label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="editInfo(scope.$index, propertyInfo)">编辑</el-button>
              <el-button size="small" type="danger" @click="Delete(scope.$index, propertyInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination pageType="property" :pageInfo="propertyInfoChange"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :title="edit?'编辑':'新建'" :visible.sync="dialogFormVisible" :before-close="beforeclose">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="物业名称" prop="sImg">
          <el-input size="small" v-model="formState.propertyname"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="sImg">
          <el-input size="small" v-model="formState.leader"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="title">
          <el-input size="small" v-model="formState.tel"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="title">
          <el-input size="small" v-model="formState.address"></el-input>
        </el-form-item>
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 关联 -->
    <el-dialog size="large" title="选择物业" :visible.sync="propertydialogFormVisible">
      <el-table border stripe :data="propertyInfo" align="center" v-loading="loading" ref="singleTable" tooltip-effect="dark" style="width: 100%" @row-click="correlateProperty">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="propertyname" label="物业名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination pageType="property" :pageInfo="propertyPage"></Pagination>
    </el-dialog>
  </div>
</template>

<script>
import fetch from "@/utils/fetch";
// import Pcc from '../../components/pcc/pcc.vue';
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
      propertydialogFormVisible: false,
      formState: {},
      search: "",
      deleteState: true,
      selectedCorrelationProperty: {},
      rules: {},
      datapasser: null,
      propertyInfoChangepasser: null
    };
  },
  methods: {
    searchproperty(code) {
      // 先通过省市区查询小区列表
      fetch({
        url: "/baseMessage/communities/selectCommByAreaCode",
        methods: "get",
        params: { areaCode: code[2], pageNum: 1, pageSize: 10 }
      }).then(result => {
        // propertylist为页面上的搜索区小区列表下拉的值
        this.datapasser = result.data.list;
        // this.propertyChange = "pccpropertylist";
        this.propertyInfoChangepasser = {
          pageSize: result.data.pageSize,
          pageNum: result.data.pageNum,
          totalItems: result.data.total
        };
      });
    },
    cooperateProperty(index, rows) {
      // 关联物业
      this.propertydialogFormVisible = true;
      this.selectedCorrelationProperty.propertyid = rows[index].propertyid;
      if (!this.propertyInfo) {
        this.$store.dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "property"
        });
      }
    },
    correlateProperty(currentRow, oldCurrentRow) {
      this.$confirm("确定要关联吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return new Promise((resolve, reject) => {
          this.selectedCorrelationProperty.propertyid = currentRow.propertyid;
          resolve();
        }).then(
          fetch({
            url: "/baseMessage/communities/2property",
            method: "post",
            params: this.selectedCorrelationProperty
          })
            .then(() => {
              this.selectedCorrelationProperty = {};
              this.propertydialogFormVisible = false;
              this.$store.dispatch("getInfo", {
                pageInfo: this.$store.getters.propertyPage,
                type: "property"
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
      this.edit = false;
      this.dialogFormVisible = true;
    },
    Deletes() {
      let deleteArr = this.multipleSelection.map(
        (currentValue, index, arr) => currentValue.propertyid
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
              delete: { propertyids: deleteArr },
              type: "property"
            })
            .then(result => {
              this.$notify({
                title: "成功",
                message: "批量删除成功",
                type: "success",
                duration: 2000
              });
              // this.$store.dispatch('getInfo', this.$store.getters.propertyPage);
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
              id: { propertyid: rows[index].propertyid },
              type: "property"
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
          propertyname: this.search,
          pageNum: 1,
          pageSize: this.$store.getters.propertyPage.pageSize
        },
        type: "property"
      });
      // }
    },
    editInfo(index, rows) {
      this.edit = true;
      this.dialogFormVisible = true;
      /* if (!this.propertyType) {
        fetch({
          url: '/baseMessage/propertyType/selectpropertyType',
          methods: 'get'
        }).then((result) => {
          this.propertyType = result.data;
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
          .dispatch("addInfo", { form: this.formState, type: "property" })
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
            type: "property"
          })
          .then(result => {
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
    ...mapGetters(["propertyInfo", "propertyPage"]),
    data: {
      get: function() {
        return this.datapasser || this.propertyInfo;
      },
      set: function(value) {
        return value;
      }
    },
    propertyInfoChange: {
      get: function() {
        return this.propertyInfoChangepasser || this.propertyPage;
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
    // if (!this.$store.getters.propertyInfo) {
    if (!this.$store.getters.propertyPage) {
      this.$store
        .dispatch("getInfo", {
          pageInfo: { pageSize: 10, pageNum: 1 },
          type: "property"
        })
        .then(() => {
          console.log(123);
          this.loading = false;
          // this.data = this.propertyInfo;
          // this.propertyInfoChange = this.propertyPage;
        });
    } else {
      this.$store
        .dispatch("getInfo", {
          pageInfo: this.$store.getters.propertyPage,
          type: "property"
        })
        .then(() => {
          console.log(123);
          this.loading = false;
          // this.data = this.propertyInfo;
          // this.propertyInfoChange = this.propertyPage;
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
