export function hasShareAPI() {
  return true
  return typeof navigator !== 'undefined' && !!navigator.share
}
