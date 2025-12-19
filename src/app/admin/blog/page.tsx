"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaTimes } from "react-icons/fa";

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  image: string;
  published: boolean;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Les bénéfices de la certification ISO 9001 pour votre entreprise",
      slug: "benefices-certification-iso-9001",
      excerpt: "Découvrez comment la certification ISO 9001 peut transformer votre organisation et améliorer votre compétitivité.",
      content: "La certification ISO 9001 est un standard international...",
      category: "Qualité",
      tags: ["ISO", "Certification", "Qualité"],
      author: "Tarandro",
      date: "2025-12-10",
      image: "/blog/iso-9001.jpg",
      published: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Qualité",
    tags: [],
    author: "Tarandro",
    date: new Date().toISOString().split('T')[0],
    image: "",
    published: false,
  });

  const [tagInput, setTagInput] = useState("");

  const handleNewPost = () => {
    setCurrentPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Qualité",
      tags: [],
      author: "Tarandro",
      date: new Date().toISOString().split('T')[0],
      image: "",
      published: false,
    });
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleSavePost = () => {
    if (!currentPost.title || !currentPost.content) {
      alert("Le titre et le contenu sont obligatoires");
      return;
    }

    // Générer le slug si vide
    if (!currentPost.slug && currentPost.title) {
      currentPost.slug = currentPost.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (currentPost.id) {
      // Mise à jour
      setPosts(posts.map(p => p.id === currentPost.id ? currentPost as BlogPost : p));
    } else {
      // Nouveau post
      const newPost = {
        ...currentPost,
        id: Date.now().toString(),
      } as BlogPost;
      setPosts([newPost, ...posts]);
    }

    setIsEditing(false);
    alert("Article enregistré ! (Note: en production, cela sauvegarderait dans une base de données)");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !currentPost.tags?.includes(tagInput.trim())) {
      setCurrentPost({
        ...currentPost,
        tags: [...(currentPost.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentPost({
      ...currentPost,
      tags: currentPost.tags?.filter(t => t !== tag) || [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Administration du Blog
              </h1>
              <p className="text-gray-600">Gérez vos articles de blog</p>
            </div>
            {!isEditing && (
              <button
                onClick={handleNewPost}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center font-semibold"
              >
                <FaPlus className="mr-2" />
                Nouvel article
              </button>
            )}
          </div>
        </div>

        {/* Editor */}
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentPost.id ? "Modifier l'article" : "Nouvel article"}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  value={currentPost.title || ""}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Les avantages de la certification ISO 9001"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) - Laissez vide pour génération automatique
                </label>
                <input
                  type="text"
                  value={currentPost.slug || ""}
                  onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ex: avantages-certification-iso-9001"
                />
              </div>

              {/* Extrait */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extrait (résumé) *
                </label>
                <textarea
                  value={currentPost.excerpt || ""}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Résumé court de l'article (150-200 caractères)"
                ></textarea>
              </div>

              {/* Contenu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de l'article *
                </label>
                <textarea
                  value={currentPost.content || ""}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder="Contenu de l'article en Markdown ou texte simple..."
                ></textarea>
                <p className="text-sm text-gray-500 mt-2">
                  💡 Vous pouvez utiliser le format Markdown pour la mise en forme
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={currentPost.category || "Qualité"}
                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Qualité">Qualité</option>
                    <option value="Formation">Formation</option>
                    <option value="Certification">Certification</option>
                    <option value="Actualités">Actualités</option>
                    <option value="Conseils">Conseils</option>
                  </select>
                </div>

                {/* Auteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={currentPost.author || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={currentPost.date || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image (URL)
                  </label>
                  <input
                    type="text"
                    value={currentPost.image || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="/blog/mon-image.jpg"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ajouter un tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentPost.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm inline-flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Publié */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={currentPost.published || false}
                  onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
                  Publier l'article (visible sur le site)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={handleSavePost}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg inline-flex items-center font-semibold"
                >
                  <FaSave className="mr-2" />
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Liste des articles */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        {post.published ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Publié
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Brouillon
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Voir l'article"
                          >
                            <FaEye size={18} />
                          </a>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                            title="Modifier"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun article pour le moment</p>
                  <button
                    onClick={handleNewPost}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Créer votre premier article
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Cette interface de gestion est actuellement en mode démo (données stockées en mémoire). 
            Pour une utilisation en production, il faudra connecter cette interface à une base de données (ex: MongoDB, PostgreSQL) 
            ou utiliser un CMS headless (ex: Sanity, Contentful, Strapi).
          </p>
        </div>
      </div>
    </div>
  );
}
