/**
 * Color utility functions
 */

/**
 * Convert RGB array to hex color string
 */
export function rgbToHex(rgb: number[]): string {
  if (!rgb || rgb.length !== 3) return '#FFFFFF';

  const [r, g, b] = rgb;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Convert RGB array to CSS rgb() string
 */
export function rgbToString(rgb: number[]): string {
  if (!rgb || rgb.length !== 3) return 'rgb(255, 255, 255)';

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * Get track status color
 */
export function getTrackStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    '1': 'rgb(150, 150, 150)',  // Green
    '2': 'rgb(220, 180, 0)',    // Yellow
    '4': 'rgb(180, 100, 30)',   // Safety Car
    '5': 'rgb(200, 30, 30)',    // Red
    '6': 'rgb(200, 130, 50)',   // VSC
    '7': 'rgb(200, 130, 50)',   // VSC ending
  };

  return statusMap[status] || statusMap['1'];
}

/**
 * Get track status name
 */
export function getTrackStatusName(status: string): string {
  const statusMap: Record<string, string> = {
    '1': 'Green Flag',
    '2': 'Yellow Flag',
    '4': 'Safety Car',
    '5': 'Red Flag',
    '6': 'Virtual Safety Car',
    '7': 'VSC Ending',
  };

  return statusMap[status] || 'Green Flag';
}
