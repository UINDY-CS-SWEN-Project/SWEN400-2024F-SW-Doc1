import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { dbFs } from "../firebase/firebase";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { useSearchParams, useNavigate } from "react-router-dom";


const TextEditor = () => {
    const [content, setContent] = useState("");
    const [docName, setDocName] = useState("Untitled Document");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNewDocument, setIsNewDocument] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const documentId = searchParams.get("id");


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
        clipboard: { matchVisual: false },
        history: { delay: 2000, maxStack: 500, userOnly: true },
    };


    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "script",
        "blockquote",
        "code-block",
        "list",
        "bullet",
        "indent",
        "direction",
        "align",
        "link",
        "image",
        "video",
        "formula",
        "clean",
        "line-height",
        "letter-spacing",
        "margin",
        "padding",
    ];


    useEffect(() => {
        const fetchDocument = async () => {
            if (!documentId) {
                setIsNewDocument(true);
                setLoading(false);
                return;
            }


            setLoading(true);
            try {
                const docRef = doc(dbFs, "documents", documentId);
                const docSnap = await getDoc(docRef);


                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDocName(data.name || "Untitled Document");
                    setContent(data.content || "");
                } else {
                    console.error("Document not found.");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };


        fetchDocument();
    }, [documentId]);


    const saveDocument = async () => {
        setSaving(true);


        try {
            if (isNewDocument) {
                await addDoc(collection(dbFs, "documents"), {
                    name: docName,
                    content,
                    createdAt: new Date(),
                });
                alert("Document created successfully!");
            } else {
                const docRef = doc(dbFs, "documents", documentId);
                await updateDoc(docRef, {
                    name: docName,
                    content,
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
                <input
                    type="text"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Document Name"
                    className="text-xl font-normal text-gray-700 outline-none w-3/4 border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-4">
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
