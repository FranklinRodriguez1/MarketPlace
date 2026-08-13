import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { canReviewBooking } from '@cerca/src';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ReviewFormProps {
  onSubmit: () => void;
}
export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Datos temporales mientras no usamos API
  const actor = {
    id: 'user-2',
  };

  const booking = {
    id: 'booking-2',
    customerId: 'user-2',
    reviewId: null,

    status: {
      kind: 'completed' as const,
      completedAt: '2026-08-10T12:00:00.000Z',
    },
  };

  const eligibility = canReviewBooking(actor, booking, new Date('2026-08-11T12:00:00.000Z'));
  // -------------------------
  // FORMULARIO
  // -------------------------

  const submitReview = () => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a rating.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Comment required', 'Please write a comment.');
      return;
    }

    // Por ahora no hay API.
    console.log({
      bookingId: booking.id,
      rating,
      comment: comment.trim(),
    });

    Alert.alert('Review submitted', 'Your review has been saved.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.navbar}>
        <Pressable onPress={() => router.push('/')}>
          <MaterialIcons name="close" size={24} color={theme.primary} />
        </Pressable>
        <Text>Review</Text>
      </View>

      <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>Review</Text>

      <Text style={[styles.title, { color: theme.text }]}>Leave a review</Text>

      <Text style={[styles.description, { color: theme.textSecondary }]}>
        Share your experience with this service.
      </Text>

      {/* RATING */}

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>How was your experience?</Text>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
              <Text
                style={[
                  styles.star,
                  { color: theme.border },
                  star <= rating && styles.starSelected,
                ]}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        {rating > 0 && (
          <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
            {getRatingText(rating)}
          </Text>
        )}
      </View>

      {/* COMMENT */}

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Tell us about your experience</Text>

        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Write your review..."
          placeholderTextColor={theme.textSecondary}
          multiline
          maxLength={500}
          textAlignVertical="top"
          style={[
            styles.textarea,
            { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text },
          ]}
        />

        <Text style={[styles.counter, { color: theme.textSecondary }]}>{comment.length}/500</Text>
      </View>

      {/* BUTTON */}

      <Button
        label="Submit review"
        onPress={submitReview}
        disabled={rating === 0 || !comment.trim()}
      />
    </View>
  );
}
function getRatingText(rating: number) {
  switch (rating) {
    case 1:
      return 'Very bad';

    case 2:
      return 'Bad';

    case 3:
      return 'Okay';

    case 4:
      return 'Good';

    case 5:
      return 'Excellent';

    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.five,
  },
  navbar: {
    flexDirection: 'row',
  },
  stepLabel: {
    fontSize: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
  },

  section: {
    gap: Spacing.two,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
  },

  stars: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },

  star: {
    fontSize: 42,
  },

  starSelected: {
    color: '#F59E0B',
  },

  ratingText: {
    fontSize: 14,
  },

  textarea: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: BorderRadius.input,
    padding: Spacing.three,
    fontSize: 16,
  },

  counter: {
    textAlign: 'right',
    fontSize: 12,
  },
});
