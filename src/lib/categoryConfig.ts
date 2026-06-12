import { Category } from "@/types";

// Visual config for genre categories — not mock data, these are real UI constants.
// Images use Open Library covers of representative books for each genre.
export const categoryConfig: Category[] = [
  {
    _id: "comedy",
    name: "Comedy",
    image: "https://covers.openlibrary.org/b/isbn/9780060853983-L.jpg",
    slug: "comedy",
    bgColor: "bg-yellow-400",
  },
  {
    _id: "romantic",
    name: "Romantic",
    image: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    slug: "romantic",
    bgColor: "bg-pink-400",
  },
  {
    _id: "fantasy",
    name: "Fantasy",
    image: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    slug: "fantasy",
    bgColor: "bg-blue-500",
  },
];
