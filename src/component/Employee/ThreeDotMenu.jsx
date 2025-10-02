import { FiMoreVertical } from "react-icons/fi"; // Feather icon

const ThreeDotMenu = ({ onEdit, onDelete }) => {
  return (
    <div className="relative">
      <button className="p-2">
        <FiMoreVertical size={20} />
      </button>

      {/* Example dropdown for edit/delete */}
      <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md z-10">
        <button
          onClick={onEdit}
          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ThreeDotMenu;

