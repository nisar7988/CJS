import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppInput } from '../../../src/components/common/AppInput';
import { AppButton } from '../../../src/components/common/AppButton';
import { NotesRepo } from '../../../src/db/repositories/notes.repo';

export default function CreateNote() {
    const { jobId } = useLocalSearchParams<{ jobId: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const handleCreate = async () => {
        if (!content) {
            Alert.alert('Error', 'Content is required');
            return;
        }

        setLoading(true);
        try {
            await NotesRepo.create({
                job_id: jobId,
                content
            });
            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to create note');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background p-4">
            <AppInput
                label="Note Content"
                value={content}
                onChangeText={setContent}
                multiline
                autoFocus
                numberOfLines={6}
                style={{ height: 150, textAlignVertical: 'top' }}
            />

            <View className="mt-4">
                <AppButton title="Save Note" onPress={handleCreate} loading={loading} />
            </View>
        </View>
    );
}
