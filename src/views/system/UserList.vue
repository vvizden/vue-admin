<template>
  <div>
    <div class="filter-container"></div>
    <v-table :columns="columns" :data="tableData" border stripe> </v-table>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      columns: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          label: '配送信息',
          children: [
            {
              prop: 'name',
              label: '姓名',
            },
            {
              label: '地址',
              children: [
                {
                  prop: 'province',
                  label: '省份',
                },
                {
                  prop: 'city',
                  label: '市区',
                },
                {
                  prop: 'address',
                  label: '地址',
                },
                {
                  prop: 'zip',
                  label: '邮编',
                },
              ],
            },
          ],
        },
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
      ],
    }
  },
}
</script>

<style></style>
