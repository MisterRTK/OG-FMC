import { FamilyMember, FamilyTree } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Local storage key for saving the family tree
const STORAGE_KEY = 'family-tree-data';

// Save family tree to local storage
export const saveFamilyTree = (tree: FamilyTree): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
};

// Load family tree from local storage
export const loadFamilyTree = (): FamilyTree | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data) as FamilyTree;
  }
  return null;
};

// Create a new family member
export const createFamilyMember = (
  partialMember: Partial<FamilyMember>
): FamilyMember => {
  return {
    id: uuidv4(),
    name: '',
    gender: 'other',
    parentIds: [],
    childrenIds: [],
    ...partialMember,
  };
};

// Add a child to a parent
export const addChild = (
  tree: FamilyTree,
  parentId: string,
  childData: Partial<FamilyMember>
): FamilyTree => {
  const newTree = { ...tree };
  const parent = newTree.members[parentId];
  
  if (!parent) return tree;
  
  const child = createFamilyMember({
    ...childData,
    parentIds: [...(childData.parentIds || []), parentId],
  });
  
  // Update parent's children list
  parent.childrenIds = [...parent.childrenIds, child.id];
  
  // Add new child to members
  newTree.members = {
    ...newTree.members,
    [child.id]: child,
    [parentId]: parent,
  };
  
  return newTree;
};

// Add a parent to a child
export const addParent = (
  tree: FamilyTree,
  childId: string,
  parentData: Partial<FamilyMember>
): FamilyTree => {
  const newTree = { ...tree };
  const child = newTree.members[childId];
  
  if (!child) return tree;
  
  const parent = createFamilyMember({
    ...parentData,
    childrenIds: [...(parentData.childrenIds || []), childId],
  });
  
  // Update child's parent list
  child.parentIds = [...child.parentIds, parent.id];
  
  // Add new parent to members
  newTree.members = {
    ...newTree.members,
    [parent.id]: parent,
    [childId]: child,
  };
  
  return newTree;
};

// Add a partner connection
export const addPartner = (
  tree: FamilyTree,
  personId: string,
  partnerData: Partial<FamilyMember>
): FamilyTree => {
  const newTree = { ...tree };
  const person = newTree.members[personId];
  
  if (!person) return tree;
  
  const partner = createFamilyMember({
    ...partnerData,
  });
  
  // Update partner connections
  person.partnerId = partner.id;
  partner.partnerId = person.id;
  
  // Add new partner to members
  newTree.members = {
    ...newTree.members,
    [partner.id]: partner,
    [personId]: person,
  };
  
  return newTree;
};

// Remove a family member and clean up references
export const removeFamilyMember = (
  tree: FamilyTree,
  memberId: string
): FamilyTree => {
  const newTree = { ...tree };
  const memberToRemove = newTree.members[memberId];
  
  if (!memberToRemove) return tree;
  
  // Remove from parents' childrenIds
  memberToRemove.parentIds.forEach(parentId => {
    const parent = newTree.members[parentId];
    if (parent) {
      parent.childrenIds = parent.childrenIds.filter(id => id !== memberId);
      newTree.members[parentId] = parent;
    }
  });
  
  // Remove from children's parentIds
  memberToRemove.childrenIds.forEach(childId => {
    const child = newTree.members[childId];
    if (child) {
      child.parentIds = child.parentIds.filter(id => id !== memberId);
      newTree.members[childId] = child;
    }
  });
  
  // Remove partner connection
  if (memberToRemove.partnerId) {
    const partner = newTree.members[memberToRemove.partnerId];
    if (partner) {
      partner.partnerId = undefined;
      newTree.members[partner.id] = partner;
    }
  }
  
  // Remove the member
  const { [memberId]: _, ...remainingMembers } = newTree.members;
  newTree.members = remainingMembers;
  
  // If this was the root member, unset the root
  if (newTree.rootMemberId === memberId) {
    newTree.rootMemberId = undefined;
  }
  
  return newTree;
};

// Get sample data for initial display
export const getSampleFamilyTree = (): FamilyTree => {
  const grandpaId = uuidv4();
  const grandmaId = uuidv4();
  const fatherId = uuidv4();
  const motherId = uuidv4();
  const childId = uuidv4();
  const auntId = uuidv4();
  const uncleId = uuidv4();
  const cousinId = uuidv4();

  return {
    rootMemberId: grandpaId,
    members: {
      [grandpaId]: {
        id: grandpaId,
        name: 'Grandfather',
        gender: 'male',
        birthDate: '1940-05-10',
        bio: 'Family patriarch',
        parentIds: [],
        childrenIds: [fatherId, auntId],
        partnerId: grandmaId,
        imageUrl: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [grandmaId]: {
        id: grandmaId,
        name: 'Grandmother',
        gender: 'female',
        birthDate: '1942-02-15',
        bio: 'Family matriarch',
        parentIds: [],
        childrenIds: [fatherId, auntId],
        partnerId: grandpaId,
        imageUrl: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [fatherId]: {
        id: fatherId,
        name: 'Father',
        gender: 'male',
        birthDate: '1965-08-20',
        bio: 'Loving father',
        parentIds: [grandpaId, grandmaId],
        childrenIds: [childId],
        partnerId: motherId,
        imageUrl: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [motherId]: {
        id: motherId,
        name: 'Mother',
        gender: 'female',
        birthDate: '1968-11-12',
        bio: 'Caring mother',
        parentIds: [],
        childrenIds: [childId],
        partnerId: fatherId,
        imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [childId]: {
        id: childId,
        name: 'Child',
        gender: 'other',
        birthDate: '1995-03-05',
        bio: 'The youngest generation',
        parentIds: [fatherId, motherId],
        childrenIds: [],
        imageUrl: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [auntId]: {
        id: auntId,
        name: 'Aunt',
        gender: 'female',
        birthDate: '1967-12-01',
        bio: 'Your favorite aunt',
        parentIds: [grandpaId, grandmaId],
        childrenIds: [cousinId],
        partnerId: uncleId,
        imageUrl: 'https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [uncleId]: {
        id: uncleId,
        name: 'Uncle',
        gender: 'male',
        birthDate: '1966-04-22',
        bio: 'Funny uncle',
        parentIds: [],
        childrenIds: [cousinId],
        partnerId: auntId,
        imageUrl: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      [cousinId]: {
        id: cousinId,
        name: 'Cousin',
        gender: 'other',
        birthDate: '1990-07-17',
        bio: 'Your cousin',
        parentIds: [auntId, uncleId],
        childrenIds: [],
        imageUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    }
  };
};