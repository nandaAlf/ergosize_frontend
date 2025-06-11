// import { AppRouter } from "./routes/AppRouter";
import { BrowserRouter } from "react-router-dom";
import DashboardLayoutBasic from "./components/D";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
// import NavBar from './components/NavBar';
// Define tu tema personalizado
// const theme = createTheme({

//   palette: {
//     primary: {
//       main: "#2563eb", //grey
//       light: "#f0f0f0",
//       dark: "#0088ffff",
//       contrastText: "#fff",
//     },
//     secondary: {
//       main: "#fff", // Color secundario personalizado (verde)
//       light: "#fff", //gray
//       // dark
//     },
//     error: {
//       main: "#db3027ff", // Color de error personalizado (rojo)
//     },
//   },
// });
// const theme = createTheme({
//   cssVariables: {
//     colorSchemeSelector: "data-toolpad-color-scheme",
//   },
//   colorSchemes: { light: true, dark: true },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        {/* <ThemeProvider theme={theme}> */}
        {/* <Layout/> */}
     
          <NotificationsProvider>
            <DashboardLayoutBasic />
          </NotificationsProvider>
    
        {/* <AppRouter /> */}
        {/* <Footer /> */}
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </>
  );
}

// const App: React.FC = () => {
//   return (
//     <>
//       <CssBaseline />
//       <Box
//         sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
//       >
//         <NavBar />
//         <Home />
//         <Footer />
//       </Box>
//     </>
//   );
// };

export default App;
