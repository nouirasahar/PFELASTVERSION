# Use Node.js as the base image
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular application
RUN npm run build

# Use Nginx to serve the built application
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/angular-website/browser /usr/share/nginx/html


# Copy custom nginx config if needed
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
