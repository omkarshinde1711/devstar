import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const formData = await request.formData();
  const file = formData.get('image');

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:image/${file.type.split('/')[1]};base64,${buffer.toString('base64')}`;
    return json({ imageUrl: base64Image });
  }

  return json({ error: 'No image provided' }, { status: 400 });
}
