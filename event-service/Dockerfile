# Use official Node.js image
FROM node:18
#event-service
# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Expose the port Express.js runs on
EXPOSE 3002

# Start the service
CMD ["node", "server.js"]
