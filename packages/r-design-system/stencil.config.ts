import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'r-design-system',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
    },
  ],
  globalStyle: 'src/global/variables.css',
};

