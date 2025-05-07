# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if necessary)
RUN npm run build

# Expose the application port (80 by default in the code)
EXPOSE 80

# Set the command to run the application
# Ensure it runs index.js explicitly if it's the entry point
CMD ["npm", "run", "start"]
