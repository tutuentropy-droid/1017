import type {
  Song,
  Collection,
  MemoryTag,
  MusicDNAReport,
  DNAPersonalityType,
  StyleTag,
  MusicStyle,
} from '@/types';
import { mockSongs } from '@/data/songs';
import { memoryTags } from '@/data/memoryTags';
import {
  styleTags,
  personalityTypes,
  songStyleMap,
  getRecommendedSongs,
} from '@/data/musicDNA';

interface AnalysisInput {
  userId: string;
  collections: Collection[];
  songTagAssociations?: Record<string, string[]>;
}

const analyzeStyles = (songs: Song[]): { style: StyleTag; percentage: number }[] => {
  const styleCount: Record<MusicStyle, number> = {
    rock: 0,
    pop: 0,
    folk: 0,
    cantopop: 0,
    mandopop: 0,
    ballad: 0,
    campus: 0,
  };

  songs.forEach((song) => {
    const styles = songStyleMap[song.id] || ['pop'];
    styles.forEach((s) => {
      styleCount[s] = (styleCount[s] || 0) + 1;
    });
  });

  const total = Object.values(styleCount).reduce((a, b) => a + b, 0) || 1;
  const results = styleTags
    .map((tag) => ({
      style: tag,
      percentage: Math.round((styleCount[tag.id] / total) * 100),
    }))
    .filter((r) => r.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  return results;
};

const analyzeDecade = (songs: Song[]): { decade: string; percentage: number } => {
  if (songs.length === 0) {
    return { decade: '90s', percentage: 50 };
  }
  const count80s = songs.filter((s) => s.year >= 1980 && s.year <= 1989).length;
  const count90s = songs.filter((s) => s.year >= 1990 && s.year <= 1999).length;
  const total = songs.length;
  const pct80 = Math.round((count80s / total) * 100);
  const pct90 = Math.round((count90s / total) * 100);
  return pct80 > pct90
    ? { decade: '80s', percentage: pct80 }
    : { decade: '90s', percentage: pct90 };
};

const analyzeTags = (
  _songs: Song[],
  songTagAssociations?: Record<string, string[]>
): { tag: MemoryTag; count: number }[] => {
  const tagCount: Record<string, number> = {};

  if (songTagAssociations) {
    Object.values(songTagAssociations).forEach((tagIds) => {
      tagIds.forEach((tid) => {
        tagCount[tid] = (tagCount[tid] || 0) + 1;
      });
    });
  }

  const results = Object.entries(tagCount)
    .map(([tagId, count]) => {
      const tag = memoryTags.find((t) => t.id === tagId);
      return tag ? { tag, count } : null;
    })
    .filter(Boolean) as { tag: MemoryTag; count: number }[];

  results.sort((a, b) => b.count - a.count);
  return results.slice(0, 5);
};

const analyzeArtists = (songs: Song[]): { artist: string; count: number }[] => {
  const artistCount: Record<string, number> = {};
  songs.forEach((song) => {
    const artistNames = song.artist.split(/\s*\/\s*/);
    artistNames.forEach((name) => {
      artistCount[name] = (artistCount[name] || 0) + 1;
    });
  });
  return Object.entries(artistCount)
    .map(([artist, count]) => ({ artist, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};

const calculateAvgYear = (songs: Song[]): number => {
  if (songs.length === 0) return 1992;
  const sum = songs.reduce((acc, s) => acc + s.year, 0);
  return Math.round(sum / songs.length);
};

const determinePersonality = (
  styleAnalysis: { style: StyleTag; percentage: number }[],
  decadeAnalysis: { decade: string; percentage: number }
): DNAPersonalityType => {
  const topStyle = styleAnalysis[0]?.style.id;
  const decade = decadeAnalysis.decade;
  const decadeBalanced = Math.abs(decadeAnalysis.percentage - 50) < 20;

  const scored = personalityTypes.map((p) => {
    let score = 0;

    switch (p.id) {
      case 'rock-rebel':
        if (topStyle === 'rock') score += 10;
        if (decade === '80s') score += 5;
        break;
      case 'campus-poet':
        if (topStyle === 'campus' || topStyle === 'folk') score += 10;
        if (decadeBalanced) score += 3;
        break;
      case 'cantonese-classic':
        if (topStyle === 'cantopop') score += 10;
        if (decade === '90s') score += 5;
        break;
      case 'ballad-dreamer':
        if (topStyle === 'ballad') score += 10;
        if (decade === '90s') score += 4;
        break;
      case 'folk-wanderer':
        if (topStyle === 'folk') score += 8;
        if (decade === '80s') score += 5;
        break;
      case 'nostalgia-archivist':
        if (decadeBalanced) score += 10;
        if (styleAnalysis.length >= 3) score += 5;
        break;
      case 'pop-connoisseur':
        if (topStyle === 'pop' || topStyle === 'mandopop') score += 10;
        if (decade === '90s') score += 4;
        break;
    }

    score += Math.random() * 2;
    return { personality: p, score };
  });

  return [...scored].sort((a, b) => b.score - a.score)[0].personality;
};

export const generateMusicDNAReport = (input: AnalysisInput): MusicDNAReport => {
  const collectedSongs = input.collections
    .map((c) => mockSongs.find((s) => s.id === c.songId))
    .filter(Boolean) as Song[];

  const useSongs = collectedSongs.length > 0 ? collectedSongs : mockSongs.slice(0, 8);

  const styleAnalysis = analyzeStyles(useSongs);
  const decadeAnalysis = analyzeDecade(useSongs);
  const tagAnalysis = analyzeTags(useSongs, input.songTagAssociations);
  const artistAnalysis = analyzeArtists(useSongs);
  const avgYear = calculateAvgYear(useSongs);
  const personality = determinePersonality(styleAnalysis, decadeAnalysis);

  const dominantStyleIds = styleAnalysis.slice(0, 3).map((s) => s.style.id);
  const recommendations = getRecommendedSongs(
    useSongs.map((s) => s.id),
    dominantStyleIds,
    avgYear,
    mockSongs,
    4
  );

  return {
    personality,
    dominantStyles: styleAnalysis,
    dominantDecade: decadeAnalysis,
    dominantTags: tagAnalysis,
    topCollectedArtists: artistAnalysis,
    avgYear,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
};
