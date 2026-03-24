<h1 align="center">iLO4 Fan Controller for HP Gen8/Gen9 Servers</h1>

<p align="center">
  <a href="https://github.com/IT-Kuny/HPE-G8-G9-Fan-Controller/pkgs/container/hpe-g8-g9-fan-controller"><img src="https://img.shields.io/badge/docker-ready-blue.svg" alt="Docker"></a>
  <a href="https://github.com/IT-Kuny/HPE-G8-G9-Fan-Controller/actions/workflows/ci.yml"><img src="https://github.com/IT-Kuny/HPE-G8-G9-Fan-Controller/actions/workflows/ci.yml/badge.svg" alt="Security Check, Build & Test"></a>
</p>

<p align="center">
  <img width="400" src="https://github.com/user-attachments/assets/76f2bd8b-d289-41f6-ab62-fa26565f34a1" alt="iLO4 Fan Controller Interface">
  <br>
</p>

<img width="1020" height="533" alt="image" src="https://github.com/user-attachments/assets/b2a79350-d1fd-4afa-a2d4-2f54aaac0615" />

<p align="center">
  <b>Professional fan speed management for HP ProLiant servers</b>
</p>

---

## Overview

A modern web-based application for managing fan speeds on HP ProLiant Gen8 servers with modified iLO4 firmware. Provides both an intuitive web interface and comprehensive REST API for automation and scripting.

### Key Features

- 🌐 **Web Interface**: Responsive design accessible from any device
- 🔧 **Dynamic Configuration**: Auto-detects and supports variable fan counts
- 🔒 **Secure Authentication**: Cookie-based sessions with rate limiting
- 📡 **REST API**: Complete API for automation and integration
- 🐳 **Container Ready**: Docker support with environment configuration
- ⚡ **Real-time Updates**: Live fan status monitoring and control

---

## Prerequisites

