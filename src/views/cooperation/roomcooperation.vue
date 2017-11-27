<template>
  <div class="app-container">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <el-row class="dr-datatable">
          <el-button size="small" :data="data" type="primary" icon="plus" @click="dialogFormVisible = true">新建</el-button>
          <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="adminDelete(selectlist)">删除</el-button>
          <el-button size="small" type="default" icon="search" @click="adminDelete(selectlist)">查询</el-button>
          <el-input class="search" size="small" placeholder="请输入设备号"></el-input>
        </el-row>
        <el-table id="admintable" align="center" v-loading="loading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="phoneNum" label="房间号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="email" label="设备号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="mini" @click="editUserInfo(scope.$index, dataList)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteUser(scope.$index, dataList)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination pageType="adminList" :pageInfo="page"></Pagination>
      </el-col>
    </el-row>
    <!-- Form -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formState" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="省市区" prop="sImg">
          <el-cascader size="middle" :options="options" v-model="selectedOptions" @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="房间号" prop="sImg">
          <el-select filterable v-model="formState.region" placeholder="请选择群组">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备号" prop="title">
           <el-select filterable v-model="formState.region" placeholder="请选择群组">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="dr-submitContent">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="small" @click="dialogFormVisible = false;formState.title=null;formState.sImg=null;formState.link=null">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../components/pagination/page.vue'
import { regionData } from 'element-china-area-data'
export default {
  data() {
    return {
      options: regionData,
      selectedOptions: [],
      selectedOptionsedit: [],
      loading: false,
      dialogFormVisible: false,
      formState: {},
      data: '',
      deleteState: true,
      rules: {

      },
      page: {
        totalItems: 100,
        current: 1,
        pageSize: 10
      }
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleChange(value) {
      console.log(value)
    }
  },
  components: {
    Pagination
  }
}
</script>

<style lang="scss" scoped>
.dr-datatable {
  margin-bottom: 1em;
}
.search {
  width: 20%;
}
</style>

