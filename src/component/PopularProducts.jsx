export default function PopularProducts() {
    const products = [
      { name: 'Gray vintage 3D computer', earning: '$7,750.88', status: 'Deactivate' },
      { name: 'Virtual reality visual sphere', earning: '$3,250.13', status: 'Active' },
      { name: '3D dark mode wallpaper', earning: '$4,750.17', status: 'Pending' },
    ];
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Popular products</h2>
        <ul className="space-y-3">
          {products.map((product, index) => (
            <li key={index} className="flex justify-between">
              <span>{product.name}</span>
              <div className="text-right">
                <p className="font-semibold">{product.earning}</p>
                <span className={`text-sm ${product.status === 'Active' ? 'text-green-500' : product.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {product.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  