⚠️ **Important**: This application requires HP iLO4 firmware modified with [**"The Fan Hack"**](https://www.reddit.com/r/homelab/comments/hix44v/silence_of_the_fans_pt_2_hp_ilo_4_273_now_with/) to enable SSH-based fan control.

**Supported Hardware:**
- HP ProLiant Gen8/Gen9 servers (DL360p, DL380p, etc.)
- Modified iLO4 firmware with SSH access enabled
- Network connectivity to iLO management interface

---

## Installation

### 🐳 Docker Deployment (Recommended)

```bash
# Clone repository
git clone https://github.com/IT-Kuny/HPE-G8-G9-Fan-Controller.git
cd ilo4-fan-controller

# Build image
docker build -t ilo4-fan-controller .

# Run container
docker run -d \
  --name=HPE-G8-G9-Fan-Controller \
  --restart=unless-stopped \
  -p 3000:3000 \
  -e ILO_HOST='192.168.1.100' \
  -e ILO_USERNAME='your_ilo_username' \
  -e ILO_PASSWORD='your_ilo_password' \
  -e AUTH_USERNAME='admin' \
  -e AUTH_PASSWORD='your_secure_password' \
  -e SESSION_SECRET='your_32_char_secret_key_here' \
  HPE-G8-G9-Fan-Controller
```

### 📦 Pre-built Container

```bash
docker run -d \
  --name=HPE-G8-G9-Fan-Controller \
  --restart=unless-stopped \
  -p 3000:3000 \
  -e ILO_HOST='192.168.1.100' \
  -e ILO_USERNAME='your_ilo_username' \
  -e ILO_PASSWORD='your_ilo_password' \
  -e AUTH_USERNAME='admin' \
  -e AUTH_PASSWORD='your_secure_password' \
  -e SESSION_SECRET='your_32_char_secret_key_here' \
  ghcr.io/it-kuny/HPE-G8-G9-Fan-Controller:latest
```

### 🔧 Native Installation

```bash
# Clone and setup
git clone https://github.com/IT-Kuny/HPE-G8-G9-Fan-Controller.git
cd ilo4-fan-controller

# Configure environment
cp .env.template .env
# Edit .env with your settings

# Install dependencies and build
yarn install
yarn build

# Start application
yarn start
```

**Environment Configuration (.env):**
```env
ILO_HOST=192.168.1.100
ILO_USERNAME=your_ilo_username
ILO_PASSWORD=your_ilo_password

AUTH_USERNAME=admin
AUTH_PASSWORD=your_strong_password_here
SESSION_SECRET=random_string_at_least_32_characters_long
```

---

## REST API

### Authentication

All API endpoints require authentication via session cookies. Obtain a session by logging in through the web interface or using the login endpoint.

**Base URL:** `http://your-server:3000/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate and create session |
| `POST` | `/auth/logout` | Destroy current session |
| `GET` | `/fans` | Retrieve current fan status |
| `POST` | `/fans` | Set fan speeds |
| `POST` | `/fans/unlock` | Enable manual fan control |

### Usage Examples

```bash
BASE_URL="http://your-server:3000"

# Authenticate
curl -X POST "$BASE_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"your_password"}' \
  -c cookies.txt

# Unlock fan control
curl -X POST "$BASE_URL/api/fans/unlock" \
  -b cookies.txt

# Set fan speeds (percentages)
curl -X POST "$BASE_URL/api/fans" \
  -H 'Content-Type: application/json' \
  -d '{"fans":[35,35,35,35]}' \
  -b cookies.txt

# Get current status
curl "$BASE_URL/api/fans" \
  -b cookies.txt | jq .

# Logout
curl -X POST "$BASE_URL/api/auth/logout" \
  -b cookies.txt

# Cleanup
rm cookies.txt
```

---

## Security & Configuration

### Authentication & Rate Limiting

- **Session Management**: Secure cookie-based authentication
- **Rate Limiting**: 5 login attempts per IP address per 15 minutes
- **Environment Variables**: All sensitive data configured via environment

### Production Deployment

- Use strong, unique passwords for `AUTH_PASSWORD`
- Generate cryptographically secure `SESSION_SECRET` (≥32 characters)
- Consider deploying behind reverse proxy with TLS termination
- For multi-instance deployments, implement shared session storage (Redis)

---

## Architecture

### How It Works

1. **Frontend**: Next.js application with server-side rendering
2. **Backend**: API routes handling iLO4 SSH communication  
3. **Dynamic Discovery**: Auto-detects available fans via iLO4 queries
4. **Real-time Control**: Direct SSH commands for immediate fan response
5. **State Management**: Session-based authentication with secure cookies

### Performance Notes

- Fan speed changes typically take 10-20 seconds to apply
- Response time scales with number of fans configured
- SSH connection pooling for optimal performance

---

## Troubleshooting

### Common Issues

**Connection Refused**
- Verify iLO4 network connectivity and SSH service status
- Confirm modified firmware installation and SSH enablement

**Authentication Failed**
- Check iLO4 username/password in environment configuration
- Verify SSH access works manually: `ssh user@ilo-ip`

**Fan Control Not Working**
- Ensure fan control is unlocked via `/api/fans/unlock`
- Confirm iLO4 firmware modification supports fan speed control

---

## Contributing

Contributions are welcome! Please ensure:

- Code follows existing style conventions
- Tests pass: `yarn test`
- Documentation is updated for new features
- Security considerations are addressed

---

## Credits & License

### Acknowledgments

This project is derived from [DavidIlie's ilo4-fan-controller](https://github.com/DavidIlie/ilo4-fan-controller) with significant enhancements and modernizations. The fork was detached to incorporate critical improvements and maintain active development.

### Key Improvements

- ✅ **User Login Interface**: No more unsecured fan controls without additional effort 
- ✅ **Enhanced Documentation**: Comprehensive setup and API guides
- ✅ **Modern CI/CD**: Automated testing and container builds  
- ✅ **Security Hardening**: Rate limiting and session management
- ✅ **API Expansion**: Complete REST API with examples
- ✅ **Production Ready**: Docker support and deployment guides
- ✅ **Active Maintenance**: Ongoing security updates and improvements

### License

This project maintains the same license terms as the original work. See individual source files for specific licensing information.

---

<p align="center">
  <strong>⚡ Built for the HomeLab Community ⚡</strong>
