<script>
import { NAME_PREFIX } from '../const/common'
import SvgIcon from '../svg-icon'

export default {
  name: `${NAME_PREFIX}IconTitle`,
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={['el-icon-font', icon]} />)
      } else {
        vnodes.push(<SvgIcon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(
        <span slot="title" class="icon-title">
          {title}
        </span>,
      )
    }
    return vnodes
  },
}
</script>

<style lang="scss" scoped>
.el-icon-font {
  color: currentColor;
  width: 1em;
  height: 1em;
}

.el-icon-font + .icon-title,
.svg-icon + .icon-title {
  margin-left: 8px;
}
</style>
