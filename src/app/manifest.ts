import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Signcap',
    short_name: 'Signcap',
    description: 'Signcap is a web application that allows you to sign documents digitally. by Prakash',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons:[
      {
          "purpose": "maskable",
          "sizes": "512x512",
          "src": "images/icon/icon512_maskable.png",
          "type": "image/png"
      },
      {
          "purpose": "any",
          "sizes": "512x512",
          "src": "images/icon/icon512_rounded.png",
          "type": "image/png"
      }
  ],
  }
}