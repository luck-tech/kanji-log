import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/common/Button';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/(onboarding)/features');
  };

  return (
    <View style={styles.container}>
      {/* Background Image with Overlay */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(79, 70, 229, 0.8)', 'rgba(99, 102, 241, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="people" size={32} color="white" />
              </View>
              <Text style={styles.appName}>幹事ナビ</Text>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <Text style={styles.title}>
                幹事の負担を
                {'\n'}劇的に軽減
              </Text>
              <Text style={styles.subtitle}>
                イベントの企画から開催まで、
                {'\n'}すべてをスマートに管理できる
                {'\n'}幹事専用アプリです
              </Text>
            </View>

            {/* Call to Action */}
            <View style={styles.callToAction}>
              <Button
                title="はじめる"
                onPress={handleGetStarted}
                variant="secondary"
                size="lg"
                fullWidth
                icon={
                  <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
                }
                textStyle={{ color: '#3b82f6', fontWeight: '600' }}
              />
              <Text style={styles.disclaimer}>
                続行することで、利用規約とプライバシーポリシーに同意したものとみなされます
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(219, 234, 254, 1)',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  callToAction: {
    marginTop: 'auto',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(219, 234, 254, 1)',
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
    lineHeight: 16,
  },
});
