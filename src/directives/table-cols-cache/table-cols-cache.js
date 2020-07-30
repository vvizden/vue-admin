import Storage from '@/utils/storage'

// table-col-cache abbr
const CACHE_PREFIX = 'tcc'

export default {
  bind(el, binding, vnode) {
    if (binding.arg) {
      const instance = vnode.componentInstance
      if (instance.columnsCtrl) {
        instance.columnsSortMap = Storage.get(
          `${CACHE_PREFIX}${vnode.context.$options.name || ''}_${
            binding.arg
          }_cols_sort_map`,
          null,
        )

        if (instance.columnsSortMap) {
          instance.sortColumns(instance.columnsCopy, instance.columnsSortMap)
          // instance.columnsCheckVal = [...instance.columnsCheckVal]
        }

        instance.checkboxVal = Storage.get(
          `${CACHE_PREFIX}${vnode.context.$options.name || ''}_${
            binding.arg
          }_cols`,
          null,
        )
      }
    }
  },
  unbind(el, binding, vnode) {
    if (binding.arg) {
      const instance = vnode.componentInstance
      if (instance.columnsCtrl) {
        const columnsSortMap = instance.columnsSortMap
        const checkboxVal = instance.checkboxVal

        if (columnsSortMap) {
          Storage.set(
            `${CACHE_PREFIX}${vnode.context.$options.name || ''}_${
              binding.arg
            }_cols_sort_map`,
            columnsSortMap,
          )
        }

        if (checkboxVal) {
          Storage.set(
            `${CACHE_PREFIX}${vnode.context.$options.name || ''}_${
              binding.arg
            }_cols`,
            checkboxVal,
          )
        }
      }
    }
  },
}
