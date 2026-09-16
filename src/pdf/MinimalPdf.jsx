import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 36, // p-9
    fontFamily: 'Helvetica',
    fontSize: 12, // text-xs
    color: '#1e293b', // slate-800
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 20, // pb-5
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // slate-200
    marginBottom: 24, // space-y-6
  },
  headerLeft: {
    flex: 1,
    marginRight: 24,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24, // text-2xl
    color: '#0f172a', // slate-900
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14, // text-sm
    color: '#7c3aed', // violet-600
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  contactBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 11, // text-[11px]
    color: '#64748b', // slate-500
    paddingTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  linksBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 10.5, // text-[10.5px]
    paddingTop: 4,
  },
  linkItem: {
    color: '#475569', // slate-600
    textDecoration: 'underline',
    marginRight: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#f8fafc', // slate-50 approx for slate-100
    objectFit: 'cover',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#94a3b8', // slate-400
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 11,
    color: '#334155', // slate-700
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 16,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
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
  expLocation: {
    fontSize: 10.5,
    color: '#94a3b8', // slate-400
  },
  expDateBadge: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b', // slate-500
    backgroundColor: '#f8fafc', // slate-50 approx for slate-100
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bulletList: {
    paddingTop: 2,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7c3aed', // violet-600
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    color: '#475569', // slate-600
    lineHeight: 1.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCol: {
    width: '48%',
  },
  eduItem: {
    marginBottom: 10,
  },
  eduDegree: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0f172a', // slate-900
    marginBottom: 2,
  },
  eduInst: {
    fontSize: 10.5,
    color: '#475569', // slate-600
    marginBottom: 2,
  },
  eduDate: {
    fontSize: 9.5,
    color: '#94a3b8', // slate-400
  },
  eduDetails: {
    fontSize: 9.5,
    color: '#64748b', // slate-500
    fontFamily: 'Times-Italic', // approximation for italic
    marginTop: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#f5f3ff', // violet-50
    color: '#6d28d9', // violet-700
    marginRight: 6,
    marginBottom: 6,
  },
  projItem: {
    marginBottom: 8,
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
    color: '#7c3aed', // violet-600
    textDecoration: 'underline',
  },
  projDesc: {
    fontSize: 10,
    color: '#475569', // slate-600
    lineHeight: 1.4,
  },
  certItem: {
    fontSize: 10.5,
    marginBottom: 6,
  },
  certName: {
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b', // slate-800
    marginBottom: 2,
  },
  certDetails: {
    fontSize: 10,
    color: '#64748b', // slate-500
  },
  bottomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f8fafc', // slate-50
    paddingTop: 16,
  }
});

export default function MinimalPdf({ resume }) {
  const { personal = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume || {};

  return (
    <Document>
      <Page size="A4" wrap={true} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personal.fullName || 'Your Full Name'}</Text>
            {personal.title && <Text style={styles.title}>{personal.title}</Text>}

            <View style={styles.contactBar}>
              {personal.email && (
                <View style={styles.contactItem}>
                  <Text>{personal.email}</Text>
                </View>
              )}
              {personal.phone && (
                <View style={styles.contactItem}>
                  <Text>{personal.phone}</Text>
                </View>
              )}
              {personal.location && (
                <View style={styles.contactItem}>
                  <Text>{personal.location}</Text>
                </View>
              )}
            </View>

            {(personal.links || []).filter(l => l.url).length > 0 && (
              <View style={styles.linksBar}>
                {(personal.links || []).filter(l => l.url).map((link, idx) => (
                  <Link key={link.id || idx} src={link.url} style={styles.linkItem}>
                    {link.label || link.url.replace(/^https?:\/\//, '')}
                  </Link>
                ))}
              </View>
            )}
          </View>

          {resume.photo && (
            <Image src={resume.photo} style={styles.photo} />
          )}
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, idx) => (
              <View key={exp.id || idx} style={styles.experienceItem} wrap={false}>
                <View style={styles.expHeader}>
                  <View style={styles.expTitleContainer}>
                    <Text style={styles.expRole}>{exp.role || 'Position'}</Text>
                    {exp.company && <Text style={styles.expCompany}> • {exp.company}</Text>}
                    {exp.location && <Text style={styles.expLocation}> ({exp.location})</Text>}
                  </View>
                  {(exp.start || exp.end) && (
                    <Text style={styles.expDateBadge}>
                      {exp.start} {exp.start && exp.end ? '–' : ''} {exp.end}
                    </Text>
                  )}
                </View>
                <View style={styles.bulletList}>
                  {(exp.bullets || []).filter(Boolean).map((b, i) => (
                    <View key={i} style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.grid}>
          {education.length > 0 && (
            <View style={styles.gridCol}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, idx) => (
                <View key={edu.id || idx} style={styles.eduItem} wrap={false}>
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

          {skills.length > 0 && (
            <View style={styles.gridCol}>
              <Text style={styles.sectionTitle}>Core Skills</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill, idx) => (
                  <Text key={idx} style={styles.skillBadge}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {(projects.length > 0 || certifications.length > 0) && (
          <View style={styles.bottomGrid} wrap={false}>
            {projects.length > 0 && (
              <View style={[styles.gridCol, { width: certifications.length > 0 ? '48%' : '100%' }]}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {projects.map((proj, idx) => (
                  <View key={proj.id || idx} style={styles.projItem}>
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

            {certifications.length > 0 && (
              <View style={[styles.gridCol, { width: projects.length > 0 ? '48%' : '100%' }]}>
                <Text style={styles.sectionTitle}>Certifications</Text>
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
        )}
      </Page>
    </Document>
  );
}
