"use client";

import { DIMENSION_ORDER, DISC_DIMENSIONS } from "@/lib/disc/dimensions";
import type { DiscScores } from "@/lib/disc/scoring";

/* -------------------------------------------------------------------------- */
/* Histogramme horizontal : une barre par dimension, 0 à 100.                 */
/* Chaque barre porte sa lettre, son nom et sa valeur : l'identité ne repose  */
/* jamais sur la couleur seule.                                               */
/* -------------------------------------------------------------------------- */

const CHART_WIDTH = 520;
const LABEL_WIDTH = 132;
const VALUE_WIDTH = 46;
const ROW_HEIGHT = 44;
const BAR_HEIGHT = 22;
const TOP = 26;

export function DiscBarChart({
  scores,
  caption,
}: {
  scores: DiscScores;
  caption?: string;
}) {
  const plotLeft = LABEL_WIDTH;
  const plotWidth = CHART_WIDTH - LABEL_WIDTH - VALUE_WIDTH;
  const height = TOP + DIMENSION_ORDER.length * ROW_HEIGHT + 22;
  const x = (value: number) => plotLeft + (value / 100) * plotWidth;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={
          caption ??
          `Scores DISC : ${DIMENSION_ORDER.map(
            (d) => `${DISC_DIMENSIONS[d].name} ${scores[d]}`,
          ).join(", ")}`
        }
      >
        {/* Graduations discrètes */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line
              x1={x(tick)}
              y1={TOP - 8}
              x2={x(tick)}
              y2={height - 22}
              stroke={tick === 50 ? "#94a3b8" : "#e2e8f0"}
              strokeWidth={1}
              strokeDasharray={tick === 50 ? "4 3" : undefined}
            />
            <text
              x={x(tick)}
              y={height - 8}
              textAnchor="middle"
              className="fill-gray-400"
              fontSize="10"
            >
              {tick}
            </text>
          </g>
        ))}

        <text x={x(50)} y={TOP - 14} textAnchor="middle" className="fill-gray-500" fontSize="10">
          moyenne
        </text>

        {DIMENSION_ORDER.map((dimension, index) => {
          const info = DISC_DIMENSIONS[dimension];
          const value = scores[dimension];
          const y = TOP + index * ROW_HEIGHT;
          const barWidth = Math.max(3, (value / 100) * plotWidth);

          return (
            <g key={dimension}>
              <title>{`${info.letter} — ${info.name} : ${value}/100`}</title>
              <text
                x={0}
                y={y + BAR_HEIGHT / 2 + 1}
                dominantBaseline="middle"
                className="fill-gray-900"
                fontSize="13"
                fontWeight="700"
              >
                {info.letter}
              </text>
              <text
                x={20}
                y={y + BAR_HEIGHT / 2 + 1}
                dominantBaseline="middle"
                className="fill-gray-600"
                fontSize="12"
              >
                {info.name}
              </text>
              {/* Piste de fond */}
              <rect
                x={plotLeft}
                y={y}
                width={plotWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill="#f1f5f9"
              />
              <rect
                x={plotLeft}
                y={y}
                width={barWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill={info.color}
              />
              <text
                x={plotLeft + plotWidth + 8}
                y={y + BAR_HEIGHT / 2 + 1}
                dominantBaseline="middle"
                className="fill-gray-900"
                fontSize="12"
                fontWeight="600"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && (
        <figcaption className="mt-2 text-xs text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Carte DISC : positionnement sur les deux axes fondateurs du modèle.        */
/*  - axe horizontal : orientation tâches / personnes                         */
/*  - axe vertical   : rythme réservé / actif                                 */
/* -------------------------------------------------------------------------- */

const MAP_SIZE = 360;
const MAP_PAD = 34;

export function DiscQuadrant({ scores }: { scores: DiscScores }) {
  const inner = MAP_SIZE - MAP_PAD * 2;
  const center = MAP_PAD + inner / 2;

  // Écarts normalisés dans [-1, 1]
  const people = (scores.I + scores.S - scores.D - scores.C) / 200;
  const active = (scores.D + scores.I - scores.S - scores.C) / 200;

  const px = center + people * (inner / 2) * 0.9;
  const py = center - active * (inner / 2) * 0.9;

  const quadrants = [
    { letter: "D" as const, x: MAP_PAD, y: MAP_PAD },
    { letter: "I" as const, x: center, y: MAP_PAD },
    { letter: "C" as const, x: MAP_PAD, y: center },
    { letter: "S" as const, x: center, y: center },
  ];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        className="w-full h-auto max-w-sm mx-auto"
        role="img"
        aria-label={`Position sur la carte DISC : orientation ${
          people >= 0 ? "personnes" : "tâches"
        }, rythme ${active >= 0 ? "actif" : "réservé"}`}
      >
        {quadrants.map((q) => {
          const info = DISC_DIMENSIONS[q.letter];
          return (
            <g key={q.letter}>
              <rect
                x={q.x + 1}
                y={q.y + 1}
                width={inner / 2 - 2}
                height={inner / 2 - 2}
                rx={6}
                fill={info.softBg}
              />
              <text
                x={q.x + inner / 4}
                y={q.y + inner / 4 - 6}
                textAnchor="middle"
                fontSize="22"
                fontWeight="700"
                fill={info.color}
              >
                {info.letter}
              </text>
              <text
                x={q.x + inner / 4}
                y={q.y + inner / 4 + 14}
                textAnchor="middle"
                fontSize="11"
                className="fill-gray-600"
              >
                {info.name}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={MAP_PAD}
          y1={center}
          x2={MAP_SIZE - MAP_PAD}
          y2={center}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
        <line
          x1={center}
          y1={MAP_PAD}
          x2={center}
          y2={MAP_SIZE - MAP_PAD}
          stroke="#cbd5e1"
          strokeWidth={1}
        />

        {/* Libellés des axes */}
        <text x={center} y={14} textAnchor="middle" fontSize="10" className="fill-gray-500">
          Rythme actif
        </text>
        <text
          x={center}
          y={MAP_SIZE - 4}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500"
        >
          Rythme réservé
        </text>
        <text
          x={10}
          y={center}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500"
          transform={`rotate(-90 10 ${center})`}
        >
          Orientation tâches
        </text>
        <text
          x={MAP_SIZE - 10}
          y={center}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-500"
          transform={`rotate(90 ${MAP_SIZE - 10} ${center})`}
        >
          Orientation personnes
        </text>

        {/* Position : anneau blanc de 2px pour rester lisible sur les fonds colorés */}
        <circle cx={px} cy={py} r={10} fill="#0f172a" stroke="#ffffff" strokeWidth={3}>
          <title>Votre position sur la carte DISC</title>
        </circle>
      </svg>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Vue tabulaire des trois graphiques (accessibilité et impression)           */
/* -------------------------------------------------------------------------- */

export function DiscScoreTable({
  rows,
}: {
  rows: { label: string; scores: DiscScores }[];
}) {
  return (
    <table className="w-full text-sm border-collapse">
      <caption className="sr-only">Scores DISC détaillés par graphique</caption>
      <thead>
        <tr className="border-b border-gray-200">
          <th scope="col" className="text-left py-2 pr-4 font-semibold text-gray-700">
            Graphique
          </th>
          {DIMENSION_ORDER.map((dimension) => (
            <th
              key={dimension}
              scope="col"
              className="text-right py-2 px-2 font-semibold text-gray-700"
            >
              {dimension} — {DISC_DIMENSIONS[dimension].name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-gray-100">
            <th scope="row" className="text-left py-2 pr-4 font-medium text-gray-600">
              {row.label}
            </th>
            {DIMENSION_ORDER.map((dimension) => (
              <td key={dimension} className="text-right py-2 px-2 tabular-nums text-gray-900">
                {row.scores[dimension]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
