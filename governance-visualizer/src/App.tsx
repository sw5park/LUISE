import React, { useState } from "react";

function App() {
  const [result, setResult] = useState("");

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/execute-script");
      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={handleClick}>Run Script</button>
      <pre>{result}</pre>
    </div>
  );
}

export default App;
