// frontend/src/pages/AboutUsPage/sections/TimelineSection.jsx
import React from 'react';
import styles from './TimelineSection.module.css';

const timelineEvents = [
  { year: '2010', title: 'The Spark of an Idea', description: 'A shared passion for classic automotive artistry ignites the vision for RetroRides.', icon: 'fas fa-lightbulb' },
  { year: '2012', title: 'First Acquisition', description: 'RetroRides acquires its first signature vehicle, a pristine 1965 Jaguar E-Type.', icon: 'fas fa-key' },
  { year: '2015', title: 'Showroom Grand Opening', description: 'Our first dedicated showroom opens, a haven for classic car lovers.', icon: 'fas fa-store' },
  { year: '2018', title: 'International Recognition', description: 'Gaining acclaim for exceptional restorations and rally participation.', icon: 'fas fa-trophy' },
  { year: '2022', title: 'Digital Expansion', description: 'Launching our new online platform to connect globally.', icon: 'fas fa-laptop-code' },
  { year: 'Present', title: 'Continuing the Legacy', description: 'Dedicated to preserving automotive heritage for future generations.', icon: 'fas fa-flag-checkered' },
];

const TimelineSection = () => {
  return (
    <section className={styles.timelineSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Journey <span className={styles.highlight}>Through Time</span></h2>
        <p className={styles.sectionSubtitle}>
          Tracing the milestones that have shaped RetroRides into a trusted name.
        </p>
        <div className={styles.timeline}>
          {timelineEvents.map((event, index) => (
            <div 
              key={index} 
              className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
            >
              <div className={styles.timelineIconWrapper}> {/* Changed class for clarity */}
                <i className={`${event.icon} ${styles.iconInCircle}`}></i> {/* Added class for icon itself */}
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.year}>{event.year}</span>
                <h4 className={styles.eventTitle}>{event.title}</h4>
                <p className={styles.eventDescription}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
