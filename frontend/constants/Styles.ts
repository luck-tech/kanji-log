import { StyleSheet, Platform } from 'react-native';
import { Colors } from './Colors';

export const Layout = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const Styles = StyleSheet.create({
  // Flex
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },

  // Justify Content
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },

  // Align Items
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
  alignCenter: { alignItems: 'center' },
  alignStretch: { alignItems: 'stretch' },

  // Position
  relative: { position: 'relative' },
  absolute: { position: 'absolute' },

  // Background Colors
  bgPrimary: { backgroundColor: Colors.primary[500] },
  bgPrimary50: { backgroundColor: Colors.primary[50] },
  bgPrimary100: { backgroundColor: Colors.primary[100] },
  bgPrimary600: { backgroundColor: Colors.primary[600] },
  bgSecondary: { backgroundColor: Colors.secondary[100] },
  bgSecondary100: { backgroundColor: Colors.secondary[100] },
  bgWhite: { backgroundColor: Colors.white },
  bgTransparent: { backgroundColor: Colors.transparent },
  bgError: { backgroundColor: Colors.error[500] },
  bgError50: { backgroundColor: Colors.error[50] },
  bgError100: { backgroundColor: Colors.error[100] },
  bgSuccess: { backgroundColor: Colors.success[500] },
  bgSuccess50: { backgroundColor: Colors.success[50] },
  bgWarning: { backgroundColor: Colors.warning[500] },
  bgNeutral100: { backgroundColor: Colors.neutral[100] },
  bgNeutral200: { backgroundColor: Colors.neutral[200] },
  bgBlue100: { backgroundColor: Colors.primary[100] },
  bgBlue500: { backgroundColor: Colors.primary[500] },

  // Text Colors
  textPrimary: { color: Colors.primary[600] },
  textPrimary600: { color: Colors.primary[600] },
  textSecondary: { color: Colors.secondary[600] },
  textWhite: { color: Colors.white },
  textBlack: { color: Colors.black },
  textError: { color: Colors.error[600] },
  textError600: { color: Colors.error[600] },
  textError700: { color: Colors.error[700] },
  textError800: { color: Colors.error[800] },
  textSuccess: { color: Colors.success[600] },
  textNeutral400: { color: Colors.neutral[400] },
  textNeutral500: { color: Colors.neutral[500] },
  textNeutral600: { color: Colors.neutral[600] },
  textNeutral700: { color: Colors.neutral[700] },
  textNeutral800: { color: Colors.neutral[800] },
  textNeutral900: { color: Colors.neutral[900] },

  // Font Sizes
  textXs: { fontSize: Layout.fontSize.xs },
  textSm: { fontSize: Layout.fontSize.sm },
  textBase: { fontSize: Layout.fontSize.base },
  textLg: { fontSize: Layout.fontSize.lg },
  textXl: { fontSize: Layout.fontSize.xl },
  text2Xl: { fontSize: Layout.fontSize['2xl'] },
  text3Xl: { fontSize: Layout.fontSize['3xl'] },

  // Font Weights
  fontNormal: { fontWeight: Layout.fontWeight.normal },
  fontMedium: { fontWeight: Layout.fontWeight.medium },
  fontSemibold: { fontWeight: Layout.fontWeight.semibold },
  fontBold: { fontWeight: Layout.fontWeight.bold },

  // Padding
  p1: { padding: Layout.spacing.xs },
  p2: { padding: Layout.spacing.sm },
  p3: { padding: 12 },
  p4: { padding: Layout.spacing.md },
  p5: { padding: 20 },
  p6: { padding: Layout.spacing.lg },
  p8: { padding: Layout.spacing.xl },

  px1: { paddingHorizontal: Layout.spacing.xs },
  px2: { paddingHorizontal: Layout.spacing.sm },
  px3: { paddingHorizontal: 12 },
  px4: { paddingHorizontal: Layout.spacing.md },
  px6: { paddingHorizontal: Layout.spacing.lg },
  px8: { paddingHorizontal: Layout.spacing.xl },

  py1: { paddingVertical: Layout.spacing.xs },
  py2: { paddingVertical: Layout.spacing.sm },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: Layout.spacing.md },
  py6: { paddingVertical: Layout.spacing.lg },
  py8: { paddingVertical: Layout.spacing.xl },

  // Margin
  m1: { margin: Layout.spacing.xs },
  m2: { margin: Layout.spacing.sm },
  m3: { margin: 12 },
  m4: { margin: Layout.spacing.md },
  m6: { margin: Layout.spacing.lg },
  m8: { margin: Layout.spacing.xl },

  mx1: { marginHorizontal: Layout.spacing.xs },
  mx2: { marginHorizontal: Layout.spacing.sm },
  mx4: { marginHorizontal: Layout.spacing.md },
  mx6: { marginHorizontal: Layout.spacing.lg },
  mx8: { marginHorizontal: Layout.spacing.xl },

  my1: { marginVertical: Layout.spacing.xs },
  my2: { marginVertical: Layout.spacing.sm },
  my3: { marginVertical: 12 },
  my4: { marginVertical: Layout.spacing.md },
  my6: { marginVertical: Layout.spacing.lg },
  my8: { marginVertical: Layout.spacing.xl },

  mb1: { marginBottom: Layout.spacing.xs },
  mb2: { marginBottom: Layout.spacing.sm },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: Layout.spacing.md },
  mb6: { marginBottom: Layout.spacing.lg },
  mb8: { marginBottom: Layout.spacing.xl },
  mb12: { marginBottom: Layout.spacing['2xl'] },

  mt1: { marginTop: Layout.spacing.xs },
  mt2: { marginTop: Layout.spacing.sm },
  mt3: { marginTop: 12 },
  mt4: { marginTop: Layout.spacing.md },
  mt6: { marginTop: Layout.spacing.lg },
  mt8: { marginTop: Layout.spacing.xl },

  mr1: { marginRight: Layout.spacing.xs },
  mr2: { marginRight: Layout.spacing.sm },
  mr3: { marginRight: 12 },
  mr4: { marginRight: Layout.spacing.md },

  ml1: { marginLeft: Layout.spacing.xs },
  ml2: { marginLeft: Layout.spacing.sm },
  ml3: { marginLeft: 12 },
  ml4: { marginLeft: Layout.spacing.md },

  // Border Radius
  rounded: { borderRadius: Layout.borderRadius.md },
  roundedSm: { borderRadius: Layout.borderRadius.sm },
  roundedLg: { borderRadius: Layout.borderRadius.lg },
  roundedXl: { borderRadius: Layout.borderRadius.xl },
  rounded2Xl: { borderRadius: Layout.borderRadius['2xl'] },
  roundedFull: { borderRadius: Layout.borderRadius.full },

  // Border
  border: { borderWidth: 1, borderColor: Colors.neutral[200] },
  border2: { borderWidth: 2, borderColor: Colors.neutral[200] },
  borderNeutral200: { borderColor: Colors.neutral[200] },
  borderNeutral300: { borderColor: Colors.neutral[300] },
  borderPrimary: { borderColor: Colors.primary[500] },
  borderPrimary200: { borderColor: Colors.primary[200] },
  borderError200: { borderColor: Colors.error[200] },

  // Width & Height
  wFull: { width: '100%' },
  hFull: { height: '100%' },
  w4: { width: Layout.spacing.md },
  h4: { height: Layout.spacing.md },
  w6: { width: Layout.spacing.lg },
  h6: { height: Layout.spacing.lg },
  w8: { width: Layout.spacing.xl },
  h8: { height: Layout.spacing.xl },
  w10: { width: 40 },
  h10: { height: 40 },
  w12: { width: Layout.spacing['2xl'] },
  h12: { height: Layout.spacing['2xl'] },
  w16: { width: 64 },
  h16: { height: 64 },
  w20: { width: 80 },
  h20: { height: 80 },
  w44: { width: 176 },
  h44: { height: 176 },

  // Shadows
  shadowSm: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  shadowMd: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  shadowLg: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  // Other
  overflow: { overflow: 'hidden' },
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
});
