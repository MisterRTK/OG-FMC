export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  bio?: string;
  imageUrl?: string;
  parentIds: string[];
  childrenIds: string[];
  partnerId?: string;
}

export interface FamilyTree {
  members: Record<string, FamilyMember>;
  rootMemberId?: string;
}