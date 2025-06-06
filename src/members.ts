export interface Member {
  id: string;
  name: string;
  relation: string;
  image: string;
  location: string;
  phone: string;
  email?: string;
  marriedTo?: string;
  linkedToId?: string;
  linkedAs?: "child" | "parent" | "spouse" | "sibling";
  isAdmin?: boolean;
  passedAway?: boolean; // New field for FMC
  facebookProfile?: string; // For linking to Facebook for data pulling
}

const defaultMembers: Member[] = [
  // You and spouse
  {
    id: "user@example.com",
    name: "You",
    relation: "Self",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    location: "Home",
    phone: "123-456-7890",
    email: "user@example.com",
    isAdmin: true,
    marriedTo: "spouse@example.com",
  },
  {
    id: "spouse@example.com",
    name: "Spouse",
    relation: "Spouse",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    location: "Home",
    phone: "123-456-7891",
    email: "spouse@example.com",
    marriedTo: "user@example.com",
  },
  // Children
  {
    id: "child1@example.com",
    name: "Child 1",
    relation: "Child",
    image: "https://randomuser.me/api/portraits/lego/1.jpg",
    location: "School",
    phone: "555-123-4567",
    email: "child1@example.com",
    linkedToId: "user@example.com",
    linkedAs: "child",
  },
  {
    id: "child2@example.com",
    name: "Child 2",
    relation: "Child",
    image: "https://randomuser.me/api/portraits/lego/2.jpg",
    location: "School",
    phone: "555-987-6543",
    email: "child2@example.com",
    linkedToId: "spouse@example.com",
    linkedAs: "child",
  },
  // Parent
  {
    id: "parent1@example.com",
    name: "Parent 1",
    relation: "Parent",
    image: "https://randomuser.me/api/portraits/men/20.jpg",
    location: "Retirement Home",
    phone: "888-111-2222",
    email: "parent1@example.com",
    linkedToId: "user@example.com",
    linkedAs: "parent",
  },
  // Grandparents
  {
    id: "grandpa1@example.com",
    name: "Grandpa Joe",
    relation: "Grandfather",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    location: "Old Town",
    phone: "111-222-3333",
    email: "grandpa1@example.com",
    linkedToId: "parent1@example.com",
    linkedAs: "parent",
    passedAway: true,
    facebookProfile: "https://facebook.com/grandpajoe"
  },
  {
    id: "grandma1@example.com",
    name: "Grandma Mary",
    relation: "Grandmother",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    location: "Old Town",
    phone: "111-222-3334",
    email: "grandma1@example.com",
    linkedToId: "parent1@example.com",
    linkedAs: "parent",
    facebookProfile: "https://facebook.com/grandmamary"
  },
  // Great-great-grandparents
  {
    id: "greatgreatgrandpa@example.com",
    name: "Great Great Grandpa Tom",
    relation: "Great-Great-Grandfather",
    image: "https://randomuser.me/api/portraits/men/70.jpg",
    location: "Ancient Village",
    phone: "111-222-3344",
    email: "greatgreatgrandpa@example.com",
    linkedToId: "grandpa1@example.com",
    linkedAs: "parent",
    passedAway: true
  },
  {
    id: "greatgreatgrandma@example.com",
    name: "Great Great Grandma Lily",
    relation: "Great-Great-Grandmother",
    image: "https://randomuser.me/api/portraits/women/70.jpg",
    location: "Ancient Village",
    phone: "111-222-3345",
    email: "greatgreatgrandma@example.com",
    linkedToId: "grandpa1@example.com",
    linkedAs: "parent",
    passedAway: true
  },
  // Aunts/Uncles (siblings of parent1)
  {
    id: "aunt1@example.com",
    name: "Aunt Lisa",
    relation: "Aunt",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    location: "City",
    phone: "999-888-7777",
    email: "aunt1@example.com",
    linkedToId: "grandpa1@example.com",
    linkedAs: "child"
  },
  {
    id: "uncle1@example.com",
    name: "Uncle Bob",
    relation: "Uncle",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    location: "Town",
    phone: "999-888-7778",
    email: "uncle1@example.com",
    linkedToId: "grandpa1@example.com",
    linkedAs: "child"
  }
];

export default defaultMembers;