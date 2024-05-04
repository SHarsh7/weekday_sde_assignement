import './App.css';
import { useState, useEffect } from "react";
import JobCard from './components/JobCard';
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';

function App() {
  const [jobs, setJobs] = useState([]); 
  const [offset, setOffset] = useState(0);  
  const [records, setRecords] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [selectedRole, setSelectedRole] = useState(""); 
  const [locations, setLocations] = useState([]); 
  const [roles, setRoles] = useState([]); 
  const [noDataMessage, setNoDataMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedExperienceRange, setSelectedExperienceRange] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
  const [isLoading,setIsLoading]=useState(false)


  const fetchData = async () => {
    try {
      setIsLoading(true)
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
    } finally{
      setIsLoading(false)
    }
  };

  // get more data after scroll hit the bottom
  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight-30) {
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
    <Grid container spacing={2} p={1} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Grid container spacing={2} >
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl size="small" variant="filled" fullWidth>
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
              <FormControl size="small" variant="filled" fullWidth>
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
              <FormControl size="small" variant="filled" fullWidth>
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
              <FormControl size="small" variant="filled" fullWidth>
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
              size="small"
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
      {isLoading && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 20, borderRadius: 10 }}>
          <CircularProgress  />
        </div>
      )}
  </div>
  );
}

export default App;
