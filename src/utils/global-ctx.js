// 切换全屏，未兼容所有浏览器
export function toggleFullScreen(el) {
  if (!document.fullscreenElement) {
    el.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

// 当前window是否在iframe中
export function isInFrame() {
  return window.parent != window.self
}
