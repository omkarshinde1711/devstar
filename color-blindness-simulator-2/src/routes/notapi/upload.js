import Jimp from 'jimp';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('image');

  if (!file) {
    return new Response('No image uploaded', { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const image = await Jimp.read(buffer);

  // Define color blindness transformations
  const transformations = {
    deuteranopia: new Jimp(image.bitmap.width, image.bitmap.height),
    protanopia: new Jimp(image.bitmap.width, image.bitmap.height),
    tritanopia: new Jimp(image.bitmap.width, image.bitmap.height),
  };

  // Apply filters for each type
  transformations.deuteranopia = image.clone().color([
    { apply: 'red', params: [0.8] },
    { apply: 'green', params: [0.2] },
    { apply: 'blue', params: [0.2] }
  ]);

  transformations.protanopia = image.clone().color([
    { apply: 'red', params: [0.6] },
    { apply: 'green', params: [0.4] },
    { apply: 'blue', params: [0.1] }
  ]);

  transformations.tritanopia = image.clone().color([
    { apply: 'red', params: [0.9] },
    { apply: 'green', params: [0.1] },
    { apply: 'blue', params: [0.2] }
  ]);

  // Convert images to base64
  const base64Images = {};
  for (const [key, img] of Object.entries(transformations)) {
    base64Images[key] = await img.getBase64Async(Jimp.MIME_JPEG);
  }

  // Return all images
  return new Response(JSON.stringify({
    originalImage: await image.getBase64Async(Jimp.MIME_JPEG),
    ...base64Images
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
