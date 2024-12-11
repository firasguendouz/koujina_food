// ProfileForm.js

import './ProfileForm.css';

import React, { useState } from "react";

import { useTranslation } from "react-i18next";

const ProfileForm = ({ profile, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [editableProfile, setEditableProfile] = useState(profile);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editableProfile.name || !editableProfile.email) {
      setError(t("profile.error.requiredFields"));
      return;
    }
    onSave(editableProfile);
  };

  return (
    <div className="profile-form">
      {error && <p className="form-error">{error}</p>}
      <label>
        {t("profile.fields.name")}:
        <input type="text" name="name" value={editableProfile.name || ""} onChange={handleChange} required />
      </label>
      <label>
        {t("profile.fields.email")}:
        <input type="email" name="email" value={editableProfile.email || ""} onChange={handleChange} required />
      </label>
      <label>
        {t("profile.fields.contactNumber")}:
        <input type="text" name="contactNumber" value={editableProfile.contactNumber || ""} onChange={handleChange} />
      </label>
      <div className="button-group">
        <button onClick={handleSave} className="save-button">{t("profile.buttons.saveChanges")}</button>
        <button onClick={onCancel} className="cancel-button">{t("profile.buttons.cancel")}</button>
      </div>
    </div>
  );
};

export default ProfileForm;
