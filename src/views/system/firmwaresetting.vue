<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
          <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes(selectlist)">删除</el-button> -->
        </el-row>
        <el-table stripe border :data="firmwareInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
                                                                          </el-table-column> -->
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="firmwareNum" label="固件编号">
          </el-table-column>
          <el-table-column prop="firmwareVersion" label="固件版本">
          </el-table-column>
          <el-table-column prop="fileName" label="文件名">
          </el-table-column>
          <el-table-column prop="description" label="更新说明">
          </el-table-column>
          <el-table-column prop="firmwareType2.name" label="文件类型">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editInfo(scope.$index, firmwareInfo)">编辑</el-button>
              <el-button size="mini" type="danger" @click="Delete(scope.$index, firmwareInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType="firmware" :pageInfo="firmwarePage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :before-close="beforeClose" title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="固件编号" prop="">
          <el-input size="small" v-model="formState.firmwareNum"></el-input>
        </el-form-item>
        <el-form-item label="固件版本" prop="">
          <el-input size="small" v-model="formState.firmwareVersion"></el-input>
        </el-form-item>
        <el-form-item label="文件名" prop="">
          <el-input size="small" v-model="formState.fileName"></el-input>
        </el-form-item>
        <el-form-item label="更新说明" prop="">
          <el-input size="small" v-model="formState.description"></el-input>
        </el-form-item>
        <el-input type="hidden" size="small" placeholder="格式HH:MM" v-model="formState.file"></el-input>
        <el-form-item label="文件">
          <el-upload :data="formState" with-credentials :on-success="uploadsuccess" :before-upload="check" ref="upload" :auto-upload="false" class="upload-demo" :action="actionUrl" :file-list="fileList">
            <el-button size="small" type="primary">点击选择文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="文件类型" prop="">
          <el-select size="small" v-model="formState.firmwareType" placeholder="请选择状态">
            <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={firmwareType:''};fileList=[]">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validateNumandAlp } from '@/utils/validate';
import fetch from '@/utils/fetch';
import {
  mapGetters
} from 'vuex';
import Pagination from '../../components/pagination/page.vue';
export default {
  data() {
    return {
      edit: false,
      loading: false,
      deleteState: true,
      dialogFormVisible: false,
      formState: { firmwareType: '' },
      type: '',
      rules: {},
      fileList: [],
      extral: {}
    };
  },
  methods: {
    addInfo() {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.formState = { firmwareType: '' };
      this.edit = false;
      this.dialogFormVisible = true;
      if (!this.type) {
        fetch({
          url: '/baseMessage/firmware/selectType',
          methods: 'get'
        }).then((result) => {
          this.type = result.data;
        });
      }
    },
    editInfo(index, rows) {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.edit = true;
      this.dialogFormVisible = true;
      if (!this.type) {
        fetch({
          url: '/baseMessage/firmware/selectType',
          methods: 'get'
        }).then((result) => {
          this.type = result.data;
        });
      }
      console.log('type', this.type);
      console.log('---index---', index);
      console.log('---rows---', rows);
      const rowData = rows[index];
      console.log('rowData', rowData);
      Object.assign(this.formState, rowData);
    },
    check(file) {
      console.log(file);
      const pointposition = file.name.lastIndexOf('.');
      const name = file.name.substring(0, pointposition);
      if (!validateNumandAlp(name)) {
        this.$notify({
          showClose: true,
          message: '文件名必须为英文或数字。',
          type: 'info'
        });
        return false;
      }
    },
    submitForm(form) {
      // this.$refs.upload.submit();
      console.log(this.fileList)
      if (!this.edit) {
        console.log('this.formstate', this.formState);
        /* this.$store.dispatch('addInfo', { form: this.formState, type: 'firmware' }).then(() => {
          this.formState = { firmwareType: '' };
        }); */
        this.$refs.upload.submit();
      } else {
        // this.$refs.upload.submit();
        this.$store.dispatch('updateInfo', { form: this.formState, type: 'firmware' }).then(() => {
          this.formState = { firmwareType: '' };
        });
      }
      this.dialogFormVisible = false;
    },
    uploadsuccess(response, file, filelist) {
      console.log('upload success');
      this.$store.dispatch('getInfo', { pageInfo: { pageSize: 10, pageNum: 1 }, type: 'firmware' });
      this.formState = { firmwareType: '' };
    },
    Delete(index, rows) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteInfo', { id: { id: rows[index].id }, type: 'firmware' }).then(this.$message({
          type: 'success',
          message: '删除成功!'
        }));
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    Deletes() {
      let deleteArr = this.multipleSelection.map((currentValue, index, arr) => currentValue.id);
      console.info(deleteArr);
      deleteArr = deleteArr.join(',');
      if (deleteArr && deleteArr.length !== 0) {
        this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>
          this.$store.dispatch('deleteInfoes', { delete: { idList: deleteArr }, type: 'firmware' }).then(result => {
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success',
              duration: 2000
            });
            // this.$store.dispatch('getInfo', this.$store.getters.firmwarePage);
          }));
      }
    },
    handleSelectionChange(val) {
      if (val.length !== 0) {
        this.deleteState = false;
      } else {
        this.deleteState = true;
      }
      this.multipleSelection = val;
    },
    beforeClose(done) {
      return new Promise((resolve, reject) => {
        this.$refs.upload.clearFiles();
        this.formState = { firmwareType: '' };
        resolve(true);
      }).then(_ => {
        done();
      });
    }
  },
  components: { Pagination },
  computed: {
    ...mapGetters([
      'firmwareInfo',
      'firmwarePage'
    ]),
    actionUrl: function() {
      if (this.edit === true) {
        return 'http://47.92.106.249:8089/xyzhiping//baseMessage/firmware/update';
      } else {
        return 'http://47.92.106.249:8089/xyzhiping//baseMessage/firmware/save';
      }
    }
  },
  mounted() {
    if (!this.$store.getters.firmwareInfo) {
      if (!this.$store.getters.firmwarePage) {
        this.$store.dispatch('getInfo', { pageInfo: { pageSize: 10, pageNum: 1 }, type: 'firmware' });
      } else {
        this.$store.dispatch('getInfo', { pageInfo: this.$store.getters.firmwarePage, type: 'firmware' });
      }
    }
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
