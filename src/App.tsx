
import Navbar from "./components/AppBar/AppBar";
import ManiquiViewer from "./components/ManiquiViewer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
// import { AppRouter } from "./routes/AppRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, useLocation } from "react-router-dom";
import Layout from "./routes/Layout";
// import NavBar from './components/NavBar';
// Define tu tema personalizado
const theme = createTheme({
  
  palette: {
    primary: {
      main: "#2563eb", //grey
      light: "#f0f0f0",
      dark: "#0088ffff",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff", // Color secundario personalizado (verde)
      light: "#fff", //gray
      // dark
    },
    error: {
      main: "#db3027ff", // Color de error personalizado (rojo)
    },
  },
});

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Layout/>

          {/* <AppRouter /> */}
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
