import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppInput } from '../../../../src/components/common/AppInput';
import { AppButton } from '../../../../src/components/common/AppButton';
import { JobsRepo } from '../../../../src/db/repositories/jobs.repo';
import { Job } from '../../../../src/types/models';
import { Loader } from '../../../../src/components/common/Loader';

export default function EditJob() {
    const { jobId } = useLocalSearchParams<{ jobId: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState<Job['status']>('applied');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function load() {
            if (jobId) {
                const job = await JobsRepo.getById(jobId);
                if (job) {
                    setTitle(job.title);
                    setCompany(job.company);
                    setStatus(job.status);
                    setSalary(job.salary || '');
                    setDescription(job.description || '');
                }
            }
            setLoading(false);
        }
        load();
    }, [jobId]);

    const handleUpdate = async () => {
        if (!title || !company) {
            Alert.alert('Error', 'Title and Company are required');
            return;
        }

        setSaving(true);
        try {
            await JobsRepo.update(jobId, {
                title,
                company,
                status,
                salary,
                description
            });
            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to update job');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <ScrollView className="flex-1 bg-background p-4">
            <AppInput label="Job Title" value={title} onChangeText={setTitle} />
            <AppInput label="Company" value={company} onChangeText={setCompany} />

            <AppInput
                label="Status (applied, interviewing, offer, rejected)"
                value={status}
                onChangeText={(text) => setStatus(text.toLowerCase() as any)}
            />

            <AppInput label="Salary" value={salary} onChangeText={setSalary} />
            <AppInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: 'top' }}
            />

            <View className="mt-4 mb-8">
                <AppButton title="Update Job" onPress={handleUpdate} loading={saving} />
            </View>
        </ScrollView>
    );
}
