const homepage = process.env.REACT_APP_HOMEPAGE;

export const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#5a4b3c',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: 'rgba(245, 230, 202, 0.3)',
      paper: 'rgba(245, 230, 202, 0.3)',
    },
    text: {
      primary: '#333333',
      secondary: '#333333',
      disabled: '#333333',
    },
    info: {
      main: '#3b4b52',
    },
    success: {
      main: '#6b8e23',
    },
  },
  typography: {
    overline: {
      fontFamily: 'Merriweather Sans',
    },
    fontFamily: 'Merriweather Sans',
    h1: {
      fontFamily: 'Merriweather Sans',
    },
    h2: {
      fontFamily: 'Merriweather Sans',
    },
    h3: {
      fontFamily: 'Merriweather Sans',
    },
    h4: {
      fontFamily: 'Merriweather Sans',
    },
    h5: {
      fontFamily: 'Merriweather Sans',
    },
    h6: {
      fontFamily: 'Merriweather Sans',
    },
    subtitle1: {
      fontFamily: 'Merriweather Sans',
    },
    subtitle2: {
      fontFamily: 'Merriweather Sans',
    },
    body1: {
      fontFamily: 'Merriweather Sans',
    },
    body2: {
      fontFamily: 'Merriweather Sans',
    },
    button: {
      fontFamily: 'Merriweather Sans',
    },
    caption: {
      fontFamily: 'Merriweather Sans',
    },
  },
  shape: {
    borderRadius: 4,
  },
  overrides: {
    MuiAppBar: {
      colorInherit: {
        backgroundColor: '#689f38',
        color: '#fff',
      },
    },
  },
  props: {
    MuiAppBar: {
      color: 'inherit',
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 27,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + $track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity: 1,
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: homepage ? `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3)), url(${homepage}/images/diarybg.jpg)` : '',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(245, 230, 202, 1.0)', // Colore con opacità 100%
        },
      },
    },
  },
};