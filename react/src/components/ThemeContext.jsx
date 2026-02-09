import { createContext, useContext, useEffect, useState } from "react";
import "./ThemeContext.css";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
         localStorage.getItem("theme") || "dark"
  );

  
  
          useEffect(() => {
      
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
//this i have to update
export const useTheme = () => useContext(ThemeContext);
// new theme has to be added dark theme nnn