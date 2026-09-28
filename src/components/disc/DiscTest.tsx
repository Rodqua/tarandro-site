"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaChartBar,
  FaLightbulb,
  FaExclamationTriangle,
  FaComments,
  FaBullseye,
  FaPrint,
  FaRedo,
  FaBriefcase,
  FaBalanceScale,
} from "react-icons/fa";

import { DISC_QUESTIONS, TOTAL_QUESTIONS, type DiscDimension } from "@/lib/disc/questions";
import { DISC_DIMENSIONS, DIMENSION_ORDER } from "@/lib/disc/dimensions";
import {
  computeDiscResult,
  countCompleted,
  createEmptyAnswers,
  type DiscAnswers,
} from "@/lib/disc/scoring";
import { DiscBarChart, DiscQuadrant, DiscScoreTable } from "./DiscCharts";

const STORAGE_KEY = "tarandro-disc-v1";

type Step = "intro" | "test" | "results";

interface StoredState {
  answers: DiscAnswers;
  index: number;
  step: Step;
}

export default function DiscTest() {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiscAnswers>(() => createEmptyAnswers());
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* Reprise d'un test interrompu -------------------------------------------- */
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredState;
      if (!parsed?.answers) return;
      const merged = createEmptyAnswers();
      for (const question of DISC_QUESTIONS) {
        const stored = parsed.answers[question.id];
        if (stored) merged[question.id] = { most: stored.most ?? null, least: stored.least ?? null };
      }
      if (countCompleted(merged) === 0) return;
      setAnswers(merged);
      setIndex(Math.min(Math.max(parsed.index ?? 0, 0), TOTAL_QUESTIONS - 1));
      if (parsed.step === "results" && countCompleted(merged) === TOTAL_QUESTIONS) {
        setStep("results");
      }
      setRestored(true);
    } catch {
      /* Stockage indisponible (navigation privée) : on repart de zéro. */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, step }));
    } catch {
      /* rien à faire : la persistance est un confort, pas une nécessité */
    }
  }, [answers, index, step, hydrated]);

  const completed = countCompleted(answers);
  const question = DISC_QUESTIONS[index];
  const current = answers[question.id];
  const isComplete = completed === TOTAL_QUESTIONS;

  const select = useCallback(
    (kind: "most" | "least", dimension: DiscDimension) => {
      setAnswers((previous) => {
        const answer = previous[question.id];
        const other = kind === "most" ? "least" : "most";
        const next = {
          ...answer,
          [kind]: answer[kind] === dimension ? null : dimension,
          // Un même adjectif ne peut pas être à la fois « le plus » et « le moins »
          [other]: answer[other] === dimension ? null : answer[other],
        };
        return { ...previous, [question.id]: next };
      });
    },
    [question.id],
  );

  /* Passage automatique à la question suivante une fois les deux choix faits */
  useEffect(() => {
    if (step !== "test") return;
    if (!current?.most || !current?.least) return;
    if (index >= TOTAL_QUESTIONS - 1) return;
    const timer = window.setTimeout(() => setIndex((i) => Math.min(i + 1, TOTAL_QUESTIONS - 1)), 260);
    return () => window.clearTimeout(timer);
  }, [current?.most, current?.least, index, step]);

  const result = useMemo(() => (isComplete ? computeDiscResult(answers) : null), [answers, isComplete]);

  const restart = () => {
    setAnswers(createEmptyAnswers());
    setIndex(0);
    setStep("intro");
    setRestored(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Écran d'introduction                                                   */
  /* ---------------------------------------------------------------------- */
  if (step === "intro") {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Passer le test DISC complet
        </h2>
        <p className="text-gray-700 mb-6">
          Le questionnaire comporte <strong>{TOTAL_QUESTIONS} groupes de 4 adjectifs</strong>. Pour
          chaque groupe, désignez l&apos;adjectif qui vous ressemble <strong>le plus</strong> et
          celui qui vous ressemble <strong>le moins</strong>. C&apos;est la méthode du choix forcé,
          celle des questionnaires DISC professionnels : elle évite de tout cocher et fait
          apparaître des préférences réelles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "Durée", value: "10 à 15 minutes", detail: "Sans interruption si possible" },
            { title: "Consigne", value: "Répondez spontanément", detail: "Pas de bonne réponse" },
            {
              title: "Confidentialité",
              value: "100 % dans votre navigateur",
              detail: "Aucune donnée envoyée",
            },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-5">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{item.title}</div>
              <div className="font-bold text-gray-900">{item.value}</div>
              <div className="text-sm text-gray-600">{item.detail}</div>
            </div>
          ))}
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-2">Comment répondre&nbsp;?</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start">
              <FaCheckCircle className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
              <span>
                Placez-vous dans votre contexte <strong>professionnel actuel</strong>.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
              <span>Répondez selon ce que vous êtes, non selon ce qui est attendu de vous.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
              <span>
                Ne réfléchissez pas plus de 15 secondes par groupe : le premier mouvement est le
                plus fiable.
              </span>
            </li>
          </ul>
        </div>

        {restored && completed > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-900">
            Un test en cours a été retrouvé sur cet appareil ({completed}/{TOTAL_QUESTIONS} groupes
            complétés). Vous pouvez le reprendre ou le recommencer.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setStep("test")}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold inline-flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {restored && completed > 0 ? "Reprendre le test" : "Commencer le test"}
            <FaArrowRight className="ml-2" />
          </button>
          {restored && completed > 0 && (
            <button
              type="button"
              onClick={restart}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold inline-flex items-center justify-center"
            >
              <FaRedo className="mr-2" />
              Recommencer à zéro
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Questionnaire                                                          */
  /* ---------------------------------------------------------------------- */
  if (step === "test") {
    const progress = Math.round((completed / TOTAL_QUESTIONS) * 100);

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
          <span className="font-semibold">
            Groupe {index + 1} / {TOTAL_QUESTIONS}
          </span>
          <span>
            {completed} groupe{completed > 1 ? "s" : ""} complété{completed > 1 ? "s" : ""}
          </span>
        </div>
        <div
          className="h-2 bg-gray-100 rounded-full overflow-hidden mb-8"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression du test"
        >
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Dans ce groupe, qu&apos;est-ce qui vous ressemble le plus et le moins&nbsp;?
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Un seul choix dans chaque colonne. Les deux sont obligatoires.
        </p>

        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[110px_1fr_110px] gap-x-3 md:gap-x-4 items-center mb-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 text-center">
            Le plus
          </div>
          <div />
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">
            Le moins
          </div>
        </div>

        <div className="space-y-2">
          {question.words.map((word) => {
            const isMost = current?.most === word.dimension;
            const isLeast = current?.least === word.dimension;
            return (
              <div
                key={word.id}
                className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[110px_1fr_110px] gap-x-3 md:gap-x-4 items-center rounded-xl border-2 px-3 py-2 transition-colors ${
                  isMost
                    ? "border-emerald-500 bg-emerald-50"
                    : isLeast
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => select("most", word.dimension)}
                  aria-pressed={isMost}
                  aria-label={`« ${word.label} » me ressemble le plus`}
                  className={`w-11 h-11 md:w-full md:h-10 rounded-lg border-2 font-semibold transition-all inline-flex items-center justify-center ${
                    isMost
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-gray-300 text-gray-400 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  +
                </button>
                <span className="text-lg text-gray-900 text-center font-medium">{word.label}</span>
                <button
                  type="button"
                  onClick={() => select("least", word.dimension)}
                  aria-pressed={isLeast}
                  aria-label={`« ${word.label} » me ressemble le moins`}
                  className={`w-11 h-11 md:w-full md:h-10 rounded-lg border-2 font-semibold transition-all inline-flex items-center justify-center ${
                    isLeast
                      ? "bg-gray-700 border-gray-700 text-white"
                      : "border-gray-300 text-gray-400 hover:border-gray-600 hover:text-gray-700"
                  }`}
                >
                  −
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaArrowLeft className="mr-2" />
            Précédent
          </button>

          {index < TOTAL_QUESTIONS - 1 ? (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1))}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all font-medium inline-flex items-center justify-center"
            >
              Suivant
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep("results")}
              disabled={!isComplete}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChartBar className="mr-2" />
              Voir mon profil
            </button>
          )}
        </div>

        {!isComplete && index === TOTAL_QUESTIONS - 1 && (
          <p className="mt-4 text-sm text-red-600">
            Il reste {TOTAL_QUESTIONS - completed} groupe(s) incomplet(s). Utilisez les repères
            ci-dessous pour les retrouver.
          </p>
        )}

        {/* Navigation directe entre les groupes */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">
            Accès direct aux groupes
          </div>
          <div className="flex flex-wrap gap-2">
            {DISC_QUESTIONS.map((q, i) => {
              const done = answers[q.id]?.most && answers[q.id]?.least;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Aller au groupe ${q.id}${done ? " (complété)" : " (à compléter)"}`}
                  aria-current={i === index}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                    i === index
                      ? "bg-primary-600 text-white"
                      : done
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Résultats                                                              */
  /* ---------------------------------------------------------------------- */
  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <p className="text-gray-700 mb-6">
          Le questionnaire n&apos;est pas complet, le profil ne peut pas être calculé.
        </p>
        <button
          type="button"
          onClick={() => setStep("test")}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Reprendre le questionnaire
        </button>
      </div>
    );
  }

  const { profile } = result;
  const primaryInfo = DISC_DIMENSIONS[result.primary];
  const secondaryInfo = result.secondary ? DISC_DIMENSIONS[result.secondary] : null;

  return (
    <div className="space-y-8">
      {/* En-tête du profil */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div
          className="px-8 py-10 text-white"
          style={{
            background: secondaryInfo
              ? `linear-gradient(135deg, ${primaryInfo.color} 0%, ${secondaryInfo.color} 100%)`
              : `linear-gradient(135deg, ${primaryInfo.color} 0%, #0f172a 130%)`,
          }}
        >
          <div className="text-sm uppercase tracking-widest opacity-90 mb-2">Votre profil DISC</div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div className="text-5xl md:text-6xl font-bold tracking-tight">
              {profile.letters.join("")}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{profile.name}</h2>
              <p className="opacity-90">{profile.subtitle}</p>
            </div>
          </div>
          <p className="text-lg max-w-3xl opacity-95">{profile.headline}</p>
        </div>

        <div className="p-8 md:p-10">
          {profile.description.map((paragraph, i) => (
            <p key={i} className="text-gray-700 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}

          <div className="flex flex-wrap gap-3 mt-6">
            {DIMENSION_ORDER.map((dimension) => {
              const info = DISC_DIMENSIONS[dimension];
              return (
                <div
                  key={dimension}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"
                >
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: info.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-gray-900">{info.letter}</span>
                  <span className="text-sm text-gray-600">{info.name}</span>
                  <span className="text-sm font-bold tabular-nums text-gray-900">
                    {result.synthese[dimension]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Les trois graphiques */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FaChartBar className="text-primary-600 mr-3" />
          Vos trois graphiques
        </h3>
        <p className="text-gray-600 mb-8">
          Un profil DISC ne se lit pas sur une seule courbe. Le questionnaire en produit trois : ce
          que vous montrez, ce qui vous meut, et la synthèse des deux. Les scores sont exprimés sur
          une échelle de 0 à 100, la ligne médiane à 50 correspondant à la moyenne statistique.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {result.graphs.map((graph) => (
            <div key={graph.id}>
              <h4 className="font-bold text-gray-900">{graph.title}</h4>
              <p className="text-sm text-gray-500 mb-4">{graph.subtitle}</p>
              <DiscBarChart scores={graph.scores} />
              <p className="text-sm text-gray-600 mt-3">{graph.explanation}</p>
            </div>
          ))}
        </div>

        <details className="mt-8 border-t border-gray-100 pt-6">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-primary-700">
            Voir les données chiffrées
          </summary>
          <div className="mt-4 overflow-x-auto">
            <DiscScoreTable
              rows={[
                { label: "Masque (adapté)", scores: result.masque },
                { label: "Moteur (naturel)", scores: result.moteur },
                { label: "Synthèse", scores: result.synthese },
                { label: "Choix « le plus »", scores: result.rawMost },
                { label: "Choix « le moins »", scores: result.rawLeast },
              ]}
            />
            <p className="text-xs text-gray-500 mt-3">
              Les deux dernières lignes indiquent les comptages bruts sur {TOTAL_QUESTIONS} groupes
              (7 choix = moyenne attendue).
            </p>
          </div>
        </details>
      </div>

      {/* Carte DISC + adaptation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Votre position sur la carte DISC</h3>
          <p className="text-gray-600 text-sm mb-6">
            Les quatre dimensions se déduisent de deux axes : le rythme (réservé ou actif) et
            l&apos;orientation (vers les tâches ou vers les personnes). Votre point de synthèse est
            placé sur cette carte.
          </p>
          <DiscQuadrant scores={result.synthese} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <FaBalanceScale className="text-primary-600 mr-3" />
            Masque et moteur : votre niveau d&apos;adaptation
          </h3>
          <div className="flex items-baseline gap-3 my-4">
            <span className="text-4xl font-bold text-gray-900 tabular-nums">
              {result.adaptationGap}
            </span>
            <span className="text-gray-500 text-sm">points d&apos;écart cumulés</span>
          </div>
          <div className="inline-block bg-primary-50 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {result.adaptationLabel}
          </div>
          <p className="text-gray-700 leading-relaxed">{result.adaptationComment}</p>
          <p className="text-gray-700 leading-relaxed mt-4">
            <strong>Sous tension :</strong> {profile.stress}
          </p>
        </div>
      </div>

      {/* Lecture dimension par dimension */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Lecture dimension par dimension
        </h3>
        <div className="space-y-5">
          {result.intensities
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((item) => {
              const info = DISC_DIMENSIONS[item.dimension];
              return (
                <div
                  key={item.dimension}
                  className="rounded-xl border border-gray-200 p-5"
                  style={{ backgroundColor: info.softBg }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="w-8 h-8 rounded-lg text-white font-bold inline-flex items-center justify-center"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.letter}
                    </span>
                    <span className="font-bold text-gray-900">{info.name}</span>
                    <span className="text-sm text-gray-600">— {info.question}</span>
                    <span className="ml-auto text-sm font-semibold text-gray-900">
                      {item.score}/100 · intensité {item.level}
                    </span>
                  </div>
                  <p className="text-gray-700">{item.comment}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Forces / limites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaLightbulb className="text-emerald-600 mr-3" />
            Vos points forts
          </h3>
          <ul className="space-y-3">
            {profile.forces.map((item) => (
              <li key={item} className="flex items-start">
                <FaCheckCircle className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaExclamationTriangle className="text-amber-600 mr-3" />
            Vos points de vigilance
          </h3>
          <ul className="space-y-3">
            {profile.limites.map((item) => (
              <li key={item} className="flex items-start">
                <span className="text-amber-600 mr-3 mt-1 flex-shrink-0">▸</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Communication */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FaComments className="text-primary-600 mr-3" />
          Communiquer avec un profil {profile.letters.join("")}
        </h3>
        <p className="text-gray-600 mb-6">
          À partager avec votre équipe : c&apos;est le mode d&apos;emploi relationnel qui découle de
          votre profil.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 rounded-xl p-6">
            <h4 className="font-bold text-emerald-900 mb-3">Ce qui fonctionne</h4>
            <ul className="space-y-2">
              {profile.communiquer.map((item) => (
                <li key={item} className="flex items-start text-gray-700">
                  <FaCheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-3">Ce qui bloque</h4>
            <ul className="space-y-2">
              {profile.aEviter.map((item) => (
                <li key={item} className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2 mt-1 flex-shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Moteurs / environnement / rôles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ce qui vous motive</h3>
          <ul className="space-y-2">
            {profile.moteurs.map((item) => (
              <li key={item} className="flex items-start text-gray-700">
                <span className="text-primary-600 mr-2">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Votre environnement idéal</h3>
          <ul className="space-y-2">
            {profile.environnement.map((item) => (
              <li key={item} className="flex items-start text-gray-700">
                <span className="text-primary-600 mr-2">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FaBriefcase className="text-primary-600 mr-2" />
            Rôles où ce profil s&apos;épanouit
          </h3>
          <ul className="space-y-2">
            {profile.roles.map((item) => (
              <li key={item} className="flex items-start text-gray-700">
                <span className="text-primary-600 mr-2">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Développement */}
      <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-xl border border-primary-100 p-8 md:p-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FaBullseye className="text-primary-600 mr-3" />
          Vos trois axes de développement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.developpement.map((item, i) => (
            <div key={item} className="bg-white rounded-xl p-6 border border-primary-100">
              <div className="w-8 h-8 rounded-lg bg-primary-600 text-white font-bold inline-flex items-center justify-center mb-3">
                {i + 1}
              </div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold inline-flex items-center justify-center"
          >
            Faire débriefer mon profil par un consultant
            <FaArrowRight className="ml-2" />
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold inline-flex items-center justify-center"
          >
            <FaPrint className="mr-2" />
            Imprimer / PDF
          </button>
          <button
            type="button"
            onClick={restart}
            className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold inline-flex items-center justify-center"
          >
            <FaRedo className="mr-2" />
            Repasser le test
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          Le DISC décrit des préférences comportementales, pas une valeur ni une aptitude. Il ne
          mesure ni l&apos;intelligence, ni les compétences, ni la santé mentale, et ne doit jamais
          servir seul de critère de recrutement ou de décision de carrière. Un profil évolue avec le
          contexte : un résultat obtenu en période de tension diffère d&apos;un résultat obtenu en
          période stable.
        </p>
      </div>
    </div>
  );
}
