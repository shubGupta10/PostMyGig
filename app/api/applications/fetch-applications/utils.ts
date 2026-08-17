export function parseSkills(skills: string | string[] | undefined): string[] {
  if (!skills) return [];
  const rawList = Array.isArray(skills) ? skills : [skills];
  const result: string[] = [];
  rawList.forEach((item) => {
    if (typeof item === "string") {
      // Split by comma or spaces
      item.split(/[,\s]+/).forEach((s) => {
        const trimmed = s.toLowerCase().trim();
        if (trimmed) result.push(trimmed);
      });
    }
  });
  return Array.from(new Set(result));
}

export function calculateRecommendations(applications: any[], requiredSkills: string[]) {
  const normalizedRequired = parseSkills(requiredSkills);

  const scoredApplications = applications.map((app: any) => {
    const applicantSkills = parseSkills(app.applicant?.skills);
    const portfolioProjects = app.applicant?.portfolioProjects || [];

    const matchingSkills: string[] = [];
    normalizedRequired.forEach((reqSkill) => {
      if (applicantSkills.some((skill) => skill.includes(reqSkill) || reqSkill.includes(skill))) {
        matchingSkills.push(reqSkill.charAt(0).toUpperCase() + reqSkill.slice(1));
      }
    });

    const matchingProjects: string[] = [];
    portfolioProjects.forEach((project: any) => {
      const projectTags = parseSkills(project.tags);
      const hasMatchingTag = normalizedRequired.some((reqSkill) =>
        projectTags.some((tag) => tag.includes(reqSkill) || reqSkill.includes(tag))
      );
      if (hasMatchingTag) {
        matchingProjects.push(project.title);
      }
    });

    const hasLiveProof = Boolean(app.bestWorkLink && app.bestWorkLink.trim().length > 0);

    let score = 0;

    if (normalizedRequired.length > 0) {
      const skillRatio = matchingSkills.length / normalizedRequired.length;
      score += Math.min(40, Math.round(skillRatio * 40));
    } else if (applicantSkills.length > 0) {
      score += 20;
    }

    if (matchingProjects.length > 0) {
      score += Math.min(30, matchingProjects.length * 15);
    } else if (portfolioProjects.length > 0) {
      score += 10;
    }

    if (hasLiveProof) {
      score += 20;
    }

    if (app.applicant?.isVerified) score += 5;
    if (app.applicant?.bio && app.applicant.bio.length >= 30) score += 5;

    return {
      ...app,
      matchDetails: {
        score: Math.min(100, score),
        matchingSkills,
        matchingProjects,
        hasLiveProof,
      },
    };
  });

  // Sort descending by score
  const sorted = scoredApplications.sort((a: any, b: any) => {
    if (a.status === "accepted" && b.status !== "accepted") return -1;
    if (b.status === "accepted" && a.status !== "accepted") return 1;
    return (b.matchDetails?.score || 0) - (a.matchDetails?.score || 0);
  });

  const recommendedApplications: any[] = [];
  const restApplications: any[] = [];

  sorted.forEach((app: any) => {
    // Only high match score (>= 60%) qualifies as recommended
    if ((app.matchDetails?.score || 0) >= 60) {
      recommendedApplications.push(app);
    } else {
      restApplications.push(app);
    }
  });

  return {
    recommendedApplications,
    restApplications,
  };
}
