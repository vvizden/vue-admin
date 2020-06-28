<script>
import { createMenu } from './createMenu'

export default {
  name: 'ElMenuChild',
  functional: true,
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  // eslint-disable-next-line
  render(h, ctx) {
    return createMenu.call(
      ctx.parent,
      ctx.parent.$createElement,
      ctx.props.item,
      ctx.props.basePath,
    )
  },
}
</script>
