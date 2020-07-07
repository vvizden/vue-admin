<template>
  <iframe
    :src="url"
    frameborder="0"
    width="100%"
    height="100%"
    scrolling="auto"
  ></iframe>
</template>

<script>
export default {
  name: 'IframeView',
  computed: {
    url() {
      return this.$route.meta.url
    },
  },
}
</script>
