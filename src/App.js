import './App.css';
import { useState, useEffect,useCallback } from "react";
import JobCard from './components/JobCard';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';

function App() {
  const [jobs, setJobs] = useState([]); // State for fetching data from api
  const [offset, setOffset] = useState(0);  // State of fetching data from api for next request
  const [records, setRecords] = useState([]); // State for filtering data from api
  const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location
  const [selectedRole, setSelectedRole] = useState(""); // State for selected role
  const [locations, setLocations] = useState([]); // State for locations
  const [roles, setRoles] = useState([]); // State for roles
  const [noDataMessage, setNoDataMessage] = useState(""); // State for no data/jobs message
  const [searchQuery, setSearchQuery] = useState(""); // State for company name search
  const [expRange, setExpRange] = useState(""); // State for experience range
  const [salaryRange, setSalaryRange] = useState(""); // State for salary range
  const [selectedExperienceRange, setSelectedExperienceRange] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');

  const expRanges = [
    { label: "1-3 years", min: 1, max: 3 },
    { label: "3-6 years", min: 3, max: 6 },
    { label: "6-10 years", min: 6, max: 10 },
    { label: "10+ years", min: 10, max: Infinity }
  ];

  const salaryRanges = [
    { label: "1-10 USD", min: 1, max: 10 },
    { label: "10-20 USD", min: 10, max: 20 },
    { label: "20-50 USD", min: 20, max: 50 },
    { label: "50-100 USD", min: 50, max: 100 },
    { label: "100+ USD", min: 100, max: Infinity }
  ];

  const fetchData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        limit: 9,
        offset: offset,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setJobs((prevJobs) => [...prevJobs, ...data.jdList]);
      setOffset((prevOffset) => prevOffset + 8);
      
      // Extract locations and roles from fetched data
      const uniqueLocations = Array.from(new Set(data.jdList.map(job => job.location)));
      const uniqueRoles = Array.from(new Set(data.jdList.map(job => job.jobRole)));

      setLocations(uniqueLocations);
      setRoles(uniqueRoles);

    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  // get more data after scroll hit the bottom
  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);  // cleanup
  }, [jobs]);
  useEffect(() => {
    // Filter records based on selected location, role, experience, minimum salary, and company name search
    // const filteredData = jobs.filter(job =>
    //   (!selectedLocation || job.location.toLowerCase() === selectedLocation.toLowerCase()) &&
    //   (!selectedRole || job.jobRole.toLowerCase() === selectedRole.toLowerCase()) &&
    //   (job.minExp >= expRange.min && job.maxExp <= expRange.max) &&
    //   (job.minJdSalary >= salaryRange.min && job.minJdSalary <= salaryRange.max) &&
    //   (searchQuery === "" || job.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    // );
console.log(selectedLocation)
    const filteredData = jobs.filter(job => {
      const matchesLocation = !selectedLocation || job.location.toLowerCase() === selectedLocation.toLowerCase();
      const matchesRole = !selectedRole || job.jobRole.toLowerCase() === selectedRole.toLowerCase();
      const matchesExperience = !selectedExperienceRange || (job.minExp >= selectedExperienceRange[0] && job.maxExp <= selectedExperienceRange[1]);
      const matchesSalary = !selectedSalaryRange || (job.minJdSalary >= selectedSalaryRange[0] && job.maxJdSalary <= selectedSalaryRange[1]);
      const matchesSearchTerm = !searchQuery || job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLocation && matchesRole && matchesExperience && matchesSalary && matchesSearchTerm;
    });
    console.log(filteredData)
    setRecords(filteredData);
    
    // Check if filtered data is empty and set no data message accordingly
    if (filteredData.length === 0) {
      setNoDataMessage("sorry: no jobs found.");
    } else {
      setNoDataMessage("");
    }
  }, [jobs, selectedLocation, selectedRole, selectedSalaryRange, selectedExperienceRange, searchQuery]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleExperienceRangeChange = (event) => {
    setSelectedExperienceRange(event.target.value.split(',').map(Number));
  };
  
  const handleSalaryRangeChange = (event) => {
    setSelectedSalaryRange(event.target.value.split(',').map(Number));
  };
  




  return (
    <div className="App">
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl variant="filled" fullWidth>
              <InputLabel>Roles</InputLabel>
              <Select value={selectedRole} onChange={handleRoleChange}>
                <MenuItem value="">All Roles</MenuItem>
                {roles.map((role, index) => (
                  <MenuItem key={index} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl variant="filled" fullWidth>
              <InputLabel>Locations</InputLabel>
              <Select value={selectedLocation} onChange={handleLocationChange}>
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl variant="filled" fullWidth>
              <InputLabel>Experience</InputLabel>
              <Select value={selectedExperienceRange ? selectedExperienceRange.join(',') : ""} onChange={handleExperienceRangeChange}>
                <MenuItem value="1,3">1-3 years</MenuItem>
                <MenuItem value="3,6">3-6 years</MenuItem>
                <MenuItem value="6,10">6-10 years</MenuItem>
                <MenuItem value="10,Infinity">10+ years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl variant="filled" fullWidth>
              <InputLabel>Salary</InputLabel>
              <Select value={selectedSalaryRange ? selectedSalaryRange.join(',') : ''} onChange={handleSalaryRangeChange}>
                <MenuItem value="1,10">1-10 USD</MenuItem>
                <MenuItem value="10,20">10-20 USD</MenuItem>
                <MenuItem value="20,50">20-50 USD</MenuItem>
                <MenuItem value="50,100">50-100 USD</MenuItem>
                <MenuItem value="100,Infinity">100+ USD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="Company Name" 
              variant="outlined" 
              fullWidth
              value={searchQuery} 
              onChange={handleSearchChange} 
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Grid container spacing={2} justifyContent="center" p={3}>
      {records.length > 0 ? (
        records.map((job, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <JobCard job={job} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          {noDataMessage && <p>{noDataMessage}</p>}
        </Grid>
      )}
    </Grid>
  </div>
  );
}

export default App;
