import React, { useState } from "react";
import "codemirror/lib/codemirror.css"
import "codemirror/theme/material.css"
import "codemirror/mode/xml/xml"
import "codemirror/mode/css/css"
import "codemirror/mode/javascript/javascript"
import { Controlled as ControlledEditor } from "react-codemirror2"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompressAlt, faExpandAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function Editor(props) {
  const { displayName, language, value, onChange } = props

  const [open, setOpen] = useState(true)

  function handleChange(editor, data, value) {
    onChange(value)
  }

  function clearEditor() {
    onChange("")
  }

  return (
    <div className={`editor-container ${open ? '' : 'collapsed'}`}>
      <div className="editor-title">
        {displayName}
        <div className="editor-buttons">
          <button
            type="button"
            className="clear-editor-btn btn"
            onClick={clearEditor}
            title="Clear editor">
              <FontAwesomeIcon icon={faTrash}/>
          </button>
          <button
            type="button"
            className="expand-collapse btn"
            onClick={()=> setOpen(prevOpen => !prevOpen)}
            title={open ? "Collapse" : "Expand"}>
              <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt}/>
          </button>
        </div>
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: "material",
          lineNumbers: true,
        }}
      />
    </div>
  );
}