import React, { useState, useRef, useEffect } from 'react';
import { FamilyMember } from '../types';
import FamilyMemberCard from './FamilyMemberCard';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface FamilyTreeProps {
  members: Record<string, FamilyMember>;
  rootMemberId?: string;
  onSelectMember: (id: string) => void;
  selectedMemberId?: string;
  onEditMember: (id: string) => void;
  onDeleteMember: (id: string) => void;
  onAddChild: (id: string) => void;
  onAddParent: (id: string) => void;
  onAddPartner: (id: string) => void;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({
  members,
  rootMemberId,
  onSelectMember,
  selectedMemberId,
  onEditMember,
  onDeleteMember,
  onAddChild,
  onAddParent,
  onAddPartner,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  const treeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize all nodes as expanded
    const expanded: Record<string, boolean> = {};
    Object.keys(members).forEach(id => {
      expanded[id] = true;
    });
    setExpandedNodes(expanded);
  }, [members]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale(prevScale => Math.max(0.5, Math.min(2, prevScale + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startDragPos.x;
    const dy = e.clientY - startDragPos.y;
    setPosition(prevPos => ({ x: prevPos.x + dx, y: prevPos.y + dy }));
    setStartDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Recursive function to render a branch of the family tree
  const renderFamilyBranch = (memberId: string, level = 0, isChild = false) => {
    const member = members[memberId];
    if (!member) return null;

    const isExpanded = expandedNodes[memberId];
    
    // Check if member has a partner
    const partner = member.partnerId ? members[member.partnerId] : null;
    
    return (
      <div key={memberId} className="relative">
        <div className="flex flex-col items-center">
          {/* Member card */}
          <div className="flex items-center mb-4">
            {/* Connection line to parent */}
            {level > 0 && isChild && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-400 -mt-8"></div>
            )}
            
            {/* Member and partner (if exists) */}
            <div className="flex items-center space-x-4">
              <FamilyMemberCard
                member={member}
                isSelected={selectedMemberId === member.id}
                onSelect={onSelectMember}
                onEdit={onEditMember}
                onDelete={onDeleteMember}
                onAddChild={onAddChild}
                onAddParent={onAddParent}
                onAddPartner={onAddPartner}
              />
              
              {partner && (
                <>
                  <div className="w-8 h-px bg-gray-400"></div>
                  <FamilyMemberCard
                    member={partner}
                    isSelected={selectedMemberId === partner.id}
                    onSelect={onSelectMember}
                    onEdit={onEditMember}
                    onDelete={onDeleteMember}
                    onAddChild={onAddChild}
                    onAddParent={onAddParent}
                    onAddPartner={onAddPartner}
                  />
                </>
              )}
            </div>
            
            {/* Expand/collapse button for nodes with children */}
            {member.childrenIds.length > 0 && (
              <button 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-sm"
                onClick={() => handleToggleExpand(member.id)}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ArrowUpRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>
          
          {/* Children */}
          {isExpanded && member.childrenIds.length > 0 && (
            <div className="relative mt-4">
              {/* Vertical line connecting to children */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-400"></div>
              
              {/* Horizontal line spanning all children */}
              {member.childrenIds.length > 1 && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full h-px bg-gray-400"></div>
              )}
              
              <div className="flex flex-wrap justify-center pt-8 space-x-6">
                {member.childrenIds.map(childId => (
                  renderFamilyBranch(childId, level + 1, true)
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="w-full h-full overflow-hidden bg-gray-50 rounded-lg"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={treeContainerRef}
        className="w-full h-full relative"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center',
          transition: dragging ? 'none' : 'transform 0.3s ease',
          cursor: dragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10">
          {rootMemberId ? (
            renderFamilyBranch(rootMemberId)
          ) : (
            <div className="text-center text-gray-500">
              No family members yet. Add your first member to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;