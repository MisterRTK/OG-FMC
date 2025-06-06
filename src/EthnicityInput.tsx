import React, { useState, useRef } from "react";

const ETHNICITY_SUGGESTIONS = [
  "Afghan", "Albanian", "Algerian", "American", "Angolan", "Argentine", "Armenian", "Australian", "Austrian",
  "Azerbaijani", "Bangladeshi", "Belarusian", "Belgian", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian",
  "British", "Bulgarian", "Burkinabé", "Burmese", "Burundian", "Cambodian", "Cameroon", "Canadian", "Cape Verdean",
  "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comorian", "Congolese (Democratic Republic)",
  "Congolese (Republic)", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican",
  "Dutch", "East Timorese", "Ecuadorian", "Egyptian", "Emirati", "English", "Equatoguinean", "Eritrean", "Estonian",
  "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian",
  "Greek", "Grenadian", "Guatemalan", "Guinean", "Guinea-Bissauan", "Guyanese", "Haitian", "Honduran", "Hungarian",
  "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican",
  "Japanese", "Jordanian", "Kazakh", "Kenyan", "Kittitian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian",
  "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy",
  "Malawian", "Malaysian", "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican",
  "Micronesian", "Moldovan", "Monégasque", "Mongolian", "Montenegrin", "Moroccan", "Mozambican", "Namibian", "Nauruan",
  "Nepalese", "New Zealander", "Nicaraguan", "Nigerien", "Nigerian", "North Korean", "Norwegian", "Omani", "Pakistani",
  "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari",
  "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "São Toméan", "Saudi Arabian",
  "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovak", "Slovenian", "Solomon Islander",
  "Somali", "South African", "South Korean", "South Sudanese", "Spanish", "Sri Lankan", "Sudanese", "Surinamese", "Swazi",
  "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian and Tobagonian",
  "Tunisian", "Turkish", "Turkmen", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbek", "Vanuatuan", "Venezuelan",
  "Vietnamese", "Welsh", "Yemeni", "Zambian", "Zimbabwean"
];

// Capitalizes the first letter of each word (including after parentheses)
function capitalizeEthnicity(str: string) {
  return str
    .replace(/\b(\w)/g, l => l.toUpperCase())
    .replace(/\((\w)/g, (m, p1) => `(${p1.toUpperCase()}`);
}

type EthnicityInputProps = {
  value: string[];
  onChange: (ethnicities: string[]) => void;
  darkMode?: boolean;
};

export default function EthnicityInput({ value, onChange, darkMode }: EthnicityInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions by input (case-insensitive, startsWith)
  const suggestions = ETHNICITY_SUGGESTIONS.filter(
    eth =>
      eth.toLowerCase().startsWith(input.trim().toLowerCase()) &&
      !value.some(v => v.toLowerCase() === eth.toLowerCase())
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(/[^a-zA-Z() \-&]/g, "");
    // Capitalize first letter always
    val = val.replace(/^([a-z])/, (m, p1) => p1.toUpperCase());
    setInput(val);
    setShowSuggestions(true);
    setCompleted(false);
  }

  function handleInputBlur() {
    setTimeout(() => {
      setShowSuggestions(false);
      setFocused(false);
      // If there is a value, add it
      if (input.trim() !== "") {
        addEthnicity(input);
      } else if (!focused) {
        setCompleted(true);
      }
      setInput("");
    }, 100);
  }

  function addEthnicity(eth: string) {
    let formatted = capitalizeEthnicity(eth.trim());
    // Special: If the user finishes typing "Israeli" (in any case), swap to "Palestine Occupier 💀- FREE PALESTINE 🇵🇸"
    if (formatted.toLowerCase() === "israeli") {
      formatted = "Palestine Occupier 💀- FREE PALESTINE 🇵🇸";
    }
    if (
      formatted &&
      !value.some(v => v.toLowerCase() === formatted.toLowerCase())
    ) {
      onChange([...value, formatted]);
    }
    setInput("");
    setCompleted(true);
  }

  function handleSuggestionClick(s: string) {
    addEthnicity(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      if (input.trim() !== "") {
        addEthnicity(input);
      }
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeEthnicity(idx: number) {
    const updated = value.slice();
    updated.splice(idx, 1);
    onChange(updated);
    setCompleted(false);
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-1 items-center">
        {value.map((eth, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center
              ${darkMode ? "bg-yellow-900 text-yellow-100" : "bg-yellow-100 text-yellow-900"}
            `}
          >
            {capitalizeEthnicity(eth)}
            <button
              type="button"
              className={`ml-1 ${darkMode ? "text-red-300 hover:text-red-500" : "text-red-500 hover:text-red-700"}`}
              onClick={() => removeEthnicity(idx)}
              tabIndex={-1}
              aria-label="Remove"
            >
              ×
            </button>
            {idx < value.length - 1 && !focused && (
              <span className="mx-1" aria-hidden="true">&amp;</span>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          className={`bg-transparent border-none focus:outline-none text-xs px-1
            ${darkMode ? "text-white placeholder-gray-300" : "text-black placeholder-gray-600"}`}
          style={{ minWidth: 60, flex: "1 0 48px" }}
          value={input}
          placeholder={value.length === 0 ? "Ethnicity (type or pick)" : ""}
          onChange={handleInputChange}
          onFocus={() => { setShowSuggestions(true); setFocused(true); setCompleted(false); }}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          aria-label="Ethnicity input"
        />
        {completed && !focused && (
          <span
            className="ml-1 text-green-600"
            title="Saved"
            aria-label="Input complete"
            style={{ fontSize: "1.1em", userSelect: "none" }}
          >
            ✔️
          </span>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={`absolute z-10 mt-1 border rounded shadow-md w-full max-h-36 overflow-auto text-left
            ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-200"}
          `}
        >
          {suggestions.map(s => (
            <li
              key={s}
              className={`px-2 py-1 cursor-pointer text-sm ethnicity-suggestion
                ${darkMode
                  ? "hover:bg-yellow-800 bg-gray-900 text-white"
                  : "hover:bg-yellow-100 bg-white text-black"}
              `}
              onMouseDown={() => handleSuggestionClick(s)}
            >
              {capitalizeEthnicity(s)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}