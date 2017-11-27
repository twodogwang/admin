<template>
  <div>
    <el-cascader placeholder="请选择省市区" size="small" :options="options" v-model="searchoptions" @change="searchcommunity">
    </el-cascader>
    <el-select filterable @change="searchbuilding" size="small" v-model="searchforroom" :placeholder="placeholder">
      <el-option v-for="item in communitylist" :key="item.id" :label="item.name" :value="item.communitiesCode">
      </el-option>
    </el-select>
    <!-- <el-select @change="searchroom" size="small" v-model="searchforcommunity" placeholder="请选择楼栋">
          <el-option v-for="item in buildinglist" :key="item.id" :label="item.name" :value="item.communitiesCode">
          </el-option>
        </el-select> -->
    <!-- <el-select @change="testing" size="small" v-model="tests" placeholder="请选择楼栋">
                    <el-option value="123" label="test">
                    </el-option>
                  </el-select> -->
  </div>
</template>

<script>
import fetch from '@/utils/fetch';
import { regionData } from 'element-china-area-data';
export default {
  props: {
    test: String
  },
  data() {
    return {
      options: regionData,
      communitylist: '',
      buildinglist: '',
      roomlist: '',
      tests: '',
      searchforroom: '',
      searchforcommunity: '',
      searchoptions: [],
      placeholder: ''
    };
  },
  methods: {
    testing() {
      this.$emit('selected', { 'test': this.tests });
    },
    searchcommunity(code) {
      console.log(code);
      this.placeholder = '请选择社区'
      // 先通过省市区查询小区列表
      fetch({
        url: '/baseMessage/communities/selectCommByAreaCode',
        methods: 'get',
        params: { areaCode: code[2] }
      }).then(result => {
        // communitylist为页面上的搜索区小区列表下拉的值
        this.communitylist = result.data;
      });
    },
    searchbuilding(code) {
      console.log(code);
      // 通过选择的社区号来搜索楼栋作为下拉选项
      fetch({
        url: '/baseMessage/building/selectBuildingByCommunitiesCode',
        methods: 'get',
        params: { communitiesCode: code }
      }).then(result => {
        this.buildinglist = result.data;
        this.$emit('selected', { buildinglist: result.data });
      });
    },
    searchroom(code) {
      console.log(code);
      // 通过选择的楼栋号来搜索房间作为表格内容
      fetch({
        url: '',
        methods: 'get',
        params: {}
      }).then(result => {
        this.roomlist = result.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


