# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |
| < 0.1.0 | No |

## Reporting a vulnerability

Please report suspected vulnerabilities by emailing `security@example.com` or opening a private security advisory if this repository is hosted on GitHub with advisories enabled.

Include as much detail as you safely can:

- Affected files, routes, or workflows.
- Reproduction steps using synthetic data only.
- Potential impact.
- Suggested fix, if known.

We aim to acknowledge reports within 3 business days and provide an initial triage update within 7 business days. Resolution timelines depend on severity and available maintainers.

## Medical and privacy testing rules

Do not upload real medical reports, PHI, PII, credentials, or secrets while testing this prototype. Use synthetic or fully de-identified data only.

If you discover that sensitive data was committed, logged, uploaded, or sent to a third-party provider, report it immediately and rotate any exposed credentials.

## Current security limitations

MediClarity is an early prototype. It is not certified as HIPAA compliant, SOC 2 compliant, or ISO 27001 compliant. The project still needs documented controls for authentication, authorization, upload scanning, PHI/PII retention, audit logging, prompt-injection handling, provider data processing, and incident response before production medical use.
