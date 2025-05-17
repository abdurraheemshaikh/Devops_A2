# Use official Node.js image as base
#frontend
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port your React app runs on (default is 3000)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
