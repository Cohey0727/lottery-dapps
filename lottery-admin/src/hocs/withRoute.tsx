import React from "react";
import { BrowserRouter } from "react-router-dom";

const withRoute =
  <P,>(Component: React.ComponentType<P>): React.ComponentType<P> =>
  (props: P) =>
    <BrowserRouter>{<Component {...props} />}</BrowserRouter>;

export default withRoute;
