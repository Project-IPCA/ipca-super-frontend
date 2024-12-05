# Use the official Node.js image as the base image
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port Vite uses
EXPOSE 5175

# Start the Vite development server
CMD ["yarn", "dev_expose"]