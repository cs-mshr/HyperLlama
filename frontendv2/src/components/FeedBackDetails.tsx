import React from 'react';

interface Feedback {
  id: number;
  booking: number;
  rating: number;
  comment: string;
}

const FeedbackDetails: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  return (
    <div className="mb-4">
      <p>Booking ID: {feedback.booking}</p>
      <p>Rating: {feedback.rating}</p>
      <p>Comment: {feedback.comment}</p>
    </div>
  );
};

export default FeedbackDetails;
