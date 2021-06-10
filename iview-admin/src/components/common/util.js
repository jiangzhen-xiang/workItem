export const showTitle = (item, vm) => {
  console.log('showtitle', vm.$config.useI18n)
  return ((item.meta && item.meta.title) || item.name)
  // return vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)
}
