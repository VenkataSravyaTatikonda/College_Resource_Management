import React from "react";
import AcademicForm from "./AcademicForm";
import AcademicView from "./AcademicView";

const MentorTab = ({ role, studentId }) => {
  return (
    <div>
      {role === "student" ? (
        <AcademicForm studentId={studentId}/>
      ) : (
        <AcademicView studentId={studentId} />
      )}
    </div>
  );
};

export default MentorTab;
