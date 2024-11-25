import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fsDb, auth } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TextEditor = () => {
  // State to handle the changes in text editor
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  // Function to save document to Firestore
  const saveDocument = async () => {
    // Check if content is not empty
    if (!content.trim() || !title.trim()) {
      alert('Please enter both a title and content');
      return;
    }

    try {
      // Add a new document to the 'documents' collection
      const docRef = await addDoc(collection(fsDb, 'documents'), {
        title: title,
        content: content,
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid || 'anonymous', // Add user ID if authenticated
      });

      // Clear the editor after saving
      setContent('');
      setTitle('');

      alert('Document saved successfully!');
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to save document');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-center items-center h-[10rem]">
        <h1 className="text-6xl font-extrabold">Quill.Js Text Editor</h1>
      </div>
      
      {/* Title Input */}
      <input 
        type="text"
        placeholder="Enter document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <ReactQuill
        theme='snow'
        formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video']}
        placeholder="Write something amazing..."
        modules={modules}
        onChange={setContent}
        value={content}
      />

      {/* Save Button */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={saveDocument}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Document
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold flex justify-center mt-8">Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
};

export default TextEditor;