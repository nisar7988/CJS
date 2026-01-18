import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { JobsRepo } from '../../../src/db/repositories/jobs.repo';
import { Job } from '../../../src/types/models';
import { JobList } from '../../../src/components/jobs/JobList';

export default function JobsListScreen() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        try {
            const data = await JobsRepo.getAll();
            setJobs(data);
        } catch (error) {
            console.error("Failed to load jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadJobs();
        }, [])
    );

    return (
        <JobList
            jobs={jobs}
            loading={loading}
            onRefresh={loadJobs}
            contentContainerStyle={{ paddingBottom: 80 }}
        />
    );
}
