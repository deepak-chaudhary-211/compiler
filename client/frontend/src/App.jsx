// client/src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');

  const runCode = async () => {
    try {
      const res = await fetch('https://compiler-backend-3576.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input, language })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      setOutput(data.output);
    } catch (error) {
      setOutput(`Failed: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Multi-language Code Compiler</h1>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button className="run-btn" onClick={runCode}>▶ Run</button>
      </div>

      <div className="editor-container">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-editor"
          placeholder={`Write your ${language} code here...`}
          spellCheck="false"
        />

        <div className="output-container">
          <h2>Input</h2>
          <textarea
            className="input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Provide input if required..."
            rows="6"
          />

          <h2>Output</h2>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
