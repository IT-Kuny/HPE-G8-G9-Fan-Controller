# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

Only the latest version on the `master` branch is actively maintained and receives security updates.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please use one of the following methods:

1. **GitHub Security Advisories** (preferred): Use the [private vulnerability reporting](https://github.com/IT-Kuny/HPE-G8-G9-Fan-Controller/security/advisories/new) feature on this repository.
2. **Email**: Contact the maintainer at [0n1cOn3@gmx.ch](mailto:0n1cOn3@gmx.ch) with the subject line `[SECURITY] HPE Fan Controller`.

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix**: Depending on severity, critical issues will be prioritized

## Security Considerations

This application manages HPE iLO hardware interfaces. Please be aware of the following:

- **Credentials**: iLO and application credentials are passed via environment variables. Never commit credentials to the repository.
- **Network exposure**: The web interface should only be accessible on trusted networks. Do not expose it to the public internet without proper authentication and TLS termination.
- **Cookie security**: When running without HTTPS, set `COOKIE_SECURE=false`. For production deployments with TLS, leave it at the default (`true`).
- **iLO access**: This application has direct control over server fan speeds. Misconfiguration can lead to thermal issues. Use with caution.

## Dependencies

This project uses automated dependency scanning via:
- **Dependabot**: Monitors npm dependencies for known vulnerabilities
- **CodeQL**: Static analysis for code quality and security issues
