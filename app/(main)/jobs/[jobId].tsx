import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { JobsRepo } from '../../../src/db/repositories/jobs.repo';
import { NotesRepo } from '../../../src/db/repositories/notes.repo';
import { Job, Note } from '../../../src/types/models';
import { Loader } from '../../../src/components/common/Loader';
import { SyncBadge } from '../../../src/components/status/SyncBadge';

export default function JobDetails() {
    const { jobId } = useLocalSearchParams<{ jobId: string }>();
    const router = useRouter();

    const [job, setJob] = useState<Job | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!jobId) return;
        const j = await JobsRepo.getById(jobId);
        const n = await NotesRepo.getByJobId(jobId);
        setJob(j);
        setNotes(n);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [jobId])
    );

    const handleDeleteJob = async () => {
        Alert.alert('Delete Job', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await JobsRepo.delete(jobId);
                    router.back();
                }
            }
        ]);
    };

    if (loading) return <Loader />;
    if (!job) return <View className="p-4"><Text>Job not found</Text></View>;

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="bg-surface p-4 border-b border-border">
                <View className="flex-row justify-between">
                    <Text className="text-2xl font-bold text-text flex-1">{job.title}</Text>
                    <SyncBadge synced={job.synced} />
                </View>
                <Text className="text-xl text-textMuted mb-2">{job.company}</Text>

                <View className="flex-row gap-2 mb-2">
                    <Text className="bg-infoLight text-info px-2 py-1 rounded font-medium overflow-hidden">{job.status}</Text>
                    {job.salary ? <Text className="bg-successLight text-success px-2 py-1 rounded font-medium overflow-hidden">{job.salary}</Text> : null}
                </View>

                {job.description ? <Text className="text-text mt-2">{job.description}</Text> : null}

                <View className="flex-row mt-4 gap-4">
                    <TouchableOpacity onPress={() => router.push(`/jobs/edit/${job.id}`)}>
                        <Text className="text-primary font-bold">Edit Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteJob}>
                        <Text className="text-danger font-bold">Delete Job</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="p-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-text">Notes</Text>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/notes/create', params: { jobId: job.id } })}>
                        <Text className="text-primary font-bold">+ Add Note</Text>
                    </TouchableOpacity>
                </View>

                {notes.length === 0 ? (
                    <Text className="text-textMuted italic">No notes yet.</Text>
                ) : (
                    notes.map(note => (
                        <TouchableOpacity
                            key={note.id}
                            className="bg-surface p-3 rounded mb-2 border border-border"
                            onPress={() => router.push(`/notes/edit/${note.id}`)}
                        >
                            <Text className="text-text">{note.content}</Text>
                            <View className="flex-row justify-between mt-2">
                                <Text className="text-textLight text-xs">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </Text>
                                <SyncBadge synced={note.synced} />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
