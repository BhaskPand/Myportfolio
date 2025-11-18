// Admin Authentication and Project Management
const adminAuth = {
    // Default admin credentials (you should change these!)
    defaultUsername: 'bhaskarpandit',
    defaultPassword: 'Bhas@123', // Change this to a secure password

    // Initialize admin credentials if not set
    init() {
        // Always update credentials to match current defaults (in case they were changed)
        localStorage.setItem('adminUsername', this.defaultUsername);
        localStorage.setItem('adminPassword', this.defaultPassword);
        // In a real app, you'd hash this. For simplicity, storing plain text.
        // WARNING: This is not secure for production!
    },

    // Login function
    login(username, password) {
        this.init();
        const storedUsername = localStorage.getItem('adminUsername');
        const storedPassword = localStorage.getItem('adminPassword');

        // Trim whitespace and compare (case-sensitive for security)
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (trimmedUsername === storedUsername && trimmedPassword === storedPassword) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminLoginTime', Date.now().toString());
            return true;
        }
        return false;
    },

    // Check if user is authenticated
    isAuthenticated() {
        const authenticated = sessionStorage.getItem('adminAuthenticated');
        const loginTime = sessionStorage.getItem('adminLoginTime');
        
        if (!authenticated || authenticated !== 'true') {
            return false;
        }

        // Session timeout: 2 hours (7200000 ms)
        const SESSION_TIMEOUT = 7200000;
        if (loginTime && Date.now() - parseInt(loginTime) > SESSION_TIMEOUT) {
            this.logout();
            return false;
        }

        return true;
    },

    // Logout function
    logout() {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminLoginTime');
    }
};

// Project Management
const projectManager = {
    // Get all projects
    getProjects() {
        const projects = localStorage.getItem('portfolioProjects');
        if (projects) {
            try {
                return JSON.parse(projects);
            } catch (e) {
                console.error('Error parsing projects:', e);
                return [];
            }
        }
        return [];
    },

    // Save projects to localStorage
    saveProjects(projects) {
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    },

    // Add a new project
    addProject(project) {
        const projects = this.getProjects();
        projects.push(project);
        this.saveProjects(projects);
    },

    // Delete a project by index
    deleteProject(index) {
        const projects = this.getProjects();
        if (index >= 0 && index < projects.length) {
            projects.splice(index, 1);
            this.saveProjects(projects);
            return true;
        }
        return false;
    },

    // Update a project by index
    updateProject(index, updatedProject) {
        const projects = this.getProjects();
        if (index >= 0 && index < projects.length) {
            projects[index] = updatedProject;
            this.saveProjects(projects);
            return true;
        }
        return false;
    },

    // Reorder projects
    reorderProjects(fromIndex, toIndex) {
        const projects = this.getProjects();
        if (fromIndex < 0 || fromIndex >= projects.length || 
            toIndex < 0 || toIndex >= projects.length) {
            return false;
        }
        
        // Remove the item from its current position
        const [movedItem] = projects.splice(fromIndex, 1);
        // Insert it at the new position
        projects.splice(toIndex, 0, movedItem);
        
        this.saveProjects(projects);
        return true;
    },

    // Initialize with default projects if none exist
    initDefaultProjects() {
        const projects = this.getProjects();
        if (projects.length === 0) {
            // You can add default projects here if needed
            // For now, we'll start with an empty array
            this.saveProjects([]);
        }
    }
};

// Initialize on load
projectManager.initDefaultProjects();

// Moments (Carousel Images) Management
const momentsManager = {
    // Get all moments/images
    getMoments() {
        const moments = localStorage.getItem('portfolioMoments');
        if (moments) {
            try {
                return JSON.parse(moments);
            } catch (e) {
                console.error('Error parsing moments:', e);
                return [];
            }
        }
        return [];
    },

    // Save moments to localStorage
    saveMoments(moments) {
        localStorage.setItem('portfolioMoments', JSON.stringify(moments));
    },

    // Add a new moment/image
    addMoment(imageUrl) {
        const moments = this.getMoments();
        moments.push(imageUrl);
        this.saveMoments(moments);
    },

    // Delete a moment by index
    deleteMoment(index) {
        const moments = this.getMoments();
        if (index >= 0 && index < moments.length) {
            moments.splice(index, 1);
            this.saveMoments(moments);
            return true;
        }
        return false;
    },

    // Update a moment by index
    updateMoment(index, newImageUrl) {
        const moments = this.getMoments();
        if (index >= 0 && index < moments.length) {
            moments[index] = newImageUrl;
            this.saveMoments(moments);
            return true;
        }
        return false;
    },

    // Reorder moments
    reorderMoments(fromIndex, toIndex) {
        const moments = this.getMoments();
        if (fromIndex < 0 || fromIndex >= moments.length || 
            toIndex < 0 || toIndex >= moments.length) {
            return false;
        }
        
        const [movedItem] = moments.splice(fromIndex, 1);
        moments.splice(toIndex, 0, movedItem);
        
        this.saveMoments(moments);
        return true;
    },

    // Initialize with default moments if none exist
    initDefaultMoments() {
        const moments = this.getMoments();
        if (moments.length === 0) {
            const defaultMoments = [
                'https://placehold.co/1200x800/535C7A/FFFFFF?text=Cricket+Match',
                'https://placehold.co/1200x800/779872/FFFFFF?text=Friends+Hangout',
                'https://placehold.co/1200x800/965D69/FFFFFF?text=Coding+Session',
                'https://placehold.co/1200x800/6A7B8E/FFFFFF?text=College+Trip',
                'https://placehold.co/1200x800/4B5569/FFFFFF?text=Project+Work',
                'https://placehold.co/1200x800/805D78/FFFFFF?text=Music+Time',
                'https://placehold.co/1200x800/5B8B77/FFFFFF?text=Hackathon',
                'https://placehold.co/1200x800/7A6C5D/FFFFFF?text=Trading+Desk'
            ];
            this.saveMoments(defaultMoments);
        }
    }
};

// Initialize moments on load
momentsManager.initDefaultMoments();

