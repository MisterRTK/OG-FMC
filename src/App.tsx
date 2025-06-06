import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import EthnicityInput from "./EthnicityInput";
import Connector from "./Connector";
import QRCode from "./QrCode";
import FeatureMenu from "./FeatureMenu";
import InviteMemberPopup from "./InviteMemberPopup";
import FamilyMemberCard from "./FamilyMemberCard";
import "./index.css";


export interface Member {
  id: string;
  name: string;
  relation: string;
  image: string;
  location: string;
  phone?: string;
  marriedTo?: string;
  linkedToId?: string;
  linkedAs?: "child" | "parent" | "sibling";
  isAdmin?: boolean;
  ethnicities?: string[];
  deceased?: boolean;
}

const defaultMembers: Member[] = [
  {
    id: "user@example.com",
    name: "You",
    relation: "Self",
    image: "https://randomuser.me/api/portraits/lego/1.jpg",
    location: "Home",
    phone: "555-1234",
    isAdmin: true,
    ethnicities: ["Indian (Kerala)", "American"],
  },
  {
    id: "spouse@example.com",
    name: "Alex",
    relation: "Spouse",
    image: "https://randomuser.me/api/portraits/lego/2.jpg",
    location: "Home",
    phone: "555-5678",
    marriedTo: "user@example.com",
    ethnicities: ["Irish", "American"],
  },
  {
    id: "child1@example.com",
    name: "Taylor",
    relation: "Child",
    image: "https://randomuser.me/api/portraits/lego/4.jpg",
    location: "School",
    linkedToId: "user@example.com",
    linkedAs: "child",
    ethnicities: ["Indian (Kerala)", "Irish", "American"],
  },
  {
    id: "child2@example.com",
    name: "Jordan",
    relation: "Child",
    image: "https://randomuser.me/api/portraits/lego/5.jpg",
    location: "School",
    linkedToId: "user@example.com",
    linkedAs: "child",
    ethnicities: ["Indian (Kerala)", "Irish", "American"],
  },
  {
    id: "uncle1@example.com",
    name: "Sam",
    relation: "Uncle",
    image: "https://randomuser.me/api/portraits/lego/6.jpg",
    location: "City",
    linkedToId: "grandparent1@example.com",
    linkedAs: "child",
    ethnicities: ["Indian (Kerala)"],
    deceased: true,
  },
  {
    id: "aunt1@example.com",
    name: "Linda",
    relation: "Aunt",
    image: "https://randomuser.me/api/portraits/lego/7.jpg",
    location: "City",
    linkedToId: "grandparent1@example.com",
    linkedAs: "child",
    ethnicities: ["Irish"],
  },
  {
    id: "cousin1@example.com",
    name: "Chris",
    relation: "Cousin",
    image: "https://randomuser.me/api/portraits/lego/8.jpg",
    location: "Town",
    linkedToId: "uncle1@example.com",
    linkedAs: "child",
    ethnicities: ["Indian (Kerala)", "Irish"],
  },
  {
    id: "cousin2@example.com",
    name: "Pat",
    relation: "Cousin",
    image: "https://randomuser.me/api/portraits/lego/9.jpg",
    location: "Town",
    linkedToId: "aunt1@example.com",
    linkedAs: "child",
    ethnicities: ["Irish"],
    deceased: true,
  },
  {
    id: "grandparent1@example.com",
    name: "Grandma Jo",
    relation: "Grandparent",
    image: "https://randomuser.me/api/portraits/lego/3.jpg",
    location: "Farm",
    ethnicities: ["Indian (Kerala)"],
  },
];

