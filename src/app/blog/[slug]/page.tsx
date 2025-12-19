import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft, FaClock, FaUser, FaCalendar, FaTag } from "react-icons/fa";

// Données d'exemple - en production, ces données viendraient d'une base de données
const blogPosts: Record<string, any> = {
  "benefices-certification-iso-9001": {
    title: "Les bénéfices de la certification ISO 9001 pour votre entreprise",
    excerpt: "Découvrez comment la certification ISO 9001 peut transformer votre organisation, améliorer votre compétitivité et renforcer la confiance de vos clients.",
    category: "Qualité",
    author: "Tarandro",
    date: "2025-12-10",
    readTime: "5 min",
    tags: ["ISO", "Certification", "Qualité"],
    content: `
# Les bénéfices de la certification ISO 9001 pour votre entreprise

La certification ISO 9001 est bien plus qu'un simple certificat à accrocher au mur. C'est un véritable levier de performance pour votre organisation.

## Qu'est-ce que la norme ISO 9001 ?

La norme ISO 9001 est une norme internationale qui définit les exigences pour un système de management de la qualité (SMQ). Elle aide les organisations à démontrer leur capacité à fournir régulièrement des produits et services conformes aux exigences des clients et aux réglementations applicables.

## Les principaux avantages

### 1. Amélioration de la satisfaction client

La norme ISO 9001 place le client au cœur de votre organisation. En mettant en place des processus structurés et en mesurant régulièrement la satisfaction client, vous améliorez continuellement votre offre.

### 2. Optimisation des processus

La certification vous oblige à cartographier et analyser vos processus. Cette démarche permet d'identifier les inefficacités et de mettre en place des améliorations concrètes.

### 3. Réduction des coûts

Un système de qualité bien géré réduit les erreurs, les retours produits et les réclamations clients. Cela se traduit directement par une réduction des coûts opérationnels.

### 4. Avantage concurrentiel

Dans de nombreux secteurs, la certification ISO 9001 est devenue un prérequis pour répondre aux appels d'offres. Elle vous ouvre de nouvelles opportunités commerciales.

### 5. Engagement des équipes

La démarche qualité implique tous les collaborateurs dans l'amélioration continue. Cela renforce leur motivation et leur sentiment d'appartenance.

## Comment obtenir la certification ?

Notre accompagnement comprend :

1. **Diagnostic initial** : Évaluation de votre situation actuelle
2. **Plan d'action** : Définition des étapes et du planning
3. **Mise en conformité** : Adaptation de vos processus aux exigences de la norme
4. **Documentation** : Création des procédures et documents qualité
5. **Préparation à l'audit** : Formation des équipes et audit blanc
6. **Accompagnement à la certification** : Présence lors de l'audit de certification
7. **Suivi post-certification** : Accompagnement pour le maintien de la certification

## En conclusion

La certification ISO 9001 est un investissement rentable qui structure votre organisation et améliore votre performance. Notre équipe d'experts vous accompagne à chaque étape pour garantir votre succès.

**Prêt à vous lancer ?** [Contactez-nous pour un diagnostic gratuit](/contact)
    `,
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug];
  
  if (!post) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: `${post.title} | Blog Tarandro`,
    description: post.excerpt,
    alternates: {
      canonical: `https://tarandro.org/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-semibold">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-100 hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Retour au blog
          </Link>

          <div className="max-w-4xl">
            {/* Category */}
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-primary-100">
              <div className="flex items-center">
                <FaUser className="mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <FaCalendar className="mr-2" />
                {new Date(post.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image Placeholder */}
            <div className="bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl h-96 mb-12 flex items-center justify-center">
              <span className="text-white text-8xl opacity-30">📄</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph: string, index: number) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-4xl font-bold text-gray-900 mt-8 mb-4">{paragraph.substring(2)}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.substring(3)}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{paragraph.substring(4)}</h3>;
                }
                if (paragraph.trim() === '') {
                  return null;
                }
                return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
              })}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                <FaTag className="text-gray-400 mt-2" />
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Besoin d'accompagnement ?
              </h3>
              <p className="text-gray-600 mb-6">
                Nos experts sont à votre disposition pour vous accompagner dans votre démarche qualité
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all shadow-lg font-semibold"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles (future feature) */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles similaires</h2>
            <div className="text-gray-500 text-center py-8">
              Plus d'articles à venir...
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
