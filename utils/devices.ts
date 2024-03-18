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

export { deviceSizesPx, devices }
