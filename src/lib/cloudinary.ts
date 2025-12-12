/**
 * Helper function para generar URLs optimizadas de Cloudinary
 * Preserva la calidad original de las imágenes (85-90) sin sobre-compresión
 */

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: number; // 85-90 para preservar calidad normal
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale';
}

/**
 * Genera una URL optimizada de Cloudinary con parámetros de calidad
 * @param imagePath - Ruta de la imagen en Cloudinary (ej: "The%20Klan/hero-image.jpg")
 * @param options - Opciones de transformación
 * @returns URL completa de Cloudinary con transformaciones aplicadas
 */
export function getCloudinaryImageUrl(
  imagePath: string,
  options?: CloudinaryOptions
): string {
  const baseUrl = 'https://res.cloudinary.com/dxbtafe9u/image/upload';
  const params: string[] = [];

  // Formato automático (WebP/AVIF cuando sea posible)
  params.push(`f_${options?.format || 'auto'}`);

  // Calidad: 85 por defecto (preserva calidad normal sin sobre-compresión)
  // Para imágenes importantes usar 90
  const quality = options?.quality || 85;
  params.push(`q_${quality}`);

  // Dimensiones para evitar escalado excesivo
  if (options?.width) params.push(`w_${options.width}`);
  if (options?.height) params.push(`h_${options.height}`);

  // Crop si es necesario
  if (options?.crop) params.push(`c_${options.crop}`);

  const transforms = params.join(',');
  return `${baseUrl}/${transforms}/${imagePath}`;
}

/**
 * Extrae la ruta de la imagen desde una URL completa de Cloudinary
 * Útil para convertir URLs existentes a usar el helper
 */
export function extractCloudinaryPath(url: string): string {
  // Si ya es una ruta simple (sin dominio), retornarla
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Extraer la ruta después de /upload/
  // Maneja casos con y sin transformaciones, con y sin version
  const match = url.match(/\/upload\/(?:[^\/]+\/)?(v\d+\/)?(.+)$/);
  if (match) {
    const version = match[1] || '';
    const path = match[2];
    // Si tiene version, mantenerla; si no, retornar solo el path
    return version ? `${version}${path}` : path;
  }
  
  // Fallback: retornar la URL completa si no se puede parsear
  return url;
}

