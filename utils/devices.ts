const sizes = {
  mobile: '767px',
  tablet: '768px',
  laptop: '1440px',
}

const devices = {
  mobile: `max-width: ${sizes.mobile}`,
  tablet: `min-width: ${sizes.tablet}`,
  laptop: `min-width: ${sizes.laptop}`,
}

export { devices }
