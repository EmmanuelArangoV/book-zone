export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  category: string;
  author: string;
  description?: string;
  stock?: number;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
  bgColor: string;
}

export interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

export interface StatItem {
  value: string;
  labelKey: string;
}
