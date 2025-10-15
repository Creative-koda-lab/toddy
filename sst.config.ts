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
      // Configure custom domain
      domain: {
        name: $app.stage === "production"
          ? "toddy.creative-koda.com"
          : `toddy-${$app.stage}.creative-koda.com`,
        dns: sst.cloudflare.dns(),
      },
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
  console: {
    autodeploy: {
      target(event) {
        // Deploy to production when pushing to main
        if (event.type === "branch" && event.branch === "main" && event.action === "pushed") {
          return { stage: "production" };
        }

        // Deploy to dev when pushing to dev branch
        if (event.type === "branch" && event.branch === "dev" && event.action === "pushed") {
          return { stage: "dev" };
        }

        // Deploy PR previews as separate stages
        if (event.type === "pull_request") {
          return { stage: `pr-${event.number}` };
        }
      },

      // Custom workflow for build and deployment
      async workflow({ $, event }) {
        // Install dependencies
        await $`npm install`;

        // Build the landing page to verify it compiles
        await $`npm run build:landing`;

        // Deploy or remove based on action
        if (event.action === "removed") {
          await $`npm run sst remove`;
        } else {
          await $`npm run deploy`;
        }
      }
    }
  }
});
