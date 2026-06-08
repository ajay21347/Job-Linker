import { Search } from "lucide-react";

const SearchFilter = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-white shadow"
      />
    </div>
  );
};

export default SearchFilter;
