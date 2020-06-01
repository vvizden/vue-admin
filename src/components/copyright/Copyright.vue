<template>
  <div class="copyright">
    <p class="copyright__content">
      Copyright @ 2020
      <a class="copyright__link" href="http://www.hongdian.com" target="_blank"
        >深圳市宏电技术股份有限公司</a
      >
      All Rights Reserved
    </p>
  </div>
</template>

<script>
import { NAME_PREFIX } from '../const/common'

export default {
  name: `${NAME_PREFIX}Copyright`,
}
</script>

<style lang="scss" scoped>
.copyright__content {
  font-size: 12px;
}

.copyright__link {
  text-decoration: none;
}
</style>
