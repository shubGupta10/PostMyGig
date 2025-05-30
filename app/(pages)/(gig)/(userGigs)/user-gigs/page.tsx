"use client"

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
    AlertCircle, 
    RefreshCw, 
    Briefcase, 
    Eye, 
    Trash2,
    Plus
} from 'lucide-react';

interface Contact {
    email: string;
    whatsapp: string;
    x: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    createdBy: string;
    budget: string;
    AcceptedFreelancerEmail: string;
    skillsRequired: string[];
    contact: Contact;
    displayContactLinks: boolean;
    status: 'completed' | 'active' | 'pending';
    expiresAt: string;
    reportCount: number;
    isFlagged: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    message: string;
    projects: Project[];
}

function UserGigs() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const router = useRouter();

    const fetchUserGigs = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch("/api/gigs/fetch-all-user-gigs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            
            const data: ApiResponse = await response.json();
            setProjects(data.projects);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserGigs();
    }, []);

    const deleteUserGig = async (gigId: string) => {
        try {
            setDeletingId(gigId);
            const result = await fetch("/api/gigs/delete-user-gigs", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ gigId })
            });

            if (!result.ok) {
                throw new Error('Failed to delete project');
            }
            setProjects(projects.filter(project => project._id !== gigId));
            toast.success('Project deleted successfully');
        } catch (error) {
            toast.error('Error deleting project');
            setError(error instanceof Error ? error.message : 'Failed to delete project');
        } finally {
            setDeletingId(null);
            setDeleteDialogOpen(false);
            setProjectToDelete(null);
        }
    };

    const openDeleteDialog = (project: Project) => {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            deleteUserGig(projectToDelete._id);
        }
    };

    const getStatusBadge = (status: Project['status']): string => {
        const statusColors: Record<Project['status'], string> = {
            completed: 'bg-green-500 text-white shadow-md',
            active: 'bg-blue-500 text-white shadow-md',
            pending: 'bg-blue-400 text-white shadow-md'
        };
        
        return statusColors[status] || 'bg-blue-500 text-white shadow-md';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpired = (expiresAt: string): boolean => {
        return new Date(expiresAt) < new Date();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-6"></div>
                                <div className="h-8 bg-gray-200 rounded-lg w-20 mb-4"></div>
                                <div className="flex gap-2 mb-6">
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                </div>
                                <div className="h-10 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white border border-red-200 rounded-xl shadow-lg p-12 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load Projects</h2>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <button 
                            onClick={fetchUserGigs}
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">My Projects</h1>
                    <p className="text-lg text-gray-600">Manage and track your project listings</p>
                    <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                                Total Projects: <span className="text-green-500 font-bold">{projects.length}</span>
                            </span>
                            <button 
                                onClick={fetchUserGigs}
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Projects Found</h3>
                            <p className="text-gray-500 mb-8">You haven't created any projects yet. Start by posting your first project!</p>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto">
                                <Plus className="w-5 h-5" />
                                Create Project
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 leading-tight pr-4">
                                            {project.title}
                                        </h3>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(project.status)}`}>
                                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                            </span>
                                            {isExpired(project.expiresAt) && (
                                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                                    Expired
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-green-500">
                                                {project.budget}
                                            </span>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Budget</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Skills Required:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.skillsRequired.slice(0, 4).map((skill, index) => (
                                                    <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {project.skillsRequired.length > 4 && (
                                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                                        +{project.skillsRequired.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {project.AcceptedFreelancerEmail && (
                                            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                                <p className="text-sm font-semibold text-green-700 mb-1">Accepted Freelancer:</p>
                                                <p className="text-sm text-green-600 truncate font-medium">
                                                    {project.AcceptedFreelancerEmail}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="text-gray-500">Created</p>
                                                <p className="font-semibold text-gray-700">{formatDate(project.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500">Expires</p>
                                                <p className={`font-semibold ${isExpired(project.expiresAt) ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {formatDate(project.expiresAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                                            onClick={() => { 
                                                router.push(`/applications/view-applications?gigId=${project._id}`)
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Applications
                                        </button>

                                        <button 
                                            className={`bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                                deletingId === project._id ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={() => openDeleteDialog(project)}
                                            disabled={deletingId === project._id}
                                        >
                                            {deletingId === project._id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{projectToDelete?.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteConfirm}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default UserGigs;