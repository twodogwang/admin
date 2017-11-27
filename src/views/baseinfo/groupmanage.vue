<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
          <!-- <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes(selectlist)">删除</el-button> -->
        </el-row>
        <el-table stripe border :data="groupInfo" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" width="55">
          </el-table-column>
          <el-table-column prop="id" label="群组代码">
          </el-table-column>
          <el-table-column prop="name" label="组名称">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editInfo(scope.$index, groupInfo)">编辑</el-button>
              <el-button size="mini" type="danger" @click="Delete(scope.$index, groupInfo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination pageType="group" :pageInfo="groupPage"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog :before-close="beforeClose" title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <!-- <el-form-item label="群组代码" prop="id">
          <el-input :disabled="iddisabled" size="small" v-model="formState.id"></el-input>
        </el-form-item> -->
        <el-form-item label="组名称" prop="name">
          <el-input size="small" v-model="formState.name"></el-input>
        </el-form-item>
        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState={}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Pagination from '../../components/pagination/page.vue';
export default {
  data() {
    return {
      edit: true,
      loading: false,
      dialogFormVisible: false,
      formState: {},
      deleteState: true,
      iddisabled: true,
      rules: {

      }
    };
  },

  methods: {
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
        this.formState = {};
        resolve(true);
      }).then(_ => {
        done();
      });
    },
    Delete(index, rows) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteInfo', { id: { id: rows[index].id }, type: 'group' }).then(this.$message({
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
    editInfo(index, rows) {
      this.edit = true;
      this.dialogFormVisible = true;
      this.iddisabled = true;
      console.log('---index---', index);
      console.log('---rows---', rows);
      const rowData = rows[index];
      console.log(rowData);
      Object.assign(this.formState, rowData);
    },
    submitForm(form) {
      if (!this.edit) {
        console.log('formState', this.formState);
        this.$store.dispatch('addInfo', { form: this.formState, type: 'group' }).then(() => {
          this.formState = {};
        });
      } else {
        this.$store.dispatch('updateInfo', { form: this.formState, type: 'group' });
      }
      this.dialogFormVisible = false;
    },
    addInfo() {
      this.edit = false;
      this.dialogFormVisible = true;
      this.iddisabled = false;
      this.formState = {};
    }
  },
  components: {
    Pagination
  },
  computed: {
    ...mapGetters([
      'groupInfo',
      'groupPage'
    ])
  },
  mounted() {
    if (!this.$store.getters.groupInfo) {
      if (!this.$store.getters.groupPage) {
        this.$store.dispatch('getInfo', { pageInfo: { pageSize: 10, pageNum: 1 }, type: 'group' });
      } else {
        this.$store.dispatch('getInfo', { pageInfo: this.$store.getters.groupPage, type: 'group' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dr-datatable {
  margin-bottom: 1em;
}
</style>

