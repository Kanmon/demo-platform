export interface PlatformStyles {
  h1FontFamily: string
  h1FontSize: string
  h1LineHeight: string
  h1FontColor: string
  h1FontWeight: string

  subheaderFontFamily: string
  subheaderFontSize: string
  subheaderLineHeight: string
  subheaderFontColor: string
  subheaderFontWeight: string

  bodyLargeFontFamily: string
  bodyLargeFontSize: string
  bodyLargeLineHeight: string
  bodyLargeFontColor: string
  bodyLargeFontWeight: string

  bodyRegularFontFamily: string
  bodyRegularFontSize: string
  bodyRegularLineHeight: string
  bodyRegularFontColor: string
  bodyRegularFontWeight: string

  bodySmallFontFamily: string
  bodySmallFontSize: string
  bodySmallLineHeight: string
  bodySmallFontColor: string
  bodySmallFontWeight: string

  buttonFontFamily: string
  buttonFontSize: string
  buttonFontColor: string
  buttonFontWeight: string
  buttonBorderRadius: string
  buttonTextAllCaps: boolean

  primaryColor: string
  modalBackgroundColor: string
}

export interface PlatformStyleConfigurationsDTO {
  id: string
  name: string | null
  platformId: string
  styles: PlatformStyles
  auth0Title: string
  auth0Body: string
  auth0BackgroundImage: string | null
  auth0Logo: string | null
  bizexHeaderImage: string | null
  createdAt: string
  updatedAt: string
  isDefault?: boolean
  modalBackgroundColor: string
  faviconUrl: string | null
  demoPrimaryColor: string | null
  demoPrimaryTextColor: string | null
  demoSecondaryColor: string | null
  demoSecondaryTextColor: string | null
  demoTertiaryColor: string | null
  demoTertiaryTextColor: string | null
  demoSidenavBgColor: string | null
  demoSidenavTextColor: string | null
  demoSidenavSelectedTextColor: string | null
  demoDefaultTextColor: string | null
  demoBannerBgColor: string | null
  demoLogoUrl: string | null
}
