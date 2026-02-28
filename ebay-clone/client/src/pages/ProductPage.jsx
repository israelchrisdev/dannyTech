import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../components/buy/ProductDetails';

const ProductPage = () => {
  const { id } = useParams();

  return (
    <div>
      <ProductDetails productId={id} />
    </div>
  );
};

export default ProductPage;