"use client"

import { useSession, signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { User, Mail, MapPin, Calendar, Shield, AlertTriangle, ExternalLink, Edit, LogOut, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactLinks {
  label: string;
  url: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  bio: string;
  contactLinks: ContactLinks[];
  createdAt: string;
  updatedAt: string;
  isBanned: boolean;
  location: string;
  profilePhoto: string;
  provider: string;
  reportCount: number;
  role: 'freelancer' | 'client' | 'admin';
  skills: string[];
}

function Profile() {
  const session = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await res.json();
      
      if (res.status === 200) {
        setUserData(data.user);
        console.log("User data fetched successfully:", data);
      } else {
        setError(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.data?.user?.id) {
      fetchUserData();
    }
  }, [session.data?.user?.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'freelancer': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (session.status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-green-500 to-green-400"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  {userData?.profilePhoto ? (
                    <img
                      src={userData?.profilePhoto}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {userData?.name || "Not available"}
                </h1>
                <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(userData?.role || 'user')}`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {userData?.role || "Not available"}
                  </span>
                  {userData?.isBanned && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Banned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {userData?.bio || "No bio available"}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              {userData?.skills && userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>

            {/* Contact Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Links</h2>
              {userData?.contactLinks && userData.contactLinks.length > 0 ? (
                <div className="space-y-3">
                  {userData.contactLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-indigo-600" />
                      <span className="text-gray-900 font-medium">{link.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No contact links available</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{userData?.email || "Not available"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{userData?.location || "Not available"}</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-gray-900 capitalize">{userData?.provider || "Not available"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900">{formatDate(userData?.createdAt || "")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(userData?.updatedAt || "")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Report Count</label>
                  <p className="text-gray-900">{userData?.reportCount ?? "Not available"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button onClick={() => router.push(`/user/edit/?userId=${userData?._id}`)} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;