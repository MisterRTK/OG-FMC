import React from 'react';
import { FamilyMember } from '../types';
import { Calendar, User, Users, Info, X, Heart } from 'lucide-react';

interface MemberProfileProps {
  member: FamilyMember;
  members: Record<string, FamilyMember>;
  onClose: () => void;
  onViewMember: (id: string) => void;
}

const MemberProfile: React.FC<MemberProfileProps> = ({
  member,
  members,
  onClose,
  onViewMember,
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

  const partner = member.partnerId ? members[member.partnerId] : null;
  const parents = member.parentIds.map(id => members[id]).filter(Boolean);
  const children = member.childrenIds.map(id => members[id]).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between bg-teal-700 text-white p-4">
          <h2 className="text-xl font-semibold">Family Member Profile</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-teal-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Image/Avatar */}
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              {member.imageUrl ? (
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 mb-3"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <User className="w-20 h-20 text-gray-400" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-center">{member.name}</h1>
              
              {/* Gender and Birth Info */}
              <div className="mt-2 text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {formatDate(member.birthDate)}
                  {member.deathDate && ` - ${formatDate(member.deathDate)}`}
                </span>
              </div>
            </div>
            
            {/* Details */}
            <div className="md:w-2/3 md:pl-6">
              {/* Bio */}
              {member.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-teal-600" />
                    Biography
                  </h3>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              )}
              
              {/* Relationships */}
              <div className="space-y-4">
                {/* Partner */}
                {partner && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-500" />
                      Partner
                    </h3>
                    <div 
                      className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => onViewMember(partner.id)}
                    >
                      {partner.imageUrl ? (
                        <img 
                          src={partner.imageUrl} 
                          alt={partner.name} 
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400 mr-3" />
                      )}
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(partner.birthDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Parents */}
                {parents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-500" />
                      Parents
                    </h3>
                    <div className="space-y-2">
                      {parents.map(parent => (
                        <div 
                          key={parent.id}
                          className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => onViewMember(parent.id)}
                        >
                          {parent.imageUrl ? (
                            <img 
                              src={parent.imageUrl} 
                              alt={parent.name} 
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-400 mr-3" />
                          )}
                          <div>
                            <div className="font-medium">{parent.name}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(parent.birthDate)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Children */}
                {children.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-500" />
                      Children
                    </h3>
                    <div className="space-y-2">
                      {children.map(child => (
                        <div 
                          key={child.id}
                          className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => onViewMember(child.id)}
                        >
                          {child.imageUrl ? (
                            <img 
                              src={child.imageUrl} 
                              alt={child.name} 
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-400 mr-3" />
                          )}
                          <div>
                            <div className="font-medium">{child.name}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(child.birthDate)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;