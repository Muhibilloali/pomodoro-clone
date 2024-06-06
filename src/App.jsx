import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../src/components/DailyPages/AuthContext";
import Signin from "./components/SigninPages/Signin";
import Signup from "./components/SignupPages/Signup";
import Daily from "./components/DailyPages/Daily";
import Monthly from "./components/MonthlyPages/Monthly";
import Weekly from "./components/WeeklyPages/Weekly";
import Main from "./components/MainPages/Main";
import { CustomKanban } from "./components/DragAndDropPages/dragtest";
import Forgot from "./components/ForgotPassPages/Forgot";
import SigninSuccess from "./components/SigninPages/SigninSuccess";
import SetNewPassword from "./components/SignupPages/SetNewPassword";
import Control from "./components/ControlPages/Control";
import "./App.css";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Daily />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/control" element={<Control />} />
            <Route path="/signinsuccess" element={<SigninSuccess />} />
            <Route path="/setNewPassword/:uid/:token" element={<SetNewPassword />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/modal" element={<CustomKanban />} />
            <Route path="/main" element={<Main />} />
            <Route path="/monthly" element={<Monthly />} />
            <Route path="/weekly" element={<Weekly />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;



