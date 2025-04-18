
import Navbar from "./components/AppBar/AppBar";
import ManiquiViewer from "./components/ManiquiViewer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { AppRouter } from "./routes/AppRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
// import NavBar from './components/NavBar';
// Define tu tema personalizado
const theme = createTheme({
  
  palette: {
    primary: {
      main: "##8992a3ff", //grey
      light: "#000",
      dark: "#000",
      contrastText: "#000",
    },
    secondary: {
      main: "#fff", // Color secundario personalizado (verde)
      light: "#ebeef2ff", //gray
      // dark
    },
    error: {
      main: "#f44336", // Color de error personalizado (rojo)
    },
  },
});

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
            <Navbar/>
        
          {/* <ResponsiveAppBar></ResponsiveAppBar> */}
          {/* <ManiquiViewer /> */}
          <AppRouter />
          {/* <Footer /> */}
        </ThemeProvider>
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
