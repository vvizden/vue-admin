<template>
  <div class="copyright">
    <p class="copyright__content">
      Copyright @ 2020
      <a class="copyright__link" href="#" target="_blank">Your Company</a>
      版权所有
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
