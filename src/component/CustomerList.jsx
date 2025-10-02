export default function CustomerList() {
    const customers = ['Courtney Henry', 'Jenny Wilson', 'Cameron Williamson'];
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Welcome 291 customers</h2>
        <div className="flex space-x-4">
          {customers.map((name, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <span className="text-sm mt-2">{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  