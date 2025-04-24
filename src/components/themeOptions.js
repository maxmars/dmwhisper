const homepage = process.env.REACT_APP_HOMEPAGE;

export const themeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      xsm: 400,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#5a4b3c',
      mainmatch: 'white',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: 'rgba(231, 219, 208, 1.0)',
      paper: 'rgba(231, 219, 208, 1.0)',
    },
    text: {
      primary: '#333333',
      secondary: '#e15400',
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
    allVariants: {
      "& a": {
        color: '#e15400',
        textDecoration: "none",
        "&:hover": {
          color: '#333333',
          textDecoration: "underline",
        },
      },
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
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0, // Rimuove tutto il padding
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundImage: homepage ? `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3)), url(${homepage}/images/diarybg.jpg)` : '',
          //backgroundSize: 'cover',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'left top',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            fontSize: '1.1rem',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#5a4b3c',
            fontSize: '1.2rem',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#5a4b3c',
            color: '#ffffff',
          },
          backgroundColor: 'rgba(231, 219, 208, 0.3)',
        },
        columnHeaders: {
          "& .MuiButtonBase-root.MuiIconButton-root": {
            color: "white",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(231, 219, 208, 0.4)',
        },
      },
    },
  },
};