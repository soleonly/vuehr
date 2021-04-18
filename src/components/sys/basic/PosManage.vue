<template>
  <div>
    <div>
      <el-input
          class="posInput"
          size="mini"
          placeholder="添加职位名称"
          prefix-icon="el-icon-plus"
          v-model="pos.name">
      </el-input>
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="handleAdd">添加</el-button>
    </div>
    <div class="mainTable">
      <el-table
          ref="positionsTable"
          :data="positions"
          stripe
          border
          @selection-change="handleSelectionChange">
          style="width: 80%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm
                confirm-button-text='确定'
                cancel-button-text='不敢了'
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button size="mini" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button size="small" @click="handleDeleteBatch" type="danger" :disabled="multipleSelection.length==0" >批量删除</el-button>
      </div>
    </div>
    <el-dialog
        title="编辑职位信息"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-tag type="success">职位名称</el-tag>
        <el-input class="updatePosInput" size="small" v-model="updatePos.name"/>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="handleEdit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: "PosManage",
  data(){
    return {
      pos :{
        name :""
      },
      updatePos:{
        name : ""
      },
      dialogVisible:false,
      positions:[],
      multipleSelection:[]
    }
  },
  mounted() {
    this.initPositions();
  },
  methods:{
    initPositions(){
      this.getRequest("/system/basic/pos/").then(resp=>{
        this.positions = resp;
      })
    },
    showEditDialog(index,data){
      /*变量拷贝*/
      Object.assign(this.updatePos,data);
      this.dialogVisible = true;
    },
    handleEdit(){
      this.dialogVisible = false;
      this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
        if(resp){
          this.initPositions();
          this.updatePos.name = "";
        }
      })
    },
    handleDelete(index,data){
      this.deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
        if(resp){
          this.initPositions();
        }
      })
    },
    handleAdd(){
      if(this.pos.name){
        this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
          if(resp){
            this.initPositions();
            this.pos.name = "";
          }
        })
      }else{
        Message.error("职位名称不能为空");
      }
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    handleDeleteBatch(){
      this.$confirm('此操作将永久删除'+this.multipleSelection.length+'行记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = "?";
        this.multipleSelection.forEach(item=>{
          ids += "ids="+item.id+"&"
        });
        this.deleteRequest("/system/basic/pos/batch"+ids).then(resp=>{
          if(resp){
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
.posInput{
  width: 300px;
  margin-right: 10px;
}
.mainTable{
  margin-top: 10px;
}
.updatePosInput{
  width: 120px;
  margin-left: 10px;
}
</style>