// --- Helper Functions ---
function getChildrenOf(member: Member, members: Member[]) {
  return members.filter((m) => m.linkedToId === member.id && m.linkedAs === "child");
}
function getParentsOf(member: Member, members: Member[]) {
  return members.filter((m) => m.linkedToId === member.id && m.linkedAs === "parent");
}
function getSiblingsOf(member: Member, members: Member[]) {
  if (!member.linkedToId || member.linkedAs !== "child") return [];
  return members.filter(
    (m) =>
      m.id !== member.id &&
      m.linkedToId === member.linkedToId &&
      m.linkedAs === "child"
  );
}
function getSpouseOf(member: Member, members: Member[]) {
  return member.marriedTo ? members.find((m) => m.id === member.marriedTo) : undefined;
}
function getGrandparentsOf(member: Member, members: Member[]) {
  const parents = getParentsOf(member, members);
  return parents.flatMap((p) => getParentsOf(p, members));
}
function getAuntsUnclesOf(member: Member, members: Member[]) {
  const parents = getParentsOf(member, members);
  return parents.flatMap((parent) => getSiblingsOf(parent, members));
}
function getCousinsOf(member: Member, members: Member[]) {
  const auntsUncles = getAuntsUnclesOf(member, members);
  return auntsUncles.flatMap((au) =>
    members.filter(
      (m) =>
        m.linkedToId === au.id &&
        m.linkedAs === "child"
    )
  );
}
function getDescendants(id: string, members: Member[]): string[] {
  const children = members.filter(m => m.linkedToId === id && m.linkedAs === "child");
  return children.length === 0
    ? []
    : children.flatMap(child => [child.id, ...getDescendants(child.id, members)]);
}
function removeMemberAndDescendants(id: string, members: Member[]): Member[] {
  const member = members.find(m => m.id === id);
  let updatedMembers = [...members];
  if (member && member.marriedTo) {
    updatedMembers = updatedMembers.filter(m => m.id !== member.marriedTo);
  }
  const descendants = getDescendants(id, members);
  updatedMembers = updatedMembers.filter(m => m.id !== id && !descendants.includes(m.id));
  updatedMembers = updatedMembers.map(m =>
    m.marriedTo === id ? { ...m, marriedTo: undefined } : m
  );
  return updatedMembers;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userRootId, setUserRootId] = useState<string>("user@example.com");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const inviteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.className = darkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-black";
  }, [darkMode]);

  const familyLink = `${window.location.origin}/tree/${userRootId}`;

  useEffect(() => {
    if (!inviteOpen) return;
    const handler = (event: MouseEvent) => {
      if (inviteRef.current && !inviteRef.current.contains(event.target as Node)) {
        setInviteOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [inviteOpen]);

  function shouldRenderAsRoot(member: Member, userRootId: string): boolean {
    if (member.id === userRootId) return true;
    return !members.some(
      (m) => m.marriedTo === member.id && m.id !== member.id
    );
  }

  function renderFamily(memberId: string, generationLevel: number = 0, isSpouse = false) {
    try {
      const member = members.find((m) => m.id === memberId);
      if (!member) return null;
      if (isSpouse) return null;

      const spouse = getSpouseOf(member, members);

      const memberChildren = getChildrenOf(member, members);
      const spouseChildren = spouse ? getChildrenOf(spouse, members) : [];
      const children = [
        ...memberChildren,
        ...spouseChildren.filter(
          (child) => !memberChildren.some((mc) => mc.id === child.id)
        ),
      ];

      const memberParents = getParentsOf(member, members);
      const spouseParents = spouse ? getParentsOf(spouse, members) : [];
      const parents = [
        ...memberParents,
        ...spouseParents.filter(
          (parent) => !memberParents.some((mp) => mp.id === parent.id)
        ),
      ];

      const handleAdd = (type: "child" | "sibling" | "spouse" | "grandparent" | "aunt" | "uncle" | "cousin" | "other") => {
        const newId = `${type}${Date.now()}@example.com`;
        let newMember: Member;
        if (type === "spouse") {
          if (member.marriedTo) {
            setActiveMenu(null);
            return;
          }
          newMember = {
            id: newId,
            name: "",
            relation: "Spouse",
            image: "https://randomuser.me/api/portraits/lego/3.jpg",
            location: "",
            phone: "",
            marriedTo: member.id,
            ethnicities: [],
          };
          setMembers((prev) =>
            prev.map((m) =>
              m.id === member.id
                ? { ...m, marriedTo: newId }
                : m
            ).concat([newMember])
          );
          setActiveMenu(null);
          return;
        } else if (type === "grandparent") {
          newMember = {
            id: newId,
            name: "",
            relation: "Grandparent",
            image: "https://randomuser.me/api/portraits/lego/5.jpg",
            location: "",
            phone: "",
            linkedToId: member.id,
            linkedAs: "parent",
            ethnicities: [],
          };
        } else if (type === "aunt" || type === "uncle") {
          const parents = getParentsOf(member, members);
          if (parents.length === 0) return;
          newMember = {
            id: newId,
            name: "",
            relation: type.charAt(0).toUpperCase() + type.slice(1),
            image: "https://randomuser.me/api/portraits/lego/7.jpg",
            location: "",
            phone: "",
            linkedToId: parents[0].linkedToId,
            linkedAs: "child",
            ethnicities: [],
          };
        } else if (type === "cousin") {
          const auntsUncles = getAuntsUnclesOf(member, members);
          if (auntsUncles.length === 0) return;
          newMember = {
            id: newId,
            name: "",
            relation: "Cousin",
            image: "https://randomuser.me/api/portraits/lego/8.jpg",
            location: "",
            phone: "",
            linkedToId: auntsUncles[0].id,
            linkedAs: "child",
            ethnicities: [],
          };
        } else if (type === "other") {
          newMember = {
            id: newId,
            name: "",
            relation: "Other",
            image: "https://randomuser.me/api/portraits/lego/4.jpg",
            location: "",
            phone: "",
            linkedToId: member.id,
            linkedAs: "child",
            ethnicities: [],
          };
        } else {
          newMember = {
            id: newId,
            name: "",
            relation: type.charAt(0).toUpperCase() + type.slice(1),
            image: "https://randomuser.me/api/portraits/lego/2.jpg",
            location: "",
            phone: "",
            linkedToId: type === "sibling"
              ? member.linkedToId
              : member.id,
            linkedAs: type,
            ethnicities: [],
          };
        }
        setMembers((prev) => [...prev, newMember]);
        setActiveMenu(null);
      };

      const handleDelete = () => {
        if (member.id === userRootId) {
          alert("Can't delete the root member!");
          setActiveMenu(null);
          return;
        }
        if (window.confirm("Delete this member and all their descendants?")) {
          setMembers(prev => removeMemberAndDescendants(member.id, prev));
          setActiveMenu(null);
        }
      };

      const siblingsSpacing = children.length > 2
        ? "flex-wrap justify-center gap-x-8 gap-y-8"
        : "justify-center gap-x-16";

      const isEditing = editingMemberId === member.id;

      function handleConfirmEdit() {
        setEditingMemberId(null);
      }

      return (
        <div className="flex flex-col items-center w-full" style={{ marginBottom: "64px" }}>
          {parents.length > 0 && (
            <div className="flex flex-col items-center w-full" style={{ marginBottom: "48px" }}>
              <div className="flex justify-center gap-8 mb-2">
                {parents.map((gp) => (
                  <div key={gp.id}>{renderFamily(gp.id, generationLevel - 1)}</div>
                ))}
              </div>
            </div>
          )}
          <div className="relative flex items-center gap-4">
            <div
              className={`flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md relative z-20`}
              data-member-id={member.id}
              style={{
                minWidth: 300,
                minHeight: 320,
                border: member.isAdmin ? "2px solid #FFD700" : "none"
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex gap-2">
                <div
                  key={member.id}
                  className={`group text-center w-44 h-auto relative`}
                  data-name={member.name.toLowerCase()}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    onError={(e) => (e.currentTarget.src = "/fallback-icon.png")}
                    className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 group-hover:border-blue-400 transition"
                  />
                  {member.deceased && (
                    <span className="absolute left-2 top-2 text-lg text-gray-600" title="Deceased">⚰️</span>
                  )}
                  <input
                    className="text-center font-semibold bg-transparent border-none focus:outline-none"
                    value={member.name}
                    onFocus={() => setEditingMemberId(member.id)}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((_m) =>
                          _m.id === member.id
                            ? { ..._m, name: e.target.value }
                            : _m
                        )
                      )
                    }
                  />
                  <p className="text-sm text-gray-500 italic">{member.relation}</p>
                  <input
                    className="text-xs text-gray-500 bg-transparent border-none focus:outline-none text-center"
                    value={member.location}
                    onFocus={() => setEditingMemberId(member.id)}
                    placeholder="Location"
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((_m) =>
                          _m.id === member.id
                            ? { ..._m, location: e.target.value }
                            : _m
                        )
                      )
                    }
                  />
                  <input
                    className="text-xs text-gray-500 bg-transparent border-none focus:outline-none text-center mt-1"
                    value={member.phone || ""}
                    placeholder="Phone"
                    onFocus={() => setEditingMemberId(member.id)}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((_m) =>
                          _m.id === member.id
                            ? { ..._m, phone: e.target.value }
                            : _m
                        )
                      )
                    }
                  />
                  <div className="flex flex-col items-center w-full mt-2">
                    <EthnicityInput
                      value={member.ethnicities || []}
                      onChange={ethnicities =>
                        setMembers(prev =>
                          prev.map(m =>
                            m.id === member.id ? { ...m, ethnicities } : m
                          )
                        )
                      }
                      darkMode={darkMode}
                    />
                  </div>
                  <button
                    className={`mt-2 px-2 py-1 rounded text-xs ${member.deceased ? "bg-gray-400 text-white" : "bg-black text-white"}`}
                    onClick={() =>
                      setMembers(prev =>
                        prev.map(m =>
                          m.id === member.id ? { ...m, deceased: !m.deceased } : m
                        )
                      )
                    }
                  >
                    {member.deceased ? "Unmark as Deceased" : "Mark as Deceased"}
                  </button>
                  {isEditing && (
                    <button
                      className="absolute right-0 bottom-0 bg-yellow-400 text-black px-2 py-1 rounded-full shadow font-bold text-xs flex items-center"
                      style={{ zIndex: 10 }}
                      onClick={handleConfirmEdit}
                    >
                      <span role="img" aria-label="confirm">✔️</span>
                    </button>
                  )}
                  <div className="text-xs mt-2">
                    <strong>Siblings:</strong> {getSiblingsOf(member, members).map((sib) => sib.name || "Unnamed").join(", ") || "None"}
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Parents:</strong> {getParentsOf(member, members).map((p) => p.name || "Unnamed").join(", ") || "None"}
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Grandparents:</strong> {getGrandparentsOf(member, members).map((gp) => gp.name || "Unnamed").join(", ") || "None"}
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Aunts/Uncles:</strong> {getAuntsUnclesOf(member, members).map((au) => au.name || "Unnamed").join(", ") || "None"}
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Cousins:</strong> {getCousinsOf(member, members).map((c) => c.name || "Unnamed").join(", ") || "None"}
                  </div>
                </div>
                {spouse && spouse.id !== member.id && (
                  <div
                    key={spouse.id}
                    className="group text-center w-44 h-64 relative"
                    data-name={spouse.name.toLowerCase()}
                  >
                    <img
                      src={spouse.image}
                      alt={spouse.name}
                      onError={(e) => (e.currentTarget.src = "/fallback-icon.png")}
                      className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 group-hover:border-blue-400 transition"
                    />
                    <input
                      className="text-center font-semibold bg-transparent border-none focus:outline-none"
                      value={spouse.name}
                      onFocus={() => setEditingMemberId(spouse.id)}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((_m) =>
                            _m.id === spouse.id
                              ? { ..._m, name: e.target.value }
                              : _m
                          )
                        )
                      }
                    />
                    <p className="text-sm text-gray-500 italic">{spouse.relation}</p>
                    <input
                      className="text-xs text-gray-500 bg-transparent border-none focus:outline-none text-center"
                      value={spouse.location}
                      placeholder="Location"
                      onFocus={() => setEditingMemberId(spouse.id)}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((_m) =>
                            _m.id === spouse.id
                              ? { ..._m, location: e.target.value }
                              : _m
                          )
                        )
                      }
                    />
                    <input
                      className="text-xs text-gray-500 bg-transparent border-none focus:outline-none text-center mt-1"
                      value={spouse.phone || ""}
                      placeholder="Phone"
                      onFocus={() => setEditingMemberId(spouse.id)}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((_m) =>
                            _m.id === spouse.id
                              ? { ..._m, phone: e.target.value }
                              : _m
                          )
                        )
                      }
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                <button
                  onClick={() => setActiveMenu(member.id)}
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded-full shadow"
                >
                  Add Member
                </button>
                {member.id !== userRootId && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-3 py-1 text-xs rounded-full shadow"
                  >
                    Delete
                  </button>
                )}
              </div>
              {activeMenu === member.id && (
                <div className="absolute bottom-[-4.5rem] left-1/2 transform -translate-x-1/2 flex gap-1 bg-white dark:bg-gray-900 border rounded shadow-md px-2 py-1 z-50 flex-wrap">
                  <button
                    onClick={() => handleAdd("child")}
                    className="bg-green-500 px-2 py-1 rounded text-xs text-white"
                  >
                    Child
                  </button>
                  <button
                    onClick={() => handleAdd("spouse")}
                    className="bg-red-500 px-2 py-1 rounded text-xs text-white"
                  >
                    Spouse
                  </button>
                  <button
                    onClick={() => handleAdd("sibling")}
                    className="bg-yellow-500 px-2 py-1 rounded text-xs text-black"
                  >
                    Sibling
                  </button>
                  <button
                    onClick={() => handleAdd("grandparent")}
                    className="bg-purple-600 px-2 py-1 rounded text-xs text-white"
                  >
                    Grandparent
                  </button>
                  <button
                    onClick={() => handleAdd("aunt")}
                    className="bg-pink-600 px-2 py-1 rounded text-xs text-white"
                  >
                    Aunt
                  </button>
                  <button
                    onClick={() => handleAdd("uncle")}
                    className="bg-indigo-600 px-2 py-1 rounded text-xs text-white"
                  >
                    Uncle
                  </button>
                  <button
                    onClick={() => handleAdd("cousin")}
                    className="bg-orange-600 px-2 py-1 rounded text-xs text-white"
                  >
                    Cousin
                  </button>
                  <button
                    onClick={() => handleAdd("other")}
                    className="bg-gray-600 px-2 py-1 rounded text-xs text-white"
                  >
                    Other
                  </button>
                </div>
              )}
            </div>
          </div>
          {children.length > 0 && (
            <div
              className={`flex w-full ${siblingsSpacing} mt-10`}
              style={{ minHeight: "120px", marginTop: "48px" }}
            >
              {children.map((child) => (
                <div key={child.id} className="relative group">
                  {renderFamily(child.id, generationLevel + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } catch (e) {
      console.error("Error in renderFamily for memberId", memberId, e);
      return <div style={{ color: "red" }}>Error rendering member {memberId}</div>;
    }
  }

  const editingOverlay = editingMemberId ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-200 z-10"
      style={{ pointerEvents: "auto" }}
      onClick={() => setEditingMemberId(null)}
    />
  ) : null;

  return (
    <div className="p-4 min-h-screen flex flex-col relative">
      {inviteOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex"
          style={{ pointerEvents: "auto" }}
        >
          <div
            ref={inviteRef}
            className="absolute top-8 right-8 bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center"
            style={{ minWidth: 340, minHeight: 340 }}
          >
            <h2 className="mb-4 text-xl font-bold">Invite Member</h2>
            <QRCode value={familyLink} size={200} />
            <div className="mt-4 text-sm text-gray-700 break-all text-center">
              <span>Family Tree Link:</span>
              <div className="mt-1 px-2 py-1 rounded bg-gray-100 select-all">{familyLink}</div>
            </div>
            <button
              className="mt-6 px-4 py-2 bg-yellow-400 text-black rounded font-semibold"
              onClick={() => setInviteOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editingOverlay}
      <header className="flex justify-between items-center mb-4 z-20 relative">
        <h1 className="text-2xl font-bold">Family Tree</h1>
        <div className="flex gap-2 items-center">
          <select
            value={userRootId}
            onChange={(e) => setUserRootId(e.target.value)}
            className="px-2 py-1 rounded text-black"
          >
            {members.map((m) =>
              shouldRenderAsRoot(m, userRootId) && (
                <option key={m.id} value={m.id}>
                  {m.name || `Member ${m.id}`}
                </option>
              )
            )}
          </select>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              setSearchTerm(term);
              const target = document.querySelector(
                `[data-name*="${term}"]`
              );
              if (target) {
                (target as HTMLElement).scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                target.classList.add("ring-2", "ring-blue-400");
                setTimeout(
                  () =>
                    target.classList.remove(
                      "ring-2",
                      "ring-blue-400"
                    ),
                  2000
                );
              }
            }}
            className="px-2 py-1 border rounded text-black"
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
          <button
            className="px-4 py-2 bg-yellow-400 text-black rounded font-bold shadow"
            style={{ minWidth: 120 }}
            onClick={() => setInviteOpen(true)}
          >
            Invite Member
          </button>
        </div>
      </header>
      <main className="flex flex-col items-center flex-1 w-full overflow-auto z-20 relative">
        <div className="w-full flex flex-col items-center">
          <div key={userRootId} className="w-full">
            {renderFamily(userRootId)}
          </div>
        </div>
      </main>
    </div>
  );
}