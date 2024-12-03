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
    onSnapshot,
} from "firebase/firestore";

function TemplateManager() {
    const [templates, setTemplates] = useState([]);
    const [templateName, setTemplateName] = useState("");
    const [templateContent, setTemplateContent] = useState("");
    const [jsonPreview, setJsonPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplateId, setCurrentTemplateId] = useState(null);
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
            const delta = { ops: [{ insert: content + "\n" }] }; // Simulate Quill Delta
            setJsonPreview(delta);
        } catch (error) {
            console.error("Error parsing content:", error);
            setJsonPreview(null);
        }
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim() || !templateContent.trim()) {
            alert("Template name and content are required!");
            return;
        }
    
        try {
            const templateData = {
                name: templateName,
                content: JSON.stringify({
                    ops: [{ insert: templateContent + "\n" }]
                }),
                createdBy: auth.currentUser.uid,
                createdAt: new Date(),
                // Optional: Add a timestamp field that Firestore can use for sorting
                timestamp: new Date().getTime()
            };
    
            if (isEditing && currentTemplateId) {
                const templateRef = doc(dbFs, "templates", currentTemplateId);
                await updateDoc(templateRef, templateData);
                alert("Template updated successfully!");
            } else {
                await addDoc(collection(dbFs, "templates"), templateData);
                alert("Template created successfully!");
            }
    
            resetForm();
        } catch (error) {
            console.error("Error saving template:", error);
            if (error.code === "permission-denied") {
                alert("You don't have permission to perform this operation.");
            } else {
                alert(`Failed to save template: ${error.message}`);
            }
        }
    };
    
    
    
    
    
    

    const handleEditTemplate = (template) => {
        setIsEditing(true);
        setCurrentTemplateId(template.id);
        setTemplateName(template.name);
        
        try {
            // More robust parsing
            const parsedContent = JSON.parse(template.content);
            const content = parsedContent.ops?.[0]?.insert?.trim() || "";
            
            setTemplateContent(content);
            setJsonPreview(parsedContent);
        } catch (error) {
            console.error("Error parsing template content:", error);
            // Fallback to empty state
            setTemplateContent("");
            setJsonPreview(null);
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        console.log("Attempting to delete template:", templateId);
        console.log("Current user:", auth.currentUser);
    
        if (!auth.currentUser) {
            console.warn("No authenticated user");
            alert("You must be logged in to delete templates.");
            return;
        }
    
        try {
            const templateRef = doc(dbFs, "templates", templateId);
            
            console.log("Template reference:", templateRef);
            
            await deleteDoc(templateRef);
            
            console.log("Delete successful");
            
            setTemplates(prevTemplates => 
                prevTemplates.filter(template => template.id !== templateId)
            );
            
            alert("Template deleted successfully!");
        } catch (error) {
            console.error("Detailed deletion error:", {
                code: error.code,
                message: error.message,
                name: error.name,
                stack: error.stack
            });
    
            alert(`Failed to delete template: ${error.message}`);
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h1>Template Manager</h1>
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "gray",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Home
                </button>
            </div>
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
                style={{ width: "100%", height: "150px", padding: "8px", marginBottom: "10px" }}
            />
            <div>
                <button
                    onClick={handleSaveTemplate}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: isEditing ? "blue" : "green",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "10px",
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
            <h3>JSON Preview</h3>
            <pre
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "5px",
                    overflowX: "auto",
                }}
            >
                {jsonPreview ? JSON.stringify(jsonPreview, null, 2) : "Invalid JSON"}
            </pre>
            <h2>Your Templates</h2>
            {templates.map((template) => (
                <div key={template.id} style={{ marginBottom: "10px" }}>
                    <h3>{template.name}</h3>
                    <p>Created: {template.createdAt?.toDate().toLocaleString()}</p>
                    <button onClick={() => handleEditTemplate(template)} style={{ marginRight: "10px" }}>
                        Edit
                    </button>
                    <button onClick={() => handleDeleteTemplate(template.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default TemplateManager;
