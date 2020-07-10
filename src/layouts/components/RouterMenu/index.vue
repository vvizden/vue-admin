<script>
import { mapGetters } from 'vuex'
import { createMenuChild } from './createMenuChild'

export default {
  name: 'RouterMenu',
  props: {
    mode: {
      type: String,
      default: 'vertical',
      validator: function(value) {
        return ['horizontal', 'vertical'].indexOf(value) !== -1
      },
    },
    backgroundColor: {
      type: String,
    },
    textColor: {
      type: String,
    },
    activeTextColor: {
      type: String,
    },
  },
  computed: {
    ...mapGetters(['menuRoutePermissions', 'sidebar']),
    activeMenu() {
      const { meta, path } = this.$route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse() {
      return this.sidebar.isCollapse
    },
    menuData() {
      return {
        props: {
          defaultActive: this.activeMenu,
          collapse: this.isCollapse,
          uniqueOpened: false,
          collapseTransition: false,
          router: false,
          mode: this.mode,
          backgroundColor: this.backgroundColor,
          textColor: this.textColor,
          activeTextColor: this.activeTextColor,
        },
      }
    },
  },
  // eslint-disable-next-line
  render(h) {
    return (
      <el-menu {...this.menuData}>
        {this.menuRoutePermissions.map((e) => createMenuChild.call(this, e))}
      </el-menu>
    )
  },
}
</script>
