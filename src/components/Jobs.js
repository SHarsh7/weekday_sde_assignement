import React, { useEffect } from 'react'
import JobCard from './JobCard'

const Jobs = ({jobsData}) => {
    useEffect(()=>{
        console.log(jobsData)
    },[jobsData])
  return (
          
     <>

    {jobsData.map((job,index) => (
        <JobCard key={index} job={job} />
      ))}
     </> 
  )
}

export default Jobs