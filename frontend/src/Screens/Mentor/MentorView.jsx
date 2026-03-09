import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";

const MentorView = ({ studentId }) => {

  const [data, setData] = useState(null);

  const token = localStorage.getItem("userToken");

  useEffect(() => {

    fetchMentorDetails();

  }, []);

  const fetchMentorDetails = async () => {

    try {

      const res = await axiosWrapper.get(
        `/mentor/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {

        setData(res.data.data);

      }

    } catch (error) {

      console.log("Error loading mentor data", error);

    }

  };

  if (!data) return <p className="p-6">Loading Mentor Details...</p>;

  return (

  <div className="p-6">

  <h2 className="text-2xl font-bold mb-6">
  Mentor Details
  </h2>

  {/* SCHOLARSHIPS */}

  <div className="bg-white shadow-md rounded-lg p-5 mb-6">

  <h3 className="text-lg font-semibold mb-4">
  Scholarships / Awards
  </h3>

  {data.scholarships?.length ? (

  data.scholarships.map((item,index)=>(
    
  <div key={index} className="border-b py-2">

  <p>
  <b>Title:</b> {item.title}
  </p>

  {item.certificate && (

  <a
  href={`http://localhost:4000/media/${item.certificate}`}
  target="_blank"
  rel="noreferrer"
  className="text-blue-600 underline"
  >
  Download Certificate
  </a>

  )}

  </div>

  ))

  ) : (

  <p>No scholarships added</p>

  )}

  </div>

  {/* INTERNSHIPS */}

  <div className="bg-white shadow-md rounded-lg p-5 mb-6">

  <h3 className="text-lg font-semibold mb-4">
  Internship / Industrial Training
  </h3>

  {data.internships?.length ? (

  data.internships.map((item,index)=>(
    
  <div key={index} className="border-b py-2">

  <p>
  <b>Company:</b> {item.company}
  </p>

  <p>
  <b>Date:</b> {item.startDate?.slice(0,10)} → {item.endDate?.slice(0,10)}
  </p>

  {item.certificate && (

  <a
  href={`http://localhost:4000/media/${item.certificate}`}
  target="_blank"
  rel="noreferrer"
  className="bg-blue-500 text-white px-3 py-1 rounded inline-block mt-2"
  >
  Download Certificate
  </a>

  )}

  </div>

  ))

  ) : (

  <p>No internships added</p>

  )}

  </div>

  {/* PERSONAL DETAILS */}

  <div className="bg-white shadow-md rounded-lg p-5">

  <h3 className="text-lg font-semibold mb-4">
  Personal Details
  </h3>

  <div className="grid grid-cols-2 gap-6">

  <div>

  <p className="font-semibold mb-1">
  Hobbies
  </p>

  <ul className="list-disc ml-5">

  {data.hobbies?.length
    ? data.hobbies.map((item,i)=>(
      <li key={i}>{item}</li>
      ))
    : <li>-</li>
  }

  </ul>

  </div>

  <div>

  <p className="font-semibold mb-1">
  Strength
  </p>

  <ul className="list-disc ml-5">

  {data.strength?.length
    ? data.strength.map((item,i)=>(
      <li key={i}>{item}</li>
      ))
    : <li>-</li>
  }

  </ul>

  </div>

  <div>

  <p className="font-semibold mb-1">
  Weakness
  </p>

  <ul className="list-disc ml-5">

  {data.weakness?.length
    ? data.weakness.map((item,i)=>(
      <li key={i}>{item}</li>
      ))
    : <li>-</li>
  }

  </ul>

  </div>

  <div>

  <p className="font-semibold mb-1">
  Health Record
  </p>

  <ul className="list-disc ml-5">

  {data.healthRecord?.length
    ? data.healthRecord.map((item,i)=>(
      <li key={i}>{item}</li>
      ))
    : <li>-</li>
  }

  </ul>

  </div>

  </div>

  <div className="mt-4">

  <p className="font-semibold">
  Other Information
  </p>

  <p>{data.otherInfo || "-"}</p>

  </div>

  </div>

  </div>

  );

};

export default MentorView;