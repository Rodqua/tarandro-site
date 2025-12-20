import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Chemin vers le fichier de log des contacts
    const contactsLogPath = path.join(process.cwd(), 'data', 'contacts.json');
    
    // Lire les contacts s'ils existent
    let contactsCount = 0;
    let recentContacts = [];
    
    try {
      if (fs.existsSync(contactsLogPath)) {
        const contactsData = JSON.parse(fs.readFileSync(contactsLogPath, 'utf-8'));
        contactsCount = contactsData.length;
        recentContacts = contactsData.slice(-5).reverse(); // 5 derniers
      }
    } catch (error) {
      console.log('No contacts log file yet');
    }

    // Statistiques des articles de blog (simulé pour l'instant)
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    let blogPostsCount = 0;
    
    try {
      if (fs.existsSync(blogPath)) {
        const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'));
        blogPostsCount = blogData.filter((post: any) => post.published).length;
      }
    } catch (error) {
      console.log('No blog posts yet');
    }

    // Date actuelle pour calculer les stats du mois
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Calculer les contacts du mois
    const contactsThisMonth = recentContacts.filter((contact: any) => {
      const contactDate = new Date(contact.date);
      return contactDate >= startOfMonth;
    }).length;

    // Taux de conversion approximatif (messages / visites)
    // Pour l'instant on simule, mais vous pourriez connecter Google Analytics API
    const estimatedVisitors = contactsThisMonth > 0 ? Math.round(contactsThisMonth * 30) : 0;
    const conversionRate = estimatedVisitors > 0 
      ? ((contactsThisMonth / estimatedVisitors) * 100).toFixed(1)
      : '0.0';

    // Statistiques par service
    const serviceStats: { [key: string]: number } = {};
    recentContacts.forEach((contact: any) => {
      const service = contact.service || 'autre';
      serviceStats[service] = (serviceStats[service] || 0) + 1;
    });

    // Tendance (comparer avec le mois précédent)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const contactsLastMonth = recentContacts.filter((contact: any) => {
      const contactDate = new Date(contact.date);
      return contactDate >= lastMonth && contactDate < startOfMonth;
    }).length;

    const trend = contactsLastMonth > 0
      ? Math.round(((contactsThisMonth - contactsLastMonth) / contactsLastMonth) * 100)
      : contactsThisMonth > 0 ? 100 : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalContacts: contactsCount,
        contactsThisMonth,
        blogPosts: blogPostsCount,
        estimatedVisitors,
        conversionRate,
        trend,
        serviceStats,
        recentContacts: recentContacts.slice(0, 5).map((c: any) => ({
          name: `${c.firstName} ${c.lastName}`,
          service: c.service,
          date: c.date,
          email: c.email
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des statistiques',
        stats: {
          totalContacts: 0,
          contactsThisMonth: 0,
          blogPosts: 0,
          estimatedVisitors: 0,
          conversionRate: '0.0',
          trend: 0,
          serviceStats: {},
          recentContacts: []
        }
      },
      { status: 500 }
    );
  }
}
