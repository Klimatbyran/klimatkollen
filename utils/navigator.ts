export function hasShareAPI() {
  if (process.env.NODE_ENV !== 'production') return true
  return typeof navigator !== 'undefined' && !!navigator.share
}
