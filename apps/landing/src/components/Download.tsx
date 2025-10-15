import { useState, useEffect } from 'react';

interface Platform {
  name: string;
  icon: JSX.Element;
  downloadUrl: string;
  fileSize: string;
}

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
}

const GITHUB_REPO = 'Creative-koda-lab/toddy';

export default function Download() {
  const [detectedPlatform, setDetectedPlatform] = useState<string>('');
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect user's platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setDetectedPlatform('macOS');
    } else if (userAgent.includes('win')) {
      setDetectedPlatform('Windows');
    } else if (userAgent.includes('linux')) {
      setDetectedPlatform('Linux');
    } else {
      setDetectedPlatform('Unknown');
    }

    // Fetch latest release from GitHub
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github+json',
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`GitHub API returned ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Check if it's an error response
        if (data.message) {
          console.warn('No releases found:', data.message);
          setRelease(null);
        } else {
          setRelease(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch release:', err);
        setRelease(null);
        setLoading(false);
      });
  }, []);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `~${Math.round(mb)} MB`;
  };

  // Helper function to get download URL for a platform
  const getDownloadUrl = (platformName: string): string => {
    if (!release || !release.assets) return '#';

    // Map platform names to file extensions/patterns
    const platformPatterns: Record<string, RegExp[]> = {
      'macOS': [/\.dmg$/, /\.app\.tar\.gz$/, /-darwin-/, /-macos-/],
      'Windows': [/\.exe$/, /\.msi$/],
      'Linux': [/\.AppImage$/, /\.deb$/, /\.rpm$/]
    };

    const patterns = platformPatterns[platformName] || [];

    for (const pattern of patterns) {
      const asset = release.assets.find(a => pattern.test(a.name));
      if (asset) return asset.browser_download_url;
    }

    return '#';
  };

  // Helper function to get file size for a platform
  const getFileSize = (platformName: string): string => {
    if (!release || !release.assets) return 'N/A';

    const url = getDownloadUrl(platformName);
    const asset = release.assets.find(a => a.browser_download_url === url);

    return asset ? formatFileSize(asset.size) : 'N/A';
  };

  const platforms: Platform[] = [
    {
      name: 'macOS',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      downloadUrl: getDownloadUrl('macOS'),
      fileSize: getFileSize('macOS')
    },
    {
      name: 'Windows',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 5.45L10.95 4.5v6.95H3V5.45zm0 13.1L10.95 19.5v-6.95H3v6zm8.95 1.15l9 1.35V12.5h-9v7.2zm0-15.3v7.2h9V3.5l-9 1.35z"/>
        </svg>
      ),
      downloadUrl: getDownloadUrl('Windows'),
      fileSize: getFileSize('Windows')
    },
    {
      name: 'Linux',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-.5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm3 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM9.5 13c.8 0 1.5.4 2 1 .5.7 1.2 1 2 1s1.5-.3 2-1c.5-.6 1.2-1 2-1 .3 0 .5.2.5.5s-.2.5-.5.5c-.5 0-1 .2-1.3.6-.5.6-1.2 1-2.2 1s-1.7-.4-2.2-1c-.3-.4-.8-.6-1.3-.6-.3 0-.5-.2-.5-.5s.2-.5.5-.5z"/>
        </svg>
      ),
      downloadUrl: getDownloadUrl('Linux'),
      fileSize: getFileSize('Linux')
    }
  ];

  const getPlatformByName = (name: string) => platforms.find(p => p.name === name);
  const primaryPlatform = getPlatformByName(detectedPlatform) || platforms[0];
  const version = release?.tag_name || '0.1.0';

  return (
    <section id="download" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Download for Free
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your platform and start using the app in minutes
            </p>
          </div>

          {/* Primary Download Card */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10 opacity-50" />
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {detectedPlatform ? `Detected: ${detectedPlatform}` : 'Choose your platform'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Download for {primaryPlatform.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {loading
                      ? 'Loading...'
                      : release
                      ? `Version ${version} • ${primaryPlatform.fileSize} • Universal`
                      : 'Coming soon - No releases available yet'}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {!loading && !release ? (
                      <div className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-muted text-muted-foreground">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Release Coming Soon
                      </div>
                    ) : (
                      <a
                        href={primaryPlatform.downloadUrl}
                        className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg ${
                          loading || primaryPlatform.downloadUrl === '#'
                            ? 'bg-primary/50 text-primary-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25'
                        }`}
                        onClick={(e) => {
                          if (loading || primaryPlatform.downloadUrl === '#') {
                            e.preventDefault();
                          }
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {loading ? 'Loading...' : 'Download Now'}
                      </a>
                    )}
                    <a
                      href="https://github.com/Creative-koda-lab/toddy/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-accent transition-colors"
                    >
                      View All Releases
                    </a>
                  </div>
                </div>

                {/* Platform Icon */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    {primaryPlatform.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <a
                key={index}
                href={platform.downloadUrl}
                className={`group relative p-6 rounded-xl border border-border bg-card transition-all duration-300 ${
                  loading || platform.downloadUrl === '#'
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:bg-accent/50 hover:shadow-lg hover:-translate-y-1'
                }`}
                onClick={(e) => {
                  if (loading || platform.downloadUrl === '#') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{platform.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {loading ? 'Loading...' : platform.fileSize}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 rounded-xl border border-border bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Verified & Safe</p>
                <p className="text-xs text-muted-foreground mt-1">Code-signed binaries</p>
              </div>
              <div>
                <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Auto Updates</p>
                <p className="text-xs text-muted-foreground mt-1">Always stay current</p>
              </div>
              <div>
                <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No Cost</p>
                <p className="text-xs text-muted-foreground mt-1">Free forever</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
