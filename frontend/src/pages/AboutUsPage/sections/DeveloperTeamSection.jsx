// frontend/src/pages/AboutUsPage/sections/DeveloperTeamSection.jsx
import React from 'react';
import styles from './DeveloperTeamSection.module.css';

// Mock data for developers - replace with your actual data
// USER ACTION: Update image paths and details
const developersData = [
  {
    name: 'Shahriar Khan Turjo',
    role: 'Lead Frontend Developer',
    bio: 'Turjo crafts intuitive user interfaces with a passion for pixel-perfect design and cutting-edge technologies.',
    imageUrl: '/images/team/turjo.jpg', // Placeholder image path
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alicewonder',
      github: 'https://github.com/ShahriarKhan016',
      
    },
  },
  {
    name: 'Khalid Mahmud Joy',
    role: 'Backend Architect',
    bio: 'Joy designs robust and scalable server-side solutions, ensuring reliability and performance for all our applications.',
    imageUrl: '/images/team/joy.jpg', // Placeholder image path
    socialLinks: {
      linkedin: 'https://linkedin.com/in/caroldanvers',
      github: 'https://github.com/caroldanvers',
    },
  },
  {
    name: 'Tanvir Rahman',
    role: 'Full-Stack Engineer',
    bio: 'Tanvir bridges the gap between frontend and backend, bringing cohesive and powerful features to life with her versatile skillset.',
    imageUrl: '/images/team/tanvir.jpg', // Placeholder image path
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/tanvir2002/',
      github: 'https://github.com/tanvir-dev2000',
    },
  },
  {
    name: 'Nasibul Sazid',
    role: 'DevOps & Cloud Specialist',
    bio: 'Sazid magically orchestrates our infrastructure, ensuring smooth deployments, optimal performance, and ironclad security.',
    imageUrl: '/images/team/nasibul.jpg', // Placeholder image path
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidcopperdev',
      github: 'https://github.com/davidcopperdev',
    },
  },
];

const DeveloperTeamSection = () => {
  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Meet the <span className={styles.highlight}>Artisans</span> Behind the Code</h2>
        <p className={styles.sectionSubtitle}>
          The dedicated developers who meticulously craft and maintain the RetroRides digital experience.
        </p>
        <div className={styles.teamGrid}>
          {developersData.map((developer, index) => (
            <div key={index} className={styles.teamMemberCard}>
              <div className={styles.imageWrapper}>
                <img 
                  src={developer.imageUrl} 
                  alt={developer.name} 
                  className={styles.memberImage} 
                />
              </div>
              <div className={styles.memberInfo}>
                <h4 className={styles.memberName}>{developer.name}</h4>
                <p className={styles.memberRole}>{developer.role}</p>
                <p className={styles.memberBio}>{developer.bio}</p>
                <div className={styles.socialLinks}>
                  {developer.socialLinks.linkedin && (
                    <a href={developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${developer.name}'s LinkedIn`}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {developer.socialLinks.github && (
                    <a href={developer.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label={`${developer.name}'s GitHub`}>
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                  {developer.socialLinks.twitter && (
                    <a href={developer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${developer.name}'s Twitter`}>
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {developer.socialLinks.portfolio && (
                    <a href={developer.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" aria-label={`${developer.name}'s Portfolio`}>
                      <i className="fas fa-globe"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeveloperTeamSection;
