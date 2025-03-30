type CreateFeedbackResponse = { id: string };

export const createFeedback = async (params: {
  type: string;
  page: string;
  content: string;
}): Promise<CreateFeedbackResponse> => {
  const res = await fetch('/api/notion/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  return res.json();
};
