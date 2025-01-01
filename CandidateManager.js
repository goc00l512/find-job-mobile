import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import Global from "./Global";
import RNPickerSelect from 'react-native-picker-select';

const { height } = Dimensions.get('window');

const avatar = require('./assets/ava1.png');

export default function CandidateManager({ navigation, route }) {
  const [applications, setApplications] = useState([]);
  const { job } = route.params;

  const handleJobDetail = (jobId) => {
    navigation.navigate("Job", { jobId: jobId });
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
      const response = await fetch(`http://34.87.67.60/post-service/candidate-applied?idPost=${job?.id}`, {
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
        setApplications(result.data.map(application => ({
          ...application,
          dateSubmit: application.dateSubmit ? parseInt(application.dateSubmit) : null,
        })));
      } else {
        console.warn("No jobs found or invalid data format.");
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setApplications([]);
    }
  };

  const changeStatus = async (newStatus, candidateId) => {
    const body = {
      idPost: job?.id,
      status: newStatus,
      idCandidate: candidateId,
    }
    try {
      const response = await fetch(`http://34.87.67.60/post-service/jobs-applied/editStatus`, {
        method: 'POST',
        headers: {
          'Authorization': Global.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      setApplications([]);
    }
  };

  const jobsToShow = [job];

  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp).getTime())) {
      return 'Ngày không hợp lệ';
    }

    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const downloadResume = (resumeLink) => {
    if (resumeLink) {
      Linking.openURL(resumeLink).catch((err) => console.error('Failed to open URL:', err));
    } else {
      alert('Không có CV để tải về');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={height * 0.025} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.featuredJobsContainer}>
          <Text style={styles.featuredJobsTitle}>Công việc</Text>

          {jobsToShow.map((job, index) => (
            <TouchableOpacity key={index} style={styles.jobCard} onPress={() => handleJobDetail(job?.id)}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.jobTypeContainer}>
                <Text style={styles.jobType}>
                  {job?.employmentType || "INTERNSHIP"}
                </Text>
                <Text style={styles.salary}>
                  {`Salary: $${formatter.format(job?.salary?.min?.toString())} - $${formatter.format(job?.salary?.max?.toString())}`}
                </Text>
              </View>

              <View style={styles.companyContainer}>
                <Image source={require('./assets/google.png')} style={styles.companyLogo} />
                <Text style={styles.companyName}>{job?.companyName ?? ""}</Text>
              </View>

              <View style={styles.jobLocationContainer}>
                <Ionicons
                  name="location-outline"
                  size={height * 0.018}
                  color="gray"
                />
                <Text style={styles.jobLocation}>{`${job?.location?.city ?? "-"} ${job?.location?.address ?? ""}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.applicationListTitle}>Danh sách ứng tuyển: {applications.length}</Text>

        {applications.map((application, index) => (
          <View>
            <View key={index} style={styles.applicationCard}>
              <Image source={avatar} style={styles.applicationAvatar} />
              <View style={styles.applicationInfo}>
                <Text style={styles.applicantName}>{application?.name ?? '-'}</Text>
                <Text style={styles.applicationDate}>
                  {application?.dateSubmit ? `Ngày nộp: ${formatDate(application.dateSubmit)}` : '-'}
                </Text>
              </View>

              <TouchableOpacity style={styles.viewButton} onPress={() => downloadResume(application?.resumeLink)}>
                <Ionicons name="search" size={height * 0.025} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  changeStatus(value, application?.idUser);
                }}
                items={[
                  { label: 'Submitted', value: 'Submitted' },
                  { label: 'Under Review', value: 'Under Review' },
                  { label: 'Shortlisted', value: 'Shortlisted' },
                  { label: 'Rejected', value: 'Rejected' },
                  { label: 'Hired', value: 'Hired' },
                ]}
                value={application?.status}
              />
            </View>

            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    height: height * 0.08,
  },
  menuIcon: {
    padding: 10,
  },
  featuredJobsContainer: {
    marginTop: height * 0.01,
  },
  featuredJobsTitle: {
    fontWeight: "bold",
    fontSize: height * 0.03,
    marginBottom: 10,
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
  applicationListTitle: {
    fontWeight: "bold",
    fontSize: height * 0.025,
    marginTop: height * 0.02,
    marginLeft: 10,
    marginBottom: 10,
  },
  applicationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", 
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 15, 
    marginVertical: 10, 
    marginHorizontal: 15, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  applicationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  applicationInfo: {
    flex: 1,
  },
  applicantName: {
    fontWeight: "bold",
  },
  applicationDate: {
    color: "gray",
  },
  applicationStatus: {
    fontWeight: "bold",
  },
  viewButton: {
    padding: 5,
  },
  pickerContainer: {
    width: "95%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 2,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  separator: {
    width: "95%",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 5,
  },
});