import { RouteObject } from "react-router-dom";
import Assets from "./Assets";
import Home from "./Home";
import Lotteries from "./Lotteries";

const routes: RouteObject[] = [
  {
    element: <Home />,
    path: "/",
    children: [
      {
        element: <Lotteries />,
        path: "/lotteries",
        children: [],
      },
      {
        element: <Assets />,
        path: "/assets",
        children: [],
      },
      {
        element: <Lotteries />,
        path: "/histories",
        children: [],
      },
      {
        element: <Lotteries />,
        path: "/mypage",
        children: [],
      },
    ],
  },
];

export default routes;
