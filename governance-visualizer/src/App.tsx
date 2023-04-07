import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("http://localhost:5000/execute-script");
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="intro-section">
      <h2>Autonomous Governance</h2>
      <p>
        Streamline and optimize user defined governance initiatives. Through a cyclical process, Creation agent generates new tasks based on completed work, 
        Prioritization agent refines and orders tasks in line with overarching objectives, and Execution Agent completing tasks as specified. 
      </p>
    </div>
      <h1>Governance Tracker</h1>
      <p className="description">
        Click the "Run Script" button to track progress in governance initiatives.
      </p>
      <button className="run-script-button" onClick={handleClick} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Governance Data"}
      </button>
      <div className="result-container">
        {error ? (
          <p className="error-message">An error occurred. Please try again later.</p>
        ) : (
          <pre className="result">{result || "No output yet. Run the script to see the results."}</pre>
        )}
      </div>
    </div>
  );
};

export default App;
