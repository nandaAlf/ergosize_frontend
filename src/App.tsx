
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { AppRouter } from "./routes/AppRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
// import NavBar from './components/NavBar';
// Define tu tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#A3D1C6",
      light: "B3D8A8",
      dark: "#3D8D7A",
      contrastText: "#FBFFE4",
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
          <ResponsiveAppBar></ResponsiveAppBar>
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
