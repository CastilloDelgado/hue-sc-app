import React, { createContext, useState, useMemo, useContext } from "react";

const AppContext = createContext();

export function AppProvider(props) {
  const [darkMode, setDarkMode] = useState(true);
  const [networkInfo, setNetworkInfo] = useState({
    id: "",
    ip: "",
    user: "",
    key: "",
  });
  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      networkInfo,
      setNetworkInfo,
    }),
    [darkMode, networkInfo]
  );

  return <AppContext.Provider value={value} {...props} />;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");

  return context;
}
