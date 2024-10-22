import React, { useState } from "react";
import ReactJson from 'react-json-view';
import Switch from "react-switch";
import axios from 'axios';

function App() {
  const [template, setTemplate] = useState([]);
  const [elementLabel, setElementLabel] = useState('');
  const [isWritable, setIsWritable] = useState(true);

  const handleAddElement = () => {
    setTemplate([...template, { label: elementLabel, writable: isWritable }]);
    setElementLabel(''); // Reset input field
  };

  const handleRemoveElement = (index) => {
    setTemplate(template.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/templates', { template });
      console.log("Template saved:", response.data);
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", backgroundColor: "#e7f1fc", borderRadius: "10px" }}>
      <h2>Template Configuration Page</h2>
      
      {/* JSON Editor */}
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#d3eaf9", borderRadius: "5px" }}>
        <h3>JSON Editor</h3>
        <ReactJson src={template} theme="monokai" />
      </div>
      
      {/* Add Element Section */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid black" }}>
        <label htmlFor="elementLabel">Add Element:</label>
        <input
          id="elementLabel"
          type="text"
          value={elementLabel}
          onChange={(e) => setElementLabel(e.target.value)}
          placeholder="Enter element label"
          style={{ marginLeft: "10px" }}
        />
        <br /><br />

        <label htmlFor="isWritable">Writable:</label>
        <Switch
          id="isWritable"
          onChange={setIsWritable}
          checked={isWritable}
          onColor="#86d3ff"
          offColor="#fefefe"
          checkedIcon={false}
          uncheckedIcon={false}
          height={20}
          width={40}
        />
        <span style={{ marginLeft: "10px" }}>{isWritable ? "Writable" : "Read-Only"}</span>
      </div>
      
      {/* Add and Remove Buttons */}
      <button onClick={handleAddElement} style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#4CAF50", color: "white" }}>
        Add Element
      </button>
      {template.length > 0 && template.map((element, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          <span>{element.label} - {element.writable ? "Writable" : "Read-Only"}</span>
          <button onClick={() => handleRemoveElement(index)} style={{ marginLeft: "10px", padding: "3px 7px", backgroundColor: "#f44336", color: "white" }}>
            Remove
          </button>
        </div>
      ))}
      
      {/* Save Button */}
      <button onClick={handleSave} style={{ display: "block", marginTop: "20px", padding: "10px 20px", backgroundColor: "#2196F3", color: "white" }}>
        Save
      </button>
    </div>
  );
}

export default App;
