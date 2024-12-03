import { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { dbFs, auth } from "../firebase/firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  addDoc 
} from "firebase/firestore";
import { useSearchParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const TextEditor = () => {
    const [content, setContent] = useState("");
    const [docName, setDocName] = useState("Untitled Document");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNewDocument, setIsNewDocument] = useState(false);
    const [quillInstance, setQuillInstance] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const documentId = searchParams.get("id");

    // New state for templates
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Quill editor configuration
    const modules = {
        toolbar: {
            container: [
                [{ font: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ size: ["small", false, "large", "huge"] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ script: "super" }, { script: "sub" }],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
                [{ align: [] }],
                ["link", "image", "video", "formula"],
                ["clean"],
                [{ "line-height": ["1.0", "1.2", "1.5", "1.8", "2.0", "2.5", "3.0"] }],
                [
                    { "letter-spacing": ["-0.5px", "normal", "0.5px", "1px", "1.5px", "2px", "2.5px"] },
                ],
                [{ margin: ["1px", "2px", "3px", "4px", "5px", "6px"] }],
                [{ padding: ["1px", "2px", "3px", "4px", "5px", "6px"] }],
            ],
        },
        cursors: true,
        clipboard: { matchVisual: false },
        history: { delay: 2000, maxStack: 500, userOnly: true },
    };

    const formats = [
        "header", "font", "size", "bold", "italic", "underline", "strike",
        "color", "background", "script", "blockquote", "code-block",
        "list", "bullet", "indent", "direction", "align", "link",
        "image", "video", "formula", "clean", "line-height",
        "letter-spacing", "margin", "padding"
    ];

    // Improved template application logic
    const applyTemplate = (template) => {
        if (!template) {
            alert("No template selected.");
            return;
        }
    
        try {
            const parsedContent = typeof template.content === "string"
                ? JSON.parse(template.content)
                : template.content;
    
            if (!parsedContent || !Array.isArray(parsedContent.ops)) {
                throw new Error("Template is not a valid Quill Delta format.");
            }
    
            quillInstance.setContents(parsedContent);
            setSelectedTemplate(template);
            setDocName(`Template: ${template.name || "Unnamed Template"}`);
        } catch (error) {
            alert("Failed to apply template. Ensure the content is a valid Quill Delta.");
        }
    };
    

    // Fetch document and set up real-time listeners
    useEffect(() => {
        // Ensure user is authenticated
        if (!auth.currentUser) {
            navigate('/login');
            return;
        }

        // Modify the template fetching logic to handle parsing
        const fetchTemplates = async () => {
            try {
                const templatesRef = collection(dbFs, "templates");
                const q = query(templatesRef, where("createdBy", "==", auth.currentUser.uid));
                
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedTemplates = snapshot.docs.map(doc => {
                        const data = doc.data();
                        // Ensure content is parseable
                        try {
                            // Attempt to parse content if it's a string
                            if (typeof data.content === 'string') {
                                const parsedContent = JSON.parse(data.content);
                                return {
                                    id: doc.id,
                                    ...data,
                                    content: parsedContent
                                };
                            }
                            return {
                                id: doc.id,
                                ...data
                            };
                        } catch (error) {
                            console.error(`Error parsing template ${doc.id}:`, error);
                            return null;
                        }
                    }).filter(template => template !== null); // Remove any templates that failed to parse

                    setTemplates(fetchedTemplates);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching templates:", error);
            }
        };

        fetchTemplates();

        // Document fetching logic
        if (!documentId) {
            setIsNewDocument(true);
            setLoading(false);
            return;
        }

        const fetchDocument = async () => {
            setLoading(true);
            try {
                const docRef = doc(dbFs, "documents", documentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Check if the document belongs to the current user
                    if (data.createdBy !== auth.currentUser.uid) {
                        alert("You do not have permission to view this document.");
                        navigate('/home');
                        return;
                    }

                    setDocName(data.name || "Untitled Document");
                    
                    // Set initial content
                    if (data.content) {
                        const initialContent = JSON.parse(data.content);
                        setContent(initialContent);
                    }
                    
                    // Set template if exists
                    if (data.templateId) {
                        const templatesRef = collection(dbFs, "templates");
                        const q = query(templatesRef, where("createdBy", "==", auth.currentUser.uid));
                        
                        const unsubscribe = onSnapshot(q, (snapshot) => {
                            const fetchedTemplates = snapshot.docs.map((doc) => {
                                const data = doc.data();
                                try {
                                    const content = typeof data.content === "string"
                                        ? JSON.parse(data.content)
                                        : data.content;
                                    return { id: doc.id, ...data, content };
                                } catch (error) {
                                    console.error(`Invalid template content: ${doc.id}`, error);
                                    return null;
                                }
                            }).filter((template) => template !== null);
                    
                            setTemplates(fetchedTemplates);
                        });
                    
                        return unsubscribe; // Return unsubscribe to clean up the listener later, if necessary
                    }
                    
                    
                    // Real-time document updates
                    const unsubscribe = onSnapshot(docRef, (snapshot) => {
                        const updatedData = snapshot.data();
                        if (updatedData && quillInstance && updatedData.content) {
                            const parsedContent = JSON.parse(updatedData.content);
                            quillInstance.setContents(parsedContent);
                        }
                    });

                    return () => unsubscribe();
                } else {
                    console.error("Document not found.");
                    navigate('/home');
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId, quillInstance, navigate]);

    // Quill editor initialization
    const quillRef = useCallback((wrapper) => {
        if (!wrapper) return;
        const editor = wrapper.getEditor();
        setQuillInstance(editor);
    }, []);

    // Save document
    const saveDocument = async () => {
        setSaving(true);

        try {
            // Stringify the Quill content to store in Firestore
            const contentToSave = JSON.stringify(
                quillInstance ? quillInstance.getContents() : content
            );

            if (isNewDocument) {
                const newDocRef = await addDoc(collection(dbFs, "documents"), {
                    name: docName,
                    content: contentToSave,
                    createdBy: auth.currentUser.uid,
                    createdAt: new Date(),
                    templateId: selectedTemplate ? selectedTemplate.id : null,
                });
                alert("Document created successfully!");
                navigate(`/edit?id=${newDocRef.id}`);
            } else {
                const docRef = doc(dbFs, "documents", documentId);
                
                // Verify document ownership before updating
                const docSnap = await getDoc(docRef);
                if (docSnap.data().createdBy !== auth.currentUser.uid) {
                    alert("You do not have permission to edit this document.");
                    return;
                }

                await updateDoc(docRef, {
                    name: docName,
                    content: contentToSave,
                    templateId: selectedTemplate ? selectedTemplate.id : null,
                });
                alert("Document updated successfully!");
            }
        } catch (error) {
            console.error("Error saving document:", error.message);
            alert("Failed to save document. Try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="Document Name"
                        className="text-xl font-normal text-gray-700 outline-none w-3/4 border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    {/* Template Dropdown */}
                    <select
                        value={selectedTemplate?.id || ''}
                        onChange={(e) => {
                            const template = templates.find(t => t.id === e.target.value);
                            applyTemplate(template);
                        }}
                        className="ml-4 px-2 py-1 border border-gray-300 rounded-md"
                    >
                        <option value="">Select a Template</option>
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name || 'Unnamed Template'}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate("/templates")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                    >
                        Manage Templates
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                    >
                        Home
                    </button>
                    <button
                        onClick={saveDocument}
                        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${
                            saving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            <div className="flex-grow flex justify-center items-center">
                <div className="bg-white shadow-md border border-gray-300 rounded-md w-[816px] p-8">
                    {loading ? (
                        <p className="p-6 text-center">Loading document...</p>
                    ) : (
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={content}
                            onChange={setContent}
                            placeholder="Type your document here..."
                            className="min-h-[800px]"
                        />
                    )}
                </div>
            </div>

            <style jsx global>{`
                .ql-container {
                    font-family: 'Arial', sans-serif;
                    font-size: 11pt;
                    letter-spacing: normal;
                    line-height: 1.5;
                }
               
                .ql-editor {
                    padding: 40px;
                    background: white;
                    min-height: 800px;
                    box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1);
                }

                .ql-toolbar.ql-snow {
                    border: none;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 8px;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: white;
                }
            `}</style>
        </div>
    );
};

export default TextEditor;