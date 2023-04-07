import React, { useState } from "react";
import { useTable } from 'react-table';
import "./App.css";

const Table = ({ columns, data }: any) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="results-table">
      <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: any) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
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
          Through a cyclical proccess, streamline and optimize user defined governance initiatives through:
        </p>
        <div>
          <p>Creation Agent: generate new tasks based on completed work</p>
          <p>Prioritization Agent: refine and order tasks in line with overarching objectives</p>
          <p>Execution Agent: complete tasks as specified</p>
        </div>
      </div>
      <h1>Governance Tracker</h1>
      <p className="description">
        Click the "Run Script" button to track progress in governance initiatives.
      </p>
      <button className="run-script-button" onClick={handleClick} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Collective Decision"}
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
