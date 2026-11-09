// Docusaurus 3.10.1 generates mixed ESM/CommonJS (registry, client modules).
// Scope: generated JS parsing and temporary CommonJS SSG chunks only.
// Upstream: https://github.com/facebook/docusaurus/discussions/11326
// Rationale and removal checks: https://github.com/4BFC/docnest/blob/main/CONTRIBUTING.md#docusaurus-esm
export default function generatedModuleCompat({generatedFilesDir}) {
  return {
    name: 'generated-module-compat',
    configureWebpack(config, isServer) {
      return {
        // SSG loads CommonJS chunks with Node require; .cjs overrides root ESM.
        // Client chunk names and the framework's server entry stay unchanged.
        ...(isServer && {
          output: {chunkFilename: config.output.chunkFilename.replace(/\.js$/, '.cjs')},
        }),
        module: {
          rules: [
            {
              test: /\.js$/i,
              include: generatedFilesDir,
              type: 'javascript/auto',
            },
          ],
        },
      };
    },
  };
}
