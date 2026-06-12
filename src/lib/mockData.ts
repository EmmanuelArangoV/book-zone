import { Product, Category, Author } from "@/types";

export const mockCategories: Category[] = [
  {
    _id: "cat1",
    name: "Comedy",
    image: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    slug: "comedy",
    bgColor: "bg-yellow-400",
  },
  {
    _id: "cat2",
    name: "Romantic",
    image: "https://covers.openlibrary.org/b/id/10522877-L.jpg",
    slug: "romantic",
    bgColor: "bg-pink-400",
  },
  {
    _id: "cat3",
    name: "Fantasy",
    image: "https://covers.openlibrary.org/b/id/8235124-L.jpg",
    slug: "fantasy",
    bgColor: "bg-blue-500",
  },
];

export const mockProducts: Product[] = [
  // Bestsellers
  {
    _id: "1",
    name: "The Botanist",
    price: 14.0,
    image: "https://covers.openlibrary.org/b/id/12547196-L.jpg",
    shortDescription: "A gripping thriller set in the wilderness of Cumbria.",
    description:
      "Detective Washington Poe is recalled from his enforced sabbatical to help investigate a serial killer who's leaving a distinctive calling card at each crime scene. A gripping, atmospheric thriller from the bestselling author of Black Summer.",
    category: "bestseller",
    author: "M. W. Craven",
    stock: 25,
  },
  {
    _id: "2",
    name: "The Complete Sherlock Holmes",
    price: 12.0,
    image: "https://covers.openlibrary.org/b/id/8387999-L.jpg",
    shortDescription:
      "The definitive collection of all Sherlock Holmes stories.",
    description:
      "All fifty-six short stories and four novels featuring the world's most famous detective, Sherlock Holmes, and his faithful companion Dr. John H. Watson, collected in one volume.",
    category: "bestseller",
    author: "Sir Arthur Conan Doyle",
    stock: 40,
  },
  {
    _id: "3",
    name: "Harry Potter and the Deathly Hallows",
    price: 18.0,
    image: "https://covers.openlibrary.org/b/id/10110415-L.jpg",
    shortDescription: "The thrilling conclusion to the Harry Potter series.",
    description:
      "Harry Potter is preparing to leave the Dursleys and Privet Drive for the last time. But the future that awaits him is full of danger, not only for him, but for anyone close to him.",
    category: "bestseller",
    author: "J. K. Rowling",
    stock: 60,
  },
  {
    _id: "4",
    name: "Holy Waters: Searching for the Sacred",
    price: 15.12,
    image: "https://covers.openlibrary.org/b/id/12626099-L.jpg",
    shortDescription: "A spiritual journey through water and sacred places.",
    description:
      "An extraordinary pilgrimage across some of the world's most spiritually significant waterscapes, from Iceland's geysers to the bathing ghats of India.",
    category: "bestseller",
    author: "Tom Morton",
    stock: 15,
  },
  {
    _id: "5",
    name: "The Night Circus",
    price: 16.0,
    image: "https://covers.openlibrary.org/b/id/8235124-L.jpg",
    shortDescription: "A magical competition between two young illusionists.",
    description:
      "The circus arrives without warning. No announcements precede it. It is simply there, when yesterday it was not. Within the black-and-white striped tents is an utterly unique experience full of breathtaking amazements.",
    category: "bestseller",
    author: "Erin Morgenstern",
    stock: 30,
  },
  // Detective
  {
    _id: "6",
    name: "Detective",
    price: 20.0,
    image: "https://covers.openlibrary.org/b/id/12303825-L.jpg",
    shortDescription: "A compelling story of crime and investigation.",
    description:
      "A masterful novel about a detective facing his most challenging case yet, where the lines between justice and vengeance blur.",
    category: "detective",
    author: "Arthur Hailey",
    stock: 18,
  },
  {
    _id: "7",
    name: "Detective Angel",
    price: 35.0,
    image: "https://covers.openlibrary.org/b/id/12347191-L.jpg",
    shortDescription: "An angelic detective solves supernatural crimes.",
    description:
      "When ordinary detective work meets the extraordinary, Angel must navigate a world where nothing is as it seems and every clue leads deeper into mystery.",
    category: "detective",
    author: "Rye Harrison",
    stock: 10,
  },
  {
    _id: "8",
    name: "2 Sisters Detective Agency",
    price: 17.0,
    image: "https://covers.openlibrary.org/b/id/12547199-L.jpg",
    shortDescription: "Two sisters team up to solve a dangerous mystery.",
    description:
      "Bobbie Doolittle, a scrappy young woman, arrives at her deceased father's detective agency to find her teenage half-sister Ashlee running the business. Together they stumble into a high-profile case.",
    category: "detective",
    author: "James Patterson, Candice Fox",
    stock: 22,
  },
  {
    _id: "9",
    name: "The Blitz Detective",
    price: 12.0,
    image: "https://covers.openlibrary.org/b/id/12303830-L.jpg",
    shortDescription: "A detective story set during the London Blitz.",
    description:
      "London, 1940. As bombs rain down on the city, Detective Inspector Frank Merlin battles through the chaos to solve a series of murders that seem connected to the war effort.",
    category: "detective",
    author: "Mike Hollow",
    stock: 35,
  },
  {
    _id: "10",
    name: "The Thursday Murder Club",
    price: 14.99,
    image: "https://covers.openlibrary.org/b/id/10975827-L.jpg",
    shortDescription: "Four retirees investigate cold cases — until a real one lands in their lap.",
    description:
      "In a peaceful retirement village, four unlikely friends meet weekly to investigate unsolved crimes. But when a real murder takes place on their doorstep, the Thursday Murder Club find themselves in the middle of their first live case.",
    category: "detective",
    author: "Richard Osman",
    stock: 45,
  },
  // Authors section (Stuart Douglas)
  {
    _id: "11",
    name: "White Bird, Black Serpent, Red Book",
    price: 13.2,
    image: "https://covers.openlibrary.org/b/id/10522877-L.jpg",
    shortDescription:
      "A deep exploration of Gnosticism and Jungian psychology.",
    description:
      "This book is principally about what is commonly referred to as Gnosticism and its influence on Jung's analytical psychology. It is intended for someone who are interested in Jungian studies and/or Gnosticism, both the scholar and the general reader.",
    category: "authors",
    author: "Stuart Douglas",
    stock: 8,
  },
  {
    _id: "12",
    name: "Sherlock Holmes and the Crusader's Curse",
    price: 19.73,
    image: "https://covers.openlibrary.org/b/id/8387998-L.jpg",
    shortDescription: "Holmes faces his most historically rich case.",
    description:
      "A new novel from the author of acclaimed Sherlock Holmes pastiches The Albino's Treasure, The Counterfeit Detective and The Improbable Prisoner. A CURSED LEGACY. The last Lord Thorpe.",
    category: "authors",
    author: "Stuart Douglas",
    stock: 12,
  },
];

export const mockAuthors: Author[] = [
  { _id: "a1", name: "Stuart Douglas" },
  { _id: "a2", name: "Edgar Allan Poe" },
  { _id: "a3", name: "Lev Tolstoy" },
  { _id: "a4", name: "Arthur Gonzales" },
  { _id: "a5", name: "Ernesto Wade" },
  { _id: "a6", name: "Georgia Ramirez" },
  { _id: "a7", name: "Jessica Munoz" },
  { _id: "a8", name: "Marcella Bennett" },
  { _id: "a9", name: "Tricia Allison" },
  { _id: "a10", name: "Simon Kurt Unsworth" },
  { _id: "a11", name: "Simon Booker" },
  { _id: "a12", name: "Val McDermid" },
];

export const mockStats = [
  { value: "17,237", labelKey: "happyCustomers" },
  { value: "16,728", labelKey: "totalBooks" },
  { value: "1,287", labelKey: "authors" },
  { value: "1,287", labelKey: "booksSold" },
];
