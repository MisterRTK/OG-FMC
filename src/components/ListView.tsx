import React from 'react';
import { FamilyMember } from '../types';
import { User, Calendar, Heart, Users, Edit, Trash2, Eye } from 'lucide-react';

interface ListViewProps {
  members: Record<string, FamilyMember>;
  onSelectMember: (id: string) => void;
  onEditMember: (id: string) => void;
  onDeleteMember: (id: string) => void;
  onViewMember: (id: string) => void;
  searchQuery: string;
}

const ListView: React.FC<ListViewProps> = ({
  members,
  onSelectMember,
  onEditMember,
  onDeleteMember,
  onViewMember,
  searchQuery,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filter members based on search query
  const filteredMembers = Object.values(members).filter(member => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      (member.bio && member.bio.toLowerCase().includes(query))
    );
  });

  // Sort members by name
  const sortedMembers = [...filteredMembers].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Birth/Death
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Relationships
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bio
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedMembers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                {searchQuery ? 'No members match your search' : 'No family members found'}
              </td>
            </tr>
          ) : (
            sortedMembers.map(member => (
              <tr 
                key={member.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectMember(member.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {member.imageUrl ? (
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={member.imageUrl} 
                          alt={member.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.gender === 'male' ? 'Male' : member.gender === 'female' ? 'Female' : 'Other'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span>
                      {formatDate(member.birthDate)}
                      {member.deathDate && ` - ${formatDate(member.deathDate)}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {member.partnerId && (
                      <div className="flex items-center mb-1">
                        <Heart className="h-4 w-4 mr-1 text-pink-500" />
                        <span>Partner</span>
                      </div>
                    )}
                    {member.parentIds.length > 0 && (
                      <div className="flex items-center mb-1">
                        <Users className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{member.parentIds.length} parent(s)</span>
                      </div>
                    )}
                    {member.childrenIds.length > 0 && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-green-500" />
                        <span>{member.childrenIds.length} child(ren)</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {member.bio || 'No biography available'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewMember(member.id); }}
                      className="text-teal-600 hover:text-teal-900"
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditMember(member.id); }}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteMember(member.id); }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;