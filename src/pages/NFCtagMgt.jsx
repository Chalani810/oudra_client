import React from "react";
//import Sidebar from "../component/SideBar";
import { FiFilter, FiEdit2, FiTrash2 } from "react-icons/fi";

const NFCtagMgt = () => {
  const tags = [
    {
      id: "000001",
      assignedTree: "T-00001",
      createdDate: "15-11-2025",
      updatedAt: "10-04-2025",
      updatedBy: "Kusara",
      status: "Assigned",
    },
    {
      id: "000001",
      assignedTree: "T-00001",
      createdDate: "15-11-2025",
      updatedAt: "10-04-2025",
      updatedBy: "Kusara",
      status: "Available",
    },
    {
      id: "000001",
      assignedTree: "T-00001",
      createdDate: "15-11-2025",
      updatedAt: "10-04-2025",
      updatedBy: "Kusara",
      status: "Reassigned",
    },
    {
      id: "000001",
      assignedTree: "T-00001",
      createdDate: "15-11-2025",
      updatedAt: "10-04-2025",
      updatedBy: "Kusara",
      status: "Damaged",
    },
  ];

  const statusColors = {
    Assigned: "bg-green-200 text-green-800",
    Available: "bg-blue-200 text-blue-800",
    Reassigned: "bg-yellow-200 text-yellow-800",
    Damaged: "bg-red-200 text-red-800",
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/*<Sidebar />*/}

      <div className="flex-1 p-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">NFC Tag Management</h1>

          <div className="flex items-center gap-4">
            <FiFilter className="text-2xl cursor-pointer text-gray-700" />

            <input
              type="text"
              placeholder="Search Tag"
              className="border px-4 py-2 rounded-lg w-64 focus:outline-none"
            />

            <button className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800">
              + New Tag
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Tag ID</th>
                <th>Assigned Tree</th>
                <th>Created Date</th>
                <th>Updated At</th>
                <th>Updated By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tags.map((tag, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">{tag.id}</td>
                  <td className="text-green-700 font-medium">{tag.assignedTree}</td>
                  <td>{tag.createdDate}</td>
                  <td>{tag.updatedAt}</td>
                  <td>{tag.updatedBy}</td>

                  {/* Status Badge */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[tag.status]}`}
                    >
                      {tag.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="flex gap-3 text-gray-600 text-lg">
                    <FiEdit2 className="cursor-pointer hover:text-green-700" />
                    <FiTrash2 className="cursor-pointer hover:text-red-700" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NFCtagMgt;
