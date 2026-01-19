import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "@/store/auth.store";
import AppSearchBar from "../../src/components/common/AppSearchBar";
import { FAB } from "../../src/components/common/FAB";
import HomeHeader from "../../src/components/home/HomeHeader";
import { JobList } from "../../src/components/jobs/JobList";
import { JobsRepo } from "../../src/db/repositories/jobs.repo";
import { SyncManager } from "../../src/sync/syncManager";
import { Job } from "../../src/types/models";

export default function HomeScreen() {
  const router = useRouter();
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

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      try {
        await SyncManager.pullUpdates();
      } catch (e) {
        console.error(e)
      } finally {
        await loadJobs();
      }
    };
    bootstrap();
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [])
  );
  const user = useAuthStore((state) => state.user);
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-14 pb-5 bg-white">
        <HomeHeader userName={user?.name} />

        {/* Search Bar */}
        <AppSearchBar containerStyle="mt-4" placeholder="Search jobs..." />
      </View>
      <JobList
        jobs={jobs}
        loading={loading}
        onRefresh={loadJobs}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListHeaderComponent={
          <View className="px-6 pt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">Your Jobs ({jobs.length})</Text>
            </View>
          </View>
        }
      />

      {/* Floating Plus Button */}
      <FAB onPress={() => router.push("/jobs/create")} />
    </View>
  );
}
