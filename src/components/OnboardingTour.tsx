import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  LayoutRectangle,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, fonts } from '../theme';
import { ONBOARDING_KEY } from '../constants';
import { enablePushNotifications } from '../notifications';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface TourTargets {
  dateNavigation?: LayoutRectangle;
  scorePill?: LayoutRectangle;
  labels?: LayoutRectangle;
  settingsButton?: LayoutRectangle;
}

interface OnboardingTourProps {
  targets: TourTargets;
  onComplete: () => void;
  onNotificationsEnabled: () => void;
}

interface TourStep {
  key: keyof TourTargets | 'notifications';
  title: string;
  description: string;
  emoji: string;
  tooltipPosition: 'top' | 'bottom';
  isFullScreen?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    key: 'dateNavigation',
    title: 'Browse Games',
    description: 'Swipe left or right to see past games and upcoming schedules. Yesterday\'s games are shown by default.',
    emoji: '📅',
    tooltipPosition: 'bottom',
  },
  {
    key: 'scorePill',
    title: 'Excitement Score',
    description: 'Every game gets a score from 1 to 10. Higher means more drama, closer finishes, and memorable moments. A 10 is an instant classic you can\'t miss!',
    emoji: '🔥',
    tooltipPosition: 'bottom',
  },
  {
    key: 'labels',
    title: 'Game Labels',
    description: 'Over 30 unique labels highlight what made each game special, wild comebacks, clutch shots, scoring explosions, and more. All calculated from real game data!',
    emoji: '🏷️',
    tooltipPosition: 'top',
  },
  {
    key: 'notifications',
    title: 'Morning Alerts',
    description: 'Get a single notification each morning with a quick preview of last night\'s best games. Never miss a must-watch recap!',
    emoji: '🔔',
    tooltipPosition: 'bottom',
    isFullScreen: true,
  },
  {
    key: 'settingsButton',
    title: 'Settings & More',
    description: 'Manage notifications and labels, or check out Behind the Scenes to learn more about the app and discover ways to support the project.',
    emoji: '⚙️',
    tooltipPosition: 'bottom',
  },
];

