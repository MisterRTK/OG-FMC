import React from "react";
import { UiFeatures } from "./uiFeatures";

interface FeatureMenuProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  relationFilter: string;
  setRelationFilter: (val: string) => void;
  relationOptions: string[];
  relationToRoot: string;
  setRelationToRoot: (val: string) => void;
  personOnly: boolean;
  setPersonOnly: (val: boolean) => void;
  uiFeatures: UiFeatures;
  setUiFeatures: (fn: (prev: UiFeatures) => UiFeatures) => void;
  onClear: () => void;
  onClose: () => void;
}

const FeatureMenu: React.FC<FeatureMenuProps> = ({
  searchTerm,
  setSearchTerm,
  relationFilter,
  setRelationFilter,
  relationOptions,
  relationToRoot,
  setRelationToRoot,
  personOnly,
  setPersonOnly,
  uiFeatures,
  setUiFeatures,
  onClear,
  onClose,
}) => (
  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border rounded shadow-lg p-4 z-50">
    {/* Close ("X") Button */}
    <button
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
      onClick={onClose}
      aria-label="Close menu"
      tabIndex={0}
    >
      &times;
    </button>

    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search members..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-2 py-1 mb-2 border rounded text-black"
    />

    {/* Relation Filter Dropdown */}
    <select
      value={relationFilter}
      onChange={(e) => setRelationFilter(e.target.value)}
      className="w-full px-2 py-1 mb-2 border rounded text-black"
    >
      <option value="">All Relations</option>
      {relationOptions.map((relation) => (
        <option key={relation} value={relation}>
          {relation}
        </option>
      ))}
    </select>

    {/* Relation to Root Dropdown */}
    <select
      value={relationToRoot}
      onChange={(e) => setRelationToRoot(e.target.value)}
      className="w-full px-2 py-1 mb-2 border rounded text-black"
    >
      <option value="">Any Relation to Root</option>
      <option value="child">Direct Child</option>
      <option value="parent">Direct Parent</option>
      <option value="spouse">Spouse</option>
      <option value="sibling">Sibling</option>
    </select>

    {/* Only Real People Checkbox */}
    <label className="flex items-center gap-2 mb-2 text-xs">
      <input
        type="checkbox"
        checked={personOnly}
        onChange={() => setPersonOnly(!personOnly)}
      />
      Only real people
    </label>

    <hr className="my-2" />

    {/* UI Features Section */}
    <div className="font-semibold text-sm mb-1">UI Features</div>
    <label className="flex items-center gap-2 mb-1 text-xs">
      <input
        type="checkbox"
        checked={uiFeatures.showAnimations}
        onChange={() =>
          setUiFeatures((f) => ({ ...f, showAnimations: !f.showAnimations }))
        }
      />
      Show Animations
    </label>
    <label className="flex items-center gap-2 mb-2 text-xs">
      <input
        type="checkbox"
        checked={uiFeatures.highlightOnSelect}
        onChange={() =>
          setUiFeatures((f) => ({
            ...f,
            highlightOnSelect: !f.highlightOnSelect,
          }))
        }
      />
      Highlight on Select
    </label>

    {/* Clear All Button */}
    <button
      onClick={onClear}
      className="mt-2 w-full bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs"
    >
      Clear all
    </button>
  </div>
);

export default FeatureMenu;