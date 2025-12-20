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

    // Envoi de l'email avec Resend
    const emailData = await resend.emails.send({
      from: 'Tarandro Contact <contact@tarandro.org>',
      to: process.env.EMAIL_TO || 'contact@tarandro.org',
      replyTo: email,
      subject: `Nouveau contact : ${firstName} ${lastName} - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Nouveau message de contact</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Prénom :</strong> ${firstName}</p>
            <p><strong>Nom :</strong> ${lastName}</p>
            <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Téléphone :</strong> ${phone}</p>
            <p><strong>Entreprise :</strong> ${company || 'Non renseigné'}</p>
            <p><strong>Service concerné :</strong> ${service}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message :</h3>
            <p style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #0ea5e9; border-radius: 4px;">
              ${message}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Ce message a été envoyé depuis le formulaire de contact de tarandro.org
          </p>
        </div>
      `,
    });

    console.log('✅ Email envoyé avec succès:', emailData);

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
