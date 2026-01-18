import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

import { generateUUID } from "../../utils/uuid";
import { useNetworkStore } from "../../store/network.store";
import { SyncQueueRepo } from "../../db/repositories/syncQueue.repo";
import { VideosRepo } from "../../db/repositories/videos.repo";
import { SyncManager } from "../../sync/syncManager";
import { Video } from "../../types/models";

interface JobVideoProps {
    jobId: string;
}

export default function JobVideo({ jobId }: JobVideoProps) {
    const [uploading, setUploading] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const isOnline = useNetworkStore(state => state.isOnline);

    const loadVideos = React.useCallback(async () => {
        const allVideos = await VideosRepo.getByJobId(jobId);
        setVideos(allVideos);
    }, [jobId]);

    useEffect(() => {
        loadVideos();
        const interval = setInterval(loadVideos, 2000);
        return () => clearInterval(interval);
    }, [jobId, loadVideos]);

    const handleUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];

                Alert.alert(
                    "Upload Video",
                    "Add this video to the upload queue?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Add to Queue",
                            onPress: async () => {
                                await queueVideo(asset);
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error("Pick error", error);
            Alert.alert("Error", "Failed to pick video.");
        }
    };

    const queueVideo = async (asset: ImagePicker.ImagePickerAsset) => {
        setUploading(true);
        try {
            const clientVideoId = generateUUID();
            const now = Date.now();

            const newVideo: Video = {
                id: clientVideoId,
                job_id: jobId,
                file_uri: asset.uri,
                status: 'PENDING',
                retry_count: 0,
                created_at: now,
                updated_at: now
            };

            // 1. Save to Local DB
            await VideosRepo.add(newVideo);


            await SyncQueueRepo.add('VIDEO_UPLOAD', {
                clientVideoId: clientVideoId,
                jobId: jobId
            });

            // 3. Trigger Sync (Background)
            if (isOnline) {
                SyncManager.processQueue();
            }

            await loadVideos();
            Alert.alert("Queued", "Video added to upload queue.");
        } catch (error) {
            console.error("Queue error", error);
            Alert.alert("Error", "Failed to queue video.");
        } finally {
            setUploading(false);
        }
    };

    const handleRetry = async (video: Video) => {
        await VideosRepo.updateStatus(video.id, 'PENDING');

        await SyncQueueRepo.add('VIDEO_UPLOAD', {
            clientVideoId: video.id,
            jobId: jobId
        });
        SyncManager.processQueue();
    };

    return (
        <View className="px-[18px] mt-[18px] gap-[14px]">
            {/* Upload Card */}
            <View className="bg-white rounded-[18px] p-4 shadow-black/5 shadow-sm elevation-2">
                <View className="border-2 border-primary rounded-[18px] py-7 items-center justify-center bg-[#F9FBFF]">
                    <View className="w-[54px] h-[54px] rounded-2xl bg-[#EAF2FF] items-center justify-center">
                        <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
                    </View>

                    <Text className="mt-3.5 text-sm font-extrabold text-gray-900">
                        Upload Site Video
                    </Text>

                    <Text className="mt-1.5 text-[11px] text-gray-500">
                        Select video to queue for upload
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={uploading}
                        className={`mt-3.5 px-[18px] py-2.5 rounded-2xl shadow-md elevation-4 flex-row items-center gap-2 ${uploading ? "bg-gray-400" : "bg-primary shadow-primary/25"}`}
                        onPress={handleUpload}
                    >
                        {uploading && <ActivityIndicator size="small" color="#fff" />}
                        <Text className="text-white text-xs font-extrabold">
                            {uploading ? "Processing..." : "Browse Files"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Videos List */}
            {videos.length > 0 && (
                <View className="gap-3">
                    <Text className="text-xs font-bold text-gray-700 ml-1">Job Videos</Text>
                    {videos.map(video => (
                        <View key={video.id} className="bg-white rounded-[16px] p-3 flex-row items-center gap-3 shadow-sm elevation-1">
                            <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center">
                                <Ionicons name="videocam" size={20} color="#64748B" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-900" numberOfLines={1}>
                                    Video {video.id.slice(0, 8)}...
                                </Text>
                                <Text className={`text-[10px] font-bold mt-0.5 ${video.status === 'FAILED' ? 'text-red-500' :
                                    video.status === 'UPLOADED' ? 'text-green-600' : 'text-blue-500'
                                    }`}>
                                    {video.status === 'UPLOADING' ? 'Uploading...' :
                                        video.status === 'PENDING' ? 'Waiting for Sync' :
                                            video.status}
                                    {video.status === 'FAILED' && video.error_message ? ` - ${video.error_message}` : ''}
                                </Text>
                            </View>
                            {video.status === 'FAILED' && (
                                <TouchableOpacity onPress={() => handleRetry(video)} className="p-2">
                                    <Ionicons name="refresh" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                            {video.status === 'UPLOADING' && (
                                <ActivityIndicator size="small" color="#2563EB" />
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Empty State */}
            {videos.length === 0 && (
                <View className="bg-white rounded-[18px] py-[22px] items-center justify-center shadow-black/5 shadow-sm elevation-2">
                    <Ionicons name="videocam-outline" size={28} color="#64748B" />
                    <Text className="mt-2.5 text-[11px] text-gray-500">
                        No videos in queue
                    </Text>
                </View>
            )}

            {/* Sync Status */}
            <View className="bg-white rounded-2xl p-[14px] flex-row items-center gap-2.5 shadow-black/5 shadow-sm elevation-2">
                <View className={`w-[34px] h-[34px] rounded-[14px] items-center justify-center ${isOnline ? "bg-[#E9FFF2]" : "bg-red-50"}`}>
                    <Ionicons name={isOnline ? "wifi-outline" : "wifi-sharp"} size={18} color={isOnline ? "#16A34A" : "#EF4444"} />
                </View>

                <View>
                    <Text className="text-[13px] font-extrabold text-gray-900">
                        Sync Status
                    </Text>
                    <Text className="text-[11px] text-gray-500 mt-px">
                        {isOnline ? "Videos upload automatically when ready" : "Videos queued for offline upload"}
                    </Text>
                </View>
            </View>
        </View>
    );
}
