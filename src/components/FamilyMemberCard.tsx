import React from 'react';
import { FamilyMember } from '../types';
import { UserCircle, Calendar, Info, Edit, Trash2, Users } from 'lucide-react';

interface FamilyMemberCardProps {
  member: FamilyMember;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (id: string) => void;
  onAddParent: (id: string) => void;
  onAddPartner: (id: string) => void;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onAddChild,
  onAddParent,
  onAddPartner,
}) => {
  const cardClasses = `
    relative flex flex-col w-48 p-3 rounded-lg shadow-md transition-all duration-300
    ${isSelected 
      ? 'bg-teal-100 border-2 border-teal-700 shadow-lg scale-105' 
      : 'bg-white hover:shadow-lg hover:scale-102'}
    ${member.gender === 'male' ? 'bg-blue-50' : member.gender === 'female' ? 'bg-pink-50' : ''}
  `;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(member.id);
  };

  return (
    <div 
      className={cardClasses} 
      onClick={handleCardClick}
      data-id={member.id}
    >
      {/* Image or Icon */}
      <div className="flex justify-center mb-2">
        {member.imageUrl ? (
          <img 
            src={member.imageUrl} 
            alt={member.name} 
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <UserCircle className="w-20 h-20 text-gray-400" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-center font-semibold text-gray-800 mb-1 truncate">
        {member.name || 'Unnamed'}
      </h3>

      {/* Basic Info */}
      <div className="text-xs text-gray-600 flex items-center justify-center mb-1">
        <Calendar className="w-3 h-3 mr-1" />
        <span>{member.birthDate ? new Date(member.birthDate).getFullYear() : 'Unknown'}</span>
        {member.deathDate && (
          <>
            <span className="mx-1">-</span>
            <span>{new Date(member.deathDate).getFullYear()}</span>
          </>
        )}
      </div>

      {/* Relationship Info */}
      <div className="text-xs text-gray-600 mb-2 flex items-center justify-center">
        <Users className="w-3 h-3 mr-1" />
        <span>
          {member.childrenIds.length > 0 
            ? `${member.childrenIds.length} ${member.childrenIds.length === 1 ? 'child' : 'children'}` 
            : 'No children'}
        </span>
      </div>

      {/* Actions - only show when selected */}
      {isSelected && (
        <div className="flex justify-center space-x-2 mt-1 pt-2 border-t border-gray-200">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(member.id); }}
            className="p-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddChild(member.id); }}
            className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            title="Add child"
          >
            <Users className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddParent(member.id); }}
            className="p-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            title="Add parent"
          >
            <Users className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(member.id); }}
            className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyMemberCard;