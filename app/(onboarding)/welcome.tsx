import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/common/Button';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

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
          style={styles.overlay}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="people" size={32} color={Colors.white} />
              </View>
              <Text style={styles.appName}>幹事ナビ</Text>
            </View>

            {/* Main Content */}
            <View style={styles.main}>
              <Text style={styles.title}>
                幹事の負担を
                {'\n'}劇的に軽減
              </Text>
              <Text style={styles.description}>
                イベントの企画から開催まで、
                {'\n'}すべてをスマートに管理できる
                {'\n'}幹事専用アプリです
              </Text>
            </View>

            {/* Call to Action */}
            <View style={styles.footer}>
              <Button
                title="はじめる"
                onPress={handleGetStarted}
                variant="secondary"
                size="lg"
                fullWidth
                icon={<Ionicons name="arrow-forward" size={20} color={Colors.primary[600]} />}
                style={styles.startButton}
                textStyle={styles.startButtonText}
              />
              <Text style={styles.terms}>
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
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.xl + 20,
    paddingBottom: Layout.padding.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.xl,
    backgroundColor: Colors.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  appName: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: '600',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.padding.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    fontWeight: '700',
    fontSize: 36,
    lineHeight: 44,
  },
  description: {
    ...Typography.body1,
    color: Colors.primary[100],
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  footer: {
    marginTop: 'auto',
  },
  startButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 6,
  },
  startButtonText: {
    color: Colors.primary[600],
    fontWeight: '600',
  },
  terms: {
    ...Typography.caption,
    color: Colors.primary[100],
    textAlign: 'center',
    marginTop: Layout.spacing.md,
    opacity: 0.7,
    lineHeight: 16,
  },
});