export default function OnboardingTour({
  targets,
  onComplete,
  onNotificationsEnabled,
}: OnboardingTourProps) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spotlightAnim = useRef(new Animated.Value(0)).current;

  // Check if onboarding was already completed
  useEffect(() => {
    (async () => {
      try {
        // DEV MODE: Always show tour (comment out the check below to restore normal behavior)
        const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
          // Small delay to let the app render first
          setTimeout(() => {
            setVisible(true);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }).start();
          }, 800);
        }
      } catch (e) {
        // Ignore errors
      } finally {
        setHasCheckedStorage(true);
      }
    })();
  }, []);

  // Animate spotlight when step changes
  useEffect(() => {
    if (visible) {
      spotlightAnim.setValue(0);
      Animated.spring(spotlightAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, visible]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    } catch (e) {
      // Ignore
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onComplete();
    });
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const handleEnableNotifications = async () => {
    const result = await enablePushNotifications();
    if (result.success) {
      onNotificationsEnabled();
    }
    handleNext();
  };

  if (!visible || !hasCheckedStorage) {
    return null;
  }

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isNotificationStep = step.key === 'notifications';
  // Only allow skipping on the first 3 steps (not on notifications or settings)
  const canSkip = currentStep < 3;
  const targetRect = step.key !== 'notifications' ? targets[step.key as keyof TourTargets] : null;

  // Calculate spotlight and tooltip positions
  const getSpotlightStyle = () => {
    if (!targetRect || step.isFullScreen) {
      return null;
    }
    
    const padding = 8;
    return {
      left: targetRect.x - padding,
      top: targetRect.y - padding,
      width: targetRect.width + padding * 2,
      height: targetRect.height + padding * 2,
      borderRadius: radius.md,
    };
  };

  const getTooltipStyle = () => {
    if (step.isFullScreen || !targetRect) {
      // Center the tooltip for full-screen steps
      return {
        left: spacing.lg,
        right: spacing.lg,
        top: SCREEN_HEIGHT * 0.3,
      };
    }

    const tooltipWidth = SCREEN_WIDTH - spacing.lg * 2;
    const left = spacing.lg;

    if (step.tooltipPosition === 'bottom') {
      return {
        left,
        width: tooltipWidth,
        top: targetRect.y + targetRect.height + 16,
      };
    } else {
      return {
        left,
        width: tooltipWidth,
        bottom: SCREEN_HEIGHT - targetRect.y + 16,
      };
    }
  };

  const spotlightStyle = getSpotlightStyle();
  const tooltipStyle = getTooltipStyle();

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Dark overlay with cutout for spotlight */}
        <View style={styles.overlayBackground}>
          {/* Top section */}
          {spotlightStyle && (
            <>
              <View style={[styles.overlaySection, { height: spotlightStyle.top }]} />
              {/* Middle section with left, spotlight, right */}
              <View style={styles.middleRow}>
                <View style={[styles.overlaySection, { width: spotlightStyle.left }]} />
                <Animated.View 
                  style={[
                    styles.spotlight, 
                    {
                      width: spotlightStyle.width,
                      height: spotlightStyle.height,
                      borderRadius: spotlightStyle.borderRadius,
                      transform: [{ scale: spotlightAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }) }],
                      opacity: spotlightAnim,
                    }
                  ]} 
                />
                <View style={[styles.overlaySection, { flex: 1 }]} />
              </View>
              {/* Bottom section */}
              <View style={[styles.overlaySection, { flex: 1 }]} />
            </>
          )}
          {!spotlightStyle && (
            <View style={[styles.overlaySection, { flex: 1 }]} />
          )}
        </View>

        {/* Tooltip Card */}
        <Animated.View 
          style={[
            styles.tooltipCard, 
            tooltipStyle,
            {
              opacity: spotlightAnim,
              transform: [{ 
                translateY: spotlightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }],
            }
          ]}
        >
          <View style={styles.tooltipHeader}>
            <Text style={styles.tooltipEmoji}>{step.emoji}</Text>
            <Text style={styles.tooltipTitle}>{step.title}</Text>
          </View>
          <Text style={styles.tooltipDescription}>{step.description}</Text>

          {/* Progress dots */}
          <View style={styles.progressRow}>
            {TOUR_STEPS.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]} 
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {canSkip && (
              <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip Tour</Text>
              </Pressable>
            )}
            
            {isNotificationStep ? (
              <View style={styles.notificationButtons}>
                <Pressable style={styles.enableButton} onPress={handleEnableNotifications}>
                  <Text style={styles.enableButtonText}>Enable Notifications</Text>
                </Pressable>
                <Pressable style={styles.laterButton} onPress={handleNext}>
                  <Text style={styles.laterButtonText}>Maybe Later</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {isLastStep ? "Let's Go" : 'Next'}
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySection: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  spotlight: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: colors.accentFlow,
    shadowColor: colors.accentFlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  tooltipCard: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tooltipEmoji: {
    fontSize: 28,
  },
  tooltipTitle: {
    color: colors.textPrimary,
    fontSize: fonts.title,
    fontWeight: '700',
  },
  tooltipDescription: {
    color: colors.textSecondary,
    fontSize: fonts.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.accentFlow,
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.body,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: colors.accentFlow,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginLeft: 'auto',
  },
  nextButtonText: {
    color: colors.card,
    fontSize: fonts.body,
    fontWeight: '700',
  },
  notificationButtons: {
    flex: 1,
    gap: spacing.sm,
  },
  enableButton: {
    backgroundColor: colors.accentFlow,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  enableButtonText: {
    color: colors.card,
    fontSize: fonts.body,
    fontWeight: '700',
  },
  laterButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  laterButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.body,
    fontWeight: '500',
  },
});
