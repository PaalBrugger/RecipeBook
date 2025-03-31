import Header from "../components/Header";
import { Outlet, Link } from "react-router-dom";
function AppLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
