import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import moment from "moment";
import * as DocumentPicker from "expo-document-picker";
import Global from "./Global";

const { height } = Dimensions.get("window");

const avatar = require("./assets/ava1.png");
const facebookLogo = require("./assets/facebook.png");

export default function JobDetail({ navigation, route }) {
  const { jobId } = route.params; 
  const [job, setJob] = useState(null); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplied, setIsApplied] = useState(false); 

  const fetchData = async () => {
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
        setJob(result.data);
        if (result.data.isApplied) {
          setIsApplied(true); 
        }
      } else {
        console.warn("No job found or invalid data format.");
        setJob(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setJob(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });
    console.log(result)
    if (result?.assets && Array.isArray(result.assets) && result.assets.length > 0) {
      setCvFile(result?.assets[0] ?? null)
    }
  };

  const handleApplyNow = () => {
    setModalVisible(true);
  };

  const applyJob = async () => {
    const formData = new FormData();
    formData.append("resume", {
      name: cvFile.name,
      type: "application/pdf",
      uri: cvFile.uri,
    });
    formData.append("coverLetter", coverLetter);
    formData.append("idPost", jobId);
    console.log("start")
    const response = await fetch(`http://34.87.67.60/post-service/jobs-applied/apply`, {
      method: 'POST',
      headers: {
        'Authorization': Global.token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    console.log(response)
    const result = await response.json();
    console.log(result?.data)
    if (result?.data) {
      Alert.alert("Thành công", "Đã ứng tuyển thành công");
      setIsApplied(true); 
      setModalVisible(false);
      setCoverLetter("");
      setCvFile(null);
    }
  };

  const handleSubmitApplication = () => {
    if (!cvFile) {
      Alert.alert("Lỗi", "Vui lòng tải lên CV của bạn.");
      return;
    }
    applyJob();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Loading job details...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={height * 0.025} color="black" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}>
            <Image source={avatar} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.jobInfoContainer}>
          <Image source={facebookLogo} style={styles.logo} />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={styles.companyInfo}>
              <Text style={styles.companyText}>at {job.companyName}</Text>
              <Text style={styles.fullTimeLabel}>{job.employmentType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.boldText}>Mô tả công việc:</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>

          <Text style={styles.boldText}>Yêu cầu công việc:</Text>
          {job.requirements.map((req, index) => (
            <Text key={index} style={styles.descriptionText}>
              - {req}
            </Text>
          ))}

          <Text style={styles.boldText}>Ngày đăng tin:</Text>
          <Text style={styles.descriptionText}>
            {moment(parseInt(job?.postDate ?? 0) ?? job.postingDate).format(
              "DD/MM/YYYY"
            )}
          </Text>

          <Text style={styles.boldText}>Ngày hết hạn:</Text>
          <Text style={styles.descriptionText}>
            {moment(parseInt(job?.dueDate ?? 0) ?? job.expiryDate).format(
              "DD/MM/YYYY"
            )}
          </Text>

          <View style={styles.salaryLocationContainer}>
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryText}>Mức lương</Text>
              <Text style={styles.salaryAmount}>
                {job.salary.min > 0 && job.salary.max > 0
                  ? `$${job.salary.min} - $${job.salary.max}`
                  : "Thương lượng"}
              </Text>
              <Text style={styles.salaryYearly}>{job.salary.currency}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={24} color="#0BA02C" />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationTextBold}>Địa điểm làm việc</Text>
                <Text style={styles.locationText}>
                  {job.location.city || "Không xác định"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {!isApplied && (
          <View style={styles.applyNowContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyNow}>
              <Text style={styles.applyText}>Ứng tuyển ngay</Text>
              <Ionicons name="chevron-forward-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ứng tuyển công việc</Text>
            <Text style={styles.modalLabel}>CV (PDF)</Text>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={pickDocument}
            >
              <Text style={styles.fileButtonText}>
                {cvFile ? cvFile?.name : "Chọn tệp"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.modalLabel}>Cover Letter</Text>
            <TextInput
              style={styles.coverLetterInput}
              placeholder="Nhập nội dung"
              value={coverLetter}
              onChangeText={setCoverLetter}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!cvFile || coverLetter.length === 0}
                style={[styles.submitButton, (!cvFile || coverLetter.length === 0) && { opacity: 0.4 }]}

                onPress={handleSubmitApplication}
              >
                <Text style={styles.submitButtonText}>Ứng tuyển</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  avatarContainer: {
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  jobInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
    paddingHorizontal: 10,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  jobDetails: {
    flexDirection: "column",
  },
  jobTitle: {
    fontSize: height * 0.022,
    fontWeight: "bold",
    lineHeight: height * 0.03, 
    flexWrap: "wrap", 
    maxWidth: "90%", 
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  companyText: {
    color: "gray",
    fontSize: height * 0.015,
    marginRight: 10,
  },
  fullTimeLabel: {
    backgroundColor: "#0BA02C",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: height * 0.015,
  },
  descriptionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  boldText: {
    fontSize: height * 0.02,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  descriptionText: {
    fontSize: height * 0.018,
    lineHeight: height * 0.025,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  salaryLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 10,
  },
  salaryContainer: {
    flex: 1,
    alignItems: "center",
  },
  salaryText: {
    fontWeight: "bold",
    fontSize: height * 0.018,
  },
  salaryAmount: {
    fontSize: height * 0.02,
    color: "#0BA02C",
    fontWeight: "bold",
  },
  salaryYearly: {
    fontSize: height * 0.016,
    color: "gray",
    fontStyle: "italic",
  },
  divider: {
    width: 1,
    backgroundColor: "lightgray",
    height: 50,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  locationTextContainer: {
    marginLeft: 10,
  },
  locationTextBold: {
    fontWeight: "bold",
    fontSize: height * 0.018,
  },
  locationText: {
    fontSize: height * 0.016,
    color: "gray",
  },
  applyNowContainer: {
    marginTop: height * 0.02,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#374CF4",
    borderRadius: 5,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  applyText: {
    color: "white",
    fontSize: height * 0.02,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: height * 0.025,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: height * 0.02,
    marginVertical: 5,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  fileButtonText: {
    fontSize: height * 0.018,
    color: "#666",
  },
  coverLetterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#374CF4",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});