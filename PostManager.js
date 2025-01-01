import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CustomHeaderRecruiter from "./CustomHeaderRecruiter";
import { useFocusEffect } from "@react-navigation/native";
import Global from "./Global";

const { height } = Dimensions.get("window");

export default function PostManager({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const handleEditJob = async (jobTitle) => {
    const dataDetail = await getDetailJob(jobTitle);
    if (!dataDetail) {
      return;
    }
    navigation.navigate("JobPosting", { job: dataDetail });
  };

  const getDetailJob = async (jobId) => {
    try {
      const response = await fetch(
        `http://34.87.67.60/post-service/job/detail/${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();

      if (result?.data) {
        return result.data;
      } else {
        console.warn("No job found or invalid data format.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const response = await fetch("http://34.87.67.60/post-service/job/opened", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: Global.token,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();
      if (result?.data && Array.isArray(result.data)) {
        setJobs(result.data);
      } else {
        console.warn("No jobs found or invalid data format.");
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setJobs([]);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(
        `http://34.87.67.60/post-service/job/delete?idPost=${jobId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: Global.token,
          },
        }
      );

      const result = await response.json();

      if (result?.success) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        Alert.alert("Thành công", "Công việc đã được xóa thành công.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa công việc. Vui lòng thử lại sau.");
    }
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <View style={styles.container}>
      <CustomHeaderRecruiter
        search={search}
        onSearchChange={(text) => setSearch(text)}
        onApplyFilter={() => {}}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.featuredJobsContainer}>
          <Text style={styles.featuredJobsTitle}>Công việc đã đăng</Text>

          <View>
            {jobs.map((job, index) => (
              <TouchableOpacity
                key={index}
                style={styles.jobCard}
                onPress={() => {
                  navigation.navigate("CandidateManager", { job: job });
                }}
              >
                <Text style={styles.jobTitle}>{job?.title}</Text>
                <View style={styles.jobTypeContainer}>
                  <Text style={styles.jobType}>{job?.employmentType}</Text>
                  <Text style={styles.salary}>{`Salary: $${formatter.format(
                    job?.salary?.min?.toString()
                  )} - $${formatter.format(
                    job?.salary?.max?.toString()
                  )}`}</Text>
                </View>

                <View style={styles.companyContainer}>
                  <Image
                    source={require("./assets/google.png")}
                    style={styles.companyLogo}
                  />
                  <Text style={styles.companyName}>
                    {job?.companyName ?? ""}
                  </Text>
                </View>

                <View style={styles.jobLocationContainer}>
                  <Ionicons
                    name="location-outline"
                    size={height * 0.018}
                    color="gray"
                  />
                  <Text style={styles.jobLocation}>{`${
                    job?.location?.city ?? "-"
                  } ${job?.location?.address ?? ""}`}</Text>
                </View>

                <View style={styles.additionalInfoContainer}>
                  <Text style={styles.applicantCount}>
                    Số lượng ứng tuyển: {job?.numberApplicant}
                  </Text>
                </View>

                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => handleEditJob(job?.id)}
                    style={styles.icon}
                  >
                    <FontAwesome
                      name="pencil"
                      size={height * 0.022}
                      color="gray"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteJob(job?.id)}
                    style={styles.icon}
                  >
                    <FontAwesome
                      name="trash"
                      size={height * 0.022}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  featuredJobsContainer: {
    marginTop: height * 0.01,
  },
  featuredJobsTitle: {
    fontWeight: "bold",
    fontSize: height * 0.03,
    marginBottom: 5,
    marginLeft: 10,
  },
  jobCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, 
    padding: 15, 
    marginVertical: 10, 
    marginHorizontal: 15,
    backgroundColor: "#ffffff", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  jobTitle: {
    fontSize: height * 0.022,
    fontWeight: "bold",
  },
  jobTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  jobType: {
    color: "gray",
  },
  salary: {
    color: "green",
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  companyLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  companyName: {
    fontWeight: "bold",
  },
  jobLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  jobLocation: {
    marginLeft: 5,
  },
  additionalInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
  },
  applicantCount: {
    color: "gray",
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
});