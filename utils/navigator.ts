export function hasShareAPI() {
  return typeof navigator !== 'undefined' && !!navigator.share
}
