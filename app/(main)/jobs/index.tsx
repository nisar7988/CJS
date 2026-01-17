import React, { useCallback, useState } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { JobsRepo } from '../../../src/db/repositories/jobs.repo';
import { Job } from '../../../src/types/models';
import { EmptyState } from '../../../src/components/common/EmptyState';
import JobCard from '../../../src/components/jobs/JobCard';
import { Loader } from '../../../src/components/common/Loader';
import { FAB } from '../../../src/components/common/FAB';

export default function JobsList() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        // setLoading(true); // Don't show full loader on soft refresh
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

    const renderItem = ({ item }: { item: Job }) => (
        <JobCard
            job={item}
            onPress={() => router.push(`/jobs/${item.id}`)}
        />
    );

    if (loading && jobs.length === 0) {
        return <Loader />;
    }

    return (
        <View className="flex-1 bg-background px-4 pt-4">
            <FlatList
                data={jobs}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyState message="No jobs found. Tap + to add one." />}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadJobs} />
                }
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            />

            <FAB
                onPress={() => router.push('/jobs/create')}
            />
        </View>
    );
}
