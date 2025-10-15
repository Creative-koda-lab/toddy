/// <reference path="./.sst/platform/config.d.ts" />
/**
 * SST Configuration
 *
 * Configures the deployment of the Toddy landing page to AWS.
 * Uses SST to deploy the Astro site as a static site on AWS with CloudFront CDN.
 */
export default $config({
  app(input) {
    return {
      name: "toddy",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: "6.10.0",
      }
    };
  },
  async run() {
    // domain
    const router = new sst.aws.Router("MyRouter", {
      domain: {
        name: $app.stage === "production"
            ? "https://toddy.creative-koda.com"
            : `https://toddy-${$app.stage}.creative-koda.com`,
        dns: sst.cloudflare.dns()
      }
    })

    // Deploy the Astro landing page
    const landing = new sst.aws.Astro("ToddyLanding", {
      path: "apps/landing",
      buildCommand: "npm run build",
      // Environment variables for the Astro build
      environment: {
        PUBLIC_SITE_URL:
          $app.stage === "production"
            ? "https://toddy.creative-koda.com"
            : `https://toddy-${$app.stage}.creative-koda.com`,
      },
      // Configure custom domain (optional - uncomment and configure)
      // domain: {
      //   name: $app.stage === "production" ? "toddy.app" : `${$app.stage}.toddy.app`,
      //   redirects: $app.stage === "production" ? ["www.toddy.app"] : [],
      // },
      // CloudFront cache invalidation settings
      invalidation: {
        paths: "all",
        wait: true,
      },
    });
    // Output the URL
    return {
      url: landing.url,
      stage: $app.stage,
    };
  },
});
