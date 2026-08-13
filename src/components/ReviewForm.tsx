import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { canReviewBooking } from '@cerca/src';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

interface ReviewFormProps {
  onSubmit: () => void;
}
export function ReviewForm({onSubmit}: ReviewFormProps){
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
  
    const eligibility = canReviewBooking(
      actor,
      booking,
      new Date('2026-08-11T12:00:00.000Z'),
    );
    // -------------------------
  // FORMULARIO
  // -------------------------

  const submitReview = () => {
    if (rating === 0) {
      Alert.alert(
        'Rating required',
        'Please select a rating.',
      );
      return;
    }

    if (!comment.trim()) {
      Alert.alert(
        'Comment required',
        'Please write a comment.',
      );
      return;
    }

    // Por ahora no hay API.
    console.log({
      bookingId: booking.id,
      rating,
      comment: comment.trim(),
    });

    Alert.alert(
      'Review submitted',
      'Your review has been saved.',
    );
  };

  return (
    <View style={styles.container}>
        <View style={styles.navbar}>
                    <Pressable onPress={() => router.push('/')}>
                        <MaterialIcons
            name="close"
            size={24}
            color="#0369A1"
          />
                    </Pressable>
                    <Text>Review</Text>
                </View>

      <Text style={styles.stepLabel}>
        Review
      </Text>

      <Text style={styles.title}>
        Leave a review
      </Text>

      <Text style={styles.description}>
        Share your experience with this service.
      </Text>

      {/* RATING */}

      <View style={styles.section}>
        <Text style={styles.label}>
          How was your experience?
        </Text>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setRating(star)}
              hitSlop={8}
            >
              <Text
                style={[
                  styles.star,
                  star <= rating && styles.starSelected,
                ]}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingText}>
            {getRatingText(rating)}
          </Text>
        )}
      </View>

      {/* COMMENT */}

      <View style={styles.section}>
        <Text style={styles.label}>
          Tell us about your experience
        </Text>

        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Write your review..."
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
          textAlignVertical="top"
          style={styles.textarea}
        />

        <Text style={styles.counter}>
          {comment.length}/500
        </Text>
      </View>

      {/* BUTTON */}

      <Pressable
        onPress={onSubmit}
        disabled={rating === 0 || !comment.trim()}
        style={[
          styles.button,
          (rating === 0 || !comment.trim()) &&
            styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          Submit review
        </Text>
      </Pressable>

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
    padding: 24,
    backgroundColor: '#F8FAFC',
    gap: 20,
  },
  navbar:{
    flexDirection: 'row',
    
  },
  stepLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  description: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },

  section: {
    gap: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },

  stars: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  star: {
    fontSize: 42,
    color: '#CBD5E1',
  },

  starSelected: {
    color: '#F59E0B',
  },

  ratingText: {
    color: '#64748B',
    fontSize: 14,
  },

  textarea: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFF',
    padding: 14,
    fontSize: 16,
  },

  counter: {
    textAlign: 'right',
    color: '#94A3B8',
    fontSize: 12,
  },

  button: {
    backgroundColor: '#075985',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  blockedCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },

  blockedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  blockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#991B1B',
    textAlign: 'center',
  },

  blockedMessage: {
    color: '#7F1D1D',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});