export function staticFilter(url) {
  if (url.startsWith('http')) {
    return url
  } else {
    return `${process.env.VUE_APP_BASE_API}${process.env.VUE_APP_STATIC_BASE_URL}/${url}`
  }
}
