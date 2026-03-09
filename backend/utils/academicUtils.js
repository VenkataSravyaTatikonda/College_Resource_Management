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
  if (total >= 90) return "O";
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

    /* ===== ATTENDANCE FINAL ===== */

    const att1 = Number(sub.attendanceMonth1 || 0);
    const att2 = Number(sub.attendanceMonth2 || 0);
    const att3 = Number(sub.attendanceMonth3 || 0);

    const attendanceFinal = Math.round((att1 + att2 + att3) / 3);

    /* ===== CIE CALCULATION ===== */

    let cie = 0;

    if (sub.type === "lab") {

      // LAB → Direct internal marks
      cie = Number(sub.cie || 0);

    } else {

      /* ===== THEORY ===== */

      const aat1 = Number(sub.aat1 || 0);
      const aat2 = Number(sub.aat2 || 0);
      const mid1 = Number(sub.mid1 || 0);
      const mid2 = Number(sub.mid2 || 0);

      // Test calculations
      const test1 = aat1 + mid1;
      const test2 = aat2 + mid2;

      const best = Math.max(test1, test2);
      const least = Math.min(test1, test2);

      // 75% + 25% rule
      const internal = (best * 0.75) + (least * 0.25); // out of 45

      // Convert to 30
      cie = Math.round((internal / 45) * 30);
    }

    /* ===== TOTAL ===== */

    const see = Number(sub.see || 0);
    let total=0;
    if(sub.type === "internship"){
      total = Number(sub.total || 0);
    } else {
      total = cie + see;
    }

    /* ===== GRADE ===== */

    const grade = getGrade(total);
    const gradePoint = getGradePoint(grade);

    const isBacklog = grade === "F";

    if (isBacklog) backlogCount++;

    /* ===== CREDITS ===== */

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

  /* ===== SGPA ===== */

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