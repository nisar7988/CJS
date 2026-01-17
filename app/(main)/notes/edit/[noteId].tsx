import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppInput } from '../../../../src/components/common/AppInput';
import { AppButton } from '../../../../src/components/common/AppButton';
import { NotesRepo } from '../../../../src/db/repositories/notes.repo';
import { Loader } from '../../../../src/components/common/Loader';

export default function EditNote() {
    const { noteId } = useLocalSearchParams<{ noteId: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        async function load() {
            if (noteId) {
                const note = await NotesRepo.getById(noteId);
                if (note) {
                    setContent(note.content);
                }
            }
            setLoading(false);
        }
        load();
    }, [noteId]);

    const handleUpdate = async () => {
        if (!content) {
            Alert.alert('Error', 'Content is required');
            return;
        }

        setSaving(true);
        try {
            await NotesRepo.update(noteId, content);
            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to update note');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Delete Note', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await NotesRepo.delete(noteId);
                    router.back();
                }
            }
        ]);
    };

    if (loading) return <Loader />;

    return (
        <View className="flex-1 bg-background p-4">
            <AppInput
                label="Note Content"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={6}
                style={{ height: 150, textAlignVertical: 'top' }}
            />

            <View className="mt-4 gap-4">
                <AppButton title="Update Note" onPress={handleUpdate} loading={saving} />
                <AppButton title="Delete Note" onPress={handleDelete} variant="danger" />
            </View>
        </View>
    );
}
