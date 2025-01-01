import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Image, 
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "@react-navigation/native";
import Global from './Global';

const { height } = Dimensions.get('window');

export default function UserDetail({ navigation }) {
  const [avatarUri, setAvatarUri] = useState(require('./assets/ava1.png'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [birthday, setBirthday] = useState('05/12/2003');
  const [location, setLocation] = useState('Da Nang');
  const [phone, setPhone] = useState(''); 
  const [gender, setGender] = useState(''); 
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://user-service-job-system.onrender.com/api/user/profile/" + Global.userId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: Global.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();
      if (result?.name) {
        setName(result?.name);
        setEmail(result?.email);
        // setLocation(result?.location);
        setPhone(result?.phone);
        setGender(result?.gender === 'male' ? 'Nam' : 'Nữ');
        setEducation(result?.education ?? []);
        setSkills(result?.skills ?? []);
        setExperience(result?.experience ?? []);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
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

  const handleAvatarPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri({ uri: result.uri });
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

      <ScrollView style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarInfoContainer}>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image source={avatarUri} style={styles.avatarLarge} />
            </TouchableOpacity>
            <View>
              <Text style={styles.userName}>{name}</Text>

              <View style={styles.infoItem}>
                <MaterialIcons name="email" size={height * 0.02} color="black" />
                <Text style={styles.infoText}>{email}</Text>
              </View>

              <View style={styles.infoItem}>
                <FontAwesome name="birthday-cake" size={height * 0.02} color="black" />
                <Text style={styles.infoTextMuted}>{birthday}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location" size={height * 0.02} color="black" />
                <Text style={styles.infoText}>{location}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="call" size={height * 0.02} color="black" />
                <Text style={styles.infoText}>{phone}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="male" size={height * 0.02} color="black" />
                <Text style={styles.infoText}>{gender}</Text>
              </View>
            </View>
          </View>

          {['Học vấn', 'Kĩ năng', 'Kinh nghiệm làm việc'].map((title, index) => (
            <View key={index} style={styles.aboutMeSection}>
              <View style={styles.aboutMeHeader}>
                <Text style={styles.aboutMeTitle}>{title}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.aboutMeContent}>
                {title === 'Học vấn' ? (
                  <View>
                    {education.map(item => (
                      <View key={item?._id} style={{ marginBottom: 10, borderBottomWidth: 1 }}>
                        <Text style={styles.aboutMeText}>{item?.school}</Text>
                        <Text style={styles.aboutMeText}>{item?.major}</Text>
                        <Text style={styles.aboutMeText}>{item?.duration}</Text>
                        <Text style={styles.aboutMeText}>{item?.description}</Text>
                      </View>
                    ))}
                  </View>
                ) : title === 'Kĩ năng' ? (
                  <View style={styles.skillContainer}>
                    {skills.map(item => (
                      <View style={styles.skillItem} key={item?.title}>
                        <Text style={styles.skillText}>{item?.title}</Text>
                      </View>
                    ))}
                  </View>
                ) : title === 'Kinh nghiệm làm việc' ? (
                  <View>
                    {experience.map(item => (
                      <View key={item?.company}>
                        <Text style={styles.aboutMeText}>{item?.company}</Text>
                        <Text style={styles.aboutMeText}>{item?.position}</Text>
                        <Text style={styles.aboutMeText}>{item?.duration}</Text>
                        <Text style={styles.aboutMeText}>{item?.description}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          Global.token = '';
          Global.userId = '';
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
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
  userInfoContainer: {
    padding: 20,
  },
  avatarInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarLarge: {
    width: height * 0.12,
    height: height * 0.12,
    borderRadius: height * 0.06,
    marginRight: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  infoTextMuted: {
    marginLeft: 10,
    fontSize: 16,
    color: '#777',
  },
  aboutMeSection: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  aboutMeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutMeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutMeContent: {
    marginTop: 10,
  },
  aboutMeText: {
    fontSize: 16,
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 10,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
  },
  skillItem: {
    backgroundColor: '#F3F3F3',
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 20,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});