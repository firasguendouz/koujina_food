// ProfileManagement.js

import "./ProfileManagement.css";

import React, { useEffect, useState } from "react";

import ErrorMessage from "../../components/common/ErrorMessage.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.js";
import ProfileDetails from "../../components/Profile/ProfileDetails";
import ProfileForm from "../../components/Profile/ProfileForm";
import { api } from "../../services/api";
import { useTranslation } from "react-i18next";

const ProfileManagement = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.getUserProfile();
        setProfile(response.data);
      } catch (err) {
        setError(t("profile.error.load"));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [t]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      await api.updateUserProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(t("profile.error.update"));
    }
  };

  if (loading) return <LoadingSpinner message={t("profile.loading")} />;
  return (
    <div className="profile-management">
      <h2>{t("profile.title")}</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {isEditing ? (
        <ProfileForm profile={profile} onSave={handleUpdateProfile} onCancel={handleEditToggle} />
      ) : (
        <ProfileDetails profile={profile} onEdit={handleEditToggle} />
      )}
    </div>
  );
};

export default ProfileManagement;
