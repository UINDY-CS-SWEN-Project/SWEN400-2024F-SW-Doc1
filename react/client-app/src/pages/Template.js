import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbFs, auth } from "../firebase/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot
} from "firebase/firestore";

function TemplateManager() {
    const [templates, setTemplates] = useState([]);
    const [templateName, setTemplateName] = useState("");
    const [templateContent, setTemplateContent] = useState("");
    const [jsonPreview, setJsonPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplateId, setCurrentTemplateId] = useState(null); // Store template ID for editing
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) return;

        const templatesRef = collection(dbFs, "templates");
        const q = query(templatesRef, where("createdBy", "==", auth.currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTemplates = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTemplates(fetchedTemplates);
        });

        return () => unsubscribe();
    }, []);

    const handleContentChange = (content) => {
        setTemplateContent(content);
        try {
            const delta = {
                ops: [
                    { insert: content + "\n" } // Convert text input into a Quill Delta format
                ]
            };
            setJsonPreview(delta);
        } catch (error) {
            setJsonPreview(null);
        }
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            alert("Template name is required!");
            return;
        }
    
        try {
            const templateData = {
                name: templateName,
                content: JSON.stringify(jsonPreview),
                createdBy: auth.currentUser.uid,
                createdAt: new Date(),
            };
    
            if (isEditing && currentTemplateId) {
                const templateRef = doc(dbFs, "templates", currentTemplateId);
                await updateDoc(templateRef, templateData);
                alert("Template updated successfully!");
            } else {
                const docRef = await addDoc(collection(dbFs, "templates"), templateData);
                // Optimistically add the new template
                setTemplates((prev) => [...prev, { id: docRef.id, ...templateData }]);
                alert("Template created successfully!");
            }
    
            resetForm();
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Failed to save template.");
        }
    };
    

    const handleEditTemplate = (template) => {
        setIsEditing(true);
        setCurrentTemplateId(template.id); // Save template ID for updating
        setTemplateName(template.name); // Correctly set the template name
        try {
            const content = JSON.parse(template.content)?.ops[0]?.insert.trim() || "";
            setTemplateContent(content);
            setJsonPreview(JSON.parse(template.content));
        } catch (error) {
            console.error("Error parsing template content:", error);
            setTemplateContent("");
            setJsonPreview(null);
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
            await deleteDoc(doc(dbFs, "templates", templateId));
            // Optimistically remove the deleted template
            setTemplates((prev) => prev.filter((template) => template.id !== templateId));
            alert("Template deleted successfully!");
        } catch (error) {
            console.error("Error deleting template:", error);
            alert("Failed to delete template.");
        }
    };
    

    const resetForm = () => {
        setIsEditing(false);
        setCurrentTemplateId(null);
        setTemplateName("");
        setTemplateContent("");
        setJsonPreview(null);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>Template Manager</h1>
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "gray",
                        color: "white",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Home
                </button>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />
                <textarea
                    placeholder="Template Content"
                    value={templateContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    style={{ width: "100%", height: "150px", padding: "8px" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleSaveTemplate}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: isEditing ? "blue" : "green",
                            color: "white",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        {isEditing ? "Update Template" : "Save Template"}
                    </button>
                    {isEditing && (
                        <button
                            onClick={resetForm}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "gray",
                                color: "white",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <div>
                <h3>JSON Preview</h3>
                <pre
                    style={{
                        backgroundColor: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        overflowX: "auto",
                        maxHeight: "200px",
                    }}
                >
                    {jsonPreview ? JSON.stringify(jsonPreview, null, 2) : "Invalid JSON"}
                </pre>
            </div>

            <div>
                <h2>Your Templates</h2>
                {templates.map((template) => (
                    <div key={template.id} style={{ marginBottom: "10px" }}>
                        <span>{template.name}</span>
                        <button
                            onClick={() => handleEditTemplate(template)}
                            style={{
                                marginLeft: "10px",
                                padding: "5px 10px",
                                backgroundColor: "blue",
                                color: "white",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            style={{
                                marginLeft: "10px",
                                padding: "5px 10px",
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TemplateManager;
