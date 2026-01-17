import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../../../src/components/common/AppButton';
import { JobsRepo } from '../../../src/db/repositories/jobs.repo';
import { Job } from '../../../src/types/models';
import AppInput from '../../../src/components/common/AppInput';
export default function CreateJob() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState<Job['status']>('applied');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!title || !company) {
            Alert.alert('Error', 'Title and Company are required');
            return;
        }

        setLoading(true);
        try {
            await JobsRepo.create({
                title,
                company,
                status,
                salary,
                description
            });
            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-background p-4">
            <AppInput label="Job Title" value={title} onChangeText={setTitle} placeholder="e.g. Senior Developer" />
            <AppInput label="Company" value={company} onChangeText={setCompany} placeholder="e.g. Tech Corp" />

            {/* Simple Status Selection for MVP - could be a dropdown */}
            <AppInput
                label="Status (applied, interviewing, offer, rejected)"
                value={status}
                onChangeText={(text) => setStatus(text.toLowerCase() as any)}
                placeholder="applied"
            />

            <AppInput label="Salary" value={salary} onChangeText={setSalary} placeholder="e.g. $120k" />
            <AppInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholder="Job description or notes..."
                style={{ height: 100, textAlignVertical: 'top' }}
            />

            <View className="mt-4 mb-8">
                <AppButton title="Save Job" onPress={handleCreate} loading={loading} />
            </View>
        </ScrollView>
    );
}
