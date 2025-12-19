import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaClock, FaUser, FaTag } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Blog - Actualités Qualité, Formation et Certification",
  description: "Retrouvez tous nos articles sur la qualité, les certifications ISO, HAS, PSAD, les formations professionnelles et les actualités du secteur.",
  alternates: {
    canonical: 'https://tarandro.org/blog',
  },
};

// Données d'exemple - en production, ces données viendraient d'une base de données ou d'un CMS
const blogPosts = [
  {
    id: "1",
    title: "Les bénéfices de la certification ISO 9001 pour votre entreprise",
    slug: "benefices-certification-iso-9001",
    excerpt: "Découvrez comment la certification ISO 9001 peut transformer votre organisation, améliorer votre compétitivité et renforcer la confiance de vos clients.",
    category: "Qualité",
    author: "Tarandro",
    date: "2025-12-10",
    readTime: "5 min",
    image: "/blog/iso-9001.jpg",
    tags: ["ISO", "Certification", "Qualité"],
  },
  {
    id: "2",
    title: "Formation SST : pourquoi c'est indispensable en entreprise",
    slug: "formation-sst-indispensable-entreprise",
    excerpt: "La formation Sauveteur Secouriste du Travail est obligatoire dans de nombreux cas. Découvrez pourquoi elle est essentielle pour la sécurité de vos équipes.",
    category: "Formation",
    author: "Tarandro",
    date: "2025-12-05",
    readTime: "4 min",
    image: "/blog/formation-sst.jpg",
    tags: ["SST", "Formation", "Sécurité"],
  },
  {
    id: "3",
    title: "Certification HAS : préparer votre établissement en 5 étapes",
    slug: "certification-has-preparation-5-etapes",
    excerpt: "Préparez sereinement la visite de certification HAS de votre établissement de santé grâce à notre méthode en 5 étapes clés.",
    category: "Certification",
    author: "Tarandro",
    date: "2025-11-28",
    readTime: "6 min",
    image: "/blog/has.jpg",
    tags: ["HAS", "Santé", "Certification"],
  },
  {
    id: "4",
    title: "Microsoft Excel : 10 astuces pour gagner en productivité",
    slug: "excel-10-astuces-productivite",
    excerpt: "Maîtrisez Excel comme un pro avec ces 10 astuces méconnues qui vont révolutionner votre utilisation quotidienne du tableur.",
    category: "Formation",
    author: "Tarandro",
    date: "2025-11-20",
    readTime: "7 min",
    image: "/blog/excel.jpg",
    tags: ["Bureautique", "Excel", "Productivité"],
  },
];

const categories = ["Tous", "Qualité", "Formation", "Certification", "Actualités"];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog & Actualités
            </h1>
            <p className="text-xl text-primary-100">
              Conseils, guides pratiques et actualités sur la qualité, les certifications et la formation professionnelle
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  category === "Tous"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-400 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-30">
                    📄
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <FaUser className="mr-1" size={12} />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" size={12} />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-2 transition-transform"
                  >
                    Lire l'article
                    <FaArrowRight className="ml-2" size={14} />
                  </Link>

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t text-sm text-gray-400">
                    {new Date(post.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More (future feature) */}
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
              Charger plus d'articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Restez informé
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Recevez nos derniers articles et conseils directement dans votre boîte mail
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold whitespace-nowrap"
              >
                S'abonner
              </button>
            </form>
            <p className="text-sm text-primary-100 mt-4">
              Pas de spam, désabonnement en 1 clic
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
