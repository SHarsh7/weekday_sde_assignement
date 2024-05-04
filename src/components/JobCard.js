import React, { useState } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const JobCard = ({ job }) => {
  
  const { jobRole, companyName, logoUrl, jdLink, jobDetailsFromCompany, minJdSalary, salaryCurrencyCode, location, minExp, maxExp } = job;

  const [expanded, setExpanded] = useState(false);

  const shortDescription = jobDetailsFromCompany.length > 250
    ? `${jobDetailsFromCompany.substring(0, 250)}...`
    : jobDetailsFromCompany;

  const handleExpand = () => {
    setExpanded(true);
  };

  return (
    <Card sx={{ borderRadius: 8 }} elevation={3}>
      <CardContent style={{ display: 'flex', flexDirection: 'column',alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <img src={logoUrl} alt={companyName} style={{ height: 80, width: 80, marginRight: 30 }} />
          <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'flex-start' }}>
            <Typography variant="h5">{jobRole}</Typography>
            <Typography variant="subtitle1">{companyName}</Typography>
            <Typography variant="subtitle2">{location}</Typography>
          </div>
        </div>
        {(minJdSalary && salaryCurrencyCode)?( <Typography variant="subtitle1">Estimated Salary: {minJdSalary} {salaryCurrencyCode} ✅</Typography>):( <Typography variant="subtitle1">Estimated Salary: Not mentioned</Typography>)}
       
        <Typography variant="h6" style={{ marginTop: 10 }}>About Company</Typography>
        <Typography variant="body2" style={{ textAlign: 'left' }}>{shortDescription}</Typography>
        {jobDetailsFromCompany.length > 200 && (
          <Button style={{ alignSelf: 'center', marginTop:2, marginBottom:2 }} variant="text" color="primary" onClick={handleExpand}>View Job</Button>
        )}
        {(minExp && maxExp) ?( <Typography variant="subtitle1">Experience: {minExp}-{maxExp} years</Typography>):(<Typography variant="subtitle1">Experience: Not mentioned</Typography>)}
       
        <div style={{ marginTop: 10, width:"100%", }}>
          <Button fullWidth variant="contained" href={jdLink} target="_blank"  style={{ backgroundColor:"#5CE7BD",color:"black"  }}>⚡Easy Apply</Button>
          
        </div>
       
        <div style={{ marginTop: 10, width:"100%" }}>
         
          <Button  style={{ backgroundColor:"#4C46DA",color:"white"}} href={jdLink} target="_blank"  fullWidth variant="contained" color="secondary">🔓 Unlock Referrals</Button>
        </div>
      </CardContent>
      {expanded && (
        <Dialog open={expanded} onClose={() => setExpanded(false)}>
          <DialogTitle>{jobRole} - {companyName}</DialogTitle>
          <DialogContent>
             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <img src={logoUrl} alt={companyName} style={{ height: 80, width: 80, marginRight: 30 }} />
          <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'flex-start' }}>
            <Typography variant="h5">{jobRole}</Typography>
            <Typography variant="subtitle1">{companyName}</Typography>
            <Typography variant="body2">{location}</Typography>
          </div>
        </div>
        {(minJdSalary && salaryCurrencyCode)?( <Typography variant="body2">Estimated Salary: {minJdSalary} {salaryCurrencyCode} ✅</Typography>):( <Typography variant="body2">Estimated Salary: Not mentioned</Typography>)}
       
        <Typography variant="h6" style={{ marginTop: 10 }}>About Company</Typography>
        <Typography variant="body2" style={{ textAlign: 'left' }}>{jobDetailsFromCompany}</Typography>
        
        {(minExp && maxExp) ?( <Typography variant="body2">Experience: {minExp}-{maxExp} years</Typography>):(<Typography variant="body2">Experience: Not mentioned</Typography>)}
       
        <div style={{ marginTop: 10, width:"100%", }}>
          <Button fullWidth variant="contained" href={jdLink} target="_blank"   style={{ backgroundColor:"#5CE7BD",color:"black"  }}>⚡Easy Apply</Button>
          
        </div>
       
        <div style={{ marginTop: 10, width:"100%" }}>
         
          <Button href={jdLink} target="_blank"  style={{ backgroundColor:"#4C46DA",color:"white"}} fullWidth variant="contained" color="secondary">🔓 Unlock Referrals</Button>
        </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExpanded(false)} color="primary">Close</Button>
           
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default JobCard;
