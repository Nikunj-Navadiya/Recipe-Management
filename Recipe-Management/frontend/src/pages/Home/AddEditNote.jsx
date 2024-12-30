import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import TagInput from "../../componets/input/Taginput";

const AddEditNote = ({ noteData, type, getallNote, onClose, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [imgUrl, setImgUrl] = useState(noteData?.imgUrl || "");
    const [price, setPrice] = useState(noteData?.price || "");
    const [error, setError] = useState(null);

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
                imgUrl,
                price,
            });
            if (response.data && response.data.note) {
                showToastMessage("Note Added Successfully");
                getallNote();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    // Edit Note
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags,
                imgUrl,
                price,
            });
            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully");
                getallNote();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddNote = () => {
        if (!title) {
            setError("Please Enter the Title");
            return;
        }
        if (!content) {
            setError("Please Enter the Content");
            return;
        }
        if (price && isNaN(price)) {
            setError("Price must be a number");
            return;
        }
        setError("");

        if (type === "edit") {
            editNote();
        } else {
            addNewNote();
        }
    };

    return (
        <div className="relative">
            <button
                className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-6 -right-4 hover:bg-slate-500"
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" />
            </button>

            <div className="flex flex-col gap-1 mt-2">
                <label className="input-lable text-black text-base">Title</label>
                <input
                    type="text"
                    className="text-sm border p-2 rounded-md text-slate-950 outline-none"
                    placeholder="Your Title...!"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <label className="input-lable text-black text-base">Content</label>
                <textarea
                    type="text"
                    className="text-sm text-slte-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={1}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                ></textarea>
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <label className="input-lable text-black text-base">Image URL</label>
                <input
                    type="text"
                    className="text-sm border p-2 rounded-md text-slate-950 outline-none"
                    placeholder="Image URL..."
                    value={imgUrl}
                    onChange={({ target }) => setImgUrl(target.value)}
                />
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <label className="input-lable text-black text-base">Price</label>
                <input
                    type="text"
                    className="text-sm border p-2 rounded-md text-slate-950 outline-none"
                    placeholder="Price..."
                    value={price}
                    onChange={({ target }) => setPrice(target.value)}
                />
            </div>

            <div className="mt-2">
                <label className="input-label text-basex">Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button
                className="btn-primary font-medium mt-5 p-3"
                onClick={handleAddNote}
            >
                {type === "edit" ? "UPDATE" : "ADD"}
            </button>
        </div>
    );
};

export default AddEditNote;
