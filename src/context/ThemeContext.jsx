
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  function toggleFavourite(id) {
    setFavourites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  return (
    <ThemeContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useFavourites() {
  return useContext(ThemeContext);
}
