<template>
    <div>
        <el-row class="dr-datatable">
            <el-col :span="24">
                <el-row class="dr-datatable">
                    <h3>投诉建议列表</h3>
                </el-row>
                <el-table border :data="complainInfo" align="center" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
                    <el-table-column prop="contact_way" label="手机号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="create_time" label="时间" :formatter="formatdata" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column   label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" type="danger" @click="DeleteComplain(scope.$index, complainInfo)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination pageType="getComplainInfo" :pageInfo="complainPage"></Pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "../../components/pagination/pageLXL.vue";
export default {
    name:"complain",
    data() {
        return {

        }
    },
    components: {
        Pagination
    },
    methods: {
        formatdata(row, cloumu, value) {
            return new Date(value).toLocaleString();
        },
        DeleteComplain(index, rows){
            this.$confirm("确定删除该建议?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.dispatch("deleteComplainInfo", {
                        id: { complaint_id: rows[index].complaint_id },
                    }).then(
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        })
                    );
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        search(){
            return
        }
    },
    computed: {
        ...mapGetters(["complainInfo", "complainPage"])
    },
    beforeCreate() {
        if (!this.$store.getters.complainInfo) {
            if (!this.$store.getters.complainPage) {
                this.$store.dispatch("getComplainInfo", {
                    pageInfo: { pageSize: 10, pageNum: 1 },
                }).then(() => {
                    console.log("compalin");
                    this.loading = false;
                });
            } else {
                this.$store.dispatch("getComplainInfo", {
                    pageInfo: this.$store.getters.complainPage,
                }).then(() => {
                    console.log("compalin");
                    this.loading = false;
                });
            }
        }
    }
}
</script>

<style>

</style>
