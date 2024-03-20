const deviceSizesPx = {
  mobile: 767,
  tablet: 768,
  laptop: 1440,
}

const devices = {
  mobile: `max-width: ${deviceSizesPx.mobile}px`,
  tablet: `min-width: ${deviceSizesPx.tablet}px`,
  laptop: `min-width: ${deviceSizesPx.laptop}px`,
}

// do a best-effort attempt at checking if touch is primary input method. more info:
// https://www.w3.org/TR/mediaqueries-4/#mf-interaction
const onTouchDevice = () => !!(window.matchMedia('(pointer: coarse)').matches)

export { deviceSizesPx, devices, onTouchDevice }
