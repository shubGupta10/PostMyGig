export interface SkillHighlightSegment {
  text: string
  highlight: boolean
}

export interface SkillMatch {
  skill: string
  score: number
  segments: SkillHighlightSegment[]
}

export function matchAndScoreSkill(skill: string, query: string): SkillMatch | null {
  const trimmed = query.trim()
  if (!trimmed) {
    return {
      skill,
      score: 1,
      segments: [{ text: skill, highlight: false }],
    }
  }

  const sLower = skill.toLowerCase()
  const qLower = trimmed.toLowerCase()

  if (sLower === qLower) {
    return {
      skill,
      score: 1000,
      segments: [{ text: skill, highlight: true }],
    }
  }

  if (sLower.startsWith(qLower)) {
    return {
      skill,
      score: 800 - (skill.length - trimmed.length),
      segments: [
        { text: skill.slice(0, trimmed.length), highlight: true },
        { text: skill.slice(trimmed.length), highlight: false },
      ].filter((s) => s.text.length > 0),
    }
  }

  const wordRegex = /[A-Za-z0-9]+/g
  let match: RegExpExecArray | null
  let bestWordIndex = -1

  while ((match = wordRegex.exec(skill)) !== null) {
    const word = match[0].toLowerCase()
    if (word.startsWith(qLower)) {
      bestWordIndex = match.index
      break
    }
  }

  if (bestWordIndex !== -1) {
    const start = bestWordIndex
    const end = start + trimmed.length
    return {
      skill,
      score: 600 - start,
      segments: [
        { text: skill.slice(0, start), highlight: false },
        { text: skill.slice(start, end), highlight: true },
        { text: skill.slice(end), highlight: false },
      ].filter((s) => s.text.length > 0),
    }
  }

  const subIndex = sLower.indexOf(qLower)
  if (subIndex !== -1) {
    return {
      skill,
      score: 400 - subIndex,
      segments: [
        { text: skill.slice(0, subIndex), highlight: false },
        { text: skill.slice(subIndex, subIndex + trimmed.length), highlight: true },
        { text: skill.slice(subIndex + trimmed.length), highlight: false },
      ].filter((s) => s.text.length > 0),
    }
  }

  const words = skill.split(/[\s.\-_/]+/).filter(Boolean)
  const initials = words.map((w) => w[0].toLowerCase()).join("")
  if (initials.startsWith(qLower)) {
    return {
      skill,
      score: 300,
      segments: [{ text: skill, highlight: false }],
    }
  }

  let qIdx = 0
  const matchedIndices: number[] = []
  for (let i = 0; i < sLower.length && qIdx < qLower.length; i++) {
    if (sLower[i] === qLower[qIdx]) {
      matchedIndices.push(i)
      qIdx++
    }
  }

  if (qIdx === qLower.length) {
    let consecutiveBonus = 0
    for (let i = 1; i < matchedIndices.length; i++) {
      if (matchedIndices[i] === matchedIndices[i - 1] + 1) {
        consecutiveBonus += 20
      }
    }
    const score = 100 + consecutiveBonus - (skill.length - trimmed.length)

    const segments: SkillHighlightSegment[] = []
    const indexSet = new Set(matchedIndices)
    for (let i = 0; i < skill.length; i++) {
      const isHighlighted = indexSet.has(i)
      if (segments.length === 0 || segments[segments.length - 1].highlight !== isHighlighted) {
        segments.push({ text: skill[i], highlight: isHighlighted })
      } else {
        segments[segments.length - 1].text += skill[i]
      }
    }

    return { skill, score, segments }
  }

  return null
}
