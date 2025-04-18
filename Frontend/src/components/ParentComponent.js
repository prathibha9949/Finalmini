// src/components/ParentComponent.js
import React, { useState } from 'react';
import AddProduct from './AddProduct';
import ProductsPage from './ProductsPage';

const ParentComponent = () => {
    const [products, setProducts] = useState([]);

    const handleProductAdded = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    return (
        <div>
            <AddProduct onProductAdded={handleProductAdded} />
            <ProductsPage products={products} />
        </div>
    );
};

export default ParentComponent;
