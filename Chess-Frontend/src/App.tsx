import { BrowserRouter, Route, Routes } from "react-router-dom"
import GamePage from "./Pages/GamePage"
import HomePage from "./Pages/HomePage"

function App() {


  return (
    <div className="bg-cgray">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
