import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import Chatbot from "./chatbot/chatbot";

function App() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");
  const [iframeOpen, setIframeOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>  
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  // Function to update the code from chatbot response
  const handleCodeGenerate = (type, code) => {
    if (type === "html") {
      setHtml(code);
    } else if (type === "css") {
      setCss(code);
    } else if (type === "js") {
      setJs(code);
    }
  };

  return (
    <>
      <div className={`pane ${iframeOpen ? "collapsed-pane" : "top-pane"}`}>
        <Editor
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        />
        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor
          language="javascript"
          displayName="JavaScript"
          value={js}
          onChange={setJs}
        />
      </div>
      <div className={`pane ${iframeOpen ? "expanded-iframe" : ""}`}>
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
        <button
          className="toggle-button"
          onClick={() => setIframeOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={iframeOpen ? faCompress : faExpand} />
          {iframeOpen ? " Collapse View" : " Full Screen View"}
        </button>
      </div>
      <Chatbot onCodeGenerate={handleCodeGenerate} />
    </>
  );
}

export default App;
