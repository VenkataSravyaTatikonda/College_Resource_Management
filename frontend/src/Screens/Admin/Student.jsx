import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";

import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";

const Student = ({ setSelectedStudentId, setSelectedMenu }) => {

const userToken = localStorage.getItem("userToken");

const [searchParams, setSearchParams] = useState({
enrollmentNo:"",
name:"",
semester:"",
branch:""
});

const [students,setStudents]=useState([]);
const [branches,setBranches]=useState([]);
const [dataLoading,setDataLoading]=useState(false);
const [hasSearched,setHasSearched]=useState(false);

const [isDeleteConfirmOpen,setIsDeleteConfirmOpen]=useState(false);
const [deleteId,setDeleteId]=useState(null);

const [showAddForm,setShowAddForm]=useState(false);

/* IMAGE STATE */
const [file,setFile]=useState(null);

const [formData,setFormData]=useState({

firstName:"",
middleName:"",
lastName:"",
email:"",
phone:"",
semester:"",
branchId:"",
gender:"",
dob:"",
bloodGroup:"",

address:"",
city:"",
state:"",
pincode:"",
country:"",

emergencyContact:{
name:"",
relationship:"",
phone:""
}

});



/* ================= LOAD BRANCHES ================= */

const fetchBranches = useCallback(async()=>{

try{

const response = await axiosWrapper.get("/branch",{
headers:{Authorization:`Bearer ${userToken}`}
});

if(response.data.success){
setBranches(response.data.data);
}

}catch{
toast.error("Error fetching branches");
}

},[userToken]);

useEffect(()=>{
fetchBranches();
},[fetchBranches]);



/* ================= SEARCH ================= */

const handleInputChange=(e)=>{

const {name,value}=e.target;

setSearchParams(prev=>({
...prev,
[name]:value
}));

};

const searchStudents=async(e)=>{

e.preventDefault();

if(
!searchParams.enrollmentNo &&
!searchParams.name &&
!searchParams.semester &&
!searchParams.branch
){
toast.error("Please select at least one filter");
return;
}

setDataLoading(true);
setHasSearched(true);

try{

const response=await axiosWrapper.post(
"/student/search",
searchParams,
{
headers:{Authorization:`Bearer ${userToken}`}
}
);

if(response.data.success){
setStudents(response.data.data || []);
}

}catch{
toast.error("Error searching students");
setStudents([]);
}
finally{
setDataLoading(false);
}

};



/* ================= DELETE ================= */

const deleteStudentHandler=(id)=>{
setDeleteId(id);
setIsDeleteConfirmOpen(true);
};

const confirmDelete=async()=>{

try{

const response=await axiosWrapper.delete(`/student/${deleteId}`,{
headers:{Authorization:`Bearer ${userToken}`}
});

if(response.data.success){

toast.success("Student deleted");

setStudents(prev=>prev.filter(
student=>student._id!==deleteId
));

}

}catch{
toast.error("Error deleting student");
}

setIsDeleteConfirmOpen(false);

};



/* ================= ADD STUDENT ================= */

const handleFormInputChange=(field,value)=>{

setFormData(prev=>({

...prev,
[field]:value

}));

};

const handleEmergencyChange=(field,value)=>{

setFormData(prev=>({

...prev,

emergencyContact:{
...prev.emergencyContact,
[field]:value
}

}));

};



const addStudentHandler=async()=>{

try{

toast.loading("Adding Student...");

const formDataToSend=new FormData();

/* ADD NORMAL FIELDS */

for(const key in formData){

if(key==="emergencyContact"){

for(const subKey in formData.emergencyContact){

formDataToSend.append(
`emergencyContact[${subKey}]`,
formData.emergencyContact[subKey]
);

}

}else{

formDataToSend.append(key,formData[key]);

}

}

/* ADD IMAGE */

if(file){
formDataToSend.append("file",file);
}

const response=await axiosWrapper.post(
"/student/register",
formDataToSend,
{
headers:{
"Content-Type":"multipart/form-data",
Authorization:`Bearer ${userToken}`
}
}
);

toast.dismiss();

if(response.data.success){

toast.success("Student added successfully");

setShowAddForm(false);

}

}catch{

toast.dismiss();
toast.error("Error adding student");

}

};



return(

<div className="w-full mx-auto mt-10 flex flex-col mb-10">

{/* HEADER */}

<div className="flex justify-between items-center">

<Heading title="Student Management"/>

<CustomButton onClick={()=>setShowAddForm(true)}>
<IoMdAdd/> Add Student
</CustomButton>

</div>



{/* SEARCH FORM */}

<form onSubmit={searchStudents} className="my-6">

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

<input
type="text"
name="enrollmentNo"
placeholder="Enrollment Number"
value={searchParams.enrollmentNo}
onChange={handleInputChange}
className="border p-2 rounded"
/>

<input
type="text"
name="name"
placeholder="Student Name"
value={searchParams.name}
onChange={handleInputChange}
className="border p-2 rounded"
/>

<select
name="semester"
value={searchParams.semester}
onChange={handleInputChange}
className="border p-2 rounded"
>
<option value="">Semester</option>
{[1,2,3,4,5,6,7,8].map(sem=>(
<option key={sem} value={sem}>
Semester {sem}
</option>
))}
</select>

<select
name="branch"
value={searchParams.branch}
onChange={handleInputChange}
className="border p-2 rounded"
>
<option value="">Branch</option>

{branches.map(branch=>(
<option key={branch._id} value={branch._id}>
{branch.name}
</option>
))}

</select>

</div>

<div className="mt-4">

<CustomButton type="submit">
{dataLoading?"Searching...":"Search"}
</CustomButton>

</div>

</form>



{/* RESULTS */}

{hasSearched && students.length===0 &&(
<NoData title="No students found"/>
)}

{students.length>0 &&(

<div className="overflow-x-auto mt-6">

<table className="min-w-full bg-white border">

<thead>

<tr className="bg-gray-100">

<th className="border p-2">Name</th>
<th className="border p-2">Enrollment</th>
<th className="border p-2">Semester</th>
<th className="border p-2">Branch</th>
<th className="border p-2">Actions</th>

</tr>

</thead>

<tbody>

{students.map(student=>(

<tr key={student._id}>

<td className="border p-2">
{student.firstName} {student.lastName}
</td>

<td className="border p-2">
{student.enrollmentNo}
</td>

<td className="border p-2">
{student.semester}
</td>

<td className="border p-2">
{student.branchId?.name}
</td>

<td className="border p-2 text-center">

<div className="flex gap-2 justify-center">

<CustomButton
variant="primary"
onClick={()=>{

setSelectedStudentId(student._id);
setSelectedMenu("mentor");

}}
>
View Academic
</CustomButton>

<CustomButton
variant="danger"
onClick={()=>deleteStudentHandler(student._id)}
>
<MdOutlineDelete/>
</CustomButton>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

)}



{/* DELETE MODAL */}

{isDeleteConfirmOpen &&(

<DeleteConfirm
onConfirm={confirmDelete}
onCancel={()=>setIsDeleteConfirmOpen(false)}
/>

)}



{/* ADD STUDENT POPUP */}

{showAddForm &&(

<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

<div className="bg-white p-6 rounded w-[700px] max-h-[90vh] overflow-y-auto">

<div className="flex justify-between mb-4">

<h2 className="text-xl font-semibold">
Add Student
</h2>

<IoMdClose
className="cursor-pointer text-xl"
onClick={()=>setShowAddForm(false)}
/>

</div>



{/* PROFILE IMAGE */}

<h3 className="font-semibold mb-2">
Profile Photo
</h3>

<input
type="file"
accept="image/*"
className="border p-2 w-full mb-4"
onChange={(e)=>setFile(e.target.files[0])}
/>



{/* PERSONAL INFO */}

<h3 className="font-semibold mb-2">
Personal Information
</h3>

<div className="grid grid-cols-2 gap-3">

<input placeholder="First Name" className="border p-2"
onChange={e=>handleFormInputChange("firstName",e.target.value)}
/>

<input placeholder="Middle Name" className="border p-2"
onChange={e=>handleFormInputChange("middleName",e.target.value)}
/>

<input placeholder="Last Name" className="border p-2"
onChange={e=>handleFormInputChange("lastName",e.target.value)}
/>

<input placeholder="Email" className="border p-2"
onChange={e=>handleFormInputChange("email",e.target.value)}
/>

<input placeholder="Phone" className="border p-2"
onChange={e=>handleFormInputChange("phone",e.target.value)}
/>

<select className="border p-2"
onChange={e=>handleFormInputChange("gender",e.target.value)}
>
<option>Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
<option value="other">Other</option>
</select>

<input type="date" className="border p-2"
onChange={e=>handleFormInputChange("dob",e.target.value)}
/>

<input placeholder="Blood Group" className="border p-2"
onChange={e=>handleFormInputChange("bloodGroup",e.target.value)}
/>

</div>



{/* ADDRESS */}

<h3 className="font-semibold mt-4 mb-2">
Address Information
</h3>

<div className="grid grid-cols-2 gap-3">

<input placeholder="Address" className="border p-2"
onChange={e=>handleFormInputChange("address",e.target.value)}
/>

<input placeholder="City" className="border p-2"
onChange={e=>handleFormInputChange("city",e.target.value)}
/>

<input placeholder="State" className="border p-2"
onChange={e=>handleFormInputChange("state",e.target.value)}
/>

<input placeholder="Pincode" className="border p-2"
onChange={e=>handleFormInputChange("pincode",e.target.value)}
/>

<input placeholder="Country" className="border p-2"
onChange={e=>handleFormInputChange("country",e.target.value)}
/>

<select className="border p-2"
onChange={e=>handleFormInputChange("semester",e.target.value)}
>
<option>Semester</option>
{[1,2,3,4,5,6,7,8].map(s=>(
<option key={s}>{s}</option>
))}
</select>

<select className="border p-2"
onChange={e=>handleFormInputChange("branchId",e.target.value)}
>
<option>Branch</option>

{branches.map(b=>(
<option key={b._id} value={b._id}>
{b.name}
</option>
))}

</select>

</div>



{/* EMERGENCY CONTACT */}

<h3 className="font-semibold mt-4 mb-2">
Emergency Contact
</h3>

<div className="grid grid-cols-2 gap-3">

<input placeholder="Name" className="border p-2"
onChange={e=>handleEmergencyChange("name",e.target.value)}
/>

<input placeholder="Relationship" className="border p-2"
onChange={e=>handleEmergencyChange("relationship",e.target.value)}
/>

<input placeholder="Phone" className="border p-2"
onChange={e=>handleEmergencyChange("phone",e.target.value)}
/>

</div>



<div className="mt-5">

<CustomButton onClick={addStudentHandler}>
Save Student
</CustomButton>

</div>

</div>

</div>

)}

</div>

);

};

export default Student;