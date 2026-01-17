import React, { useCallback, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { JobsRepo } from '../../../src/db/repositories/jobs.repo';
import { Job } from '../../../src/types/models';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { SyncBadge } from '../../../src/components/status/SyncBadge';
import { Loader } from '../../../src/components/common/Loader';

export default function JobsList() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        // setLoading(true); // Don't show full loader on soft refresh
        const data = await JobsRepo.getAll();
        setJobs(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadJobs();
        }, [])
    );

    const renderItem = ({ item }: { item: Job }) => (
        <TouchableOpacity
            className="bg-surface p-4 mb-2 rounded border border-border"
            onPress={() => router.push(`/jobs/${item.id}`)}
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-text">{item.title}</Text>
                    <Text className="text-textMuted">{item.company}</Text>
                    <Text className="text-textLight text-sm mt-1 uppercase font-bold text-xs">{item.status}</Text>
                </View>
                <SyncBadge synced={item.synced} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-background p-4">
            {loading ? (
                <Loader />
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<EmptyState message="No jobs found. Tap + to add one." />}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={loadJobs} />
                    }
                />
            )}

            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
                onPress={() => router.push('/jobs/create')}
            >
                <Text className="text-textOnPrimary text-3xl pb-1">+</Text>
            </TouchableOpacity>
        </View>
    );
}
