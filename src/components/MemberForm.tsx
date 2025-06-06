import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types';
import { X, Save, UserCircle } from 'lucide-react';

interface MemberFormProps {
  member?: FamilyMember;
  onSave: (member: Partial<FamilyMember>) => void;
  onCancel: () => void;
  title: string;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  member, 
  onSave, 
  onCancel,
  title
}) => {
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: '',
    gender: 'other',
    birthDate: '',
    deathDate: '',
    bio: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        gender: member.gender,
        birthDate: member.birthDate || '',
        deathDate: member.deathDate || '',
        bio: member.bio || '',
        imageUrl: member.imageUrl || '',
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between bg-teal-700 text-white p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onCancel}
            className="text-white hover:text-teal-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            {formData.imageUrl ? (
              <img 
                src={formData.imageUrl} 
                alt={formData.name || 'Family member'} 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-2"
              />
            ) : (
              <UserCircle className="w-32 h-32 text-gray-300 mb-2" />
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Death Date
                </label>
                <input
                  type="date"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;