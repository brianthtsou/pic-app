# Use Node.js LTS version as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build TypeScript code 
RUN npm run build

# Expose the backend port
EXPOSE 3000

# Start the backend application
CMD ["npm", "start"]
