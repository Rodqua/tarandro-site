import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export async function GET() {
  try {
    // Vérifier que les credentials sont configurés
    const propertyId = process.env.GA4_PROPERTY_ID;
    const credentials = process.env.GA4_CREDENTIALS;

    if (!propertyId || !credentials) {
      console.log(
        "⚠️ Google Analytics non configuré - utilisation des stats de base"
      );
      return NextResponse.json({
        success: false,
        message: "Google Analytics API non configuré",
        useBasicStats: true,
      });
    }

    // Parser les credentials JSON
    const credentialsJson = JSON.parse(credentials);

    // Initialiser le client Google Analytics
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentialsJson,
    });

    // Date actuelle et il y a 30 jours
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    // Requête 1: Statistiques générales (30 derniers jours)
    const [generalReport] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(thirtyDaysAgo),
          endDate: formatDate(today),
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    });

    // Requête 2: Sources de trafic
    const [trafficReport] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(sevenDaysAgo),
          endDate: formatDate(today),
        },
      ],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    });

    // Requête 3: Pages les plus vues
    const [pagesReport] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(sevenDaysAgo),
          endDate: formatDate(today),
        },
      ],
      dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    // Requête 4: Événements personnalisés (conversions)
    const [eventsReport] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(sevenDaysAgo),
          endDate: formatDate(today),
        },
      ],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: {
            values: [
              "form_submit",
              "phone_click",
              "email_click",
              "button_click",
            ],
          },
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    });

    // Calculer les totaux
    let totalUsers = 0;
    let totalSessions = 0;
    let totalPageViews = 0;
    let totalBounceRate = 0;
    let totalSessionDuration = 0;
    let dataPoints = 0;

    generalReport.rows?.forEach((row) => {
      totalUsers += parseInt(row.metricValues?.[0]?.value || "0");
      totalSessions += parseInt(row.metricValues?.[1]?.value || "0");
      totalPageViews += parseInt(row.metricValues?.[2]?.value || "0");
      totalBounceRate += parseFloat(row.metricValues?.[3]?.value || "0");
      totalSessionDuration += parseFloat(row.metricValues?.[4]?.value || "0");
      dataPoints++;
    });

    const avgBounceRate =
      dataPoints > 0 ? (totalBounceRate / dataPoints) * 100 : 0;
    const avgSessionDuration =
      dataPoints > 0 ? Math.round(totalSessionDuration / dataPoints) : 0;

    // Parser les sources de trafic
    const trafficSources =
      trafficReport.rows?.map((row) => ({
        source: row.dimensionValues?.[0]?.value || "Unknown",
        sessions: parseInt(row.metricValues?.[0]?.value || "0"),
        users: parseInt(row.metricValues?.[1]?.value || "0"),
      })) || [];

    // Parser les pages populaires
    const topPages =
      pagesReport.rows?.map((row) => ({
        title: row.dimensionValues?.[0]?.value || "Unknown",
        path: row.dimensionValues?.[1]?.value || "/",
        views: parseInt(row.metricValues?.[0]?.value || "0"),
        users: parseInt(row.metricValues?.[1]?.value || "0"),
      })) || [];

    // Parser les événements
    const events =
      eventsReport.rows?.map((row) => ({
        name: row.dimensionValues?.[0]?.value || "Unknown",
        count: parseInt(row.metricValues?.[0]?.value || "0"),
      })) || [];

    // Calculer le taux de conversion (form_submit / sessions)
    const formSubmits =
      events.find((e) => e.name === "form_submit")?.count || 0;
    const conversionRate =
      totalSessions > 0 ? (formSubmits / totalSessions) * 100 : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          users: totalUsers,
          sessions: totalSessions,
          pageViews: totalPageViews,
          bounceRate: avgBounceRate,
          avgSessionDuration,
          conversionRate,
        },
        trafficSources,
        topPages,
        events,
        period: "30 derniers jours",
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur Google Analytics API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        useBasicStats: true,
      },
      { status: 500 }
    );
  }
}
