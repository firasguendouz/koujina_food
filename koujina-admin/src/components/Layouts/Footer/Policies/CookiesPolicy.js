// src/pages/CookiesPolicy.js

import './PolicyStyles.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const CookiesPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      
      <h1>Cookies Policy</h1>
      <p>Our website uses cookies to improve your experience and provide personalized content. This Cookies Policy explains what cookies are, how we use them, and your choices regarding cookies.</p>
      
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files that are placed on your device (computer, smartphone, or other device) when you visit a website. They help websites recognize returning visitors, understand how visitors interact with content, and enhance user experience by personalizing interactions.</p>
      
      <h2>2. Types of Cookies We Use</h2>
      <ul>
        <li><strong>Essential Cookies:</strong> These cookies are necessary for our website to function properly. They enable basic features, such as secure logins, page navigation, and session management.</li>
        <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting anonymous data on site usage, such as pages visited and time spent. This information helps us improve website performance.</li>
        <li><strong>Functional Cookies:</strong> These cookies allow us to remember choices you make on our website, such as language preferences or region, to provide enhanced and personalized features.</li>
        <li><strong>Targeting/Advertising Cookies:</strong> These cookies are used to deliver content and advertisements that are relevant to your interests. They also limit the number of times you see the same ad and help measure the effectiveness of advertising campaigns.</li>
      </ul>
      
      <h2>3. How We Use Cookies</h2>
      <p>We use cookies to enhance your browsing experience by:</p>
      <ul>
        <li>Remembering your login details and preferences</li>
        <li>Analyzing website traffic to improve functionality and content</li>
        <li>Providing relevant content and advertisements</li>
      </ul>

      <h2>4. Managing Cookies</h2>
      <p>Most web browsers allow you to manage cookies through your browser settings. You can choose to accept, block, or delete cookies. Please note that disabling essential cookies may affect the functionality of our website. To learn more about managing cookies, visit the "Help" section of your browser.</p>

      <h2>5. Changes to Our Cookies Policy</h2>
      <p>We may update this Cookies Policy periodically to reflect changes in technology or legal requirements. Please check this page from time to time to stay informed about our use of cookies.</p>

      <h2>6. Contact Us</h2>
      <p>If you have any questions regarding our use of cookies or this Cookies Policy, please contact us at:</p>
      <address>
        Email: <a href="mailto:support@koujina.food">support@koujina.food</a><br />
        
      </address>
    </div>
  );
};

export default CookiesPolicy;
