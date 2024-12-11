// ProfileDetails.js

import './ProfileDetails.css';

import React from "react";
import { useTranslation } from "react-i18next";

const ProfileDetails = ({ profile, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="profile-details">
      <p>{t("profile.fields.name")}: {profile.name}</p>
      <p>{t("profile.fields.email")}: {profile.email}</p>
      <p>{t("profile.fields.contactNumber")}: {profile.contactNumber || t("profile.info.notProvided")}</p>
      <p>{t("profile.fields.status")}: {profile.status || t("profile.info.notProvided")}</p>
      <p>{t("profile.fields.loyaltyPoints")}: {profile.loyaltyPoints || 0}</p>
      <button onClick={onEdit} className="edit-button">
        {t("profile.buttons.editProfile")}
      </button>
    </div>
  );
};

export default ProfileDetails;
