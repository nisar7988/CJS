import React from 'react';
import { FlatList, RefreshControl, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Job } from '../../types/models';
import { EmptyState } from '../common/EmptyState';
import JobCard from './JobCard';
import { Loader } from '../common/Loader';

interface JobListProps {
    jobs: Job[];
    loading: boolean;
    onRefresh: () => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export const JobList: React.FC<JobListProps> = ({
    jobs,
    loading,
    onRefresh,
    ListHeaderComponent,
    contentContainerStyle
}) => {
    const router = useRouter();

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
        <FlatList
            data={jobs}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<EmptyState message="No jobs found. Tap + to add one." />}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
        />
    );
};
