import React from 'react';

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    },
    content: {
        padding: '20px 0',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        marginBottom: '0.5rem',
        color: '#333',
    },
    subtitle: {
        fontSize: '1.5rem',
        textAlign: 'center' as const,
        marginBottom: '0.5rem',
        color: '#666',
        fontWeight: 'normal',
    },
    lastUpdated: {
        fontSize: '0.9rem',
        textAlign: 'center' as const,
        marginBottom: '2rem',
        color: '#888',
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginTop: '2rem',
        marginBottom: '1rem',
        color: '#333',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '0.5rem',
    },
    subsectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        marginTop: '1.5rem',
        marginBottom: '0.75rem',
        color: '#444',
    },
    text: {
        fontSize: '0.95rem',
        lineHeight: '1.6',
        marginBottom: '1rem',
        color: '#555',
    },
    textP: {
        margin: '0.5rem 0',
    },
    footer: {
        fontSize: '0.9rem',
        fontStyle: 'italic',
        textAlign: 'center' as const,
        marginTop: '3rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666',
        border: '1px solid #e9ecef',
    },
};

export const PrivacyPolicy: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Privacy Policy</h1>
                <h2 style={styles.subtitle}>Fit Fly</h2>
                <p style={styles.lastUpdated}>Last Updated: July 19, 2025</p>

                <h3 style={styles.sectionTitle}>1. Introduction</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>Welcome to Fit Fly. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy explains how we collect, use, and safeguard your information when you use our
                        fitness tracking application.</p>
                </div>

                <h3 style={styles.sectionTitle}>2. Information We Collect</h3>

                <h4 style={styles.subsectionTitle}>2.1 Personal Information</h4>
                <div style={styles.text}>
                    <p style={styles.textP}>• Account information (name, email address, username)</p>
                    <p style={styles.textP}>• Profile information (age, gender, height, weight, fitness goals)</p>
                    <p style={styles.textP}>• Contact information for support purposes</p>
                </div>

                <h4 style={styles.subsectionTitle}>2.2 Health and Fitness Data</h4>
                <div style={styles.text}>
                    <p style={styles.textP}>• Macro nutrition data (calories, proteins, carbohydrates, fats)</p>
                    <p style={styles.textP}>• Food intake and meal logging</p>
                    <p style={styles.textP}>• Exercise routines and workout data</p>
                    <p style={styles.textP}>• Body measurements and fitness goals</p>
                    <p style={styles.textP}>• Progress tracking information</p>
                </div>

                <h4 style={styles.subsectionTitle}>2.3 Photos and Media</h4>
                <div style={styles.text}>
                    <p style={styles.textP}>• Progress photos you choose to upload</p>
                    <p style={styles.textP}>• Profile pictures</p>
                    <p style={styles.textP}>• Food photos for meal tracking</p>
                </div>

                <h4 style={styles.subsectionTitle}>2.4 Usage Data</h4>
                <div style={styles.text}>
                    <p style={styles.textP}>• App usage patterns and preferences</p>
                    <p style={styles.textP}>• Device information (browser type, device model)</p>
                    <p style={styles.textP}>• Log data and crash reports</p>
                    <p style={styles.textP}>• Analytics data to improve our services</p>
                </div>

                <h3 style={styles.sectionTitle}>3. How We Use Your Information</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>We use your information to:</p>
                    <p style={styles.textP}>• Provide and maintain our fitness tracking services</p>
                    <p style={styles.textP}>• Calculate and track your macro nutrition goals</p>
                    <p style={styles.textP}>• Store and display your progress photos securely</p>
                    <p style={styles.textP}>• Generate personalized fitness recommendations</p>
                    <p style={styles.textP}>• Improve our app functionality and user experience</p>
                    <p style={styles.textP}>• Provide customer support</p>
                    <p style={styles.textP}>• Send important updates about our services</p>
                    <p style={styles.textP}>• Ensure app security and prevent fraud</p>
                </div>

                <h3 style={styles.sectionTitle}>4. Data Storage and Security</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>• All data is encrypted in transit and at rest</p>
                    <p style={styles.textP}>• Progress photos are stored securely with restricted access</p>
                    <p style={styles.textP}>• We use industry-standard security measures</p>
                    <p style={styles.textP}>• Data is stored on secure cloud servers with regular backups</p>
                    <p style={styles.textP}>• Access to your data is limited to authorized personnel only</p>
                </div>

                <h3 style={styles.sectionTitle}>5. Data Sharing</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>We do not sell, trade, or rent your personal information. We may share data only in these limited circumstances:</p>
                    <p style={styles.textP}>• With your explicit consent</p>
                    <p style={styles.textP}>• To comply with legal obligations</p>
                    <p style={styles.textP}>• To protect our rights and safety</p>
                    <p style={styles.textP}>• With service providers who assist in app functionality (under strict confidentiality agreements)</p>
                </div>

                <h3 style={styles.sectionTitle}>6. Your Rights and Choices</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>You have the right to:</p>
                    <p style={styles.textP}>• Access your personal data</p>
                    <p style={styles.textP}>• Correct inaccurate information</p>
                    <p style={styles.textP}>• Delete your account and associated data</p>
                    <p style={styles.textP}>• Export your data</p>
                    <p style={styles.textP}>• Opt-out of non-essential communications</p>
                    <p style={styles.textP}>• Withdraw consent for data processing</p>
                </div>

                <h3 style={styles.sectionTitle}>7. Photo Privacy</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>• Progress photos are private and visible only to you</p>
                    <p style={styles.textP}>• Photos are not shared with other users or third parties</p>
                    <p style={styles.textP}>• You can delete photos at any time</p>
                    <p style={styles.textP}>• Photos are permanently deleted when you delete your account</p>
                    <p style={styles.textP}>• We do not use your photos for marketing or promotional purposes</p>
                </div>

                <h3 style={styles.sectionTitle}>8. Health Data Protection</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>• We comply with applicable health data protection regulations</p>
                    <p style={styles.textP}>• Health and fitness data is treated with the highest level of security</p>
                    <p style={styles.textP}>• Data is not shared with insurance companies or employers</p>
                    <p style={styles.textP}>• You control what health data you share with the app</p>
                </div>

                <h3 style={styles.sectionTitle}>9. Children's Privacy</h3>
                <p style={styles.text}>
                    Our app is not intended for children under 13. We do not knowingly collect personal
                    information from children under 13. If we become aware that we have collected such
                    information, we will delete it immediately.
                </p>

                <h3 style={styles.sectionTitle}>10. International Data Transfers</h3>
                <p style={styles.text}>
                    Your data may be transferred to and processed in countries other than your own.
                    We ensure appropriate safeguards are in place to protect your data during such transfers.
                </p>

                <h3 style={styles.sectionTitle}>11. Data Retention</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>• Account data is retained while your account is active</p>
                    <p style={styles.textP}>• Data is deleted within 30 days of account deletion</p>
                    <p style={styles.textP}>• Some data may be retained longer for legal compliance</p>
                    <p style={styles.textP}>• You can request immediate data deletion by contacting support</p>
                </div>

                <h3 style={styles.sectionTitle}>12. Third-Party Services</h3>
                <p style={styles.text}>
                    Our app may integrate with third-party services (such as nutrition databases).
                    These services have their own privacy policies, and we encourage you to review them.
                </p>

                <h3 style={styles.sectionTitle}>13. Changes to This Policy</h3>
                <p style={styles.text}>
                    We may update this privacy policy from time to time. We will notify you of any
                    material changes through the app or via email. Your continued use of the app
                    after changes constitutes acceptance of the updated policy.
                </p>

                <h3 style={styles.sectionTitle}>14. Contact Information</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>If you have questions about this privacy policy or our data practices, please contact us at:</p>
                    <p style={styles.textP}>Email: privacy@fitfly.app</p>
                    <p style={styles.textP}>Address: [Your Company Address]</p>
                    <p style={styles.textP}>Phone: [Your Phone Number]</p>
                </div>

                <h3 style={styles.sectionTitle}>15. Web-Specific Provisions</h3>
                <div style={styles.text}>
                    <p style={styles.textP}>• We comply with web standards and best practices</p>
                    <p style={styles.textP}>• We respect browser privacy features and permissions</p>
                    <p style={styles.textP}>• We support web accessibility guidelines</p>
                </div>

                <div style={styles.footer}>
                    By using Fit Fly, you acknowledge that you have read and understood this Privacy Policy.
                </div>
            </div>
        </div>
    );
};
