const getGradePoint = (grade) => {
  switch (grade) {
    case "O": return 10;
    case "A+": return 9;
    case "A": return 8;
    case "B+": return 7;
    case "B": return 6;
    case "C": return 5;
    case "F": return 0;
    default: return 0;
  }
};

const getGrade = (total) => {
  if (total >= 90) return "O";   // ✅ fixed
  if (total >= 80) return "A+";
  if (total >= 70) return "A";
  if (total >= 60) return "B+";
  if (total >= 50) return "B";
  if (total >= 40) return "C";
  return "F";
};

const processSubjects = (subjects) => {
  let totalCredits = 0;
  let weightedSum = 0;
  let backlogCount = 0;

  const updatedSubjects = subjects.map((sub) => {

    /* ===== ATTENDANCE FINAL (Average of 3 months) ===== */
    const att1 = Number(sub.attendanceMonth1 || 0);
    const att2 = Number(sub.attendanceMonth2 || 0);
    const att3 = Number(sub.attendanceMonth3 || 0);

    const attendanceFinal = Math.round((att1 + att2 + att3) / 3);

    /* ===== CIE CALCULATION (Scaled to 30) ===== */
    const aat1 = Number(sub.aat1 || 0);
    const aat2 = Number(sub.aat2 || 0);
    const mid1 = Number(sub.mid1 || 0);
    const mid2 = Number(sub.mid2 || 0);

    const bestAAT = Math.max(aat1, aat2);
    const bestMID = Math.max(mid1, mid2);

    const internalRaw = bestAAT + bestMID;  // out of 40
    const cie = Math.round((internalRaw / 40) * 30);

    /* ===== TOTAL ===== */
    const see = Number(sub.see || 0);
    const total = cie + see;

    /* ===== GRADE & BACKLOG ===== */
    const grade = getGrade(total);
    const gradePoint = getGradePoint(grade);

    const isBacklog = grade === "F";

    if (isBacklog) {
      backlogCount++;
    }

    const credits = Number(sub.credits || 0);

    totalCredits += credits;
    weightedSum += gradePoint * credits;

    return {
      ...sub,
      attendanceFinal,
      cie,
      total,
      grade,
      isBacklog,
    };
  });

  const sgpa =
    totalCredits === 0
      ? 0
      : Number((weightedSum / totalCredits).toFixed(2));

  return {
    updatedSubjects,
    sgpa,
    totalCredits,
    backlogCount,
  };
};

module.exports = { processSubjects };