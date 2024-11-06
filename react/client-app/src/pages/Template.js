import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Template() {
  const [template, setTemplate] = useState([]);
  const [elementLabel, setElementLabel] = useState('');
  const [isWritable, setIsWritable] = useState(true);
  const [jsonValue, setJsonValue] = useState(JSON.stringify(template, null, 2));
  const navigate = useNavigate();

  const handleAddElement = () => {
    const newTemplate = [...template, { label: elementLabel, writable: isWritable }];
    setTemplate(newTemplate);
    setElementLabel(''); 
    setJsonValue(JSON.stringify(newTemplate, null, 2));
  };

  const handleRemoveElement = (index) => {
    const newTemplate = template.filter((_, i) => i !== index);
    setTemplate(newTemplate);
    setJsonValue(JSON.stringify(newTemplate, null, 2));
  };

  const handleSave = () => {
    console.log("Template saved:", template);
  };

  const handleEditorChange = (event) => {
    const value = event.target.value;
    try {
      const parsedValue = JSON.parse(value);
      setTemplate(parsedValue);
    } catch (error) {
      // Handle JSON parsing errors if necessary
    }
    setJsonValue(value);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", backgroundColor: "#e7f1fc", borderRadius: "10px" }}>
      <h1>Template Configuration Page</h1>

      {/* JSON Editor */}
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#d3eaf9" }}>
        <h2>JSON Editor</h2>
        <textarea
          style={{ width: "100%", height: "200px" }}
          value={jsonValue}
          onChange={handleEditorChange}
        />
      </div>

      {/* Add Element Section */}
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#ffffff", border: "1px solid #ddd", borderRadius: "5px" }}>
        <input
          type="text"
          placeholder="Enter element label"
          value={elementLabel}
          onChange={(e) => setElementLabel(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Writable:</span>
          <input
            type="checkbox"
            checked={isWritable}
            onChange={(e) => setIsWritable(e.target.checked)}
          />
          <span>{isWritable ? "Writable" : "Read-Only"}</span>
        </label>
      </div>

      {/* Add and Remove Buttons */}
      <button
        onClick={handleAddElement}
        style={{ padding: "10px 15px", backgroundColor: "green", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer", marginRight: "10px" }}
      >
        Add Element
      </button>

      {/* Display the List of Elements */}
      {template.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {template.map((element, index) => (
            <div key={index} style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{element.label} - {element.writable ? "Writable" : "Read-Only"}</span>
              <button
                onClick={() => handleRemoveElement(index)}
                style={{ padding: "5px 10px", backgroundColor: "red", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{ padding: "10px 15px", backgroundColor: "blue", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer", marginTop: "20px" }}
      >
        Save
      </button>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        style={{ padding: "10px 15px", backgroundColor: "#555", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer", marginTop: "10px", display: "block" }}
      >
        Home
      </button>
    </div>
  );
}

export default Template;
