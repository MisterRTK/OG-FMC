import React from 'react';
import { ZoomIn, ZoomOut, RefreshCw, UserPlus, Save, Upload, Download, Search, List, Trees as Tree } from 'lucide-react';

interface FamilyTreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onAddRootMember: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onToggleView: () => void;
  isTreeView: boolean;
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FamilyTreeControls: React.FC<FamilyTreeControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onAddRootMember,
  onSave,
  onExport,
  onImport,
  onToggleView,
  isTreeView,
  onSearch,
  searchQuery,
  setSearchQuery,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left side controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={onZoomIn}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={onZoomOut}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={onReset}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Reset View"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="h-6 border-r border-gray-300 mx-1"></div>
          <button 
            onClick={onToggleView}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title={isTreeView ? "Switch to List View" : "Switch to Tree View"}
          >
            {isTreeView ? (
              <List className="w-5 h-5" />
            ) : (
              <Tree className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Center search */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search family members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </form>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={onAddRootMember}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Add Family Member"
          >
            <UserPlus className="w-5 h-5" />
          </button>
          <button 
            onClick={onSave}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Save Tree"
          >
            <Save className="w-5 h-5" />
          </button>
          <button 
            onClick={onExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Export Tree"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={onImport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Import Tree"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeControls;