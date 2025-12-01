import React, { useState } from 'react';
import { Employee, LocationData } from '../types';
import { Edit2, Trash2, MapPinOff, MapPin } from 'lucide-react';
import MapModal from './MapModal';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  const [selectedLocation, setSelectedLocation] = useState<{loc: LocationData, name: string} | null>(null);

  if (employees.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 mt-6 shadow-sm">
        <p className="text-gray-500">No employees found. Start by adding one above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Age/Gender</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{employee.fullName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{employee.address || 'No address'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{employee.email}</div>
                    <div className="text-xs text-gray-500">{employee.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>{employee.age} yrs</div>
                    <div className="text-xs text-gray-500">{employee.gender}</div>
                  </td>
                  <td className="px-6 py-4">
                    {employee.location ? (
                      <button
                        onClick={() => setSelectedLocation({ loc: employee.location!, name: employee.fullName })}
                        className="flex items-center gap-1.5 text-blue-700 text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-md transition hover:shadow-sm"
                        title="View on Google Maps"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-medium">View Map</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400 text-xs py-1.5 px-2">
                        <MapPinOff className="w-3.5 h-3.5" />
                        <span>Not set</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(employee.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLocation && (
        <MapModal
          isOpen={true}
          onClose={() => setSelectedLocation(null)}
          location={selectedLocation.loc}
          title={`${selectedLocation.name}'s Location`}
        />
      )}
    </>
  );
};

export default EmployeeTable;