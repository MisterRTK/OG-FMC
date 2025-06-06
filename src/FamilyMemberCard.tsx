import React, { useState } from "react";
import EthnicityInput from "./EthnicityInput";

export default function FamilyMemberCard({
  member,
  members,
  onEdit,
  onAdd,
  onLink,
  highlightId,
  setHighlightId,
  onConfirmEdit,
  darkMode,
}) {
  // ...other code...
  const relationBlock = (title, list) => (
    <div className="text-xs mt-1">
      <strong>{title}:</strong>{" "}
      {list.length === 0 ? (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-600">None</span>
      ) : (
        list.map((rel) => (
          <button
            key={rel.id}
            className={`inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-300 mx-0.5 transition
              ${highlightId === rel.id ? "ring-2 ring-blue-400" : ""}`}
            onClick={() => setHighlightId(rel.id)}
            tabIndex={0}
          >
            {rel.name || "Unnamed"}
          </button>
        ))
      )}
    </div>
  );

  return (
    <div
      className={`relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md w-[340px] min-h-[320px]
        ${darkMode ? "text-white" : "text-black"}`
      }
    >
      {/* Add Member button right side */}
      <button
        className="absolute top-1/2 right-[-35px] transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-xs rounded-full shadow"
        onClick={() => onAdd(member)}
        title="Add related member"
      >
        + Add
      </button>

      {/* Main editable fields */}
      <input /* ... */ className="..." />
      {/* ...etc... */}

      {/* Ethnicity input with confirm */}
      <div className="flex items-center w-full mt-2">
        <EthnicityInput
          value={member.ethnicities || []}
          onChange={ethnicities => onEdit({ ...member, ethnicities })}
        />
        <button
          className="ml-2 px-2 py-1 rounded bg-yellow-400 text-black font-bold text-xs flex items-center shadow"
          onClick={onConfirmEdit}
          title="Confirm ethnicity"
        >
          ✔️
        </button>
      </div>

      {/* Clickable relations */}
      {relationBlock("Siblings", member.siblings)}
      {relationBlock("Parents", member.parents)}
      {relationBlock("Grandparents", member.grandparents)}
      {relationBlock("Aunts/Uncles", member.auntsuncles)}
      {relationBlock("Cousins", member.cousins)}
    </div>
  );
}