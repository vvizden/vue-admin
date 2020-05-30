export function getCurrentTimeDesc() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? '早上'
    : hour <= 11
    ? '上午'
    : hour <= 13
    ? '中午'
    : hour < 20
    ? '下午'
    : '晚上'
}
