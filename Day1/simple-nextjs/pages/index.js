import {useState} from "react";

const Form = ({Enrollment,name})=> {
  return(
    <div>
      <p >Enrollment no. : {Enrollment}</p>
      <p >Name : {name}</p>
    </div>
  )
}

export default function Home(){
  const [inputValue,setInputValue]=useState();
  const [students,setstudents]= useState([]);

  const newValue =()=>{
  if(inputValue=== "") return;
    
   const newStudent={
    Enrollment : students.length+1,
    name : inputValue
   }
   
   setstudents([...students,newStudent]);
  }

  return (
    <div>
      <input placeholder="Enter the name..."
             onChange={((e)=>setInputValue(e.target.value))} />
      <button onClick={newValue}>Add</button> 

      {students.map((student)=>(
        <Form name={student.name} Enrollment={student.Enrollment}/>
      ))}
    </div>
  )
 
}

