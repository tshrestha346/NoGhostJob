# NoGhostJob

## Team

| Role | Name |
|---|---|
| Product Owner | Deval Mevada|
| Scrum Master | Tej Bahadur Shrestha|
| Developer | Meet Bhadehsia |
| Developer |Rohan Pandey|
| Developer | Dev Desai|

## Project Overview
A student-focused job platform that enables job searching and posting while providing detailed feedback on rejected applications to help users improve their skills.

## Architecture

_Add your architecture diagram here (C4 Context or Container diagram). Update this as the project evolves._

```
service-a  ──►  service-b
    │
    ▼
  database
```

## Tech Stack

| Layer | Technology | MERN Stack
|---|---|
| Frontend |ReactJS|
| Backend |ExpressJS|
| Database |MongoDB|
| Deployment |Vercel|

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- Git

### Run locally

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
cp .env.example .env   # fill in your values
docker compose up --build
```

The app will be available at `http://localhost:3000`.

## Repository Structure

```
├── README.md
├── .gitignore
├── docs/
│   └── vision.md            # Product vision, personas, user stories
├── services/
│   ├── service-a/           # First microservice
│   └── service-b/           # Second microservice
└── docker-compose.yml
```

## Documentation

- [Vision Document](docs/vision.md)
-Session log of each group partners is in the seesion log folder
-Dev branch wil be use for development
-Prod branch will be use for deployment


## License

MIT
