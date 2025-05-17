# Use official Node.js image as base
FROM node:18
#user service
# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Expose the port the service runs on
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]
