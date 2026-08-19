// StreamingVideoProvider (SVP) API & Player Integration Helper
// Supports www.streamingvideoprovider.co.uk / www.streamingvideoprovider.com

export const SVP_CONFIG = {
  defaultPlayerUrl: 'https://player.streamingvideoprovider.com/',
  apiUrl: 'https://api.streamingvideoprovider.com/'
};

/**
 * Robustly parses any StreamingVideoProvider input:
 * - Full <iframe> HTML embed code -> extracts src
 * - Full player URL (https://player.streamingvideoprovider.com/?...)
 * - Clip ID / Media ID (e.g. '849204' or 'clip_id=849204')
 * - Direct video file (.mp4, .m3u8)
 */
export function getSvpEmbedUrl(rawInput, options = {}) {
  if (!rawInput || typeof rawInput !== 'string') return '';

  let input = rawInput.trim();
  const { autoplay = true } = options;

  // 1. If it's an <iframe> HTML snippet, extract the src URL
  if (input.includes('<iframe') && input.includes('src=')) {
    const match = input.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      input = match[1];
    }
  }

  // 2. If it's an HTTP/HTTPS URL
  if (input.startsWith('http://') || input.startsWith('https://') || input.startsWith('//')) {
    if (input.startsWith('//')) input = 'https:' + input;

    try {
      const url = new URL(input);
      if (autoplay && !url.searchParams.has('autoplay')) {
        url.searchParams.set('autoplay', '1');
      }
      return url.toString();
    } catch {
      return input;
    }
  }

  // 3. If it's formatted like 'clip_id=12345'
  if (input.toLowerCase().startsWith('clip_id=')) {
    input = input.split('=')[1] || '';
  }

  // 4. Otherwise treat as a numeric or alphanumeric Clip ID
  const cleanId = input.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!cleanId) return '';

  return `https://player.streamingvideoprovider.com/?clip_id=${cleanId}&autoplay=${autoplay ? '1' : '0'}`;
}

/**
 * Checks if a session has an active SVP video configured
 */
export function isSvpVideo(video) {
  if (!video) return false;
  if (video.svpClipId && video.svpClipId.trim().length > 0) return true;
  if (video.svpEmbedUrl && video.svpEmbedUrl.trim().length > 0) return true;
  if (video.videoUrl && (video.videoUrl.includes('streamingvideoprovider') || video.videoUrl.includes('svp'))) return true;
  return false;
}
