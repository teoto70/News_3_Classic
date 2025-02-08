import { ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-platform-server'; // Import the Platform Server plugin

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'news', // Replace with your project name
  outDir: './dist/static',
  defaultPostRenderers: ['scullyPlatformServer'], // Use Scully Platform Server
  routes: {
    '/post/:docId': {
      type: 'json',
      docId: {
        url: 'https://news3-57830--news3-57830.europe-west4.hosted.app/', // API endpoint to fetch posts
        property: 'id', // Property to use as the route parameter
      },
    },
  },
};