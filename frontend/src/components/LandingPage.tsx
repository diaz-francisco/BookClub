import Header from "./LandingPage/Header";
import Home from "./LandingPage/Home";
// import Monthly from "./LandingPage/Monthly";

export default function LandingPage() {
  // let component;
  // switch (window.location.pathname) {
  //   case "/home":
  //     component = <Home />;
  //     break;
  //   case "/monthly":
  //     component = <Monthly />;
  //     break;
  // }

  return (
    <div>
      <div
        style={{ position: "sticky", top: "0px" }}
      >
        <Header />
      </div>
      <Home />
    </div>
  );
}
