import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import User from "./scenes/User"
import Matcher from "./scenes/Matcher"
import SuperMatcher from "./scenes/SuperMatcher"
import Reporter from "./scenes/Reporter"
import Searcher from "./scenes/Searcher"
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Navigate to="/user" />} /> {/* Default route */}
              <Route path="/user" element={<User />} />
              <Route path="/matcher" element={<Matcher />} />
              <Route path="/super_matcher" element={<SuperMatcher />} />
              <Route path="/reporter" element={<Reporter />} />
              <Route path="/searcher" element={<Searcher />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
