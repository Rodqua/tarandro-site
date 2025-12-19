import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const { firstName, lastName, email, phone, company, service, message } = data;
    
    if (!firstName || !lastName || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Ici, vous pouvez :
    // 1. Envoyer un email avec Resend, SendGrid, Nodemailer, etc.
    // 2. Sauvegarder dans une base de données
    // 3. Envoyer vers un CRM
    
    // Pour l'instant, on simule l'envoi et on log les données
    console.log('📧 Nouveau message de contact reçu:', {
      firstName,
      lastName,
      email,
      phone,
      company: company || 'Non renseigné',
      service,
      message,
      date: new Date().toISOString()
    });

    // Réponse de succès
    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre message a été envoyé avec succès ! Nous vous contacterons sous 24h.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors du traitement du formulaire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
