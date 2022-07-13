import React from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "configs";
import { useRoutes } from "react-router-dom";
import routes from "pages";
import { withRoute } from "hocs";

function App() {
  const routeElements = useRoutes(routes);
  return <ThemeProvider theme={theme}>{routeElements}</ThemeProvider>;
}

export default withRoute(App);
