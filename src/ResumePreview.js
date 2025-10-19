export default function ResumePreview({ data }) {
  if (!data) return null;

  const {
    header,
    summary,
    experience = [],
    skills = [],
    education = [],
    languages = [],
    courses = []
  } = data;

  return (
    <div className="resume">
      {/* Header */}
      <div className="resume-header">
        <div>
        <h2>{header?.name || "Your Name"}</h2>
        <div className="resume-sub">{header?.title || "Target Role"}</div>
        </div>
        {(header?.email || header?.phone || header?.location) && (
          <div className="resume-contact">
            <span className="icon-info-row">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/>
                <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"/>
                </svg>
                {header.email && <span>{header.email}</span>}
            </span>
            <span className="icon-info-row">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
                </svg>
                {header.phone && <span>  {header.phone}</span>}
            </span>
            <span className="icon-info-row">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z" clip-rule="evenodd"/>
                </svg>
                {header.location && <span> {header.location}</span>}
            </span>
          </div>
        )}
      </div>
        

        <div className="left-section">
            {/* Summary */}
            {summary && (
                <section className="about-me">
                <h3>Summary</h3>
                <p>{summary}</p>
                </section>
            )}
        {/* Experience */}
        {experience.length > 0 && (
            <section className="experiences">
            <h3>Experience</h3>
            {experience.map((item, i) => (
                <div key={i} className="xp-item">
                <div className="xp-head">
                    <strong className="xp-head-name">{item.role}</strong>
                    {item.company ? ` ${item.company}` : ""}
                    <span className="xp-dates">{` (${item.dates})`}</span>
                </div>
                {item.bullets?.length > 0 && (
                    <ul>
                    {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                )}
                </div>
            ))}
            </section>
        )}
        {/* Education */}
        {education.length > 0 && (
            <section className="education">
            <h3>Education</h3>
                {education.map((ed, i) => (
                <div key={i} className="xp-item">
                    <div className="xp-head">
                        <strong className="xp-head-name">{ed.degree}</strong>
                        {ed.institution ? ` ${ed.institution}` : ""}
                        <span className="xp-dates"> {ed.year ? ` (${ed.year})` : ""}</span>
                    </div>
                   
                    {ed.bullets?.length > 0 && (
                        <ul>
                        {ed.bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                    )}
                </div>
                ))}

            </section>
        )}    
        </div>

        <div className="right-section"> 
        {/* Skills */}
        {skills.length > 0 && (
            <section className="skills">
            <h3>Skills</h3>
            <ul>
                {skills.map((skill, i) => (
                    <li key={i}>
                        {skill}
                    </li>
                ))}
            </ul>
            </section>
        )}
        {courses.length > 0 && (
            <section className="courses">
                <h3>Courses & Certifications</h3>
                <ul>
                {courses.map((c, i) => (
                    <li key={i}>
                    <strong>{c.name}</strong>
                    {c.issuer ? `, ${c.issuer}` : ""}
                    {c.year ? ` (${c.year})` : ""}
                    </li>
                ))}
                </ul>
            </section>
            )}
        {/* Languages */}
            {languages?.length > 0 && (
            <section className="langs">
                <h3>Languages</h3>
                <ul>
                    {languages.map((l,i) => (
                        <li key={i}>{l}</li>
                    ))}
                </ul>
            </section>
            )}
        </div>
    </div>
  );
}
