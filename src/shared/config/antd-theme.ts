import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#000000',
    colorBgBase: '#ffffff',
    colorTextBase: '#000000',
    fontFamily: "'Jost', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: 0,
    borderRadiusLG: 0,
    borderRadiusSM: 0,
    borderRadiusXS: 0,
    colorBorder: '#e5e5e5',
    colorBorderSecondary: '#d4d4d4',
    colorFill: '#f2f2f2',
    colorFillSecondary: '#f9f9f9',
    fontSize: 14,
    lineHeight: 1.5,
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    motionDurationMid: '0.25s',
  },
  components: {
    Button: {
      borderRadius: 0,
      borderRadiusLG: 0,
      borderRadiusSM: 0,
      colorPrimary: '#000000',
      colorPrimaryHover: '#262626',
      colorPrimaryActive: '#171717',
      paddingContentHorizontal: 32,
      controlHeight: 48,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 0,
      activeBorderColor: '#000000',
      hoverBorderColor: '#000000',
    },
    Select: {
      borderRadius: 0,
      optionSelectedBg: '#f2f2f2',
      optionSelectedColor: '#000000',
      optionSelectedFontWeight: 600,
    },
    Table: {
      borderRadius: 0,
      headerBg: '#f9f9f9',
    },
    Menu: {
      borderRadius: 0,
      itemBorderRadius: 0,
    },
    Drawer: {
      borderRadius: 0,
    },
    Modal: {
      borderRadius: 0,
    },
  },
};
