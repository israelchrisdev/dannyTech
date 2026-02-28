import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/constants';

const CategoriesList = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
        >
          <h3 className="font-medium text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500 mt-1">View items →</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesList;