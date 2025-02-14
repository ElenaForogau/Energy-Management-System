# Use a Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project
RUN npm run build

# Expose the port Vite will run on
EXPOSE 5173

# Start the app using the preview mode
CMD ["npm", "start"]
