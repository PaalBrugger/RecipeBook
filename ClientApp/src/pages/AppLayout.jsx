import Header from "../components/Header";
import { Outlet, Link, useLocation } from "react-router-dom";
import style from "./AppLayout.module.css";

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div>
      <Header />
      <main className={isHome ? "" : style["with-padding"]}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
