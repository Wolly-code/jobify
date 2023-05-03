import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Landing, Error, Dashboard } from "./pages";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
