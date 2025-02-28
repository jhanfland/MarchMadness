import { Button } from "@/components/ui/button"

import { useState } from 'react'
import MMLogo from "./images/logo.png"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={MMLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>MM App (React Framework + TypeScript Variant)</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          This is the ShadCN Button: {count}
        </Button>
      </div>
    </>
  )
}

export default App
