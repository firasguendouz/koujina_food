// src/pages/LegalMentions.js

import './PolicyStyles.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LegalMentions = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      
      <h1>Legal Mentions</h1>
      <p>Welcome to our Legal Mentions page. Here you will find important legal information pertaining to the use of our website. Please review these details carefully.</p>

      <h2>1. Website Ownership</h2>
      <p>This website is owned and operated by <strong>Koujina UG</strong>, a company registered in Germany with headquarters located at:</p>
      <address>
        Adalbertstraße 80799 München<br />
        80799 München<br />
        Germany
      </address>
      <p>For further information, please contact us via email at <a href="mailto:legal@koujina.food">legal@koujina.food</a>.</p>

      <h2>2. Intellectual Property Rights</h2>
      <p>All content on this website, including but not limited to text, images, logos, trademarks, graphics, software, and source code, is the intellectual property of <strong>Koujina </strong> or has been duly licensed. Unauthorized use, reproduction, or distribution of this content without explicit permission is strictly prohibited and may result in legal action.</p>

      <h2>3. Content Accuracy</h2>
      <p>We strive to provide accurate and up-to-date information. However, <strong>Koujina </strong> does not guarantee the completeness, reliability, or accuracy of the information presented on this website. Users are encouraged to verify any information obtained from this site before making decisions based on it.</p>

      <h2>4. Links to Third-Party Sites</h2>
      <p>This website may contain links to external websites operated by third parties. <strong>Koujina </strong> has no control over the content of these sites and assumes no responsibility for their content, privacy practices, or terms of use. Users access third-party sites at their own risk.</p>

      <h2>5. Liability Limitations</h2>
      <p><strong>Koujina </strong> shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use this website, including but not limited to errors, inaccuracies, or interruptions in service.</p>
      <p>We make no warranties regarding the site's functionality, availability, or performance and reserve the right to suspend, limit, or terminate access to the website at any time without notice.</p>

      <h2>6. Data Privacy and Protection</h2>
      <p>Your privacy is important to us. Please refer to our <a href="/PrivacyPolicy">Privacy Policy</a> and <a href="/CookiesPolicy">Cookies Policy</a> for detailed information on how we collect, use, and protect your personal data in compliance with the GDPR and other applicable data protection laws.</p>

      <h2>7. Governing Law and Jurisdiction</h2>
      <p>These legal mentions and any disputes arising from your use of this website shall be governed by and interpreted in accordance with the laws of Germany. All disputes shall be subject to the exclusive jurisdiction of the courts in [City, Germany].</p>

      <h2>8. Contact Us</h2>
      <p>If you have any legal inquiries or require additional information about these legal mentions, please contact us at:</p>
      <address>
        Email: <a href="mailto:legal@koujina.food">koujina.food</a><br />
        
      </address>
      
      <p>Thank you for reviewing our Legal Mentions. By using this website, you acknowledge and agree to these terms.</p>
    </div>
  );
};

export default LegalMentions;
