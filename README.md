
# Demo Platform

Welcome to the **Demo Platform** repository! This project is designed to give our customers a hands-on experience with our APIs, demonstrating both frontend and backend integrations. It's built using Next.js, React, and Redux to create a seamless demonstration environment.

## Overview

The Demo Platform allows you to:

- Explore our API capabilities through a fully functional demo environment.
- Experience our complete flow, from frontend interactions to backend processing.
- Test and experiment with our APIs in a controlled, sandboxed environment.

This demo is already embedded in your **KanmonOS** portal, where you can see a running version.

## Getting Started

If you'd like to run the Demo Platform locally and explore it on your own, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/Kanmon/demo-platform.git
cd demo-platform
```

1. **Set Up Environment Variables**

Copy the provided `sample.env` file to create your `.env` file:

```bash
cp sample.env .env
```

The `.env` file will be automatically configured to point at our Sandbox environment.

1. **Get Your Kanmon API Key**

To run the demo, you'll need a Kanmon API Key. You can obtain this key from your KanmonOS portal or by reaching out to your account manager.

1. **Install Dependencies**

Install the necessary dependencies:

```bash
yarn install
```

1. **Run the Application**

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

## Usage

Once the application is running, you can interact with it just like the embedded version in KanmonOS. Use the demo to understand how our APIs work and how you can integrate them into your own projects.

## Api Docs / SDKs

- [API Docs](https://kanmon.dev)
- [Web SDK](https://www.npmjs.com/package/@kanmon/web-sdk)
- [Backend SDK](https://github.com/Kanmon/sdk)

## Support

If you have any issues, please report them in the [issues](https://github.com/Kanmon/sdk/issues) section of Github. If you have any questions or need help, please contact your account manager and we'll be happy to help you directly!
