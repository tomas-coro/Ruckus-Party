export interface Standing {
  readonly playerId: string;
  readonly score: number;
  readonly rank: number;
}

export function rankStandings(scores: Readonly<Record<string, number>>): readonly Standing[] {
  const sorted = Object.entries(scores).sort(
    ([firstId, firstScore], [secondId, secondScore]) =>
      secondScore - firstScore || firstId.localeCompare(secondId),
  );

  return sorted.map(([playerId, score], index) => {
    const previous = sorted[index - 1];
    const rank = previous?.[1] === score
      ? (sorted.findIndex(([, candidateScore]) => candidateScore === score) + 1)
      : index + 1;
    return { playerId, score, rank };
  });
}
