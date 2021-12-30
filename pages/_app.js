import { ChakraProvider,extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
  sm: '37.5em', // small 600px
  md: '56.25em', // medium 900px
  lg: '68.75em', // large 1100px
  xl: '87.5em', // x-large 1400px
});

const theme = extendTheme({
  breakpoints
});
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp