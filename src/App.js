import { useState } from "react";
import './App.css';
import ResumePreview from "./ResumePreview";

function App() {
  const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const [tab, setTab] = useState("create"); // 'create' | 'improve'
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // --- Create form state ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  // Experience = list of jobs
  const [experiences, setExperiences] = useState([
    { role: "", company: "", dates: "", details: "" } // details = optional notes/bullets
  ]);  
  const [skills, setSkills] = useState("");
  // Education = list of degrees
  const [educations, setEducations] = useState([
    { degree: "", institution: "", year: "", details: "" }
  ]);
  const [courses, setCourses] = useState([
  { name: "", issuer: "", year: "" } 
  ]);
  const [langs, setLangs] = useState("");

  const [jobDescription, setJobDescription] = useState("");
  const [volunteers, setVolunteers] = useState([
    { role: "", organization: "", dates: "", details: "" }
  ]);

  function updateVolunteer(idx, field, value){
    setVolunteers(prev => {
      const copy = [...prev];
      copy[idx] = {...copy[idx], [field]: value};
      return copy
    });
  }
  function addVolunteer(){
    setVolunteers(prev => [...prev, {role: "", organization: "", dates: "", details: ""}]);
  }
  function removeVolunteer(idx){
    setVolunteers(prev => prev.filter((_,i) => i !== idx));
  }

  function updateExperience(idx, field, value) {
    setExperiences(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }
  function addExperience() {
    setExperiences(prev => [...prev, { role: "", company: "", dates: "", details: "" }]);
  }
  function removeExperience(idx) {
    setExperiences(prev => prev.filter((_, i) => i !== idx));
  }

  // education:
  function updateEducation(idx, field, value) {
    setEducations(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }
  function addEducation() {
    setEducations(prev => [...prev, { degree: "", institution: "", year: "", details: "" }
]);
  }
  function removeEducation(idx) {
    setEducations(prev => prev.filter((_, i) => i !== idx));
  }

  // courses:
  function updateCourse(idx, field, value) {
    setCourses(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function addCourse() {
    setCourses(prev => [...prev, { name: "", issuer: "", year: "" }]);
  }

  function removeCourse(idx) {
    setCourses(prev => prev.filter((_, i) => i !== idx));
  }


  async function onCreateSubmit(e) {
    e.preventDefault();
    if (!fullName.trim() || !role.trim() || !summary.trim()) {
      setResumeData(null);
      setOutput("❌ Please fill at least: Full Name, Target Role, Summary");
      return;
    }
    const skillsArr = skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [];
    const languagesArr = langs ? langs.split(",").map(s => s.trim()).filter(Boolean) : [];

    const payload = {
    fullName,
    role,
    email,
    phone,
    location,
    summary,
    experiences,   // [{ role, company, dates, details }]
    educations,    // [{ degree, institution, year }]
    skills: skillsArr,
    languages: languagesArr,
    courses,       // [{ name, issuer, year }]
    jobDescription,
    volunteers
    };

     try {
      setIsLoading(true);  
      setOutput("");
      const res = await fetch(`${BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "create",
          payload
        })
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      setResumeData(json);
    } catch (err) {
      console.error(err);
      setResumeData(null);
      setOutput("❌ Request failed. Check server is running on :3001 and try again.");
    } finally {
      setIsLoading(false);         
    }
  }

   

  function exportPDF() {
    window.print(); 
  }

  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="container">
      <h1>AI Resume Builder</h1>

       <div className="tabContent">
          <form onSubmit={onCreateSubmit} className="form form-create">
            <div className="personal-details">
              <div className="fieldsetTitle">Personal Info <span className="required">*</span></div>
              <input
                className="in"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                className="in"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="in"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="in"
                placeholder="Location (e.g., Tel Aviv)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                className="in"
                placeholder="Target Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <textarea
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                required
              />

            </div>
            <div className="form-section">
             <div className="fieldsetTitle">Experience  <span className="required">*</span></div>
            {experiences.map((exp, idx) => (
              <div key={idx} className="gridRow">
                <input
                  placeholder="Role"
                  value={exp.role}
                  onChange={e => updateExperience(idx, "role", e.target.value)}
                  required
                />
                <input
                  placeholder="Company"
                  value={exp.company}
                  onChange={e => updateExperience(idx, "company", e.target.value)}
                  required
                />
                <input
                  placeholder="Dates (e.g., 2023 – 2025)"
                  value={exp.dates}
                  onChange={e => updateExperience(idx, "dates", e.target.value)}
                  required
                />
                <textarea
                  placeholder="Details (optional)"
                  value={exp.details}
                  onChange={e => updateExperience(idx, "details", e.target.value)}
                  rows={3}
                />

                {experiences.length > 1 && (
                  <button className="remove-btn" type="button" onClick={() => removeExperience(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button className="btn-add-row" type="button" onClick={addExperience}>+ Add Experience</button>
         
            </div>
            
            <div className="form-section">
            <div className="fieldsetTitle">Education  <span className="required">*</span></div>

            {educations.map((ed, idx) => (
              <div key={idx} className="gridRow">
                <input
                  placeholder="Degree (e.g., B.Sc. Computer Science)"
                  value={ed.degree}
                  onChange={e => updateEducation(idx, "degree", e.target.value)}
                  required
                />
                <input
                  placeholder="Institution"
                  value={ed.institution}
                  onChange={e => updateEducation(idx, "institution", e.target.value)}
                  required
                />
                <input
                  placeholder="Year (e.g., 2025)"
                  value={ed.year}
                  onChange={e => updateEducation(idx, "year", e.target.value)}
                />
                  <textarea
                    placeholder="Details (optional)"
                    rows={3}
                    value={ed.details}                
                    onChange={e => updateEducation(idx, "details", e.target.value)}
                  />


                {educations.length > 1 && (
                  <button  className="remove-btn" type="button" onClick={() => removeEducation(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button className="btn-add-row" type="button" onClick={addEducation}>+ Add Education</button>
            </div>

            <div className="form-section">

            {/* Courses & Certifications (optional, dynamic) */}
            <div className="fieldsetTitle">Courses & Certifications</div>

            {courses.map((c, idx) => (
              <div key={idx} className="gridRow">
                <input
                  placeholder="Course/Certification Name"
                  value={c.name}
                  onChange={e => updateCourse(idx, "name", e.target.value)}
                />
                <input
                  placeholder="Issuer (e.g., Coursera, AWS)"
                  value={c.issuer}
                  onChange={e => updateCourse(idx, "issuer", e.target.value)}
                />
                <input
                  placeholder="Year (e.g., 2024)"
                  value={c.year}
                  onChange={e => updateCourse(idx, "year", e.target.value)}
                />
                {courses.length > 1 && (
                  <button className="remove-btn" type="button" onClick={() => removeCourse(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button className="btn-add-row" type="button" onClick={addCourse}>+ Add Course/Certification</button>
            </div>

            <div className="form-section">
            <div className="fieldsetTitle"> Volunteer Work </div>
            {volunteers.map((v,idx)=> (
              <div key={idx} className="gridRow">
                <input
                  placeholder="Role"
                  value={v.role}
                  onChange={e => updateVolunteer(idx, "role", e.target.value)}
                />
                <input
                  placeholder="Organization"
                  value={v.organization}
                  onChange={e => updateVolunteer(idx, "organization", e.target.value)}
                />
                <input
                  placeholder="Year (e.g., 2022 – 2024)"
                  value={v.dates}
                  onChange={e => updateVolunteer(idx, "dates", e.target.value)}
                />
                <textarea
                  placeholder="Details (Optional)"
                  rows={3} 
                  value={v.details}
                  onChange={e => updateVolunteer(idx, "details", e.target.value)}
                />
                {volunteers.length > 1 && (
                  <button className="remove-btn" type="button" onClick={() => removeVolunteer(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button className="btn-add-row" type="button" onClick={addVolunteer}>+ Add volunteer work</button>

            </div>

            <div className="form-section">
              <div className="fieldsetTitle"> Skills & Languages <span className="required">*</span></div>
              <div className="gridRow-special">

                <input 
                  placeholder="Technical Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required

                />
                <input
                  placeholder="Languages"
                  value={langs}
                  onChange={(e) => setLangs(e.target.value)}
                  required

                />
              </div>
            </div>
            <div className="form-section">
              <div className="fieldsetTitle">Adjust your resume according to...</div>
              <textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e)=> setJobDescription(e.target.value)}
                rows={6}
              />
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Generating…" : "Create"}
            </button>
              {isLoading && <span className="spinner" aria-live="polite" aria-busy="true" />}
          </form>
        
      </div>
      {resumeData && (
        <section className="output">
          <div className="outputBar">
            <h3>Result</h3>
            <button type="button" className="export-pdf" onClick={exportPDF}>Export PDF</button>
          </div>

          {/* אזור שמודפס בלבד */}
          <div className="print-area">
            <ResumePreview data={resumeData} />
          </div>
        </section>
      )}

    </div>
  );
}

export default App;
