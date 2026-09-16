import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Times-Roman',
    fontSize: 11.5,
    lineHeight: 1.5,
    color: '#0f172a',
  },
  header: {
    textAlign: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1', // close to slate-300
    marginBottom: 16,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: '#020617', // slate-950 approx
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Helvetica',
    fontWeight: 'medium',
    fontSize: 12,
    color: '#334155', // slate-700
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contactBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: '#475569', // slate-600
    paddingTop: 4,
  },
  contactItem: {
    marginHorizontal: 4,
  },
  contactEmail: {
    fontWeight: 'medium',
    color: '#0f172a',
  },
  contactLink: {
    color: '#1e293b', // slate-800
    textDecoration: 'none',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#020617', // slate-950
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8', // slate-400
    paddingBottom: 2,
    marginBottom: 4,
  },
  summaryText: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#334155', // slate-700
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontFamily: 'Helvetica',
    fontSize: 12,
    marginBottom: 4,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleText: {
    fontFamily: 'Helvetica-Bold',
    color: '#020617',
  },
  companyText: {
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b', // slate-800
  },
  locationText: {
    color: '#64748b', // slate-500
  },
  dateText: {
    fontFamily: 'Times-Italic',
    fontSize: 10.5,
    color: '#475569', // slate-600
  },
  bulletList: {
    paddingLeft: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10.5,
    color: '#334155',
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    color: '#334155',
  },
  educationItem: {
    marginBottom: 8,
    fontFamily: 'Helvetica',
  },
  eduDetails: {
    fontFamily: 'Times-Italic',
    fontSize: 10.5,
    color: '#475569', // slate-600
  },
  skillsText: {
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: '#334155', // slate-700
  },
  skillsLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a', // slate-900
  },
  projectItem: {
    marginBottom: 8,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
    marginBottom: 2,
  },
  projectName: {
    fontFamily: 'Helvetica-Bold',
    color: '#020617', // slate-950
    marginRight: 8,
  },
  projectLink: {
    fontSize: 10,
    color: '#64748b', // slate-500
    textDecoration: 'underline',
  },
  projectDesc: {
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    color: '#475569', // slate-600
  },
  certItem: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: '#334155', // slate-700
    marginBottom: 2,
  },
  certBullet: {
    width: 10,
  },
  certName: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a', // slate-900
  },
  certIssuer: {
    color: '#334155', // slate-700
  },
  certDate: {
    fontFamily: 'Times-Italic',
    color: '#64748b', // slate-500
  }
});

export default function ClassicPdf({ resume }) {
  const { personal = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume || {};

  return (
    <Document>
      <Page size="A4" wrap={true} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName || 'Your Full Name'}</Text>
          {personal.title && <Text style={styles.title}>{personal.title}</Text>}
          
          <View style={styles.contactBar}>
            {personal.location && <Text style={styles.contactItem}>{personal.location}</Text>}
            {personal.location && personal.phone && <Text style={styles.contactItem}>•</Text>}
            {personal.phone && <Text style={styles.contactItem}>{personal.phone}</Text>}
            {personal.phone && personal.email && <Text style={styles.contactItem}>•</Text>}
            {personal.email && <Text style={[styles.contactItem, styles.contactEmail]}>{personal.email}</Text>}
            
            {(personal.links || []).filter(l => l.url).map((link, idx) => (
              <React.Fragment key={link.id || idx}>
                <Text style={styles.contactItem}>•</Text>
                <Link src={link.url} style={[styles.contactItem, styles.contactLink]}>
                  {link.label || link.url.replace(/^https?:\/\//, '')}
                </Link>
              </React.Fragment>
            ))}
          </View>
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp, idx) => (
              <View key={exp.id || idx} style={styles.experienceItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.roleText}>{exp.role || 'Position'}</Text>
                    {exp.company && <Text style={styles.companyText}>, {exp.company}</Text>}
                    {exp.location && <Text style={styles.locationText}> — {exp.location}</Text>}
                  </View>
                  {(exp.start || exp.end) && (
                    <Text style={styles.dateText}>
                      {exp.start} {exp.start && exp.end ? '–' : ''} {exp.end}
                    </Text>
                  )}
                </View>
                <View style={styles.bulletList}>
                  {(exp.bullets || []).filter(Boolean).map((b, i) => (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={edu.id || idx} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.roleText}>{edu.institution}</Text>
                    {edu.degree && <Text style={styles.companyText}> — {edu.degree}</Text>}
                  </View>
                  {(edu.start || edu.end) && (
                    <Text style={styles.dateText}>
                      {edu.start} {edu.start && edu.end ? '–' : ''} {edu.end}
                    </Text>
                  )}
                </View>
                {edu.details && <Text style={styles.eduDetails}>{edu.details}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills & Competencies</Text>
            <Text style={styles.skillsText}>
              <Text style={styles.skillsLabel}>Skills: </Text>
              {skills.join(' • ')}
            </Text>
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj, idx) => (
              <View key={proj.id || idx} style={styles.projectItem} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proj.name || 'Project Name'}</Text>
                  {proj.link && (
                    <Link src={proj.link} style={styles.projectLink}>
                      {proj.link.replace(/^https?:\/\//, '')}
                    </Link>
                  )}
                </View>
                {proj.description && <Text style={styles.projectDesc}>{proj.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.bulletList}>
              {certifications.map((cert, idx) => (
                <View key={cert.id || idx} style={styles.certItem}>
                  <Text style={styles.certBullet}>•</Text>
                  <Text style={styles.certText}>
                    <Text style={styles.certName}>{cert.name || 'Certification Name'}</Text>
                    {cert.issuer && <Text style={styles.certIssuer}> — {cert.issuer}</Text>}
                    {cert.date && <Text style={styles.certDate}> ({cert.date})</Text>}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
