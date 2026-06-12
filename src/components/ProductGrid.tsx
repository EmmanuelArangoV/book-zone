import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          _id={product._id}
          name={product.name}
          price={product.price}
          image={product.image}
          shortDescription={product.shortDescription}
          author={product.author}
        />
      ))}
    </div>
  );
}
