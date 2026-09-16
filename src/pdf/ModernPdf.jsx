import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#1e293b', // slate-800
    flexDirection: 'row',
  },
  sidebar: {
    width: '34%',
    backgroundColor: '#f5f3ff', // violet-50 approx for violet-50/40
    borderRightWidth: 1,
    borderRightColor: '#ede9fe', // violet-100
    padding: 24, // p-6
    display: 'flex',
    flexDirection: 'column',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 112, // w-28
    height: 112, // h-28
    borderRadius: 16, // rounded-2xl roughly 16px
    borderWidth: 2,
    borderColor: '#ffffff',
    objectFit: 'cover',
  },
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6d28d9', // violet-700
    borderBottomWidth: 1,
    borderBottomColor: '#ddd6fe', // violet-200
    paddingBottom: 4,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 11,
    color: '#475569', // slate-600
    marginLeft: 0,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  linkText: {
    fontSize: 11,
    color: '#475569',
    textDecoration: 'none',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    borderWidth: 1,
    borderColor: '#ddd6fe', // violet-200
    backgroundColor: '#f5f3ff', // violet-50
    color: '#6d28d9', // violet-700
    marginRight: 6,
    marginBottom: 8,
  },
  eduItem: {
    marginBottom: 12,
  },
  eduDegree: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0f172a', // slate-900
    marginBottom: 2,
  },
  eduInst: {
    fontSize: 10,
    color: '#475569', // slate-600
    marginBottom: 2,
  },
  eduDate: {
    fontSize: 9.5,
    color: '#94a3b8', // slate-400
    marginBottom: 2,
  },
  eduDetails: {
    fontSize: 9.5,
    color: '#64748b', // slate-500
    fontFamily: 'Times-Italic',
  },
  certItem: {
    fontSize: 10,
    marginBottom: 8,
  },
  certName: {
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b', // slate-800
    marginBottom: 2,
  },
  certDetails: {
    color: '#64748b', // slate-500
  },
  mainContent: {
    width: '66%',
    padding: 28, // p-7
    display: 'flex',
    flexDirection: 'column',
  },
  mainHeader: {
    paddingBottom: 8,
    marginBottom: 24,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: '#0f172a', // slate-900
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#334155', // slate-700
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  divider: {
    height: 3,
    width: 48,
    backgroundColor: '#7c3aed', // violet-600
    borderRadius: 1.5,
  },
  mainSection: {
    marginBottom: 24,
  },
  mainSectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6d28d9', // violet-700
    borderBottomWidth: 1,
    borderBottomColor: '#ddd6fe', // violet-200
    paddingBottom: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 11,
    color: '#334155', // slate-700
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  expItem: {
    marginBottom: 16,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expRole: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11.5,
    color: '#0f172a', // slate-900
  },
  expCompany: {
    fontFamily: 'Helvetica-Bold',
    color: '#475569', // slate-600
  },
  expDate: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#94a3b8', // slate-400
  },
  expLocation: {
    fontSize: 10,
    color: '#94a3b8', // slate-400
    fontFamily: 'Times-Italic',
    marginBottom: 4,
  },
  bulletList: {
    paddingTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 12,
    color: '#a78bfa', // violet-400
    marginRight: 6,
    marginTop: -1,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    color: '#334155', // slate-700
    lineHeight: 1.4,
  },
  projItem: {
    marginBottom: 10,
  },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  projName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0f172a', // slate-900
  },
  projLink: {
    fontSize: 10,
    color: '#6d28d9', // violet-700
    textDecoration: 'underline',
  },
  projDesc: {
    fontSize: 10.5,
    color: '#334155', // slate-700
    lineHeight: 1.4,
  }
});

export default function ModernPdf({ resume }) {
  const { personal = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume || {};

  return (
    <Document>
      <Page size="A4" wrap={true} style={styles.page}>
        <View style={styles.sidebar}>
          {resume.photo && (
            <View style={styles.photoContainer}>
              <Image src={resume.photo} style={styles.photo} />
            </View>
          )}

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {personal.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{personal.email}</Text>
              </View>
            )}
            {personal.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{personal.phone}</Text>
              </View>
            )}
            {personal.location && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{personal.location}</Text>
              </View>
            )}
          </View>

          {(personal.links || []).filter(l => l.url).length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Profiles & Links</Text>
              {(personal.links || []).filter(l => l.url).map((link, idx) => (
                <View key={link.id || idx} style={styles.linkItem}>
                  <Link src={link.url} style={styles.linkText}>
                    {link.label || link.url.replace(/^https?:\/\//, '')}
                  </Link>
                </View>
              ))}
            </View>
          )}

          {skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills & Expertise</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill, idx) => (
                  <Text key={idx} style={styles.skillBadge}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {education.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Education</Text>
              {education.map((edu, idx) => (
                <View key={edu.id || idx} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>{edu.degree || 'Degree'}</Text>
                  <Text style={styles.eduInst}>{edu.institution}</Text>
                  {(edu.start || edu.end) && (
                    <Text style={styles.eduDate}>
                      {edu.start} {edu.start && edu.end ? '–' : ''} {edu.end}
                    </Text>
                  )}
                  {edu.details && <Text style={styles.eduDetails}>{edu.details}</Text>}
                </View>
              ))}
            </View>
          )}

          {certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Certifications</Text>
              {certifications.map((cert, idx) => (
                <View key={cert.id || idx} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name || 'Certification Name'}</Text>
                  <Text style={styles.certDetails}>
                    {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.mainContent}>
          <View style={styles.mainHeader}>
            <Text style={styles.name}>{personal.fullName || 'Your Full Name'}</Text>
            {personal.title && <Text style={styles.title}>{personal.title}</Text>}
            <View style={styles.divider} />
          </View>

          {summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>About Me</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Work Experience</Text>
              {experience.map((exp, idx) => (
                <View key={exp.id || idx} style={styles.expItem} wrap={false}>
                  <View style={styles.expHeader}>
                    <View style={styles.expTitleContainer}>
                      <Text style={styles.expRole}>{exp.role || 'Position'}</Text>
                      {exp.company && <Text style={styles.expCompany}> • {exp.company}</Text>}
                    </View>
                    {(exp.start || exp.end) && (
                      <Text style={styles.expDate}>
                        {exp.start} {exp.start && exp.end ? '–' : ''} {exp.end}
                      </Text>
                    )}
                  </View>
                  {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
                  <View style={styles.bulletList}>
                    {(exp.bullets || []).filter(Boolean).map((b, i) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bulletDot}>▪</Text>
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Key Projects</Text>
              {projects.map((proj, idx) => (
                <View key={proj.id || idx} style={styles.projItem} wrap={false}>
                  <View style={styles.projHeader}>
                    <Text style={styles.projName}>{proj.name || 'Project Name'}</Text>
                    {proj.link && (
                      <Link src={proj.link} style={styles.projLink}>Link</Link>
                    )}
                  </View>
                  {proj.description && <Text style={styles.projDesc}>{proj.description}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
