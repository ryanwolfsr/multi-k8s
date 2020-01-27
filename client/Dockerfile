#Multi-step Build File Example:

# Step 1 (Builder Phase):
# Initial Base Image 
FROM node:alpine as builder

# Specify work directory
WORKDIR '/app'

# List of dependencies to be installed
COPY ./package.json ./

# Install Dependencies
RUN npm install

# Copy remaining source files (Different because we don't want changes to code to require redownload of dependencies)
COPY . .

# Builds and puts output to build folder ('/app/build') which is what we want to copy over 
RUN npm run build

# Step 2 (Run Phase):
FROM nginx

# Expose port
EXPOSE 3000

# Copy build folder from builder phase above (/usr/share/nginx/html is a location nginx uses to serve html content)
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy build folder from builder phase above (/usr/share/nginx/html is a location nginx uses to serve html content)
COPY --from=builder /app/build /usr/share/nginx/html

# NGINX start command will start by the default command