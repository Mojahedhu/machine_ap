import { heicTo } from "heic-to";

self.onmessage = async (e: MessageEvent<File>) => {
  try {
    const file = e.data;

    const convertedBlob = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.9,
    });

    self.postMessage({
      success: true,
      blob: convertedBlob,
    });
  } catch (error) {
    console.log("heic conversion error 18", error);
    self.postMessage({
      success: false,
      error: "Conversion failed",
    });
  }
};
