type CreateFeedbackResponse = { id: string };

export const createFeedback = async (params: {
  type: string;
  page: string;
  content: string;
  email?: string;
}): Promise<CreateFeedbackResponse> => {
  const res = await fetch('/api/notion/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error('');
  }

  return res.json();
};
