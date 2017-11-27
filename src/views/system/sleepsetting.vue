<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
          <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes(selectlist)">删除</el-button> -->
        </el-row>
        <el-table stripe border :data="sleepInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
                                      </el-table-column> -->          
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="name" label="休眠名称">
          </el-table-column>
          <el-table-column prop="dormancyNum" label="休眠编号">
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间">
          </el-table-column>
          <el-table-column prop="stopTime" label="结束时间">
          </el-table-column>
          <el-table-column prop="dormancyType.name" label="状态">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editInfo(scope.$index, sleepInfo)">编辑</el-button>
              <el-button size="mini" type="danger" @click="Delete(scope.$index, sleepInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination isSearch="none" pageType="sleep" :pageInfo="sleepPage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :before-close="beforeClose" title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="休眠名称" prop="name">
          <el-input size="small" v-model="formState.name"></el-input>
        </el-form-item>
        <el-form-item label="休眠编号" prop="name">
          <el-input size="small" v-model="formState.dormancyNum"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="name">
          <el-input size="small" placeholder="格式HH:MM" v-model="formState.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="id">
          <el-input size="small" placeholder="格式HH:MM" v-model="formState.stopTime"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="">
          <el-select size="small" v-model="formState.dormancyStatus" placeholder="请选择状态">
            <el-option v-for="item in state" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={dormancyStatus:''}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
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
      formState: { dormancyStatus: '' },
      state: '',
      rules: {}
    };
  },
  methods: {
    addInfo() {
      this.edit = false;
      this.dialogFormVisible = true;
      if (!this.state) {
        fetch({
          url: '/baseMessage/dormancy/selectDormancyType',
          methods: 'get'
        }).then((result) => {
          this.state = result.data;
        });
      }
    },
    editInfo(index, rows) {
      this.edit = true;
      this.dialogFormVisible = true;
      if (!this.state) {
        fetch({
          url: '/baseMessage/dormancy/selectDormancyType',
          methods: 'get'
        }).then((result) => {
          this.state = result.data;
        });
      }
      console.log('state', this.state);
      console.log('---index---', index);
      console.log('---rows---', rows);
      const rowData = rows[index];
      console.log('rowData', rowData);
      Object.assign(this.formState, rowData);
    },
    submitForm(form) {
      if (!this.edit) {
        console.log('this.formstate', this.formState);
        this.$store.dispatch('addInfo', { form: this.formState, type: 'sleep' }).then(() => {
          this.formState = { dormancyStatus: '' };
        });
      } else {
        this.$store.dispatch('updateInfo', { form: this.formState, type: 'sleep' });
      }
      this.dialogFormVisible = false;
    },
    Delete(index, rows) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteInfo', { id: { id: rows[index].id }, type: 'sleep' }).then(this.$message({
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
          this.$store.dispatch('deleteInfoes', { delete: { idList: deleteArr }, type: 'sleep' }).then(result => {
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success',
              duration: 2000
            });
            // this.$store.dispatch('getInfo', this.$store.getters.sleepPage);
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
        this.formState = { dormancyStatus: '' };
        resolve(true);
      }).then(_ => {
        done();
      });
    }
  },
  components: { Pagination },
  computed: {
    ...mapGetters([
      'sleepInfo',
      'sleepPage'
    ])
  },
  mounted() {
    if (!this.$store.getters.sleepInfo) {
      if (!this.$store.getters.sleepPage) {
        this.$store.dispatch('getInfo', { pageInfo: { pageSize: 10, pageNum: 1 }, type: 'sleep' });
      } else {
        this.$store.dispatch('getInfo', { pageInfo: this.$store.getters.sleepPage, type: 'sleep' });
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
