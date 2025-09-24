import { supabase } from '../supabaseClient';

export async function saveSummaryToSupabase({ title, summaryType, content, transcript, userId }: any) {
  const { error } = await supabase.from('video_summaries').insert([
    {
      title,
      summary_type: summaryType,
      content,
      transcript,
      user_id: userId,
      created_at: new Date(),
    }
  ]);
  if (error) throw error;
}

export async function summarizeYouTube(videoUrl: string) {
  const res = await fetch('http://localhost:5000/api/summarize/youtube', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoUrl }),
  });
  return await res.json();
}

export async function summarizeLocalVideo(file: File) {
  const formData = new FormData();
  formData.append('video', file);
  const res = await fetch('http://localhost:5000/api/summarize/local', {
    method: 'POST',
    body: formData,
  });
  return await res.json();
}
