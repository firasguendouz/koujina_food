// src/pages/PrivacyPolicy.js

import './PolicyStyles.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      
      <h1>Privacy Policy</h1>
      <p>Welcome to our Privacy Policy page. Protecting your privacy is of utmost importance to us. This policy outlines how we collect, use, and safeguard your personal information, in compliance with applicable laws and regulations, including the GDPR.</p>
      
      <h2>1. Information Collection and Use</h2>
      <p>We collect and use information to improve our services and provide you with a seamless experience. The types of information we collect include:</p>
      <ul>
        <li><strong>Personal Information:</strong> This may include your name, email address, contact details, and payment information provided when you register, make purchases, or contact us.</li>
        <li><strong>Usage Data:</strong> We collect information on how you interact with our website, such as pages visited, time spent, and actions taken. This data helps us optimize the website experience.</li>
        <li><strong>Device Information:</strong> We may gather data on the device you use to access our site, including IP address, browser type, and operating system.</li>
      </ul>
      
      <h2>2. Data Storage and Protection</h2>
      <p>Your personal information is stored securely and accessed only as needed to fulfill the purposes outlined in this policy. We employ industry-standard measures to protect your data, including:</p>
      <ul>
        <li>Encryption to safeguard data during transmission.</li>
        <li>Secure servers with access controls to prevent unauthorized access.</li>
        <li>Regular security assessments to protect against data breaches and unauthorized access.</li>
      </ul>
      
      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, operate, and maintain our services.</li>
        <li>Personalize your experience on our website.</li>
        <li>Respond to your inquiries, process transactions, and communicate essential updates.</li>
        <li>Analyze and improve our services, ensuring a high-quality experience.</li>
      </ul>

      <h2>4. Sharing of Information</h2>
      <p>We do not share your personal information with third parties except in the following cases:</p>
      <ul>
        <li>With trusted service providers who assist in our business operations (e.g., payment processing, analytics) under strict confidentiality agreements.</li>
        <li>As required by law or legal processes, or to protect our rights and the rights of others.</li>
        <li>In the event of a business transfer, such as a merger or acquisition, with assurances for continued data protection.</li>
      </ul>

      <h2>5. Your Rights Under GDPR</h2>
      <p>If you are a resident of the European Union, you have specific rights under the GDPR, including:</p>
      <ul>
        <li><strong>Right of Access:</strong> You may request access to your personal data that we hold.</li>
        <li><strong>Right to Rectification:</strong> You can request corrections to inaccurate or incomplete information.</li>
        <li><strong>Right to Erasure:</strong> You may request the deletion of your data under certain conditions.</li>
        <li><strong>Right to Object:</strong> You have the right to object to data processing for direct marketing purposes.</li>
        <li><strong>Data Portability:</strong> You may request to receive your data in a commonly used format.</li>
      </ul>
      <p>To exercise these rights, please contact us at the email address provided below.</p>

      <h2>6. Changes to This Policy</h2>
      <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When changes are made, we will notify users via email or by posting an update on our website. We encourage you to review this policy periodically to stay informed.</p>

      <h2>7. Contact Us</h2>
      <p>If you have any questions or concerns regarding this Privacy Policy or your personal data, please contact us at:</p>
      <address>
        Email: <a href="mailto:support@koujina.com">support@koujina.food</a><br />
        
      </address>
    </div>
  );
};

export default PrivacyPolicy;
