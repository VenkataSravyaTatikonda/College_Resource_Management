import React from "react";
import AcademicForm from "./AcademicForm";
import AcademicView from "./AcademicView";
import MentorForm from "./MentorForm";
import MentorView from "./MentorView";

const MentorTab = ({ role, studentId }) => {
  return (
    <div>

      {role === "student" ? (
        <>
          <AcademicForm studentId={studentId} />
          <MentorForm studentId={studentId} />
        </>
      ) : (
        <>
          <AcademicView studentId={studentId} />
          <MentorView studentId={studentId} />
        </>
      )}

    </div>
  );
};

export default MentorTab;