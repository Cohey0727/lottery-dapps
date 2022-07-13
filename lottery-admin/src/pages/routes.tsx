import { RouteObject } from "react-router-dom";
import Home from "./Home";
import Lotteries from "./Lotteries";
import LotteryDetail from "./LotteryDetail";

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
        element: <LotteryDetail />,
        path: "/lotteries/:lotteryId",
        children: [],
      },
      {
        element: <Lotteries />,
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
