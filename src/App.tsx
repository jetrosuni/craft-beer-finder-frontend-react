import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

import { MainView } from "./views/MainView";

function App() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="col-span-1 hidden lg:block"></div>
      <div className="col-span-1 lg:col-span-3">
        <MainView />
      </div>
      <div className="col-span-1 hidden lg:block"></div>
    </div>
  );
}

export default App;
