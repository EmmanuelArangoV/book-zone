import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

const isbn = (code: string) =>
  `https://covers.openlibrary.org/b/isbn/${code}-L.jpg`;
const olid = (id: string) =>
  `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const books = [
  // ── Bestsellers ──────────────────────────────────────────────────────────
  {
    name: "Gone Girl",
    author: "Gillian Flynn",
    price: 14.99,
    image: isbn("9780307588371"),
    shortDescription: "Una desaparición que sacude una relación perfecta.",
    description:
      "En su quinto aniversario de bodas, Amy Dunne desaparece. La investigación policial revela las mentiras que sostenían un matrimonio aparentemente perfecto. Un thriller que cambia de perspectiva en cada capítulo.",
    stock: 45,
    category: "bestseller",
    specifications: { pages: 422, language: "English" },
  },
  {
    name: "The Silent Patient",
    author: "Alex Michaelides",
    price: 16.99,
    image: isbn("9781250301697"),
    shortDescription: "Una pintora que deja de hablar tras matar a su marido.",
    description:
      "Alicia Berenson mató a su marido de cinco disparos y desde entonces no ha vuelto a hablar. Theo Faber está obsesionado con descifrar su silencio.",
    stock: 38,
    category: "bestseller",
    specifications: { pages: 336, language: "English" },
  },
  {
    name: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 18.0,
    image: isbn("9780439708180"),
    shortDescription: "El inicio de la saga del mago más famoso del mundo.",
    description:
      "Harry Potter nunca ha sido especial para nadie, hasta que una carta lo invita a Hogwarts. Un viaje mágico que ha cautivado a millones de lectores en todo el mundo.",
    stock: 120,
    category: "bestseller",
    specifications: { pages: 309, language: "English" },
  },
  {
    name: "The Da Vinci Code",
    author: "Dan Brown",
    price: 15.99,
    image: isbn("9780307474278"),
    shortDescription: "Un asesinato en el Louvre desata un misterio milenario.",
    description:
      "El famoso profesor de simbología Robert Langdon es llamado al Louvre tras el asesinato del curador. Lo que descubre desafía dos mil años de historia.",
    stock: 55,
    category: "bestseller",
    specifications: { pages: 489, language: "English" },
  },
  {
    name: "1984",
    author: "George Orwell",
    price: 12.99,
    image: isbn("9780451524935"),
    shortDescription: "Una distopía donde el Gran Hermano todo lo ve.",
    description:
      "En el estado totalitario de Oceanía, Winston Smith trabaja reescribiendo la historia. Su rebelión secreta contra el Partido lo llevará a consecuencias devastadoras.",
    stock: 70,
    category: "bestseller",
    specifications: { pages: 328, language: "English" },
  },

  // ── Detective / Mystery ──────────────────────────────────────────────────
  {
    name: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    price: 15.99,
    image: isbn("9780307454546"),
    shortDescription: "Una hacker y un periodista resuelven un crimen familiar.",
    description:
      "Mikael Blomkvist es contratado para resolver la desaparición de una joven ocurrida 40 años atrás. Con la ayuda de Lisbeth Salander descubrirán verdades oscuras.",
    stock: 42,
    category: "detective",
    specifications: { pages: 672, language: "English" },
  },
  {
    name: "The Thursday Murder Club",
    author: "Richard Osman",
    price: 14.99,
    image: isbn("9780525562009"),
    shortDescription: "Cuatro jubilados investigan crímenes sin resolver.",
    description:
      "En una lujosa residencia de jubilados, cuatro amigos se reúnen cada jueves para investigar casos sin resolver. Cuando aparece un cadáver, enfrentan su primer caso real.",
    stock: 33,
    category: "detective",
    specifications: { pages: 382, language: "English" },
  },
  {
    name: "Big Little Lies",
    author: "Liane Moriarty",
    price: 13.99,
    image: isbn("9780425274866"),
    shortDescription: "Tres madres, un crimen, y secretos que explotan.",
    description:
      "Madeline, Celeste y Jane comparten la maternidad en una escuela australiana de élite. Un evento del colegio termina en tragedia y todos guardaban secretos.",
    stock: 28,
    category: "detective",
    specifications: { pages: 460, language: "English" },
  },
  {
    name: "In the Woods",
    author: "Tana French",
    price: 14.99,
    image: isbn("9780143113492"),
    shortDescription: "Un detective investiga donde desaparecieron sus amigos.",
    description:
      "El detective Rob Ryan investiga el asesinato de una niña en el mismo bosque donde sus dos mejores amigos desaparecieron misteriosamente cuando era niño.",
    stock: 25,
    category: "detective",
    specifications: { pages: 429, language: "English" },
  },

  // ── Comedy ───────────────────────────────────────────────────────────────
  {
    name: "Good Omens",
    author: "Terry Pratchett & Neil Gaiman",
    price: 15.99,
    image: isbn("9780060853983"),
    shortDescription: "Un ángel y un demonio intentan evitar el Apocalipsis.",
    description:
      "Aziraphale y Crowley llevan 6.000 años conviviendo en la Tierra. Cuando el Apocalipsis se acerca, deciden unirse para evitarlo porque se han acostumbrado a la vida humana.",
    stock: 30,
    category: "comedy",
    specifications: { pages: 432, language: "English" },
  },
  {
    name: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    price: 13.99,
    image: isbn("9780345391803"),
    shortDescription: "La guía imprescindible para viajar por la galaxia.",
    description:
      "Segundos antes de que la Tierra sea demolida para construir una autopista hiperespacial, Arthur Dent es rescatado por su amigo Ford Prefect.",
    stock: 35,
    category: "comedy",
    specifications: { pages: 224, language: "English" },
  },

  // ── Romantic ─────────────────────────────────────────────────────────────
  {
    name: "Pride and Prejudice",
    author: "Jane Austen",
    price: 10.99,
    image: isbn("9780141439518"),
    shortDescription: "La historia de amor más clásica de la literatura inglesa.",
    description:
      "Elizabeth Bennet y el señor Darcy son dos personas que se disgustan desde el primer momento. Bajo los prejuicios de clase late algo diferente.",
    stock: 80,
    category: "romantic",
    specifications: { pages: 432, language: "English" },
  },
  {
    name: "Me Before You",
    author: "Jojo Moyes",
    price: 13.99,
    image: isbn("9780143124542"),
    shortDescription: "Él cambió su forma de ver el mundo. Ella cambió sus planes.",
    description:
      "Louisa Clark es contratada como cuidadora de Will Traynor, un hombre tetrapléjico. Lo que comienza como una relación profesional se convierte en algo que ninguno esperaba.",
    stock: 40,
    category: "romantic",
    specifications: { pages: 369, language: "English" },
  },

  // ── Fantasy ──────────────────────────────────────────────────────────────
  {
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 14.99,
    image: isbn("9780547928227"),
    shortDescription: "Bilbo Bolsón parte en una aventura inesperada.",
    description:
      "Bilbo lleva una vida tranquila hasta que Gandalf y trece enanos llaman a su puerta. La aventura lo llevará a enfrentarse a trolls, elfos y un dragón.",
    stock: 65,
    category: "fantasy",
    specifications: { pages: 310, language: "English" },
  },
  {
    name: "The Name of the Wind",
    author: "Patrick Rothfuss",
    price: 17.99,
    image: isbn("9780756404741"),
    shortDescription: "La historia del mago más famoso narrada por él mismo.",
    description:
      "Kvothe le cuenta a un cronista cómo fue admitido en la Universidad más joven que nadie y cómo se convirtió en la leyenda que todos conocen.",
    stock: 28,
    category: "fantasy",
    specifications: { pages: 662, language: "English" },
  },

  // ── Authors spotlight ────────────────────────────────────────────────────
  // Arthur Conan Doyle
  {
    name: "The Complete Sherlock Holmes",
    author: "Arthur Conan Doyle",
    price: 12.0,
    image: olid("8387999"),
    shortDescription: "Colección completa del detective más famoso de la literatura.",
    description:
      "Las cuatro novelas y 56 relatos protagonizados por Sherlock Holmes y el Dr. Watson. Incluye A Study in Scarlet, The Hound of the Baskervilles y mucho más.",
    stock: 60,
    category: "authors",
    specifications: { pages: 1122, language: "English" },
  },
  {
    name: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    price: 9.99,
    image: isbn("9780140437867"),
    shortDescription: "El caso más aterrador de Sherlock Holmes.",
    description:
      "Un perro gigante acecha a la familia Baskerville en los páramos de Devonshire. Holmes y Watson deben descubrir si es una maldición o algo más siniestro.",
    stock: 50,
    category: "authors",
    specifications: { pages: 256, language: "English" },
  },
  {
    name: "A Study in Scarlet",
    author: "Arthur Conan Doyle",
    price: 8.99,
    image: isbn("9780140437492"),
    shortDescription: "El primer encuentro entre Holmes y Watson.",
    description:
      "El Dr. Watson, recién llegado de Afganistán, conoce al excéntrico Sherlock Holmes. Juntos investigan un asesinato con una sola pista: la palabra RACHE.",
    stock: 45,
    category: "authors",
    specifications: { pages: 192, language: "English" },
  },

  // Edgar Allan Poe
  {
    name: "The Complete Tales and Poems",
    author: "Edgar Allan Poe",
    price: 14.99,
    image: olid("8232498"),
    shortDescription: "La obra completa del maestro del terror y el misterio.",
    description:
      "Toda la obra de Poe en un solo volumen: cuentos de terror, poemas legendarios y relatos de detectives. El Cuervo, El gato negro, Los crímenes de la Rue Morgue y mucho más.",
    stock: 40,
    category: "authors",
    specifications: { pages: 842, language: "English" },
  },
  {
    name: "The Raven and Other Poems",
    author: "Edgar Allan Poe",
    price: 9.99,
    image: isbn("9780486266855"),
    shortDescription: "La colección poética más oscura y memorable de Poe.",
    description:
      "Una selección de los mejores poemas de Edgar Allan Poe, encabezada por El Cuervo. Versos que mezclan belleza y horror con una musicalidad inigualable.",
    stock: 35,
    category: "authors",
    specifications: { pages: 128, language: "English" },
  },

  // Lev Tolstoy
  {
    name: "Anna Karenina",
    author: "Lev Tolstoy",
    price: 13.99,
    image: isbn("9780143035008"),
    shortDescription: "El gran drama del amor y la sociedad en la Rusia zarista.",
    description:
      "Anna Karenina abandona a su familia por el conde Vronsky. Tolstoi despliega un fresco magistral de la sociedad rusa del siglo XIX donde el amor conduce a la tragedia.",
    stock: 42,
    category: "authors",
    specifications: { pages: 864, language: "English" },
  },
  {
    name: "War and Peace",
    author: "Lev Tolstoy",
    price: 16.99,
    image: isbn("9780143039990"),
    shortDescription: "La épica novela de las guerras napoleónicas.",
    description:
      "A través de cinco familias aristocráticas rusas, Tolstoi narra las guerras napoleónicas de 1805-1820. Considerada una de las mayores obras de la literatura universal.",
    stock: 30,
    category: "authors",
    specifications: { pages: 1392, language: "English" },
  },

  // Val McDermid
  {
    name: "Wire in the Blood",
    author: "Val McDermid",
    price: 13.49,
    image: isbn("9780007149834"),
    shortDescription: "Un perfil psicológico que lleva al límite a los investigadores.",
    description:
      "El Dr. Tony Hill es llamado para ayudar en la investigación de una serie de desapariciones. Un thriller psicológico que explora los rincones más oscuros de la mente humana.",
    stock: 22,
    category: "authors",
    specifications: { pages: 403, language: "English" },
  },
  {
    name: "The Mermaids Singing",
    author: "Val McDermid",
    price: 12.99,
    image: isbn("9780007232857"),
    shortDescription: "El primer caso del perfil psicológico más brillante de la ficción.",
    description:
      "En Bradfield aparecen cuatro hombres torturados y asesinados. Carol Jordan y Tony Hill deben atrapar a un asesino en serie antes de que vuelva a actuar.",
    stock: 18,
    category: "authors",
    specifications: { pages: 352, language: "English" },
  },

  // Tana French
  {
    name: "The Likeness",
    author: "Tana French",
    price: 14.49,
    image: isbn("9780143115625"),
    shortDescription: "Una detective se infiltra como su propia víctima.",
    description:
      "La detective Cassie Maddox encuentra el cadáver de una mujer que usa su antigua identidad encubierta. Para resolver el caso, tendrá que convertirse en ella.",
    stock: 20,
    category: "authors",
    specifications: { pages: 466, language: "English" },
  },
  {
    name: "Faithful Place",
    author: "Tana French",
    price: 13.99,
    image: isbn("9780143119494"),
    shortDescription: "Un detective regresa al barrio que huyó hace 22 años.",
    description:
      "Frank Mackey creyó que su novia lo había abandonado la noche que iban a escapar juntos. Veintidós años después aparece su maleta en una casa abandonada.",
    stock: 17,
    category: "authors",
    specifications: { pages: 400, language: "English" },
  },

  // Gillian Flynn
  {
    name: "Sharp Objects",
    author: "Gillian Flynn",
    price: 12.99,
    image: isbn("9780307341556"),
    shortDescription: "Una periodista regresa al pueblo donde creció para cubrir dos asesinatos.",
    description:
      "Camille Preaker regresa a Wind Gap, Misuri, para investigar los asesinatos de dos niñas. Lo que descubre sobre su familia es más perturbador que el crimen mismo.",
    stock: 32,
    category: "authors",
    specifications: { pages: 254, language: "English" },
  },
  {
    name: "Dark Places",
    author: "Gillian Flynn",
    price: 13.49,
    image: isbn("9780307341570"),
    shortDescription: "Una sobreviviente busca la verdad sobre la masacre de su familia.",
    description:
      "Libby Day tiene 7 años cuando su familia es masacrada. Treinta años después, un club de crímenes reales le paga para que reabra el caso y descubra qué pasó realmente.",
    stock: 27,
    category: "authors",
    specifications: { pages: 349, language: "English" },
  },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en producción" },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    await Product.deleteMany({});
    const inserted = await Product.insertMany(books);

    const summary = books.reduce<Record<string, number>>((acc, b) => {
      acc[b.category] = (acc[b.category] ?? 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      message: `✅ ${inserted.length} libros insertados`,
      porCategoria: summary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al hacer seed" },
      { status: 500 }
    );
  }
}
