import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  imgUrl,
  price,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">

      </div>

      {/* Display imgUrl if provided */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt="Note Thumbnail"
          className="w-full h-52  rounded mt-1"
        />
      )}

      <h6 className="text-xl font-medium mt-1">{title}</h6>

      <p className="text-md text-slate-600 mt-1">{content?.slice(0, 60)}</p>

      {/* Display tags */}
      <div className=" flex flex-wrap gap-2 mt-1">
        {tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-500 text-xs px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
      </div>

      {/* Display price */}
      {price !== undefined && (
        <div className=" text-sm font-medium text-green-500 mt-1">
          Price: ${price.toFixed(2)}
        </div>
      )}

      <span className="text-xs text-slate-500 mt-1">{date}</span>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500"></div>

        <div className="flex items-center gap-4">
          <MdOutlinePushPin
            className={`icon-btn ${isPinned ? "text-primary" : "text-slate-400"}`}
            onClick={onPinNote}
          />

          <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />

          <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />

        </div>
      </div>
    </div>
  );
};

export default NoteCard;
