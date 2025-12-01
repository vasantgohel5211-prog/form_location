import React, { useState, useEffect } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import { Employee, EmployeeFormData } from './types';
import { Users, UserPlus } from 'lucide-react';

// Use a unique key for localStorage
const STORAGE_KEY = 'employee_manager_data';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setEmployees(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse employee data', error);
      }
    }
  }, []);

  // Save data to localStorage whenever employees state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const handleAddOrUpdateEmployee = (formData: EmployeeFormData) => {
    if (editingEmployee) {
      // Update existing
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
      );
      setEmployees(updatedEmployees);
      setEditingEmployee(null);
    } else {
      // Create new
      const newEmployee: Employee = {
        ...formData,
        id: crypto.randomUUID(), // Generates a unique ID
      };
      setEmployees((prev) => [newEmployee, ...prev]);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      // If we are editing the deleted employee, cancel edit
      if (editingEmployee?.id === id) {
        setEditingEmployee(null);
      }
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    // Smooth scroll to top for better UX on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Employee Manager</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'} Listed
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 gap-8">
          {/* Form Section */}
          <section>
             <EmployeeForm 
                onSubmit={handleAddOrUpdateEmployee}
                onCancelEdit={handleCancelEdit}
                editingEmployee={editingEmployee}
             />
          </section>

          {/* Table Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Employee Directory</h2>
              {!editingEmployee && (
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="sm:hidden flex items-center gap-1 text-sm text-blue-600 font-medium"
                  >
                    <UserPlus className="w-4 h-4" /> Add New
                  </button>
              )}
            </div>
            <EmployeeTable 
              employees={employees}
              onEdit={handleEditClick}
              onDelete={handleDeleteEmployee}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;