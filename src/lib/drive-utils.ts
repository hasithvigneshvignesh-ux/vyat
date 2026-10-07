export function formatGoogleDriveUrl(url: string): { embedUrl: string | null; fileId: string | null; isValid: boolean } {
  if (!url) {
    return { embedUrl: null, fileId: null, isValid: false };
  }

  // Common Google Drive link patterns
  // 1. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // 2. https://drive.google.com/open?id=FILE_ID
  // 3. https://drive.google.com/file/d/FILE_ID/preview
  // 4. https://drive.google.com/uc?id=FILE_ID

  let fileId = null;

  try {
    const parsedUrl = new URL(url);

    // YouTube Pattern
    if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
      let videoId = null;
      if (parsedUrl.hostname.includes('youtu.be')) {
        videoId = parsedUrl.pathname.slice(1);
      } else {
        videoId = parsedUrl.searchParams.get('v');
      }
      if (videoId) {
        return {
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          fileId: videoId,
          isValid: true
        };
      }
    }

    // Pattern 1 & 3: /file/d/FILE_ID/...
    if (parsedUrl.pathname.includes('/file/d/')) {
      const parts = parsedUrl.pathname.split('/');
      const dIndex = parts.indexOf('d');
      if (dIndex !== -1 && parts.length > dIndex + 1) {
        fileId = parts[dIndex + 1];
      }
    } 
    // Pattern 2 & 4: /open?id=FILE_ID or /uc?id=FILE_ID
    else if (parsedUrl.searchParams.has('id')) {
      fileId = parsedUrl.searchParams.get('id');
    }

    if (fileId) {
      return {
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        fileId: fileId,
        isValid: true
      };
    }
  } catch (e) {
    // Invalid URL format
  }

  return { embedUrl: null, fileId: null, isValid: false };
}
