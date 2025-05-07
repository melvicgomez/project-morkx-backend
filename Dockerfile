# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Then copy the rest of the project
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8000

# Set the command to run the application
CMD ["npm", "run", "start"]
